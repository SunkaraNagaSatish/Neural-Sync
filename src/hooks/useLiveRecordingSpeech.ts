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
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const lastProcessedTimeRef = useRef<number>(0);

  // Check browser support
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
    if (!supported) {
      setError('Speech recognition not supported. Use Chrome, Edge, or Safari.');
    }
  }, []);

  // ULTRA-FAST: Real-time processing with immediate updates
  const processResults = useCallback((event: any) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      let finalText = '';
      let interimText = '';
      
      // Process both interim and final results for real-time feedback
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result && result[0] && result[0].transcript) {
          const text = result[0].transcript.trim();
          if (text.length > 1) {
            if (result.isFinal) {
              finalText = text;
            } else {
              interimText = text;
            }
          }
        }
      }

      // REAL-TIME: Show interim results immediately for live feedback
      if (interimText && !finalText) {
        // Create temporary entry for interim results (will be replaced by final)
        const tempEntry: TranscriptEntry = {
          id: `interim_${Date.now()}`,
          text: interimText,
          timestamp: new Date(),
          confidence: 0.5,
          speaker: 'User'
        };

        setTranscript(prev => {
          // Remove any existing interim entries and add new one
          const withoutInterim = prev.filter(entry => !entry.id.startsWith('interim_'));
          return [...withoutInterim, tempEntry];
        });
      }

      // FINAL: Process final results with strict duplicate prevention
      if (finalText && 
          finalText !== lastFinalTextRef.current && 
          !processedTextsRef.current.has(finalText.toLowerCase()) &&
          finalText.length > 1) {
        
        const now = Date.now();
        // Prevent rapid duplicates (within 500ms)
        if (now - lastProcessedTimeRef.current < 500) {
          isProcessingRef.current = false;
          return;
        }
        
        lastProcessedTimeRef.current = now;
        lastFinalTextRef.current = finalText;
        processedTextsRef.current.add(finalText.toLowerCase());
        
        const newEntry: TranscriptEntry = {
          id: `final_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          text: finalText,
          timestamp: new Date(),
          confidence: 1.0,
          speaker: 'User'
        };

        setTranscript(prev => {
          // Remove interim entries and add final entry
          const withoutInterim = prev.filter(entry => !entry.id.startsWith('interim_'));
          
          // Final check: ensure this exact text doesn't already exist
          const textExists = withoutInterim.some(entry => 
            entry.text.trim().toLowerCase() === finalText.toLowerCase()
          );
          
          if (!textExists) {
            console.log('✅ FINAL SPEECH ENTRY:', finalText);
            return [...withoutInterim, newEntry];
          }
          
          console.log('❌ DUPLICATE PREVENTED:', finalText);
          return withoutInterim;
        });
      }
    } catch (error) {
      console.error('Error processing speech:', error);
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  // ENHANCED: Ultra-fast startup with optimized settings
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
    lastProcessedTimeRef.current = 0;
    currentSessionRef.current = Date.now().toString();
    setError(null);

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // ULTRA-OPTIMIZED settings for maximum speed and accuracy
      recognition.continuous = true;
      recognition.interimResults = true; // CRITICAL: Enable interim results for real-time feedback
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3; // Multiple alternatives for better accuracy
      
      // PERFORMANCE: Optimize for speed and accuracy
      if (recognition.serviceURI) {
        recognition.serviceURI = 'wss://www.google.com/speech-api/v2/recognize';
      }

      recognition.onstart = () => {
        console.log('🎤 ULTRA-FAST LIVE RECORDING STARTED');
        setIsListening(true);
        setError(null);
        retryCountRef.current = 0;
      };

      recognition.onresult = processResults;

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event.error);
        
        // Handle manual stop
        if (event.error === 'aborted' && isManualStopRef.current) {
          setIsListening(false);
          return;
        }

        // ENHANCED: Handle network errors with retry mechanism
        if (event.error === 'network') {
          console.log(`Network error occurred. Retry attempt: ${retryCountRef.current + 1}/${maxRetries}`);
          
          if (retryCountRef.current < maxRetries && !isManualStopRef.current) {
            retryCountRef.current++;
            setError(`Network error. Retrying... (${retryCountRef.current}/${maxRetries})`);
            
            // Quick retry for network issues
            setTimeout(() => {
              if (!isManualStopRef.current) {
                console.log('🔄 Quick retry after network error...');
                startListening();
              }
            }, 1000);
            return;
          } else {
            setError('Network error: Please check your internet connection and try again.');
            setIsListening(false);
            return;
          }
        }

        // Continue on no-speech (don't stop)
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
          return;
        }

        // Handle other errors
        const errorMessages: { [key: string]: string } = {
          'not-allowed': 'Microphone access denied. Please allow microphone permissions and refresh the page.',
          'audio-capture': 'Microphone error. Please check your microphone and try again.',
          'service-not-allowed': 'Speech service not allowed. Please check your browser settings.',
        };

        setError(errorMessages[event.error] || `Speech error: ${event.error}. Please try again.`);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // ULTRA-FAST: Immediate restart for continuous recording
        if (!isManualStopRef.current && retryCountRef.current === 0) {
          console.log('🔄 Immediate restart for continuous recording...');
          setTimeout(() => {
            if (!isManualStopRef.current) {
              startListening();
            }
          }, 100); // Ultra-fast restart
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start speech recognition. Please refresh the page and try again.');
      setIsListening(false);
    }
  }, [isSupported, processResults]);

  const stopListening = useCallback(() => {
    console.log('🛑 MANUALLY STOPPING LIVE RECORDING');
    isManualStopRef.current = true;
    isProcessingRef.current = false;
    retryCountRef.current = 0;

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
    lastProcessedTimeRef.current = 0;
    currentSessionRef.current = '';
    isProcessingRef.current = false;
    retryCountRef.current = 0;
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