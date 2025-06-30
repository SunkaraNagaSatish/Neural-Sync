import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Download, 
  Copy, 
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Brain,
  Zap,
  MessageSquare,
  FileText,
  BarChart3,
  Play,
  Pause,
  Send,
  Crown,
  Lock
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MeetingContext, AIResponse } from '../types';
import { generateMeetingResponse, generateMeetingSummary, generateInterviewTips, testGeminiConnection, isGeminiReady } from '../services/geminiService';
import { usePremium } from '../contexts/PremiumContext';

interface MeetingScreenProps {
  context?: MeetingContext;
}

export const MeetingScreen: React.FC<MeetingScreenProps> = ({ context }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPremium } = usePremium();
  
  // Get context from location state if not provided as prop
  const meetingContext = context || location.state?.context;

  // Redirect if no context provided
  useEffect(() => {
    if (!meetingContext) {
      navigate('/setup');
    }
  }, [meetingContext, navigate]);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError
  } = useSpeechRecognition();

  const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);
  const [meetingSummary, setMeetingSummary] = useState('');
  const [interviewTips, setInterviewTips] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [manualQuestion, setManualQuestion] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const aiResponsesRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(new Date());

  // Check API readiness on mount
  useEffect(() => {
    const checkAPI = async () => {
      const ready = isGeminiReady();
      if (ready) {
        const connectionTest = await testGeminiConnection();
        setApiReady(connectionTest);
        if (connectionTest) {
          showNotification('success', 'Neural Sync AI is ready! Ultra-fast responses enabled.');
        }
      }
    };
    
    checkAPI();
  }, []);

  // Auto-pause recording when new transcript entry is added
  useEffect(() => {
    if (transcript.length > 0 && isListening) {
      const lastEntry = transcript[transcript.length - 1];
      const timeSinceLastEntry = Date.now() - lastEntry.timestamp.getTime();
      
      // Auto-pause after getting a question (with small delay to ensure complete capture)
      if (timeSinceLastEntry < 1000) {
        setTimeout(() => {
          if (isListening) {
            stopListening();
            setRecordingState('paused');
            showNotification('success', 'Question captured! Click "Continue Recording" for next question.');
          }
        }, 1500);
      }
    }
  }, [transcript, isListening, stopListening]);

  // Auto-scroll to top of AI responses when new response is added
  useEffect(() => {
    if (aiResponsesRef.current && aiResponses.length > 0) {
      aiResponsesRef.current.scrollTop = 0;
    }
  }, [aiResponses]);

  // Auto-scroll to top of transcript when new entry is added
  useEffect(() => {
    if (transcriptRef.current && transcript.length > 0) {
      transcriptRef.current.scrollTop = 0;
    }
  }, [transcript]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartRecording = () => {
    startListening();
    setRecordingState('recording');
  };

  const handleContinueRecording = () => {
    startListening();
    setRecordingState('recording');
  };

  const handleStopRecording = () => {
    stopListening();
    setRecordingState('idle');
  };

  const handleGenerateResponse = async (questionText?: string) => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    const questionToUse = questionText || (transcript.length > 0 ? transcript[transcript.length - 1]?.text : '') || manualQuestion.trim();
    
    if (!questionToUse) {
      showNotification('error', 'Please record a question or type one manually');
      return;
    }

    setIsGeneratingResponse(true);
    const startTime = Date.now();
    
    try {
      const response = await generateMeetingResponse(meetingContext!, transcript);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const aiResponse: AIResponse = {
        id: Date.now().toString(),
        query: questionToUse,
        response,
        timestamp: new Date()
      };
      
      // Add to beginning of array for recent-first display
      setAiResponses(prev => [aiResponse, ...prev]);
      setManualQuestion(''); // Clear manual input
      showNotification('success', `AI response generated in ${responseTime}ms!`);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate AI response';
      showNotification('error', errorMessage);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleManualQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualQuestion.trim()) {
      handleGenerateResponse(manualQuestion.trim());
    }
  };

  const handleGenerateSummary = async () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (transcript.length === 0) {
      showNotification('error', 'No transcript available to summarize');
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const summary = await generateMeetingSummary(meetingContext!, transcript);
      setMeetingSummary(summary);
      showNotification('success', 'Meeting summary generated!');
    } catch (error) {
      console.error('Error generating summary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate meeting summary';
      showNotification('error', errorMessage);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateTips = async () => {
    setIsGeneratingTips(true);
    try {
      const tips = await generateInterviewTips(meetingContext!, transcript);
      setInterviewTips(tips);
      showNotification('success', 'Smart tips generated!');
    } catch (error) {
      console.error('Error generating tips:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate interview tips';
      showNotification('error', errorMessage);
    } finally {
      setIsGeneratingTips(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('success', 'Copied to clipboard!');
  };

  const downloadTranscript = () => {
    const content = transcript.map(entry => 
      `[${entry.timestamp.toLocaleTimeString()}] ${entry.text}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neural-sync-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', 'Transcript downloaded!');
  };

  if (!meetingContext) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - AI Response & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Response Generation - TOP PRIORITY */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-indigo-600" />
                  Neural AI Assistant
                  {isPremium ? (
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
                      Ultra-Fast
                    </span>
                  ) : (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-medium flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => handleGenerateResponse()}
                  disabled={isGeneratingResponse || (!transcript.length && !manualQuestion.trim())}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold shadow-lg"
                >
                  {isGeneratingResponse ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Get Instant Response</span>
                    </>
                  )}
                </button>
              </div>

              {/* Manual Question Input - ENHANCED */}
              <form onSubmit={handleManualQuestionSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={manualQuestion}
                    onChange={(e) => setManualQuestion(e.target.value)}
                    placeholder="Type a question manually if speech recognition doesn't capture it..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors text-base"
                  />
                  <button
                    type="submit"
                    disabled={!manualQuestion.trim() || isGeneratingResponse}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ask</span>
                  </button>
                </div>
              </form>

              {apiReady && isPremium && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">Neural Sync AI is ready for lightning-fast, accurate responses!</span>
                </div>
              )}

              {/* AI Responses - ENHANCED SIZE AND SPACING */}
              <div 
                ref={aiResponsesRef}
                className="space-y-6 max-h-[600px] overflow-y-auto"
              >
                {aiResponses.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Brain className="w-20 h-20 mx-auto mb-6 opacity-30" />
                    <p className="text-xl font-medium">AI responses will appear here</p>
                    <p className="text-base mt-2">Record a question or type manually and click "Get Instant Response" for ultra-fast AI assistance</p>
                  </div>
                ) : (
                  aiResponses.map((response) => (
                    <div key={response.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mb-4">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide bg-indigo-100 px-3 py-1 rounded-full">
                          Neural Response
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(response.response)}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                            title="Copy response"
                          >
                            <Copy className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="text-xs text-gray-500 mt-1">
                            {response.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 font-medium">Question:</p>
                        <p className="text-base text-gray-700 italic mb-4 bg-white/50 p-3 rounded-lg">{response.query}</p>
                      </div>
                      <p className="text-gray-900 leading-relaxed font-medium text-lg">{response.response}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Smart Tips & Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Smart Tips */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                    Smart Tips
                  </h3>
                  <button
                    onClick={handleGenerateTips}
                    disabled={isGeneratingTips}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isGeneratingTips ? 'Generating...' : 'Get Tips'}
                  </button>
                </div>

                {interviewTips.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {interviewTips.map((tip, index) => (
                      <div key={index} className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400">
                        <p className="text-sm text-amber-800 font-medium">{tip}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Get personalized tips based on your conversation context.
                  </p>
                )}
              </div>

              {/* Meeting Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Summary
                    {!isPremium && <Crown className="w-4 h-4 ml-2 text-amber-500" />}
                  </h3>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary || !isPremium}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isGeneratingSummary ? 'Generating...' : 'Generate'}
                  </button>
                </div>

                {!isPremium ? (
                  <div className="text-center py-8">
                    <Crown className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                    <p className="text-gray-600 mb-3">Premium feature</p>
                    <button
                      onClick={() => setShowPremiumModal(true)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                    >
                      Upgrade to Access
                    </button>
                  </div>
                ) : meetingSummary ? (
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                        Meeting Summary
                      </span>
                      <button
                        onClick={() => copyToClipboard(meetingSummary)}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                        title="Copy summary"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">
                      {meetingSummary}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Generate a comprehensive summary of your meeting when you're ready.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Questions & Transcript */}
          <div className="space-y-6">
            {/* Questions/Transcript Panel - RIGHT SIDE */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Live Questions & Transcript
                </h2>
                {transcript.length > 0 && (
                  <button
                    onClick={downloadTranscript}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-1 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                )}
              </div>

              {/* Recording Controls */}
              <div className="mb-6 space-y-3">
                {recordingState === 'idle' && (
                  <button
                    onClick={handleStartRecording}
                    className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start Recording</span>
                  </button>
                )}

                {recordingState === 'recording' && (
                  <button
                    onClick={handleStopRecording}
                    className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 animate-pulse-soft"
                  >
                    <MicOff className="w-5 h-5" />
                    <span>Recording... (Click to Stop)</span>
                  </button>
                )}

                {recordingState === 'paused' && (
                  <button
                    onClick={handleContinueRecording}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Continue Recording</span>
                  </button>
                )}

                {speechError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{speechError}</span>
                  </div>
                )}
              </div>

              {/* Transcript Display - Recent First with Better Spacing */}
              <div
                ref={transcriptRef}
                className="bg-gray-50 rounded-xl p-4 h-80 overflow-y-auto border"
              >
                {transcript.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Click "Start Recording" to capture questions</p>
                      <p className="text-sm mt-2">Neural Sync will process speech in real-time</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Show most recent first with better spacing */}
                    {[...transcript].reverse().map((entry) => (
                      <div key={entry.id} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-indigo-400 mb-3">
                        <div className="flex items-start justify-between">
                          <p className="text-gray-900 flex-1 font-medium text-base leading-relaxed">{entry.text}</p>
                          <span className="text-xs text-gray-500 ml-3 flex-shrink-0">
                            {entry.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        {entry.confidence && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-indigo-500 h-1 rounded-full"
                                style={{ width: `${entry.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {transcript.length > 0 && (
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={clearTranscript}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Clear Transcript
                  </button>
                  <span className="text-sm text-gray-500">
                    {transcript.length} entries captured
                  </span>
                </div>
              )}
            </div>

            {/* Session Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Session Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{transcript.length}</div>
                  <div className="text-xs text-gray-600">Questions Captured</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{aiResponses.length}</div>
                  <div className="text-xs text-gray-600">AI Responses</div>
                </div>
                <div className="text-center col-span-2">
                  <div className="text-lg font-bold text-emerald-600">
                    {Math.floor((Date.now() - startTime.current.getTime()) / 60000)} min
                  </div>
                  <div className="text-xs text-gray-600">Session Duration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Feature</h3>
              <p className="text-gray-600 mb-6">
                Upgrade to Premium to access unlimited AI responses, advanced features, and priority support.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPremiumModal(false);
                    navigate('/premium');
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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