import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Lock, 
  Check, 
  Crown, 
  ArrowLeft,
  Shield,
  Zap
} from 'lucide-react';
import { usePremium } from '../contexts/PremiumContext';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { upgradeToPremium } = usePremium();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Upgrade to premium
    upgradeToPremium();
    
    // Redirect to success page or dashboard
    navigate('/setup', { 
      state: { 
        message: 'Welcome to Premium! You now have access to all features.' 
      } 
    });
  };

  const features = [
    'Unlimited AI responses',
    'Advanced AI models',
    'Detailed analytics',
    'Export all formats',
    '24/7 priority support',
    'Custom templates'
  ];

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/premium')}
            className="p-2 mr-4 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Upgrade</h1>
            <p className="text-gray-600">Secure payment powered by industry-leading encryption</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Payment Form */}
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Neural Sync Premium</h2>
                <p className="text-gray-600">Monthly subscription</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={paymentData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="w-full px-4 py-3 pl-12 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <CreditCard className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center p-4 border border-green-200 bg-green-50 rounded-xl">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm text-green-700">
                  Your payment information is encrypted and secure
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center justify-center w-full px-6 py-4 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Complete Payment - $19/month</span>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy. 
                You can cancel your subscription at any time.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Plan Details */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Neural Sync Premium</span>
                  <span className="font-semibold">$19.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-amber-600">$19.00/month</span>
                  </div>
                </div>
              </div>

              <div className="p-4 mt-6 border bg-amber-50 border-amber-200 rounded-xl">
                <div className="flex items-center mb-2">
                  <Zap className="w-4 h-4 mr-2 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">Special Launch Offer</span>
                </div>
                <p className="text-sm text-amber-700">
                  First month at full price, then continue at $19/month. Cancel anytime.
                </p>
              </div>
            </div>

            {/* Features Included */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">What's Included</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Money Back Guarantee */}
            <div className="p-6 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 mr-2 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">30-Day Money Back Guarantee</h3>
              </div>
              <p className="text-sm text-green-700">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};