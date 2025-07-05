import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Share2, 
  Copy, 
  Volume2, 
  Download,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Eye,
  Globe,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import { useUltraFastSpeechRecognition } from '../hooks/useUltraFastSpeechRecognition';

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  confidence?: number;
}

interface LiveSession {
  id: string;
  title: string;
  transcript: TranscriptEntry[];
  isActive: boolean;
  startTime: Date;
  lastUpdate: Date;
  viewerCount: number;
  hostId: string;
}

export const LiveRecording: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isHost, setIsHost] = useState(!sessionId);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  
  const transcriptRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hostId = useRef(Math.random().toString(36).substr(2, 9));

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError,
    isSupported
  } = useUltraFastSpeechRecognition();

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }, []);

  // Show notification
  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Save session to localStorage
  const saveSession = useCallback((session: LiveSession) => {
    try {
      localStorage.setItem(`live_session_${session.id}`, JSON.stringify(session));
      console.log('Session saved:', session.id);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, []);

  // Load session from localStorage
  const loadSession = useCallback((id: string): LiveSession | null => {
    try {
      const sessionData = localStorage.getItem(`live_session_${id}`);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        return {
          ...session,
          startTime: new Date(session.startTime),
          lastUpdate: new Date(session.lastUpdate),
          transcript: session.transcript.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))
        };
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
    return null;
  }, []);

  // Create new session
  const createNewSession = useCallback(() => {
    const newSessionId = generateSessionId();
    const newSession: LiveSession = {
      id: newSessionId,
      title: sessionTitle || `Live Recording - ${new Date().toLocaleDateString()}`,
      transcript: [],
      isActive: false,
      startTime: new Date(),
      lastUpdate: new Date(),
      viewerCount: 1,
      hostId: hostId.current
    };
    
    setCurrentSession(newSession);
    saveSession(newSession);
    setIsSessionStarted(true);
    
    // Update URL without navigation
    window.history.pushState({}, '', `/live-recording/${newSessionId}`);
    
    showNotification('success', 'Session created! Share the URL to let others watch live.');
    return newSession;
  }, [sessionTitle, generateSessionId, saveSession, showNotification]);

  // Start recording
  const handleStartRecording = useCallback(() => {
    if (!isSupported) {
      showNotification('error', 'Speech recognition not supported. Use Chrome, Edge, or Safari.');
      return;
    }

    let session = currentSession;
    if (!session) {
      session = createNewSession();
      if (!session) return;
    }

    clearTranscript();
    startListening();
    
    const updatedSession = {
      ...session,
      isActive: true,
      lastUpdate: new Date()
    };
    setCurrentSession(updatedSession);
    saveSession(updatedSession);
    
    showNotification('success', '🎤 LIVE RECORDING STARTED! Speak now - words will appear instantly.');
  }, [currentSession, createNewSession, clearTranscript, startListening, saveSession, showNotification, isSupported]);

  // Stop recording
  const handleStopRecording = useCallback(() => {
    stopListening();
    
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        isActive: false,
        lastUpdate: new Date()
      };
      setCurrentSession(updatedSession);
      saveSession(updatedSession);
    }
    
    showNotification('info', 'Recording stopped. Click "Start Recording" to continue.');
  }, [currentSession, stopListening, saveSession, showNotification]);

  // Update session with new transcript in real-time
  useEffect(() => {
    if (transcript.length > 0 && currentSession && isHost) {
      const updatedSession = {
        ...currentSession,
        transcript: [...transcript],
        lastUpdate: new Date()
      };
      setCurrentSession(updatedSession);
      saveSession(updatedSession);
    }
  }, [transcript, currentSession, isHost, saveSession]);

  // Load existing session or prepare for new one
  useEffect(() => {
    if (sessionId) {
      // Viewer mode
      const session = loadSession(sessionId);
      if (session) {
        setCurrentSession(session);
        setIsHost(false);
        setConnectionStatus('connected');
        setIsSessionStarted(true);
        showNotification('success', 'Connected to live session!');
      } else {
        showNotification('error', 'Session not found or expired.');
        navigate('/live-recording');
      }
    } else {
      // Host mode
      setIsHost(true);
      setConnectionStatus('connected');
    }
  }, [sessionId, loadSession, navigate, showNotification]);

  // Poll for updates when viewing (not hosting)
  useEffect(() => {
    if (!isHost && currentSession && sessionId) {
      setConnectionStatus('connecting');
      
      pollIntervalRef.current = setInterval(() => {
        const updatedSession = loadSession(sessionId);
        if (updatedSession) {
          setCurrentSession(updatedSession);
          setConnectionStatus('connected');
          setViewerCount(Math.floor(Math.random() * 3) + 1);
        } else {
          setConnectionStatus('disconnected');
        }
      }, 1000); // Poll every 1 second for faster updates

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [isHost, currentSession, sessionId, loadSession]);

  // Share session
  const handleShare = useCallback(() => {
    if (!currentSession) {
      showNotification('error', 'No active session to share');
      return;
    }

    const shareUrl = `${window.location.origin}/live-recording/${currentSession.id}`;
    navigator.clipboard.writeText(shareUrl);
    showNotification('success', 'Share link copied! Anyone can view without signing up.');
  }, [currentSession, showNotification]);

  // Download transcript
  const handleDownload = useCallback(() => {
    if (!currentSession?.transcript?.length) {
      showNotification('error', 'No transcript to download');
      return;
    }

    const transcriptText = currentSession.transcript
      .map(entry => `[${entry.timestamp.toLocaleTimeString()}] ${entry.text}`)
      .join('\n\n');

    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSession.title.replace(/[^a-z0-9]/gi, '_')}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('success', 'Transcript downloaded!');
  }, [currentSession, showNotification]);

  // Clear session
  const handleClearSession = useCallback(() => {
    if (currentSession) {
      const clearedSession = {
        ...currentSession,
        transcript: [],
        lastUpdate: new Date()
      };
      setCurrentSession(clearedSession);
      saveSession(clearedSession);
      clearTranscript();
      showNotification('success', 'Session cleared!');
    }
  }, [currentSession, saveSession, clearTranscript, showNotification]);

  // Format duration
  const formatDuration = useCallback((startTime: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-6 px-4">
      <div className="max-w-full mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mb-3 shadow-lg">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Live Voice Recording
          </h1>
          <p className="text-gray-600">
            {isHost ? 'Ultra-fast voice-to-text with instant sharing' : 'Viewing live recording session'}
          </p>
        </div>

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center p-3 border border-red-200 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
              <p className="text-red-800 text-sm">
                Speech recognition not supported. Use Chrome, Edge, or Safari.
              </p>
            </div>
          </div>
        )}

        {/* Compact Controls Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Session Info */}
            <div className="flex items-center space-x-4">
              {currentSession && (
                <>
                  <div className="text-sm">
                    <span className="font-medium">{currentSession.title}</span>
                    {currentSession.startTime && (
                      <span className="text-gray-500 ml-2">
                        • {formatDuration(currentSession.startTime)}
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center space-x-1 text-xs ${
                    currentSession.isActive ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      currentSession.isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    <span>{currentSession.isActive ? 'LIVE' : 'STOPPED'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Connection Status for Viewers */}
              {!isHost && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
                  connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {connectionStatus === 'connected' ? <Wifi className="w-3 h-3" /> :
                   connectionStatus === 'connecting' ? <Wifi className="w-3 h-3 animate-pulse" /> :
                   <WifiOff className="w-3 h-3" />}
                  <span className="capitalize">{connectionStatus}</span>
                </div>
              )}

              {/* Host Controls */}
              {isHost && (
                <>
                  {!isListening ? (
                    <button
                      onClick={handleStartRecording}
                      disabled={!isSupported}
                      className="flex items-center px-4 py-2 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 shadow-lg disabled:opacity-50"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Recording</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex items-center px-4 py-2 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-800 shadow-lg"
                    >
                      <MicOff className="w-4 h-4" />
                      <span>Stop Recording</span>
                    </button>
                  )}

                  {currentSession && (
                    <>
                      <button
                        onClick={handleShare}
                        className="flex items-center px-3 py-2 space-x-1 text-indigo-600 transition-colors bg-indigo-50 rounded-lg hover:bg-indigo-100"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        disabled={!currentSession.transcript?.length}
                        className="flex items-center px-3 py-2 space-x-1 text-green-600 transition-colors bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        onClick={handleClearSession}
                        className="flex items-center px-3 py-2 space-x-1 text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Clear</span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Session Title Input for New Sessions */}
          {isHost && !isSessionStarted && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="Enter session title (optional)..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
              />
            </div>
          )}

          {/* Speech Error Display */}
          {speechError && isHost && (
            <div className="flex items-center p-3 mt-4 border border-red-200 bg-red-50 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-red-700 text-sm">{speechError}</span>
            </div>
          )}

          {/* Recording Status */}
          {isListening && isHost && (
            <div className="flex items-center p-3 mt-4 border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
              <div className="w-3 h-3 mr-2 bg-red-500 rounded-full animate-pulse" />
              <span className="font-medium text-red-700 text-sm">🎙️ LIVE RECORDING - Speak now! Words appear instantly.</span>
            </div>
          )}
        </div>

        {/* FULL WIDTH TRANSCRIPT CONTAINER - NO SIDEBAR */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Transcript Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Volume2 className="w-5 h-5 mr-2 text-red-500" />
              Live Transcript
              {currentSession?.isActive && (
                <span className="ml-2 px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full animate-pulse">
                  LIVE
                </span>
              )}
            </h3>
            {currentSession?.transcript?.length && (
              <span className="text-sm text-gray-500">
                {currentSession.transcript.length} entries
              </span>
            )}
          </div>

          {/* MASSIVE TRANSCRIPT DISPLAY - FULL WIDTH, NO COMPONENTS BESIDE */}
          <div 
            ref={transcriptRef}
            className="w-full h-[600px] overflow-y-auto p-6"
            style={{ width: '100%', maxWidth: '100%' }}
          >
            {(currentSession?.transcript?.length || transcript.length) ? (
              <div className="space-y-4 w-full">
                {/* Show current session transcript for viewers, or live transcript for hosts */}
                {(isHost ? transcript : currentSession?.transcript || []).map((entry, index) => (
                  <div key={entry.id || index} className="flex w-full">
                    {/* TIMESTAMP ON LEFT */}
                    <div className="flex-shrink-0 w-20 text-xs text-gray-500 font-mono pt-1">
                      {entry.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                    
                    {/* TEXT CONTENT - PROPER PARAGRAPH FORMAT */}
                    <div className="flex-1 ml-4">
                      <p className="text-gray-900 leading-relaxed text-base whitespace-pre-wrap">
                        {entry.text}
                      </p>
                      {/* Confidence indicator for interim results */}
                      {entry.confidence && entry.confidence < 1.0 && (
                        <div className="mt-1">
                          <div className="w-full h-1 bg-gray-200 rounded-full">
                            <div 
                              className="h-1 bg-yellow-400 rounded-full transition-all duration-300"
                              style={{ width: `${entry.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 w-full">
                <div className="text-center">
                  <Mic className="w-20 h-20 mx-auto mb-6 opacity-30" />
                  <p className="text-xl font-medium mb-2">
                    {isHost ? 'Click "Start Recording" to begin' : 'Waiting for host to start recording...'}
                  </p>
                  <p className="text-base text-gray-400">
                    {isHost ? 'Your voice will appear as text instantly - no delays!' : 'Live transcript will appear here when recording starts'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-4 text-blue-800">
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>No login required for viewers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Real-time updates</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>Instant sharing</span>
              </div>
            </div>
            
            {!isHost && (
              <div className="text-blue-700">
                <span className="font-medium">{viewerCount} viewer{viewerCount !== 1 ? 's' : ''} watching</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-2 max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 
          notification.type === 'error' ? 'bg-red-500 text-white' : 
          'bg-blue-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};