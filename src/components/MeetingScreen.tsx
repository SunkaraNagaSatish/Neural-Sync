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
  Send,
  Crown,
  Code
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MeetingContext, AIResponse } from '../types';
import { generateMeetingResponse, generateMeetingSummary, generateInterviewTips, testGeminiConnection, isGeminiReady, generateCodeResponse } from '../services/geminiService';
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
  const [codeResponses, setCodeResponses] = useState<AIResponse[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
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

  // Auto-stop recording when new transcript entry is added
  useEffect(() => {
    if (transcript.length > 0 && isListening) {
      const lastEntry = transcript[transcript.length - 1];
      const timeSinceLastEntry = Date.now() - lastEntry.timestamp.getTime();
      
      // Auto-stop after getting a question (with small delay to ensure complete capture)
      if (timeSinceLastEntry < 1000) {
        setTimeout(() => {
          if (isListening) {
            stopListening();
            setRecordingState('paused');
            showNotification('success', 'Question captured! Recording stopped automatically.');
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

    // Always prioritize manual input if present
    const questionToUse = questionText && questionText.trim()
      ? questionText.trim()
      : (transcript.length > 0 ? transcript[transcript.length - 1]?.text : '');
    
    if (!questionToUse) {
      showNotification('error', 'Please record a question or type one manually');
      return;
    }

    setIsGeneratingResponse(true);
    const startTime = Date.now();
    try {
      // If manual input, create a transcript entry for the AI
      let transcriptForAI = transcript;
      if (questionText && questionText.trim()) {
        transcriptForAI = [
          {
            id: Date.now().toString(),
            text: questionToUse,
            timestamp: new Date(),
            confidence: 1.0
          }
        ];
      }
      const response = await generateMeetingResponse(meetingContext!, transcriptForAI);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const aiResponse: AIResponse = {
        id: Date.now().toString(),
        query: questionToUse,
        response,
        timestamp: new Date()
      };
      
      setAiResponses(prev => [aiResponse, ...prev]);
      setManualQuestion(''); // Always clear manual input after response
      showNotification('success', `AI response generated in ${responseTime}ms!`);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate AI response';
      showNotification('error', errorMessage);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleGenerateCode = async (questionText?: string) => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    // Always prioritize manual input if present
    const questionToUse = questionText && questionText.trim()
      ? questionText.trim()
      : (transcript.length > 0 ? transcript[transcript.length - 1]?.text : '');
    
    if (!questionToUse) {
      showNotification('error', 'Please record a question or type one manually');
      return;
    }

    setIsGeneratingCode(true);
    const startTime = Date.now();
    try {
      // If manual input, create a transcript entry for the AI
      let transcriptForAI = transcript;
      if (questionText && questionText.trim()) {
        transcriptForAI = [
          {
            id: Date.now().toString(),
            text: questionToUse,
            timestamp: new Date(),
            confidence: 1.0
          }
        ];
      }
      const codeResponse = await generateCodeResponse(meetingContext!, transcriptForAI);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const aiCodeResponse: AIResponse = {
        id: Date.now().toString(),
        query: questionToUse,
        response: codeResponse,
        timestamp: new Date()
      };
      
      setCodeResponses(prev => [aiCodeResponse, ...prev]);
      showNotification('success', `Code response generated in ${responseTime}ms!`);
    } catch (error) {
      console.error('Error generating code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate code response';
      showNotification('error', errorMessage);
    } finally {
      setIsGeneratingCode(false);
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
      <div className="px-4 py-6 mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - AI Response & Code */}
          <div className="space-y-6 lg:col-span-2">
            {/* AI Response Generation - TOP PRIORITY */}
            <div className="p-6 bg-white border-2 border-indigo-100 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center text-xl font-bold text-gray-900">
                  <Brain className="w-6 h-6 mr-2 text-indigo-600" />
                  Neural AI Assistant
                  {isPremium ? (
                    <span className="px-2 py-1 ml-2 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                      Ultra-Fast
                    </span>
                  ) : (
                    <span className="flex items-center px-2 py-1 ml-2 text-xs font-medium rounded-full bg-amber-100 text-amber-600">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </span>
                  )}
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleGenerateResponse()}
                    disabled={isGeneratingResponse || (!transcript.length && !manualQuestion.trim())}
                    className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingResponse ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Get Instant Response</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleGenerateCode()}
                    disabled={isGeneratingCode || (!transcript.length && !manualQuestion.trim())}
                    className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingCode ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Code className="w-5 h-5" />
                        <span>Get Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Manual Question Input - ENHANCED */}
              <form onSubmit={handleManualQuestionSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={manualQuestion}
                    onChange={(e) => setManualQuestion(e.target.value)}
                    placeholder="Type a question manually if speech recognition doesn't capture it..."
                    className="flex-1 px-4 py-3 text-base transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    type="submit"
                    disabled={!manualQuestion.trim() || isGeneratingResponse}
                    className="flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ask</span>
                  </button>
                </div>
              </form>

              {apiReady && isPremium && (
                <div className="flex items-center p-4 mb-6 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  <span className="font-medium text-green-700">Neural Sync AI is ready for lightning-fast, accurate responses!</span>
                </div>
              )}

              {/* AI Responses - ENHANCED SIZE AND SPACING */}
              <div 
                ref={aiResponsesRef}
                className="space-y-6 max-h-[400px] overflow-y-auto"
              >
                {aiResponses.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">AI responses will appear here</p>
                    <p className="mt-2 text-sm">Record a question or type manually and click "Get Instant Response" for ultra-fast AI assistance</p>
                  </div>
                ) : (
                  aiResponses.map((response) => (
                    <div key={response.id} className="p-6 mb-4 border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <span className="px-3 py-1 text-xs font-bold tracking-wide text-indigo-600 uppercase bg-indigo-100 rounded-full">
                          Neural Response
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(response.response)}
                            className="p-2 transition-colors rounded-lg hover:bg-white/50"
                            title="Copy response"
                          >
                            <Copy className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="mt-1 text-xs text-gray-500">
                            {response.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600">Question:</p>
                        <p className="p-3 mb-4 text-base italic text-gray-700 rounded-lg bg-white/50">{response.query}</p>
                      </div>
                      <p className="text-base font-medium leading-relaxed text-gray-900">{response.response}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Code Responses Section */}
              {codeResponses.length > 0 && (
                <div className="mt-8">
                  <h4 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                    <Code className="w-5 h-5 mr-2 text-green-600" />
                    Code Responses
                  </h4>
                  <div className="space-y-6 max-h-[400px] overflow-y-auto">
                    {codeResponses.map((response) => (
                      <div key={response.id} className="p-6 border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <div className="flex items-start justify-between mb-4">
                          <span className="px-3 py-1 text-xs font-bold tracking-wide text-green-600 uppercase bg-green-100 rounded-full">
                            Code Response
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(response.response)}
                              className="p-2 transition-colors rounded-lg hover:bg-white/50"
                              title="Copy code"
                            >
                              <Copy className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="mt-1 text-xs text-gray-500">
                              {response.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600">Question:</p>
                          <p className="p-3 mb-4 text-base italic text-gray-700 rounded-lg bg-white/50">{response.query}</p>
                        </div>
                        <div className="p-4 font-mono text-sm bg-gray-900 rounded-lg">
                          <pre className="text-green-400 whitespace-pre-wrap">{response.response}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Smart Tips & Summary */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Smart Tips */}
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900">
                    <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                    Smart Tips
                  </h3>
                  <button
                    onClick={handleGenerateTips}
                    disabled={isGeneratingTips}
                    className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingTips ? 'Generating...' : 'Get Tips'}
                  </button>
                </div>

                {interviewTips.length > 0 ? (
                  <div className="space-y-3 overflow-y-auto max-h-64">
                    {interviewTips.map((tip, index) => (
                      <div key={index} className="p-3 border-l-4 rounded-lg bg-amber-50 border-amber-400">
                        <p className="text-sm font-medium text-amber-800">{tip}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Get personalized tips based on your conversation context.
                  </p>
                )}
              </div>

              {/* Meeting Summary */}
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center text-lg font-semibold text-gray-900">
                    <FileText className="w-5 h-5 mr-2" />
                    Summary
                    {!isPremium && <Crown className="w-4 h-4 ml-2 text-amber-500" />}
                  </h3>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary || !isPremium}
                    className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingSummary ? 'Generating...' : 'Generate'}
                  </button>
                </div>

                {!isPremium ? (
                  <div className="py-8 text-center">
                    <Crown className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                    <p className="mb-3 text-gray-600">Premium feature</p>
                    <button
                      onClick={() => setShowPremiumModal(true)}
                      className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-amber-500 hover:bg-amber-600"
                    >
                      Upgrade to Access
                    </button>
                  </div>
                ) : meetingSummary ? (
                  <div className="p-4 overflow-y-auto rounded-lg bg-gray-50 max-h-64">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium tracking-wide uppercase text-emerald-600">
                        Meeting Summary
                      </span>
                      <button
                        onClick={() => copyToClipboard(meetingSummary)}
                        className="p-1 transition-colors rounded hover:bg-white/50"
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
                  <p className="text-sm text-gray-500">
                    Generate a comprehensive summary of your meeting when you're ready.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Questions & Transcript */}
          <div className="space-y-6">
            {/* Questions/Transcript Panel - RIGHT SIDE */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Live Questions & Transcript
                </h2>
                {transcript.length > 0 && (
                  <button
                    onClick={downloadTranscript}
                    className="flex items-center px-3 py-1 space-x-1 text-sm transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
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
                    className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start Recording</span>
                  </button>
                )}

                {recordingState === 'recording' && (
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-red-500 hover:bg-red-600 rounded-xl animate-pulse-soft"
                  >
                    <MicOff className="w-5 h-5" />
                    <span>Recording... (Click to Stop)</span>
                  </button>
                )}

                {recordingState === 'paused' && (
                  <button
                    onClick={handleContinueRecording}
                    className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-green-600 hover:bg-green-700 rounded-xl"
                  >
                    <Play className="w-5 h-5" />
                    <span>Continue Recording</span>
                  </button>
                )}

                {speechError && (
                  <div className="flex items-center p-3 border border-red-200 rounded-lg bg-red-50">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    <span className="text-sm text-red-700">{speechError}</span>
                  </div>
                )}
              </div>

              {/* Transcript Display - Recent First with Better Spacing */}
              <div
                ref={transcriptRef}
                className="p-4 overflow-y-auto border bg-gray-50 rounded-xl h-80"
              >
                {transcript.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Click "Start Recording" to capture questions</p>
                      <p className="mt-2 text-sm">Neural Sync will process speech in real-time</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Show most recent first with better spacing */}
                    {[...transcript].reverse().map((entry) => (
                      <div key={entry.id} className="p-4 mb-3 bg-white border-l-4 border-indigo-400 rounded-lg shadow-sm">
                        <div className="flex items-start justify-between">
                          <p className="flex-1 text-base font-medium leading-relaxed text-gray-900">{entry.text}</p>
                          <span className="flex-shrink-0 ml-3 text-xs text-gray-500">
                            {entry.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        {entry.confidence && (
                          <div className="mt-3">
                            <div className="w-full h-1 bg-gray-200 rounded-full">
                              <div 
                                className="h-1 bg-indigo-500 rounded-full"
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
                <div className="flex justify-between mt-4">
                  <button
                    onClick={clearTranscript}
                    className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
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
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
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
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{codeResponses.length}</div>
                  <div className="text-xs text-gray-600">Code Responses</div>
                </div>
                <div className="text-center">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 bg-white rounded-2xl">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Premium Feature</h3>
              <p className="mb-6 text-gray-600">
                Upgrade to Premium to access unlimited AI responses, code generation, advanced features, and priority support.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPremiumModal(false);
                    navigate('/premium');
                  }}
                  className="flex-1 px-4 py-2 text-white transition-colors rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
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
            <CheckCircle className="flex-shrink-0 w-5 h-5" />
          ) : (
            <AlertCircle className="flex-shrink-0 w-5 h-5" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};