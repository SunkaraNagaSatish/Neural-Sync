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

export const DemoMeeting: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [capturedQuestion, setCapturedQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const simulateVoiceRecognition = useCallback(() => {
    setIsListening(true);
    showNotification('success', 'Listening for your question...');
    
    // Simulate speech recognition
    setTimeout(() => {
      const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      setCapturedQuestion(randomQuestion);
      setIsListening(false);
      showNotification('success', 'Question captured! AI is generating response...');
      
      // Simulate AI response generation - FIXED: Use the same question index for response
      setTimeout(() => {
        const questionIndex = sampleQuestions.indexOf(randomQuestion);
        const correspondingResponse = sampleResponses[questionIndex] || sampleResponses[0];
        setAiResponse(correspondingResponse);
        setDemoStep(2);
        showNotification('success', 'AI response ready! This is how fast Neural Sync works.');
      }, 1500);
    }, 2000);
  }, [sampleQuestions, sampleResponses, showNotification]);

  const nextStep = useCallback(() => {
    if (demoStep < demoSteps.length - 1) {
      if (demoStep === 1) {
        simulateVoiceRecognition();
      } else {
        setDemoStep(demoStep + 1);
      }
    } else {
      navigate('/login');
    }
  }, [demoStep, demoSteps.length, simulateVoiceRecognition, navigate]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Demo Timer */}
      {isActive && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-full shadow-lg px-4 sm:px-6 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span className="font-bold text-indigo-600 text-sm sm:text-base">Demo Time: {formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Neural Sync Demo
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Experience the power of AI-assisted interviews in just 3 minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Demo Interface */}
          <div className="space-y-4 sm:space-y-6">
            {/* Current Step */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {demoSteps[demoStep].title}
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                  {demoSteps[demoStep].description}
                </p>

                {demoStep === 0 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                      <div className="p-3 sm:p-4 bg-indigo-50 rounded-xl">
                        <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm font-medium text-indigo-800">Ultra-Fast AI</p>
                      </div>
                      <div className="p-3 sm:p-4 bg-purple-50 rounded-xl">
                        <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm font-medium text-purple-800">Smart Responses</p>
                      </div>
                      <div className="p-3 sm:p-4 bg-emerald-50 rounded-xl">
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm font-medium text-emerald-800">Real-time Help</p>
                      </div>
                    </div>
                  </div>
                )}

                {demoStep === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-200">
                      <div className="flex items-center justify-center mb-4">
                        {isListening ? (
                          <>
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-indigo-700 font-medium text-sm sm:text-base">Listening for questions...</span>
                          </>
                        ) : capturedQuestion ? (
                          <>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                            <span className="text-green-700 font-medium text-sm sm:text-base">Question captured!</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mr-2" />
                            <span className="text-indigo-700 font-medium text-sm sm:text-base">Ready to capture speech</span>
                          </>
                        )}
                      </div>
                      {capturedQuestion && (
                        <p className="text-gray-700 italic bg-white/50 p-3 rounded-lg text-sm sm:text-base">
                          "{capturedQuestion}"
                        </p>
                      )}
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">Speech Recognition</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">Neural Sync automatically captures interview questions in real-time</p>
                    </div>
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wide bg-green-100 px-2 py-1 rounded-full">
                          AI Response (Generated in 847ms)
                        </span>
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-600 font-medium mb-2">Question:</p>
                        <p className="text-sm text-gray-700 italic mb-4 bg-white/50 p-2 rounded">"{capturedQuestion}"</p>
                        <p className="text-xs text-gray-600 font-medium mb-2">AI Response:</p>
                        <p className="text-gray-900 leading-relaxed text-sm sm:text-base">{aiResponse}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">AI Processing</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">Contextual responses based on your resume and job description</p>
                    </div>
                  </div>
                )}

                {demoStep === 3 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-indigo-50 rounded-xl">
                        <div className="text-xl sm:text-2xl font-bold text-indigo-600 mb-1">∞</div>
                        <div className="text-xs sm:text-sm text-indigo-800">Unlimited with Premium</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">24/7</div>
                        <div className="text-xs sm:text-sm text-purple-800">AI Assistance</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center justify-center space-x-2 text-amber-700">
                        <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-medium text-sm sm:text-base">Premium features require subscription</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={demoStep === 0 ? startDemo : nextStep}
                  disabled={isListening}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto font-semibold text-sm sm:text-base"
                >
                  {isListening ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Progress</h3>
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
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Neural Sync?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Lightning Fast</p>
                    <p className="text-xs sm:text-sm text-gray-600">Get AI responses in under 1 second</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Highly Accurate</p>
                    <p className="text-xs sm:text-sm text-gray-600">Context-aware responses tailored to your background</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Easy to Use</p>
                    <p className="text-xs sm:text-sm text-gray-600">No complex setup, works instantly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Proven Results</p>
                    <p className="text-xs sm:text-sm text-gray-600">Trusted by 10,000+ professionals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-4 sm:p-6 text-white text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-indigo-100 mb-4 text-sm sm:text-base">
                Sign up for free and get 5 AI responses per day
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base"
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
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
});

DemoMeeting.displayName = 'DemoMeeting';

export default DemoMeeting;