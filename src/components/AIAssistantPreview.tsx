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
    <div className="min-h-screen py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 sm:py-12">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-transparent sm:text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
            AI Interview Assistant
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 sm:text-xl">
            Get instant, intelligent AI responses during live interviews. Our advanced neural AI listens to questions
            and provides personalized answers based on your background.
          </p>
        </div>

        {/* Interactive Demo Section - Only show if authenticated */}
        {isAuthenticated && (
          <div className="p-6 mb-16 bg-white shadow-lg rounded-2xl sm:p-8">
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 sm:text-3xl">
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
                      className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Listening</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 animate-pulse"
                    >
                      <MicOff className="w-4 h-4" />
                      <span>Stop Listening</span>
                    </button>
                  )}

                  {transcript.length > 0 && (
                    <button
                      onClick={handleSpeechResponse}
                      disabled={isGenerating}
                      className="px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      Get AI Response
                    </button>
                  )}
                </div>
              </div>

              {/* Speech Status */}
              <div className="p-4 mb-4 rounded-lg bg-gray-50">
                {isListening ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-3 h-3 mr-2 bg-green-500 rounded-full animate-pulse"></div>
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
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span>{speechError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Input */}
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Or Type Your Question</h3>
              <form onSubmit={handleManualSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={manualQuestion}
                  onChange={(e) => setManualQuestion(e.target.value)}
                  placeholder="Type an interview question here..."
                  className="flex-1 px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="submit"
                  disabled={!manualQuestion.trim() || isGenerating}
                  className="flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
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
              <div className="p-6 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <div className="flex items-center mb-3">
                  <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="font-semibold text-indigo-800">AI Response</span>
                </div>
                <p className="leading-relaxed text-gray-900">{aiResponse}</p>
              </div>
            )}

            {!isPremium && (
              <div className="p-4 mt-6 text-center border bg-amber-50 border-amber-200 rounded-xl">
                <Crown className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <p className="font-medium text-amber-800">Upgrade to Premium to access AI responses</p>
                <Link
                  to="/premium"
                  className="inline-block px-4 py-2 mt-2 text-white transition-colors rounded-lg bg-amber-600 hover:bg-amber-700"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid gap-6 mb-16 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 transition-shadow bg-white shadow-lg rounded-2xl hover:shadow-xl">
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="p-6 mb-16 bg-white shadow-lg rounded-2xl sm:p-8">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-900 sm:text-3xl">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute flex items-center justify-center w-8 h-8 rounded-full -top-2 -right-2 bg-amber-400">
                      <span className="text-sm font-bold text-white">{item.step}</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid gap-6 mb-16 sm:grid-cols-3 sm:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="p-6 text-center shadow-lg bg-gradient-to-br from-gray-50 to-white rounded-2xl">
                <Icon className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="p-6 mb-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl sm:p-8">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-900 sm:text-3xl">
            Success Stories
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white shadow-lg rounded-xl">
                <p className="mb-6 italic text-gray-700">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 mr-4 rounded-full"
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
        <div className="p-6 mb-16 bg-white shadow-lg rounded-2xl sm:p-8">
          <h2 className="mb-8 text-2xl font-bold text-center text-gray-900 sm:text-3xl">
            Simple, Transparent Pricing
          </h2>
          <div className="grid max-w-4xl gap-8 mx-auto sm:grid-cols-2">
            {/* Free Plan */}
            <div className="p-6 border border-gray-200 rounded-xl">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Free Plan</h3>
              <div className="mb-4 text-3xl font-bold text-gray-600">$0</div>
              <ul className="mb-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>5 AI responses per day</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Basic interview practice</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                  <span>Speech recognition</span>
                </li>
              </ul>
            </div>

            {/* Premium Plan */}
            <div className="relative p-6 border-2 border-indigo-500 rounded-xl">
              <div className="absolute transform -translate-x-1/2 -top-3 left-1/2">
                <span className="px-4 py-1 text-sm font-medium text-white bg-indigo-500 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Premium Plan</h3>
              <div className="mb-4 text-3xl font-bold text-indigo-600">$19<span className="text-lg text-gray-600">/month</span></div>
              <ul className="mb-6 space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-indigo-500" />
                  <span className="font-medium">Unlimited AI responses</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-indigo-500" />
                  <span className="font-medium">Advanced AI models</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-indigo-500" />
                  <span className="font-medium">Detailed analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-indigo-500" />
                  <span className="font-medium">24/7 priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 text-center text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl sm:p-12">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-indigo-100 sm:text-xl">
            Join thousands of professionals who have successfully landed their dream jobs with Neural Sync AI Assistant
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to={isAuthenticated ? "/setup" : "/login"}
              className="flex items-center justify-center px-6 py-3 space-x-2 font-semibold text-indigo-600 transition-colors bg-white sm:px-8 sm:py-4 rounded-xl hover:bg-gray-100"
            >
              <span>{isAuthenticated ? "Start Session" : "Start Free Trial"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center mt-6 space-y-2 text-sm text-indigo-200 sm:flex-row sm:space-y-0 sm:space-x-6">
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
            <CheckCircle className="flex-shrink-0 w-5 h-5" />
          ) : (
            <AlertCircle className="flex-shrink-0 w-5 h-5" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
});

AIAssistantPreview.displayName = 'AIAssistantPreview';
