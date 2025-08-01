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
      <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-white shadow-2xl rounded-3xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text">
              You're Already Premium!
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Enjoy all the premium features and continue acing your interviews!
            </p>
            <div className="grid gap-6 mb-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-indigo-600">∞</div>
                <div className="text-sm text-gray-600">Unlimited AI Responses</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Priority Support</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-gray-600">All Features Unlocked</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/setup')}
              className="flex items-center px-8 py-4 mx-auto space-x-2 text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700"
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
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 shadow-lg bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-4 text-5xl font-bold text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text">
            Upgrade to Premium
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Unlock the full power of Neural Sync AI and take your interview preparation to the next level
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 mb-16 md:grid-cols-2">
          {/* Free Plan */}
          <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Free Plan</h3>
              <div className="mb-2 text-4xl font-bold text-gray-600">$0</div>
              <p className="text-gray-500">Perfect for getting started</p>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-green-500" />
                <span>5 AI responses per day</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-green-500" />
                <span>Basic interview practice</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-green-500" />
                <span>Speech recognition</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-green-500" />
                <span>Basic templates</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-xl hover:bg-gray-50">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="relative p-8 border-2 shadow-2xl bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-amber-200">
            <div className="absolute transform -translate-x-1/2 -top-4 left-1/2">
              <span className="px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
                Most Popular
              </span>
            </div>
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Premium Plan</h3>
              <div className="mb-2 text-4xl font-bold text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text">
                $19
              </div>
              <p className="text-gray-600">per month</p>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-amber-500" />
                <span className="font-medium">Unlimited AI responses</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-amber-500" />
                <span className="font-medium">Advanced AI models</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-amber-500" />
                <span className="font-medium">Detailed analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-amber-500" />
                <span className="font-medium">Export all formats</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-amber-500" />
                <span className="font-medium">24/7 priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 mr-3 text-amber-500" />
                <span className="font-medium">Custom templates</span>
              </li>
            </ul>
            <button
              onClick={handleUpgrade}
              className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade Now</span>
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="p-8 mb-16 bg-white shadow-lg rounded-2xl">
          <h3 className="mb-8 text-2xl font-bold text-center text-gray-900">
            Feature Comparison
          </h3>
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center flex-1 space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-8">
                    <div className="text-center">
                      <div className="mb-1 text-sm text-gray-500">Free</div>
                      <div className="font-medium text-gray-700">{feature.free}</div>
                    </div>
                    <div className="text-center">
                      <div className="mb-1 text-sm text-amber-600">Premium</div>
                      <div className="font-bold text-amber-600">{feature.premium}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="mb-12 text-3xl font-bold text-center text-gray-900">
            What Our Premium Users Say
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white shadow-lg rounded-2xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-6 italic text-gray-700">
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
        <div className="p-12 text-center text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl">
          <h3 className="mb-4 text-3xl font-bold">
            Ready to Unlock Your Interview Potential?
          </h3>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-indigo-100">
            Join thousands of professionals who have upgraded to Premium and landed their dream jobs
          </p>
          <button
            onClick={handleUpgrade}
            className="flex items-center px-8 py-4 mx-auto space-x-2 font-semibold text-indigo-600 transition-colors bg-white rounded-xl hover:bg-gray-100"
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