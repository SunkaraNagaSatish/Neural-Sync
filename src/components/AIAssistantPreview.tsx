import React from 'react';
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
  Award
} from 'lucide-react';

export const AIAssistantPreview: React.FC = () => {
  const features = [
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
  ];

  const howItWorks = [
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
  ];

  const benefits = [
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
  ];

  const testimonials = [
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
  ];

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

        {/* Demo Video/Preview Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 sm:p-12 mb-16 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">See Neural Sync in Action</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Watch how our AI assistant helps candidates ace their interviews
          </p>
          <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm border border-white/20">
            <div className="aspect-video bg-white/20 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <p className="text-white/80">Interactive Demo Coming Soon</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4">
                <Zap className="w-6 h-6 mb-2 mx-auto" />
                <p>500ms Response Time</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Shield className="w-6 h-6 mb-2 mx-auto" />
                <p>100% Secure & Private</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Users className="w-6 h-6 mb-2 mx-auto" />
                <p>10,000+ Success Stories</p>
              </div>
            </div>
          </div>
        </div>

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
              to="/login"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
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
    </div>
  );
};