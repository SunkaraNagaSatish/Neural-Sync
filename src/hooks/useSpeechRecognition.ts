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
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize error messages for better performance
  const errorMessages = useMemo(() => ({
    network: 'Network error. Please check your internet connection.',
    'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
    'no-speech': 'No speech detected. Please speak clearly into your microphone.',
    'audio-capture': 'Audio capture failed. Please check your microphone.',
    'service-not-allowed': 'Speech recognition service not allowed.',
  }), []);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Optimized settings for better performance and accuracy
      recognition.continuous = true;
      recognition.interimResults = false; // Only final results for better accuracy
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      // Enhanced settings for better performance
      if ('webkitSpeechRecognition' in window) {
        (recognition as any).webkitServiceURI = 'wss://www.google.com/speech-api/full-duplex/v1/up';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        console.log('Neural Sync speech recognition started');
        
        // Set a timeout to auto-stop after 30 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 30000);
      };

      recognition.onresult = (event) => {
        let finalText = '';
        
        // Process only final results for better accuracy
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          }
        }

        if (finalText.trim()) {
          const newEntry: TranscriptEntry = {
            id: Date.now().toString(),
            text: finalText.trim(),
            timestamp: new Date(),
            confidence: event.results[event.results.length - 1]?.[0]?.confidence || 0.9
          };

          setTranscript(prev => [...prev, newEntry]);
          console.log('Neural Sync captured:', finalText.trim());
        }
      };

      recognition.onerror = (event) => {
        console.error('Neural Sync speech recognition error:', event.error);
        
        // Use memoized error messages
        const errorMessage = errorMessages[event.error as keyof typeof errorMessages] || 
                            `Speech recognition error: ${event.error}`;
        
        setError(errorMessage);
        setIsListening(false);
        
        // Clear timeout on error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Neural Sync speech recognition ended');
        
        // Clear timeout on end
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError('Failed to start speech recognition');
      console.error('Neural Sync speech recognition error:', err);
    }
  }, [errorMessages]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsListening(false);
    console.log('Neural Sync speech recognition stopped');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
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
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}