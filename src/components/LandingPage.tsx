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
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-12 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center mb-4 space-x-2 sm:space-x-3 sm:mb-6 lg:mb-8">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
                <Brain className="w-5 h-5 text-white sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl xl:text-6xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  Neural Sync
                </h1>
                <p className="text-xs text-gray-600 sm:text-sm lg:text-lg">AI Interview Assistant</p>
              </div>
            </div>

            <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl xl:text-7xl sm:mb-4 lg:mb-6">
              Ace Your Next
              <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                {' '}Interview
              </span>
            </h2>

            <p className="max-w-4xl px-4 mx-auto mb-4 text-base text-gray-600 sm:text-lg lg:text-xl xl:text-2xl sm:mb-6 lg:mb-8">
              Get instant, intelligent AI responses during live interviews. 
              Practice with our AI interviewer and land your dream job with confidence.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 px-4 mb-6 sm:flex-row sm:gap-4 sm:mb-8 lg:mb-12">
              <Link
                to="/login"
                className="flex items-center justify-center w-full px-6 py-3 space-x-2 text-sm font-semibold text-white transition-all duration-200 shadow-lg sm:w-auto sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 sm:text-base"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                to="/ai-assistant-preview"
                className="flex items-center justify-center w-full px-6 py-3 space-x-2 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-200 shadow-sm sm:w-auto sm:px-8 sm:py-4 rounded-xl hover:bg-gray-50 sm:text-base"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Watch Demo</span>
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center px-4 space-y-2 text-xs text-gray-500 sm:flex-row sm:space-y-0 sm:space-x-6 lg:space-x-8 sm:text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500 sm:w-4 sm:h-4" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500 sm:w-4 sm:h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500 sm:w-4 sm:h-4" />
                <span>Instant setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white sm:py-12 lg:py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-1 text-xl font-bold text-transparent sm:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600 sm:text-sm lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h3 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl sm:mb-4">
              Why Choose Neural Sync?
            </h3>
            <p className="max-w-2xl mx-auto text-base text-gray-600 sm:text-lg lg:text-xl">
              Advanced AI technology designed specifically for interview success
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 transition-shadow bg-white border border-gray-100 sm:p-6 lg:p-8 rounded-2xl hover:shadow-lg">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
                    <Icon className="w-5 h-5 text-white sm:w-6 sm:h-6" />
                  </div>
                  <h4 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg lg:text-xl sm:mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-white sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h3 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl sm:mb-4">
              How Neural Sync Works
            </h3>
            <p className="text-base text-gray-600 sm:text-lg lg:text-xl">
              Three simple steps to interview success
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8 lg:gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:mb-6">
                <Brain className="w-6 h-6 text-white sm:w-8 sm:h-8" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl sm:mb-3">1. Setup Your Profile</h4>
              <p className="text-sm text-gray-600 sm:text-base">Upload your resume and job description to personalize AI responses</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl sm:mb-6">
                <MessageSquare className="w-6 h-6 text-white sm:w-8 sm:h-8" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl sm:mb-3">2. Start Your Interview</h4>
              <p className="text-sm text-gray-600 sm:text-base">Our AI listens to questions and provides instant, relevant responses</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl sm:mb-6">
                <Award className="w-6 h-6 text-white sm:w-8 sm:h-8" />
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl sm:mb-3">3. Land Your Dream Job</h4>
              <p className="text-sm text-gray-600 sm:text-base">Impress interviewers with confident, well-structured answers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-12 lg:mb-16">
            <h3 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl sm:mb-4">
              Trusted by Top Professionals
            </h3>
            <p className="text-base text-gray-600 sm:text-lg lg:text-xl">
              See what our users say about Neural Sync
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 bg-white shadow-lg sm:p-6 lg:p-8 rounded-2xl">
                <div className="flex items-center mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current sm:w-5 sm:h-5" />
                  ))}
                </div>
                <p className="mb-4 text-sm italic text-gray-700 sm:mb-6 sm:text-base">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 mr-3 rounded-full sm:w-12 sm:h-12 sm:mr-4"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 sm:text-base">{testimonial.name}</p>
                    <p className="text-xs text-gray-600 sm:text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h3 className="mb-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl sm:mb-4 lg:mb-6">
            Ready to Ace Your Next Interview?
          </h3>
          <p className="mb-6 text-base text-indigo-100 sm:text-lg lg:text-xl sm:mb-8">
            Join thousands of professionals who have successfully landed their dream jobs with Neural Sync
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/login"
              className="flex items-center justify-center w-full px-6 py-3 space-x-2 text-sm font-semibold text-indigo-600 transition-colors bg-white sm:w-auto sm:px-8 sm:py-4 rounded-xl hover:bg-gray-100 sm:text-base"
            >
              <span>Start Free Today</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/ai-assistant-preview"
              className="flex items-center justify-center w-full px-6 py-3 space-x-2 text-sm font-semibold text-white transition-colors border sm:w-auto sm:px-8 sm:py-4 bg-white/20 rounded-xl hover:bg-white/30 border-white/30 sm:text-base"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};