import { useState, useRef, useCallback, useEffect } from 'react';

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  confidence?: number;
  speaker?: string;
}

interface UseLiveRecordingSpeechReturn {
  isListening: boolean;
  transcript: TranscriptEntry[];
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

export const useLiveRecordingSpeech = (): UseLiveRecordingSpeechReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const isManualStopRef = useRef(false);
  const processedTextsRef = useRef<Set<string>>(new Set());
  const lastUpdateTimeRef = useRef<number>(0);
  const sessionIdRef = useRef<string>('');
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Check browser support
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    if (!supported) {
      setError('Speech recognition not supported. Use Chrome, Edge, or Safari.');
    }
  }, []);

  // FIXED: Ultra-fast processing with proper line separation
  const processResults = useCallback((event: any) => {
    try {
      const now = Date.now();
      
      // Throttle for performance (100ms for stability)
      if (now - lastUpdateTimeRef.current < 100) return;
      lastUpdateTimeRef.current = now;

      let finalText = '';
      let interimText = '';

      // Process all results safely
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result && result[0] && result[0].transcript) {
          const text = result[0].transcript.trim();

          if (result.isFinal) {
            finalText += text + ' ';
          } else {
            interimText += text + ' ';
          }
        }
      }

      // FIXED: Handle final results (permanent entries) - NO REPETITION
      if (finalText.trim()) {
        const cleanFinalText = finalText.trim();
        
        // Create unique key to prevent duplicates
        const uniqueKey = `${cleanFinalText}_${Math.floor(now / 1000)}`;
        
        // Prevent duplicates and ensure minimum length
        if (!processedTextsRef.current.has(uniqueKey) && cleanFinalText.length > 1) {
          processedTextsRef.current.add(uniqueKey);
          
          const finalEntry: TranscriptEntry = {
            id: `${sessionIdRef.current}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            text: cleanFinalText,
            timestamp: new Date(),
            confidence: 1.0,
            speaker: 'User'
          };

          setTranscript(prev => {
            // FIXED: Only add if not already present
            const exists = prev.some(entry => 
              entry.text.trim().toLowerCase() === cleanFinalText.toLowerCase() &&
              Math.abs(entry.timestamp.getTime() - finalEntry.timestamp.getTime()) < 2000
            );
            
            if (!exists) {
              console.log('✅ NEW LINE ADDED:', cleanFinalText);
              return [...prev, finalEntry];
            }
            return prev;
          });
        }
      }

      // FIXED: Handle interim results (live preview) - show but don't save
      if (interimText.trim()) {
        const interimEntry: TranscriptEntry = {
          id: 'interim_preview',
          text: interimText.trim(),
          timestamp: new Date(),
          confidence: 0.7,
          speaker: 'User'
        };

        setTranscript(prev => {
          // Remove any existing interim and add new one
          const filtered = prev.filter(entry => entry.id !== 'interim_preview');
          return [...filtered, interimEntry];
        });
      }
    } catch (error) {
      console.error('Error processing speech results:', error);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    // Clean stop any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (e) {
        console.warn('Error stopping existing recognition:', e);
      }
    }

    // FIXED: Reset all state properly
    isManualStopRef.current = false;
    processedTextsRef.current.clear();
    sessionIdRef.current = Date.now().toString();
    setError(null);

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // OPTIMIZED settings for continuous recording
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎤 LIVE recording started - continuous mode');
        setIsListening(true);
        setError(null);
        retryCountRef.current = 0;
      };

      recognition.onresult = processResults;

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event.error);
        
        // Handle aborted error (manual stop)
        if (event.error === 'aborted' && isManualStopRef.current) {
          setIsListening(false);
          return;
        }

        // Handle no-speech error (continue listening)
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
          return; // Don't stop, just continue
        }

        // Handle network errors with retry logic
        if (event.error === 'network') {
          setIsListening(false);
          
          if (retryCountRef.current < maxRetries && !isManualStopRef.current) {
            retryCountRef.current++;
            setError(`Network error. Retrying... (${retryCountRef.current}/${maxRetries})`);
            
            // Retry after a short delay
            setTimeout(() => {
              if (!isManualStopRef.current) {
                console.log(`🔄 Retrying speech recognition (attempt ${retryCountRef.current})`);
                startListening();
              }
            }, 2000);
            return;
          } else {
            setError('Network error. Please check your connection and try again manually.');
          }
        }

        // Handle other errors
        const errorMessages: { [key: string]: string } = {
          'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
          'audio-capture': 'Microphone error. Please check your microphone.',
          'service-not-allowed': 'Speech service not available. Please try again.',
        };

        setError(errorMessages[event.error] || `Speech error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // FIXED: Auto-restart ONLY if not manually stopped and no errors
        if (!isManualStopRef.current && retryCountRef.current === 0) {
          setTimeout(() => {
            if (!isManualStopRef.current) {
              console.log('🔄 Auto-restarting for continuous recording...');
              startListening();
            }
          }, 1000); // 1 second delay for stability
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start speech recognition. Please try again.');
      setIsListening(false);
    }
  }, [isSupported, processResults]);

  const stopListening = useCallback(() => {
    console.log('🛑 Stopping live recording');
    isManualStopRef.current = true;
    retryCountRef.current = 0;

    // Remove any interim entries before stopping
    setTranscript(prev => prev.filter(entry => entry.id !== 'interim_preview'));

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
    processedTextsRef.current.clear();
    sessionIdRef.current = '';
    console.log('Live transcript cleared');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isManualStopRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
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