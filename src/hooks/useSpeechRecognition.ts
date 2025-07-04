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

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  // @ts-ignore: SpeechRecognition is a browser global, not always typed
  const recognitionRef = useRef<any>(null);
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
  }), []);

  // Use 'any' for event type for compatibility
  const processTranscript = useCallback((event: any) => {
    // Prevent multiple simultaneous processing
    if (isProcessingRef.current) {
      return;
    }
    
    isProcessingRef.current = true;
    
    try {
      // Collect all alternatives and pick the best
      let bestText = '';
      let bestConfidence = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          for (let j = 0; j < result.length; j++) {
            const alt = result[j];
            if (alt.confidence > bestConfidence && alt.transcript.trim().length > 2) {
              bestText = alt.transcript.trim();
              bestConfidence = alt.confidence;
            }
          }
        }
      }
      
      // Only process if we have new, meaningful text
      if (bestText && bestText !== lastResultRef.current && bestText.length > 2) {
        lastResultRef.current = bestText;
        
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
              entry.text.toLowerCase().trim() === bestText.toLowerCase().trim()
            );
            
            if (isDuplicate) {
              isProcessingRef.current = false;
              return prev;
            }
            
            const newEntry = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              text: bestText,
              timestamp: new Date(),
              confidence: bestConfidence || 0.9
            };
            
            isProcessingRef.current = false;
            return [...prev, newEntry];
          });
        }, 300); // Increased debounce time for better stability
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
      setError('Speech recognition is not supported in this browser');
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

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false; // Changed to false to prevent infinite loops
      recognition.interimResults = false; // Changed to false for more stable results
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1; // Reduced for better performance
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        lastResultRef.current = '';
        isProcessingRef.current = false;
        
        // Set a timeout to auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (err) {
              console.warn('Error stopping recognition on timeout:', err);
            }
          }
        }, 10000); // Reduced timeout for better UX
      };

      recognition.onresult = (event: any) => {
        processTranscript(event);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        const errorMessage = errorMessages[event.error as keyof typeof errorMessages] || 
                            `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        setIsListening(false);
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
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start speech recognition');
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
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    lastResultRef.current = '';
    isProcessingRef.current = false;
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