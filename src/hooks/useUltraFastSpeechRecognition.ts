import { useState, useRef, useCallback, useEffect } from 'react';

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  confidence?: number;
}

interface UseUltraFastSpeechRecognitionReturn {
  isListening: boolean;
  transcript: TranscriptEntry[];
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

export const useUltraFastSpeechRecognition = (): UseUltraFastSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const isManualStopRef = useRef(false);
  const currentTextRef = useRef<string>('');
  const lastUpdateTimeRef = useRef<number>(0);

  // Check browser support
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    if (!supported) {
      setError('Speech recognition not supported. Use Chrome, Edge, or Safari.');
    }
  }, []);

  // Process speech results INSTANTLY
  const processResults = useCallback((event: any) => {
    const now = Date.now();
    
    // Throttle updates to prevent too many rapid updates
    if (now - lastUpdateTimeRef.current < 100) return; // 100ms throttle for ultra-fast updates
    
    lastUpdateTimeRef.current = now;

    let interimText = '';
    let finalText = '';

    // Process all results
    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      const text = result[0].transcript;

      if (result.isFinal) {
        finalText += text + ' ';
      } else {
        interimText += text + ' ';
      }
    }

    // INSTANT UPDATE: Show interim results immediately
    const displayText = (finalText + interimText).trim();
    
    if (displayText && displayText !== currentTextRef.current) {
      currentTextRef.current = displayText;
      
      // Create or update the current entry
      const newEntry: TranscriptEntry = {
        id: 'current-' + Date.now(),
        text: displayText,
        timestamp: new Date(),
        confidence: finalText ? 1.0 : 0.8
      };

      setTranscript(prev => {
        // Replace the last entry if it's interim, or add new entry
        const filtered = prev.filter(entry => !entry.id.startsWith('current-'));
        return [...filtered, newEntry];
      });
    }

    // If we have final text, create a permanent entry
    if (finalText.trim()) {
      const finalEntry: TranscriptEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: finalText.trim(),
        timestamp: new Date(),
        confidence: 1.0
      };

      setTranscript(prev => {
        // Remove interim entries and add final entry
        const filtered = prev.filter(entry => !entry.id.startsWith('current-'));
        return [...filtered, finalEntry];
      });
      
      currentTextRef.current = '';
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    // Stop existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    isManualStopRef.current = false;
    currentTextRef.current = '';

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // ULTRA-FAST SETTINGS for immediate response
      recognition.continuous = true;
      recognition.interimResults = true; // CRITICAL for instant updates
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      // Optimize for speed
      if ('webkitSpeechRecognition' in window) {
        recognition.serviceURI = 'wss://www.google.com/speech-api/full-duplex/v1/up';
      }

      recognition.onstart = () => {
        console.log('🎤 ULTRA-FAST recognition started');
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = processResults;

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event.error);
        
        if (event.error === 'aborted' && isManualStopRef.current) {
          return;
        }

        if (event.error === 'no-speech') {
          // Continue listening, don't stop
          return;
        }

        if (event.error === 'network') {
          setError('Network error. Reconnecting...');
          // Auto-restart on network error
          setTimeout(() => {
            if (!isManualStopRef.current) {
              startListening();
            }
          }, 1000);
          return;
        }

        const errorMessages: { [key: string]: string } = {
          'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
          'audio-capture': 'Microphone error. Please check your microphone.',
        };

        setError(errorMessages[event.error] || `Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('Recognition ended');
        setIsListening(false);
        
        // PERSISTENT: Auto-restart unless manually stopped
        if (!isManualStopRef.current) {
          console.log('🔄 Auto-restarting for continuous recording...');
          setTimeout(() => {
            if (!isManualStopRef.current) {
              startListening();
            }
          }, 100); // Very fast restart
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setError('Failed to start speech recognition. Please try again.');
    }
  }, [isSupported, processResults]);

  const stopListening = useCallback(() => {
    console.log('🛑 Manually stopping recognition');
    isManualStopRef.current = true;

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
    currentTextRef.current = '';
    console.log('Transcript cleared');
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
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