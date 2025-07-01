import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader, 
  ArrowRight,
  Zap,
  Shield,
  Users,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen: React.FC = () => {
  const location = useLocation();
  // Check for showSignUp in location.state
  const showSignUp = location.state && location.state.showSignUp;
  const [isLogin, setIsLogin] = useState(!showSignUp);

  useEffect(() => {
    setIsLogin(!showSignUp);
  }, [showSignUp]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password);
      }

      if (success) {
        navigate('/setup', { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = () => {
    navigate('/demo');
  };

  const features = [
    { icon: Zap, title: 'Ultra-Fast AI', desc: 'Lightning-speed responses' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected' },
    { icon: Users, title: 'Trusted by 10K+', desc: 'Professionals worldwide' }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Left Side - Features */}
      <div className="flex-col justify-center hidden p-12 lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-md">
          <div className="flex items-center mb-8 space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl">
              <Brain className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Neural Sync</h1>
              <p className="text-indigo-200">AI Interview Assistant</p>
            </div>
          </div>

          <h2 className="mb-6 text-4xl font-bold text-white">
            Ace Your Next Interview with AI
          </h2>
          
          <p className="mb-8 text-xl text-indigo-100">
            Get instant, intelligent responses during interviews with our advanced neural AI technology.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-indigo-200">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 mt-8 border bg-white/10 rounded-xl border-white/20">
            <div className="flex items-center mb-2 space-x-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span className="font-medium text-white">Free Demo Available</span>
            </div>
            <p className="text-sm text-indigo-200">
              Try our 3-minute demo to experience the power of Neural Sync AI
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="inline-flex items-center mb-4 space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
                <Brain className="text-white w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  Neural Sync
                </h1>
                <p className="text-sm text-gray-600">AI Interview Assistant</p>
              </div>
            </div>
          </div>

          <div className="p-8 border shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to access your Neural Sync dashboard' 
                  : 'Join thousands of professionals using Neural Sync'
                }
              </p>
            </div>

            {error && (
              <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full py-3 pl-12 pr-4 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full py-3 pl-12 pr-12 transition-colors border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleDemoClick}
                className="flex items-center justify-center w-full px-6 py-3 space-x-2 font-medium text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                <span>Try 3-Minute Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};