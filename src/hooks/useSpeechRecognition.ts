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
    // Debounce rapid results and filter duplicates
    if (bestText && bestText !== lastResultRef.current) {
      lastResultRef.current = bestText;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setTranscript(prev => {
          // Merge if similar to last
          if (prev.length > 0 && prev[prev.length - 1].text === bestText) return prev;
          return [
            ...prev,
            {
              id: Date.now().toString(),
              text: bestText,
              timestamp: new Date(),
              confidence: bestConfidence || 0.9
            }
          ];
        });
      }, 120); // Short debounce for rapid results
    }
  }, []);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true; // Enable interim for real-time feedback
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3; // Get more alternatives for accuracy
      if ('webkitSpeechRecognition' in window) {
        (recognition as any).webkitServiceURI = 'wss://www.google.com/speech-api/full-duplex/v1/up';
      }
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        lastResultRef.current = '';
        // Set a timeout to auto-stop after 30 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 30000);
      };
      recognition.onresult = (event: any) => {
        processTranscript(event);
      };
      recognition.onerror = (event: any) => {
        const errorMessage = errorMessages[event.error as keyof typeof errorMessages] || 
                            `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError('Failed to start speech recognition');
    }
  }, [errorMessages, processTranscript]);

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
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
    lastResultRef.current = '';
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