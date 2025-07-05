import { useState, useRef, useCallback, useEffect } from 'react';
import { TranscriptEntry } from '../types';

interface UsePersistentSpeechRecognitionReturn {
  isListening: boolean;
  transcript: TranscriptEntry[];
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

export const usePersistentSpeechRecognition = (): UsePersistentSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualStopRef = useRef(false);
  const lastResultRef = useRef<string>('');
  const accumulatedTextRef = useRef<string>('');

  // Check browser support
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    if (!supported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }
  }, []);

  // Create and configure recognition instance
  const createRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Optimized settings for continuous recording
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    // Enhanced settings for better accuracy
    if ('webkitSpeechRecognition' in window) {
      recognition.serviceURI = 'wss://www.google.com/speech-api/full-duplex/v1/up';
    }

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Only process final results to avoid duplicates
      if (finalTranscript.trim() && finalTranscript !== lastResultRef.current) {
        lastResultRef.current = finalTranscript;
        accumulatedTextRef.current += finalTranscript + ' ';

        const newEntry: TranscriptEntry = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          text: finalTranscript.trim(),
          timestamp: new Date(),
          confidence: event.results[event.resultIndex][0].confidence || 0.9
        };

        setTranscript(prev => [...prev, newEntry]);
        console.log('Added transcript entry:', finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Don't show error for aborted (user stopped)
      if (event.error === 'aborted' && isManualStopRef.current) {
        return;
      }

      // Handle specific errors
      if (event.error === 'no-speech') {
        // Don't stop for no-speech, just continue
        console.log('No speech detected, continuing...');
        return;
      }

      if (event.error === 'network') {
        setError('Network error. Attempting to reconnect...');
        // Try to restart after network error
        if (!isManualStopRef.current) {
          setTimeout(() => {
            if (!isManualStopRef.current) {
              startListening();
            }
          }, 2000);
        }
        return;
      }

      const errorMessages: { [key: string]: string } = {
        'not-allowed': 'Microphone access denied. Please allow microphone permissions and try again.',
        'audio-capture': 'Audio capture failed. Please check your microphone.',
        'service-not-allowed': 'Speech recognition service not allowed.',
      };

      const errorMessage = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      
      // Auto-restart if not manually stopped
      if (!isManualStopRef.current) {
        console.log('Auto-restarting speech recognition...');
        restartTimeoutRef.current = setTimeout(() => {
          if (!isManualStopRef.current) {
            try {
              recognition.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
              setError('Failed to restart speech recognition. Please try again.');
            }
          }
        }, 1000);
      }
    };

    return recognition;
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.warn('Error stopping existing recognition:', error);
      }
    }

    // Clear any restart timeout
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    isManualStopRef.current = false;
    lastResultRef.current = '';
    accumulatedTextRef.current = '';

    try {
      recognitionRef.current = createRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
        console.log('Starting persistent speech recognition...');
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start speech recognition. Please try again.');
    }
  }, [isSupported, createRecognition]);

  const stopListening = useCallback(() => {
    console.log('Manually stopping speech recognition...');
    isManualStopRef.current = true;

    // Clear any restart timeout
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.warn('Error stopping recognition:', error);
      }
      recognitionRef.current = null;
    }

    setIsListening(false);
    setError(null);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    lastResultRef.current = '';
    accumulatedTextRef.current = '';
    console.log('Transcript cleared');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.warn('Error stopping recognition on cleanup:', error);
        }
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error,
    isSupported
  };
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}