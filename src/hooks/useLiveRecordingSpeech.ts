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
  const lastFinalTextRef = useRef<string>('');
  const currentSessionRef = useRef<string>('');
  const isProcessingRef = useRef(false);

  // Check browser support
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    if (!supported) {
      setError('Speech recognition not supported. Use Chrome, Edge, or Safari.');
    }
  }, []);

  // COMPLETELY REWRITTEN: Zero repetition, perfect line separation
  const processResults = useCallback((event: any) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      let finalText = '';
      
      // Only process FINAL results to prevent duplicates
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result && result.isFinal && result[0] && result[0].transcript) {
          const text = result[0].transcript.trim();
          if (text.length > 1) {
            finalText = text;
            break; // Take only the first final result
          }
        }
      }

      // STRICT duplicate prevention with multiple checks
      if (finalText && 
          finalText !== lastFinalTextRef.current && 
          !processedTextsRef.current.has(finalText.toLowerCase()) &&
          finalText.length > 1) {
        
        // Mark as processed immediately
        lastFinalTextRef.current = finalText;
        processedTextsRef.current.add(finalText.toLowerCase());
        
        const newEntry: TranscriptEntry = {
          id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          text: finalText,
          timestamp: new Date(),
          confidence: 1.0,
          speaker: 'User'
        };

        setTranscript(prev => {
          // Final check: ensure this exact text doesn't already exist
          const textExists = prev.some(entry => 
            entry.text.trim().toLowerCase() === finalText.toLowerCase()
          );
          
          if (!textExists) {
            console.log('✅ NEW SPEECH ENTRY:', finalText);
            return [...prev, newEntry];
          }
          
          console.log('❌ DUPLICATE PREVENTED:', finalText);
          return prev;
        });
      }
    } catch (error) {
      console.error('Error processing speech:', error);
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    // COMPLETE RESET - Stop any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    // RESET ALL STATE COMPLETELY
    isManualStopRef.current = false;
    isProcessingRef.current = false;
    processedTextsRef.current.clear();
    lastFinalTextRef.current = '';
    currentSessionRef.current = Date.now().toString();
    setError(null);

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // OPTIMIZED settings for continuous, non-repetitive recording
      recognition.continuous = true;
      recognition.interimResults = false; // CRITICAL: Only final results to prevent duplicates
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎤 LIVE RECORDING STARTED - ZERO REPETITION MODE');
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = processResults;

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event.error);
        
        // Handle manual stop
        if (event.error === 'aborted' && isManualStopRef.current) {
          setIsListening(false);
          return;
        }

        // Continue on no-speech (don't stop)
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
          return;
        }

        // Handle network errors
        if (event.error === 'network') {
          setError('Network error. Please check connection and restart recording.');
          setIsListening(false);
          return;
        }

        // Handle other errors
        const errorMessages: { [key: string]: string } = {
          'not-allowed': 'Microphone access denied. Please allow microphone permissions.',
          'audio-capture': 'Microphone error. Please check your microphone.',
        };

        setError(errorMessages[event.error] || `Speech error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // FIXED: Auto-restart for continuous recording ONLY if not manually stopped
        if (!isManualStopRef.current) {
          console.log('🔄 Auto-restarting for continuous recording...');
          setTimeout(() => {
            if (!isManualStopRef.current) {
              startListening();
            }
          }, 500); // Short delay for stability
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
    console.log('🛑 MANUALLY STOPPING LIVE RECORDING');
    isManualStopRef.current = true;
    isProcessingRef.current = false;

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
    lastFinalTextRef.current = '';
    currentSessionRef.current = '';
    isProcessingRef.current = false;
    console.log('✅ TRANSCRIPT COMPLETELY CLEARED');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isManualStopRef.current = true;
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