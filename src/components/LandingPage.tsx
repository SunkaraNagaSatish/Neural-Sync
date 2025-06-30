import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Star,
  Play,
  MessageSquare,
  BarChart3,
  Clock,
  Award,
  Lightbulb
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Ultra-Fast AI Responses',
      description: 'Get instant, intelligent answers during your interviews with our advanced neural AI technology.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Speech Recognition',
      description: 'Capture questions automatically and get immediate AI-powered response suggestions.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      title: 'Smart Interview Practice',
      description: 'Practice with AI interviewer that adapts to your experience level and provides feedback.',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your interview data is encrypted and never shared. Complete privacy guaranteed.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track your progress and identify areas for improvement with detailed analytics.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Trusted by Professionals',
      description: 'Join 10,000+ professionals who have successfully landed their dream jobs.',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: 'Neural Sync helped me ace my technical interviews. The AI responses were spot-on!',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Microsoft',
      content: 'The real-time assistance during my interview was incredible. Highly recommend!',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
    },
    {
      name: 'Emily Johnson',
      role: 'Data Scientist at Amazon',
      content: 'Best interview preparation tool I\'ve ever used. The AI practice sessions are amazing.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Professionals Helped' },
    { number: '95%', label: 'Success Rate' },
    { number: '500ms', label: 'Average Response Time' },
    { number: '24/7', label: 'AI Availability' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Neural Sync
                </h1>
                <p className="text-sm sm:text-lg text-gray-600">AI Interview Assistant</p>
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
              Ace Your Next
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Interview
              </span>
            </h2>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto px-4">
              Get instant, intelligent AI responses during live interviews. 
              Practice with our AI interviewer and land your dream job with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/ai-assistant-preview"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 border border-gray-200 shadow-sm"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500 px-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Neural Sync?
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced AI technology designed specifically for interview success
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How Neural Sync Works
            </h3>
            <p className="text-lg sm:text-xl text-gray-600">
              Three simple steps to interview success
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Setup Your Profile</h4>
              <p className="text-gray-600">Upload your resume and job description to personalize AI responses</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Start Your Interview</h4>
              <p className="text-gray-600">Our AI listens to questions and provides instant, relevant responses</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">3. Land Your Dream Job</h4>
              <p className="text-gray-600">Impress interviewers with confident, well-structured answers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Top Professionals
            </h3>
            <p className="text-lg sm:text-xl text-gray-600">
              See what our users say about Neural Sync
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-sm sm:text-base">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Ace Your Next Interview?
          </h3>
          <p className="text-lg sm:text-xl text-indigo-100 mb-6 sm:mb-8">
            Join thousands of professionals who have successfully landed their dream jobs with Neural Sync
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Free Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/ai-assistant-preview"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center justify-center space-x-2 border border-white/30"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};