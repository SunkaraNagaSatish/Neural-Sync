import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Check, 
  Zap, 
  Brain, 
  BarChart3, 
  Shield, 
  Headphones,
  Download,
  ArrowRight,
  Star
} from 'lucide-react';
import { usePremium } from '../contexts/PremiumContext';

export const PremiumPage: React.FC = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();

  const features = [
    {
      icon: Zap,
      title: 'Unlimited AI Responses',
      description: 'Get instant, intelligent responses during all your interviews without limits',
      free: '5 per day',
      premium: 'Unlimited'
    },
    {
      icon: Brain,
      title: 'Advanced AI Models',
      description: 'Access to the latest and most powerful AI models for better accuracy',
      free: 'Basic AI',
      premium: 'Advanced AI'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Comprehensive insights into your interview performance and progress',
      free: 'Basic stats',
      premium: 'Full analytics'
    },
    {
      icon: Download,
      title: 'Export Features',
      description: 'Download transcripts, summaries, and reports in multiple formats',
      free: 'Text only',
      premium: 'All formats'
    },
    {
      icon: Shield,
      title: 'Priority Support',
      description: '24/7 premium support with faster response times',
      free: 'Community',
      premium: '24/7 support'
    },
    {
      icon: Headphones,
      title: 'Custom Templates',
      description: 'Create and save custom interview templates for different roles',
      free: 'Basic templates',
      premium: 'Custom templates'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: 'Neural Sync Premium helped me land my dream job. The unlimited AI responses were a game-changer!',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Microsoft',
      content: 'The advanced analytics showed me exactly where to improve. Worth every penny!',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Data Scientist at Amazon',
      content: 'Premium support was incredible when I needed help during a critical interview prep.',
      rating: 5
    }
  ];

  const handleUpgrade = () => {
    navigate('/payment');
  };

  if (isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
              You're Already Premium!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Enjoy all the premium features and continue acing your interviews!
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">∞</div>
                <div className="text-sm text-gray-600">Unlimited AI Responses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Priority Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">All Features Unlocked</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/setup')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <span>Start Interview Session</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl mb-6 shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full power of Neural Sync AI and take your interview preparation to the next level
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-600 mb-2">$0</div>
              <p className="text-gray-500">Perfect for getting started</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>5 AI responses per day</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Basic interview practice</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Speech recognition</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span>Basic templates</span>
              </li>
            </ul>
            <button className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl p-8 border-2 border-amber-200 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                $19
              </div>
              <p className="text-gray-600">per month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-amber-500 mr-3" />
                <span className="font-medium">Unlimited AI responses</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-amber-500 mr-3" />
                <span className="font-medium">Advanced AI models</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-amber-500 mr-3" />
                <span className="font-medium">Detailed analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-amber-500 mr-3" />
                <span className="font-medium">Export all formats</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-amber-500 mr-3" />
                <span className="font-medium">24/7 priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-amber-500 mr-3" />
                <span className="font-medium">Custom templates</span>
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade Now</span>
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Feature Comparison
          </h3>
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Free</div>
                      <div className="text-gray-700 font-medium">{feature.free}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-amber-600 mb-1">Premium</div>
                      <div className="text-amber-600 font-bold">{feature.premium}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Premium Users Say
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Unlock Your Interview Potential?
          </h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have upgraded to Premium and landed their dream jobs
          </p>
          <button
            onClick={handleUpgrade}
            className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade to Premium</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};