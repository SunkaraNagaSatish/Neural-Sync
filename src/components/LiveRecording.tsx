import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Share2, 
  Download,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Volume2, 
  User,
  RefreshCw,
  Play,
  Square,
  Type,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { useLiveRecordingSpeech } from '../hooks/useLiveRecordingSpeech';

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  confidence?: number;
  speaker?: string;
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
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const transcriptRef = useRef<HTMLDivElement>(null);
  const hostId = useRef(Math.random().toString(36).substr(2, 9));
  const autoScrollRef = useRef(true);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError,
    isSupported
  } = useLiveRecordingSpeech();

  // PERFORMANCE: Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (transcriptRef.current && autoScrollRef.current) {
      const element = transcriptRef.current;
      const isScrolledToBottom = element.scrollHeight - element.clientHeight <= element.scrollTop + 1;
      
      if (isScrolledToBottom || transcript.length === 1) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [transcript]);

  // PERFORMANCE: Detect manual scroll to disable auto-scroll
  const handleScroll = useCallback(() => {
    if (transcriptRef.current) {
      const element = transcriptRef.current;
      const isScrolledToBottom = element.scrollHeight - element.clientHeight <= element.scrollTop + 10;
      autoScrollRef.current = isScrolledToBottom;
    }
  }, []);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }, []);

  // Show notification
  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // PERFORMANCE: Memoized session operations
  const saveSession = useCallback((session: LiveSession) => {
    try {
      localStorage.setItem(`live_session_${session.id}`, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, []);

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
    
    window.history.pushState({}, '', `/live-recording/${newSessionId}`);
    showNotification('success', 'Session created! Share the URL to let others watch live.');
    return newSession;
  }, [sessionTitle, generateSessionId, saveSession, showNotification]);

  // ULTRA-FAST: Start recording with optimized session handling
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

    try {
      clearTranscript();
      startListening();
      
      const updatedSession = {
        ...session,
        isActive: true,
        lastUpdate: new Date()
      };
      setCurrentSession(updatedSession);
      saveSession(updatedSession);
      
      showNotification('success', '🎤 ULTRA-FAST RECORDING STARTED! Real-time voice capture enabled.');
    } catch (error) {
      console.error('Error starting recording:', error);
      showNotification('error', 'Failed to start recording. Please try again.');
    }
  }, [currentSession, createNewSession, clearTranscript, startListening, saveSession, showNotification, isSupported]);

  // Stop recording cleanly
  const handleStopRecording = useCallback(() => {
    try {
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
    } catch (error) {
      console.error('Error stopping recording:', error);
      showNotification('error', 'Error stopping recording.');
    }
  }, [currentSession, stopListening, saveSession, showNotification]);

  // PERFORMANCE: Update session with new transcript efficiently
  useEffect(() => {
    if (transcript.length > 0 && currentSession && isHost) {
      try {
        const updatedSession = {
          ...currentSession,
          transcript: [...transcript],
          lastUpdate: new Date()
        };
        setCurrentSession(updatedSession);
        saveSession(updatedSession);
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }
  }, [transcript, currentSession, isHost, saveSession]);

  // Load existing session or prepare for new one
  useEffect(() => {
    if (sessionId) {
      const session = loadSession(sessionId);
      if (session) {
        setCurrentSession(session);
        setIsHost(false);
        setIsSessionStarted(true);
        showNotification('success', 'Connected to live session!');
      } else {
        showNotification('error', 'Session not found or expired.');
        navigate('/live-recording');
      }
    } else {
      setIsHost(true);
    }
  }, [sessionId, loadSession, navigate, showNotification]);

  // Font size controls
  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 10));
  const resetFontSize = () => setFontSize(16);

  // Fullscreen toggle
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  // Share session
  const handleShare = useCallback(() => {
    if (!currentSession) {
      showNotification('error', 'No active session to share');
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/live-recording/${currentSession.id}`;
      navigator.clipboard.writeText(shareUrl);
      showNotification('success', 'Share link copied! Anyone can view without signing up.');
    } catch (error) {
      showNotification('error', 'Failed to copy link. Please copy the URL manually.');
    }
  }, [currentSession, showNotification]);

  // Download transcript
  const handleDownload = useCallback(() => {
    if (!currentSession?.transcript?.length) {
      showNotification('error', 'No transcript to download');
      return;
    }

    try {
      const transcriptText = currentSession.transcript
        .map(entry => `[${entry.timestamp.toLocaleTimeString()}] ${entry.speaker || 'User'}: ${entry.text}`)
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
    } catch (error) {
      showNotification('error', 'Failed to download transcript.');
    }
  }, [currentSession, showNotification]);

  // Clear session
  const handleClearSession = useCallback(() => {
    if (currentSession) {
      try {
        const clearedSession = {
          ...currentSession,
          transcript: [],
          lastUpdate: new Date()
        };
        setCurrentSession(clearedSession);
        saveSession(clearedSession);
        clearTranscript();
        showNotification('success', 'Session cleared!');
      } catch (error) {
        showNotification('error', 'Failed to clear session.');
      }
    }
  }, [currentSession, saveSession, clearTranscript, showNotification]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="w-full max-w-full mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mb-3 shadow-lg">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Ultra-Fast Live Recording
          </h1>
          <p className="text-gray-600">
            {isHost ? 'Real-time voice-to-text with zero repetition and maximum accuracy' : 'Viewing live recording session'}
          </p>
        </div>

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center p-3 border border-red-200 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
              <p className="text-red-800 text-sm">
                Speech recognition not supported. Use Chrome, Edge, or Safari for best performance.
              </p>
            </div>
          </div>
        )}

        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Session Info */}
            <div className="flex items-center gap-4">
              {currentSession && (
                <>
                  <div className="text-sm">
                    <span className="font-medium">{currentSession.title}</span>
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
            <div className="flex items-center gap-3 flex-wrap">
              {/* Font Size Controls */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={decreaseFontSize}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Decrease font size"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-sm font-medium">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Increase font size"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={resetFontSize}
                  className="p-1 hover:bg-white rounded transition-colors"
                  title="Reset font size"
                >
                  <Type className="w-4 h-4" />
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Toggle fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Host Controls */}
              {isHost && (
                <>
                  {!isListening ? (
                    <button
                      onClick={handleStartRecording}
                      disabled={!isSupported}
                      className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 shadow-lg disabled:opacity-50"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Ultra-Fast Recording</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 shadow-lg animate-pulse"
                    >
                      <Square className="w-4 h-4" />
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
                        <span>Share</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        disabled={!currentSession.transcript?.length}
                        className="flex items-center px-3 py-2 space-x-1 text-green-600 transition-colors bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={handleClearSession}
                        className="flex items-center px-3 py-2 space-x-1 text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Clear</span>
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
            <div className="flex items-center justify-between p-3 mt-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{speechError}</span>
              </div>
              <button
                onClick={handleStartRecording}
                className="ml-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Recording Status */}
          {isListening && isHost && (
            <div className="flex items-center p-3 mt-4 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="w-3 h-3 mr-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-green-700 text-sm">🎙️ ULTRA-FAST LIVE RECORDING - Real-time voice capture active!</span>
            </div>
          )}
        </div>

        {/* ULTRA-OPTIMIZED TRANSCRIPT CONTAINER */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Transcript Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Volume2 className="w-5 h-5 mr-2 text-red-500" />
              Ultra-Fast Live Transcript
              {currentSession?.isActive && (
                <span className="ml-2 px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full animate-pulse">
                  LIVE
                </span>
              )}
            </h3>
            {(currentSession?.transcript?.length || transcript.length) && (
              <span className="text-sm text-gray-500">
                {(currentSession?.transcript?.length || transcript.length)} entries
              </span>
            )}
          </div>

          {/* ULTRA-FAST TRANSCRIPT DISPLAY */}
          <div 
            ref={transcriptRef}
            onScroll={handleScroll}
            className="w-full h-[600px] overflow-y-auto p-6"
            style={{ fontSize: `${fontSize}px` }}
          >
            {(currentSession?.transcript?.length || transcript.length) ? (
              <div className="space-y-4 w-full">
                {(isHost ? transcript : currentSession?.transcript || []).map((entry, index) => {
                  const isInterim = entry.id.startsWith('interim_');
                  return (
                    <div 
                      key={entry.id} 
                      className={`flex w-full border-l-4 pl-4 py-2 rounded-r-lg transition-all duration-200 ${
                        isInterim 
                          ? 'border-yellow-400 bg-yellow-50 opacity-70' 
                          : 'border-blue-400 bg-blue-50'
                      }`}
                    >
                      {/* SPEAKER NAME ON LEFT */}
                      <div className="flex-shrink-0 w-16 text-xs font-medium pt-1 flex items-center" style={{ color: isInterim ? '#d97706' : '#2563eb' }}>
                        <User className="w-3 h-3 mr-1" />
                        <span>{isInterim ? 'Live' : 'User'}</span>
                      </div>
                      
                      {/* TEXT CONTENT - OPTIMIZED FOR PERFORMANCE */}
                      <div className="flex-1 ml-4">
                        <p className={`leading-relaxed whitespace-pre-wrap break-words ${
                          isInterim ? 'text-yellow-800 italic' : 'text-gray-900 font-medium'
                        }`}>
                          {entry.text}
                        </p>
                        {/* TIMESTAMP BELOW TEXT */}
                        <div className="text-xs mt-2" style={{ color: isInterim ? '#92400e' : '#6b7280' }}>
                          {entry.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                          {isInterim && <span className="ml-2 animate-pulse">●</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 w-full">
                <div className="text-center">
                  <Mic className="w-20 h-20 mx-auto mb-6 opacity-30" />
                  <p className="text-xl font-medium mb-2">
                    {isHost ? 'Click "Start Ultra-Fast Recording" to begin' : 'Waiting for host to start recording...'}
                  </p>
                  <p className="text-base text-gray-400">
                    {isHost ? 'Real-time voice capture with maximum accuracy and zero repetition!' : 'Live transcript will appear here when recording starts'}
                  </p>
                </div>
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