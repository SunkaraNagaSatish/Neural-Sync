import { useState, useRef, useCallback, useMemo } from 'react';
import { TranscriptEntry } from '../types';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: TranscriptEntry[];
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
}

// Use 'any' for recognitionRef INSIDE the hook, not at the top level

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null); // <-- move here
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastResultRef = useRef<string>('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef<boolean>(false);

  // Memoize error messages for better performance
  const errorMessages = useMemo(() => ({
    network: 'Network error. Please check your internet connection.',
    'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
    'no-speech': 'No speech detected. Please speak clearly into your microphone.',
    'audio-capture': 'Audio capture failed. Please check your microphone.',
    'service-not-allowed': 'Speech recognition service not allowed.',
    'aborted': 'Speech recognition was aborted.',
  }), []);

  const processTranscript = useCallback((event: any) => {
    // Prevent multiple simultaneous processing
    if (isProcessingRef.current) {
      return;
    }
    
    isProcessingRef.current = true;
    
    try {
      let finalText = '';
      let bestConfidence = 0;
      
      // Process only final results for better accuracy
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const transcript = result[0].transcript.trim();
          const confidence = result[0].confidence || 0.9;
          
          if (transcript.length > 2 && confidence > bestConfidence) {
            finalText = transcript;
            bestConfidence = confidence;
          }
        }
      }
      
      // Only process if we have new, meaningful text
      if (finalText && finalText !== lastResultRef.current && finalText.length > 2) {
        lastResultRef.current = finalText;
        
        // Clear any existing debounce timer
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        
        // Debounce to prevent rapid duplicate entries
        debounceTimer.current = setTimeout(() => {
          setTranscript(prev => {
            // Check if this text already exists in recent entries
            const recentEntries = prev.slice(-3);
            const isDuplicate = recentEntries.some(entry => 
              entry.text.toLowerCase().trim() === finalText.toLowerCase().trim()
            );
            
            if (isDuplicate) {
              isProcessingRef.current = false;
              return prev;
            }
            
            const newEntry: TranscriptEntry = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              text: finalText,
              timestamp: new Date(),
              confidence: bestConfidence
            };
            
            console.log('Neural Sync captured:', finalText);
            isProcessingRef.current = false;
            return [...prev, newEntry];
          });
        }, 500); // Debounce time for better stability
      } else {
        isProcessingRef.current = false;
      }
    } catch (err) {
      console.error('Error processing transcript:', err);
      isProcessingRef.current = false;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping existing recognition:', err);
      }
      recognitionRef.current = null;
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping existing recognition:', err);
      }
      recognitionRef.current = null;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Optimized settings for better accuracy and performance
      recognition.continuous = true; // Keep listening for multiple phrases
      recognition.interimResults = false; // Only final results for stability
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      // Enhanced settings for better performance
      if ('webkitSpeechRecognition' in window) {
        (recognition as any).webkitServiceURI = 'wss://www.google.com/speech-api/full-duplex/v1/up';
      }
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        lastResultRef.current = '';
        isProcessingRef.current = false;
        console.log('Neural Sync speech recognition started');
        
        // Set a timeout to auto-stop after 15 seconds for better UX
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (err) {
              console.warn('Error stopping recognition on timeout:', err);
            }
            try {
              recognitionRef.current.stop();
            } catch (err) {
              console.warn('Error stopping recognition on timeout:', err);
            }
          }
        }, 15000);
      };

      recognition.onresult = (event: any) => {
        processTranscript(event);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        // Don't show error for aborted (user stopped)
        if (event.error === 'aborted') {
          setIsListening(false);
          isProcessingRef.current = false;
          return;
        }
        
        const errorMessage = errorMessages[event.error as keyof typeof errorMessages] || 
                            `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        setIsListening(false);
        isProcessingRef.current = false;
        
        isProcessingRef.current = false;
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };


      recognition.onend = () => {
        setIsListening(false);
        isProcessingRef.current = false;
        recognitionRef.current = null;
        console.log('Neural Sync speech recognition ended');
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };


      recognitionRef.current = recognition;
      recognition.start();
      
      
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start speech recognition. Please try again.');
      setIsListening(false);
      isProcessingRef.current = false;
    }
  }, [errorMessages, processTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
      recognitionRef.current = null;
    }
    
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    
    
    setIsListening(false);
    isProcessingRef.current = false;
    console.log('Neural Sync speech recognition stopped');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    lastResultRef.current = '';
    isProcessingRef.current = false;
    console.log('Neural Sync transcript cleared');
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error
  };
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}