import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Play, 
  Pause, 
  Brain, 
  Zap, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Crown,
  MessageSquare,
  Mic,
  FileText,
  Volume2,
  MicOff
} from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { generateInterviewQuestion, evaluateAnswer } from '../services/aiInterviewService';
import { generateMeetingResponse } from '../services/geminiService';
import { TranscriptEntry, MeetingContext } from '../types';

export const DemoMeeting: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [capturedQuestion, setCapturedQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedTech, setSelectedTech] = useState('React');
  const [selectedLevel, setSelectedLevel] = useState('Entry Level');
  const [isLoading, setIsLoading] = useState(false);

  const {
    isListening: speechListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError
  } = useSpeechRecognition();

  const demoSteps = useMemo(() => [
    {
      title: 'Welcome to Neural Sync Demo',
      description: 'Experience the power of AI-assisted interviews in just 3 minutes',
      action: 'Start Demo'
    },
    {
      title: 'Speech Recognition Active',
      description: 'Try saying: "Tell me about yourself" or click to simulate',
      action: 'Simulate Question'
    },
    {
      title: 'AI Response Generated',
      description: 'See how Neural Sync provides instant, intelligent responses',
      action: 'Next Feature'
    },
    {
      title: 'Demo Complete',
      description: 'Ready to unlock the full potential? Sign up for free!',
      action: 'Sign Up Now'
    }
  ], []);

  const sampleQuestions = useMemo(() => [
    "Tell me about yourself and your background",
    "What are your greatest strengths?",
    "Why do you want to work here?",
    "Describe a challenging project you worked on",
    "Where do you see yourself in 5 years?"
  ], []);

  const sampleResponses = useMemo(() => [
    "I'm a passionate software engineer with 3 years of experience in full-stack development. I specialize in React and Node.js, and I've successfully delivered multiple projects that improved user engagement by 40%. I'm particularly excited about this role because it combines my technical skills with my interest in AI and machine learning.",
    "My greatest strength is my ability to break down complex problems into manageable components. This analytical approach has helped me debug critical issues quickly and design scalable solutions. I also excel at collaborating with cross-functional teams to deliver projects on time.",
    "I'm drawn to your company's innovative approach to technology and your commitment to solving real-world problems. Your recent work in AI-driven solutions aligns perfectly with my career goals, and I believe my experience in machine learning could contribute significantly to your team's success.",
    "I recently led the development of a real-time analytics dashboard that processed over 1 million data points daily. The main challenge was optimizing performance while maintaining accuracy. I implemented a microservices architecture and used Redis for caching, which reduced response times by 60%.",
    "In five years, I see myself as a technical lead, mentoring junior developers while continuing to contribute to cutting-edge projects. I want to deepen my expertise in AI and potentially lead initiatives that bridge the gap between traditional software development and emerging technologies."
  ], []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      showNotification('error', 'Demo time expired! Sign up to continue using Neural Sync.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const startDemo = useCallback(() => {
    setIsActive(true);
    setDemoStep(1);
    showNotification('success', 'Demo started! You have 3 minutes to explore.');
  }, [showNotification]);

  // Add a ref to track if we've already processed a question
  const hasProcessedRef = React.useRef(false);

  // Helper: get the most confident, longest, or most recent transcript
  function getBestTranscript(transcript: TranscriptEntry[]): string {
    if (!transcript || transcript.length === 0) return '';
    const filtered = transcript.filter(t => (t.text.length > 2) && (t.confidence === undefined || t.confidence > 0.7));
    if (filtered.length === 0) return transcript[transcript.length - 1].text;
    return filtered
      .slice()
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0) || b.text.length - a.text.length || b.timestamp.getTime() - a.timestamp.getTime())[0].text;
  }

  // Create mock meeting context for demo
  const createMockContext = useCallback((): MeetingContext => ({
    jobTitle: `${selectedLevel} ${selectedTech} Developer`,
    companyName: 'Demo Company',
    meetingType: 'Technical Interview',
    resumeText: `Experienced ${selectedTech} developer with strong background in modern web development. Skilled in ${selectedTech}, JavaScript, and related technologies. Passionate about creating efficient, scalable solutions and staying current with industry best practices. Experience includes working on various projects ranging from small applications to enterprise-level systems.`,
    jobDescription: `We are looking for a talented ${selectedLevel} ${selectedTech} Developer to join our growing team. The ideal candidate will have experience with ${selectedTech} and modern development practices.`
  }), [selectedTech, selectedLevel]);

  // Debounce transcript processing for accuracy and speed
  useEffect(() => {
    async function processQuestion() {
      if (demoStep === 1 && !hasProcessedRef.current && transcript.length > 0) {
        const bestText = getBestTranscript(transcript);
        if (bestText && bestText.length > 2) {
          hasProcessedRef.current = true;
          setCapturedQuestion(bestText);
          stopListening();
          setIsLoading(true);
          showNotification('success', 'Question captured! Generating AI answer...');
          try {
            const mockContext = createMockContext();
            const transcriptEntry: TranscriptEntry = {
              text: bestText,
              timestamp: new Date(),
              confidence: 1.0
            };
            const aiAnswer = await generateMeetingResponse(mockContext, [transcriptEntry]);
            setAiResponse(aiAnswer);
          } catch (err) {
            setAiResponse('Sorry, there was an error generating the answer.');
          }
          setIsLoading(false);
          setDemoStep(2);
          showNotification('success', 'AI response ready!');
        }
      }
    }
    processQuestion();
  }, [demoStep, transcript, stopListening, showNotification, createMockContext]);

  // Add a timeout fallback for speech recognition
  useEffect(() => {
    if (demoStep === 1 && speechListening) {
      const timeout = setTimeout(() => {
        if (speechListening) {
          stopListening();
          showNotification('error', 'Speech recognition timed out. Please try again.');
        }
      }, 5000); // 5 seconds max listening
      return () => clearTimeout(timeout);
    }
  }, [demoStep, speechListening, stopListening, showNotification]);

  const handleStartListening = () => {
    clearTranscript();
    setCapturedQuestion('');
    setAiResponse('');
    hasProcessedRef.current = false;
    startListening();
    showNotification('success', 'Listening for your question...');
  };

  const nextStep = useCallback(() => {
    if (demoStep < demoSteps.length - 1) {
      if (demoStep === 1) {
        // simulateVoiceRecognition();
      } else {
        setDemoStep(demoStep + 1);
      }
    } else {
      navigate('/login');
    }
  }, [demoStep, demoSteps.length, navigate]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Demo Timer */}
      {isActive && (
        <div className="fixed z-50 transform -translate-x-1/2 top-4 left-1/2">
          <div className="flex items-center px-4 py-2 space-x-2 bg-white rounded-full shadow-lg sm:px-6 sm:py-3 sm:space-x-3">
            <Clock className="w-4 h-4 text-indigo-600 sm:w-5 sm:h-5" />
            <span className="text-sm font-bold text-indigo-600 sm:text-base">Demo Time: {formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl px-4 py-6 mx-auto sm:py-8">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 shadow-lg sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:mb-6">
            <Brain className="w-6 h-6 text-white sm:w-8 sm:h-8" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-transparent sm:text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text sm:mb-4">
            Neural Sync Demo
          </h1>
          <p className="max-w-2xl px-4 mx-auto text-lg text-gray-600 sm:text-xl">
            Experience the power of AI-assisted interviews in just 3 minutes
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 sm:gap-8">
          {/* Left Column - Demo Interface */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Step */}
            <div className="p-6 bg-white shadow-lg rounded-2xl sm:p-8">
              <div className="text-center">
                <h2 className="mb-3 text-xl font-bold text-gray-900 sm:text-2xl sm:mb-4">
                  {demoSteps[demoStep].title}
                </h2>
                <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base">
                  {demoSteps[demoStep].description}
                </p>

                {demoStep === 0 && (
                  <div className="flex flex-col items-center justify-center gap-4 mb-6 sm:flex-row">
                    <select value={selectedTech} onChange={e => setSelectedTech(e.target.value)} className="px-3 py-2 border rounded">
                      <option value="React">React</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="Node.js">Node.js</option>
                      <option value="Java">Java</option>
                      <option value="C++">C++</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="System Design">System Design</option>
                      <option value="Database Design">Database Design</option>
                    </select>
                    <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="px-3 py-2 border rounded">
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                    </select>
                  </div>
                )}

                {demoStep === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:p-6">
                      <div className="flex items-center justify-center mb-4">
                        {speechListening ? (
                          <>
                            <div className="w-3 h-3 mr-2 bg-red-500 rounded-full sm:w-4 sm:h-4 animate-pulse"></div>
                            <span className="text-sm font-medium text-indigo-700 sm:text-base">Listening for questions...</span>
                          </>
                        ) : capturedQuestion ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500 sm:w-5 sm:h-5" />
                            <span className="text-sm font-medium text-green-700 sm:text-base">Question captured!</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2 text-indigo-500 sm:w-5 sm:h-5" />
                            <span className="text-sm font-medium text-indigo-700 sm:text-base">Ready to capture speech</span>
                          </>
                        )}
                      </div>
                      {capturedQuestion && (
                        <p className="p-3 text-sm italic text-gray-700 rounded-lg bg-white/50 sm:text-base">
                          "{capturedQuestion}"
                        </p>
                      )}
                      {!speechListening && !capturedQuestion && (
                        <button
                          onClick={handleStartListening}
                          className="flex items-center justify-center px-4 py-2 mt-4 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                          <Mic className="w-4 h-4 mr-2" /> Start Listening
                        </button>
                      )}
                      {speechError && (
                        <p className="mt-2 text-xs text-red-600">{speechError}</p>
                      )}
                    </div>
                    <div className="p-4 bg-white border border-gray-200 rounded-xl">
                      <div className="flex items-center mb-3 space-x-3">
                        <Volume2 className="w-4 h-4 text-green-500 sm:w-5 sm:h-5" />
                        <span className="text-sm font-medium text-gray-700">Speech Recognition</span>
                      </div>
                      <p className="text-xs text-gray-600 sm:text-sm">Neural Sync automatically captures interview questions in real-time</p>
                    </div>
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2 py-1 text-xs font-bold tracking-wide text-green-600 uppercase bg-green-100 rounded-full">
                          AI Response (Generated in 847ms)
                        </span>
                        <Zap className="w-4 h-4 text-green-500 sm:w-5 sm:h-5" />
                      </div>
                      <div className="text-left">
                        <p className="mb-2 text-xs font-medium text-gray-600">Question:</p>
                        <p className="p-2 mb-4 text-sm italic text-gray-700 rounded bg-white/50">"{capturedQuestion}"</p>
                        <p className="mb-2 text-xs font-medium text-gray-600">AI Response:</p>
                        <p className="text-sm leading-relaxed text-gray-900 sm:text-base">{aiResponse}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white border border-gray-200 rounded-xl">
                      <div className="flex items-center mb-3 space-x-3">
                        <Brain className="w-4 h-4 text-purple-500 sm:w-5 sm:h-5" />
                        <span className="text-sm font-medium text-gray-700">AI Processing</span>
                      </div>
                      <p className="text-xs text-gray-600 sm:text-sm">Contextual responses based on your resume and job description</p>
                    </div>
                  </div>
                )}

                {demoStep === 3 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 text-center bg-indigo-50 rounded-xl">
                        <div className="mb-1 text-xl font-bold text-indigo-600 sm:text-2xl">∞</div>
                        <div className="text-xs text-indigo-800 sm:text-sm">Unlimited with Premium</div>
                      </div>
                      <div className="p-4 text-center bg-purple-50 rounded-xl">
                        <div className="mb-1 text-xl font-bold text-purple-600 sm:text-2xl">24/7</div>
                        <div className="text-xs text-purple-800 sm:text-sm">AI Assistance</div>
                      </div>
                    </div>
                    <div className="p-4 border bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-amber-200">
                      <div className="flex items-center justify-center space-x-2 text-amber-700">
                        <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm font-medium sm:text-base">Premium features require subscription</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={demoStep === 0 ? startDemo : nextStep}
                  disabled={speechListening}
                  className="flex items-center justify-center w-full px-6 py-3 mx-auto space-x-2 text-sm font-semibold text-white transition-all duration-200 sm:w-auto sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
                >
                  {speechListening ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full sm:w-5 sm:h-5 border-t-transparent animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {demoStep === 3 ? <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                      <span>{demoSteps[demoStep].action}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Features & Benefits */}
          <div className="space-y-4 sm:space-y-6">
            {/* Demo Progress */}
            <div className="p-4 bg-white shadow-lg rounded-2xl sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Demo Progress</h3>
              <div className="space-y-3">
                {demoSteps.map((step, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    index === demoStep ? 'bg-indigo-50 border border-indigo-200' : 
                    index < demoStep ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                      index === demoStep ? 'bg-indigo-600 text-white' :
                      index < demoStep ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index < demoStep ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : index + 1}
                    </div>
                    <span className={`font-medium text-sm sm:text-base ${
                      index === demoStep ? 'text-indigo-700' :
                      index < demoStep ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Neural Sync */}
            <div className="p-4 bg-white shadow-lg rounded-2xl sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Why Choose Neural Sync?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 sm:text-base">Lightning Fast</p>
                    <p className="text-xs text-gray-600 sm:text-sm">Get AI responses in under 1 second</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 sm:text-base">Highly Accurate</p>
                    <p className="text-xs text-gray-600 sm:text-sm">Context-aware responses tailored to your background</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 sm:text-base">Easy to Use</p>
                    <p className="text-xs text-gray-600 sm:text-sm">No complex setup, works instantly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 sm:text-base">Proven Results</p>
                    <p className="text-xs text-gray-600 sm:text-sm">Trusted by 10,000+ professionals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="p-4 text-center text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl sm:p-6">
              <h3 className="mb-2 text-lg font-bold sm:text-xl">Ready to Get Started?</h3>
              <p className="mb-4 text-sm text-indigo-100 sm:text-base">
                Sign up for free and get 5 AI responses per day
              </p>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center w-full px-4 py-2 mx-auto space-x-2 text-sm font-semibold text-indigo-600 transition-colors bg-white rounded-lg sm:w-auto sm:px-6 sm:py-3 hover:bg-gray-100 sm:text-base"
              >
                <span>Sign Up Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 sm:top-20 right-4 z-50 p-3 sm:p-4 rounded-xl shadow-2xl flex items-center space-x-2 max-w-xs sm:max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <AlertCircle className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span className="text-xs font-medium sm:text-sm">{notification.message}</span>
        </div>
      )}
    </div>
  );
});

DemoMeeting.displayName = 'DemoMeeting';

export default DemoMeeting;