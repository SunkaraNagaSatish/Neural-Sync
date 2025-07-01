import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Mic, 
  FileText, 
  ArrowRight, 
  CheckCircle,
  Shield,
  Clock,
  BarChart3,
  Crown,
  Users,
  Award,
  Send,
  MicOff,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { generateMeetingResponse } from '../services/geminiService';
import { MeetingContext, TranscriptEntry } from '../types';

export const AIAssistantPreview: React.FC = React.memo(() => {
  const { isAuthenticated } = useAuth();
  const { isPremium } = usePremium();
  const [manualQuestion, setManualQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error: speechError
  } = useSpeechRecognition();

  // Memoized demo context for better performance
  const demoContext = useMemo((): MeetingContext => ({
    jobTitle: 'Software Engineer',
    companyName: 'Demo Company',
    meetingType: 'Technical Interview',
    resumeText: 'Experienced software engineer with expertise in React, Node.js, and modern web development. Strong background in building scalable applications and working with cross-functional teams.',
    jobDescription: 'We are looking for a talented software engineer to join our growing team.'
  }), []);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleGenerateResponse = useCallback(async (questionText?: string) => {
    if (!isAuthenticated) {
      showNotification('error', 'Please sign in to use AI responses');
      return;
    }

    if (!isPremium) {
      showNotification('error', 'Premium feature required. Please upgrade to access AI responses.');
      return;
    }

    const question = questionText || manualQuestion.trim() || (transcript.length > 0 ? transcript[transcript.length - 1]?.text : '');
    
    if (!question) {
      showNotification('error', 'Please provide a question either by speaking or typing');
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();

    try {
      // Create a transcript entry for the AI service
      const transcriptEntry: TranscriptEntry = {
        id: Date.now().toString(),
        text: question,
        timestamp: new Date(),
        confidence: 1.0
      };

      const response = await generateMeetingResponse(demoContext, [transcriptEntry]);
      const endTime = Date.now();
      
      setAiResponse(response);
      setManualQuestion('');
      clearTranscript();
      
      showNotification('success', `AI response generated in ${endTime - startTime}ms!`);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate AI response';
      showNotification('error', errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [isAuthenticated, isPremium, manualQuestion, transcript, demoContext, showNotification, clearTranscript]);

  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (manualQuestion.trim()) {
      handleGenerateResponse(manualQuestion.trim());
    }
  }, [manualQuestion, handleGenerateResponse]);

  const handleSpeechResponse = useCallback(() => {
    if (transcript.length > 0) {
      const lastTranscript = transcript[transcript.length - 1];
      handleGenerateResponse(lastTranscript.text);
    }
  }, [transcript, handleGenerateResponse]);

  // Memoized feature data for better performance
  const features = useMemo(() => [
    {
      icon: Zap,
      title: 'Ultra-Fast Responses',
      description: 'Get AI-powered answers in under 500ms during live interviews',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mic,
      title: 'Real-time Speech Recognition',
      description: 'Automatically capture interview questions as they\'re asked',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      title: 'Context-Aware AI',
      description: 'Responses tailored to your resume, job description, and interview type',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with complete data privacy',
      color: 'from-red-500 to-pink-500'
    }
  ], []);

  const howItWorks = useMemo(() => [
    {
      step: '1',
      title: 'Upload Your Resume',
      description: 'Provide your resume and job description for personalized responses',
      icon: FileText
    },
    {
      step: '2',
      title: 'Start Your Interview',
      description: 'Our AI listens to questions in real-time during your interview',
      icon: Mic
    },
    {
      step: '3',
      title: 'Get Instant Responses',
      description: 'Receive intelligent, contextual answers within milliseconds',
      icon: Zap
    }
  ], []);

  const benefits = useMemo(() => [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'No more hours of interview preparation - get ready in minutes'
    },
    {
      icon: BarChart3,
      title: 'Improve Performance',
      description: 'Deliver confident, well-structured answers every time'
    },
    {
      icon: Award,
      title: 'Land Your Dream Job',
      description: 'Join 95% of users who received job offers after using Neural Sync'
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: 'Alex Chen',
      role: 'Software Engineer at Meta',
      content: 'Neural Sync helped me answer complex technical questions with confidence. Got the job!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Product Manager at Spotify',
      content: 'The real-time assistance was incredible. I felt so much more prepared and confident.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
    }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Interview Assistant
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant, intelligent AI responses during live interviews. Our advanced neural AI listens to questions 
            and provides personalized answers based on your background.
          </p>
        </div>

        {/* Interactive Demo Section - Only show if authenticated */}
        {isAuthenticated && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Try AI Assistant Live
            </h2>
            
            {/* Speech Recognition */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Voice Input</h3>
                <div className="flex space-x-2">
                  {!isListening ? (
                    <button
                      onClick={startListening}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Listening</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 animate-pulse"
                    >
                      <MicOff className="w-4 h-4" />
                      <span>Stop Listening</span>
                    </button>
                  )}
                  
                  {transcript.length > 0 && (
                    <button
                      onClick={handleSpeechResponse}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      Get AI Response
                    </button>
                  )}
                </div>
              </div>

              {/* Speech Status */}
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                {isListening ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span>Listening for your question...</span>
                  </div>
                ) : transcript.length > 0 ? (
                  <div className="text-gray-900">
                    <strong>Captured:</strong> "{transcript[transcript.length - 1]?.text}"
                  </div>
                ) : (
                  <div className="text-gray-500">Click "Start Listening" to capture questions via voice</div>
                )}
                
                {speechError && (
                  <div className="flex items-center text-red-600 mt-2">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>{speechError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Input */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Or Type Your Question</h3>
              <form onSubmit={handleManualSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={manualQuestion}
                  onChange={(e) => setManualQuestion(e.target.value)}
                  placeholder="Type an interview question here..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!manualQuestion.trim() || isGenerating}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Get Response</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* AI Response Display */}
            {aiResponse && (
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="flex items-center mb-3">
                  <Brain className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="font-semibold text-indigo-800">AI Response</span>
                </div>
                <p className="text-gray-900 leading-relaxed">{aiResponse}</p>
              </div>
            )}

            {!isPremium && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <Crown className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-amber-800 font-medium">Upgrade to Premium to access AI responses</p>
                <Link
                  to="/premium"
                  className="inline-block mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 text-center">
                <Icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Success Stories
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Simple, Transparent Pricing
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Plan</h3>
              <div className="text-3xl font-bold text-gray-600 mb-4">$0</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>5 AI responses per day</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic interview practice</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Speech recognition</span>
                </li>
              </ul>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-indigo-500 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Plan</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-4">$19<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mr-3" />
                  <span className="font-medium">Unlimited AI responses</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mr-3" />
                  <span className="font-medium">Advanced AI models</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mr-3" />
                  <span className="font-medium">Detailed analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mr-3" />
                  <span className="font-medium">24/7 priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully landed their dream jobs with Neural Sync AI Assistant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/setup" : "/login"}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>{isAuthenticated ? "Start Session" : "Start Free Trial"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-6 space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-indigo-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Premium features available</span>
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
});

AIAssistantPreview.displayName = 'AIAssistantPreview';