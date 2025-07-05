import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Share2, 
  Copy, 
  Users, 
  Clock, 
  Volume2, 
  Download,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Link
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface LiveSession {
  id: string;
  title: string;
  transcript: string;
  isActive: boolean;
  startTime: Date;
  lastUpdate: Date;
  viewerCount: number;
}

export const LiveRecording: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [isHost, setIsHost] = useState(!sessionId);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  
  const transcriptRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptLength = useRef(0);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError
  } = useSpeechRecognition();

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }, []);

  // Show notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Save session to localStorage (simulating real-time database)
  const saveSession = useCallback((session: LiveSession) => {
    localStorage.setItem(`live_session_${session.id}`, JSON.stringify(session));
    localStorage.setItem('live_sessions_list', JSON.stringify([
      ...JSON.parse(localStorage.getItem('live_sessions_list') || '[]').filter((id: string) => id !== session.id),
      session.id
    ]));
  }, []);

  // Load session from localStorage
  const loadSession = useCallback((id: string): LiveSession | null => {
    const sessionData = localStorage.getItem(`live_session_${id}`);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      return {
        ...session,
        startTime: new Date(session.startTime),
        lastUpdate: new Date(session.lastUpdate)
      };
    }
    return null;
  }, []);

  // Create new session
  const createNewSession = useCallback(() => {
    const newSessionId = generateSessionId();
    const newSession: LiveSession = {
      id: newSessionId,
      title: sessionTitle || `Live Recording - ${new Date().toLocaleDateString()}`,
      transcript: '',
      isActive: false,
      startTime: new Date(),
      lastUpdate: new Date(),
      viewerCount: 1
    };
    
    setCurrentSession(newSession);
    saveSession(newSession);
    
    // Update URL without navigation
    window.history.pushState({}, '', `/live-recording/${newSessionId}`);
    
    showNotification('success', 'Live recording session created!');
    return newSession;
  }, [sessionTitle, generateSessionId, saveSession, showNotification]);

  // Start recording
  const handleStartRecording = useCallback(() => {
    if (!currentSession) {
      const session = createNewSession();
      if (!session) return;
    }

    clearTranscript();
    startListening();
    
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        isActive: true,
        lastUpdate: new Date()
      };
      setCurrentSession(updatedSession);
      saveSession(updatedSession);
    }
    
    showNotification('success', 'Live recording started!');
  }, [currentSession, createNewSession, clearTranscript, startListening, saveSession, showNotification]);

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
    
    showNotification('success', 'Recording stopped.');
  }, [currentSession, stopListening, saveSession, showNotification]);

  // Update transcript in real-time
  useEffect(() => {
    if (transcript.length > 0 && currentSession && isHost) {
      const latestTranscript = transcript.map(entry => 
        `[${entry.timestamp.toLocaleTimeString()}] ${entry.text}`
      ).join('\n\n');
      
      if (latestTranscript !== currentSession.transcript) {
        const updatedSession = {
          ...currentSession,
          transcript: latestTranscript,
          lastUpdate: new Date()
        };
        setCurrentSession(updatedSession);
        saveSession(updatedSession);
      }
    }
  }, [transcript, currentSession, isHost, saveSession]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current && currentSession?.transcript) {
      const currentLength = currentSession.transcript.length;
      if (currentLength > lastTranscriptLength.current) {
        transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        lastTranscriptLength.current = currentLength;
      }
    }
  }, [currentSession?.transcript]);

  // Load existing session or create new one
  useEffect(() => {
    if (sessionId) {
      // Viewer mode - load existing session
      const session = loadSession(sessionId);
      if (session) {
        setCurrentSession(session);
        setIsHost(false);
        setConnectionStatus('connected');
        showNotification('success', 'Connected to live session!');
      } else {
        showNotification('error', 'Session not found. It may have expired or been deleted.');
        navigate('/live-recording');
      }
    } else {
      // Host mode - prepare for new session
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
          
          // Simulate viewer count (in real app, this would come from server)
          setViewerCount(Math.floor(Math.random() * 5) + 1);
        } else {
          setConnectionStatus('disconnected');
        }
      }, 2000); // Poll every 2 seconds

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
    showNotification('success', 'Share link copied to clipboard!');
  }, [currentSession, showNotification]);

  // Download transcript
  const handleDownload = useCallback(() => {
    if (!currentSession?.transcript) {
      showNotification('error', 'No transcript to download');
      return;
    }

    const blob = new Blob([currentSession.transcript], { type: 'text/plain' });
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
        transcript: '',
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Live Voice Recording
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isHost ? 'Record your voice in real-time and share with others instantly' : 'Viewing live recording session'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Recording Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Info & Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  {isHost && !currentSession ? (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Session Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={sessionTitle}
                        onChange={(e) => setSessionTitle(e.target.value)}
                        placeholder="Enter session title..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
                      />
                    </div>
                  ) : currentSession ? (
                    <div>
                      {isEditingTitle && isHost ? (
                        <input
                          type="text"
                          value={currentSession.title}
                          onChange={(e) => setCurrentSession(prev => prev ? { ...prev, title: e.target.value } : null)}
                          onBlur={() => setIsEditingTitle(false)}
                          onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                          className="text-xl font-bold bg-transparent border-b-2 border-red-500 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <h2 
                          className="text-xl font-bold text-gray-900 cursor-pointer hover:text-red-600 transition-colors"
                          onClick={() => isHost && setIsEditingTitle(true)}
                        >
                          {currentSession.title}
                        </h2>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {formatDuration(currentSession.startTime)}</span>
                        </div>
                        {!isHost && (
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{viewerCount} viewer{viewerCount !== 1 ? 's' : ''}</span>
                          </div>
                        )}
                        <div className={`flex items-center space-x-1 ${
                          currentSession.isActive ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            currentSession.isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                          }`} />
                          <span>{currentSession.isActive ? 'Recording' : 'Stopped'}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Connection Status for Viewers */}
                {!isHost && (
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
                    connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-500' :
                      connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                      'bg-red-500'
                    }`} />
                    <span className="capitalize">{connectionStatus}</span>
                  </div>
                )}
              </div>

              {/* Recording Controls - Only for Host */}
              {isHost && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {!isListening ? (
                    <button
                      onClick={handleStartRecording}
                      className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 shadow-lg"
                    >
                      <Mic className="w-5 h-5" />
                      <span>Start Live Recording</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl hover:from-gray-700 hover:to-gray-800 shadow-lg animate-pulse"
                    >
                      <MicOff className="w-5 h-5" />
                      <span>Stop Recording</span>
                    </button>
                  )}

                  {currentSession && (
                    <>
                      <button
                        onClick={handleShare}
                        className="flex items-center px-4 py-3 space-x-2 font-medium text-indigo-600 transition-colors bg-indigo-50 rounded-xl hover:bg-indigo-100"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        disabled={!currentSession.transcript}
                        className="flex items-center px-4 py-3 space-x-2 font-medium text-green-600 transition-colors bg-green-50 rounded-xl hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={handleClearSession}
                        className="flex items-center px-4 py-3 space-x-2 font-medium text-red-600 transition-colors bg-red-50 rounded-xl hover:bg-red-100"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Clear</span>
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Speech Error Display */}
              {speechError && isHost && (
                <div className="flex items-center p-4 mb-4 border border-red-200 bg-red-50 rounded-xl">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  <span className="text-red-700">{speechError}</span>
                </div>
              )}

              {/* Recording Status */}
              {isListening && isHost && (
                <div className="flex items-center p-4 mb-4 border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                  <div className="w-4 h-4 mr-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-medium text-red-700">Recording in progress... Speak clearly into your microphone</span>
                </div>
              )}
            </div>

            {/* Live Transcript Display */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Volume2 className="w-5 h-5 mr-2 text-red-500" />
                  Live Transcript
                </h3>
                {currentSession?.transcript && (
                  <span className="text-sm text-gray-500">
                    {currentSession.transcript.length} characters
                  </span>
                )}
              </div>

              <div 
                ref={transcriptRef}
                className="min-h-[400px] max-h-[600px] overflow-y-auto p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
              >
                {currentSession?.transcript ? (
                  <div className="space-y-4">
                    {currentSession.transcript.split('\n\n').map((entry, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-red-400">
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{entry}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Mic className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">
                        {isHost ? 'Click "Start Live Recording" to begin' : 'Waiting for host to start recording...'}
                      </p>
                      <p className="mt-2 text-sm">
                        {isHost ? 'Your voice will be converted to text in real-time' : 'Live transcript will appear here when recording starts'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-500" />
                Session Details
              </h3>
              
              {currentSession ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Session ID</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="flex-1 px-2 py-1 text-xs bg-gray-100 rounded font-mono">
                        {currentSession.id}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(currentSession.id);
                          showNotification('success', 'Session ID copied!');
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Share URL</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="text"
                        value={`${window.location.origin}/live-recording/${currentSession.id}`}
                        readOnly
                        className="flex-1 px-2 py-1 text-xs bg-gray-100 rounded border-0 focus:ring-0"
                      />
                      <button
                        onClick={handleShare}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {currentSession.isActive ? 'LIVE' : 'STOPPED'}
                      </div>
                      <div className="text-xs text-gray-600">Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatDuration(currentSession.startTime)}
                      </div>
                      <div className="text-xs text-gray-600">Duration</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No active session</p>
                  <p className="text-sm mt-1">Start recording to create a session</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                {isHost ? 'How to Use' : 'Viewing Mode'}
              </h3>
              <div className="space-y-3 text-sm text-blue-800">
                {isHost ? (
                  <>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                      <p>Click "Start Live Recording" to begin capturing your voice</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                      <p>Speak clearly - your voice will be converted to text in real-time</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                      <p>Share the session URL with others to let them view live</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                      <p>Download the transcript when finished</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start space-x-2">
                      <Eye className="w-4 h-4 mt-1 text-blue-600" />
                      <p>You're viewing a live recording session</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Volume2 className="w-4 h-4 mt-1 text-blue-600" />
                      <p>The transcript updates automatically as the host speaks</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Users className="w-4 h-4 mt-1 text-blue-600" />
                      <p>No login required - just watch and follow along</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Browser Compatibility */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Browser Support</h3>
              <div className="space-y-2 text-sm text-amber-800">
                <p>✅ Chrome (Recommended)</p>
                <p>✅ Edge</p>
                <p>✅ Safari</p>
                <p>❌ Firefox (Limited support)</p>
              </div>
              <p className="text-xs text-amber-700 mt-3">
                For best results, use Chrome or Edge with microphone permissions enabled.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-2 max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
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