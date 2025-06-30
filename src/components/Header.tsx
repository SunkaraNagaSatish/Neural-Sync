import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  User, 
  LogOut, 
  Crown, 
  MessageSquare, 
  Zap,
  Menu,
  X,
  Home,
  Phone,
  BarChart3,
  FileText,
  Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';

export const Header: React.FC = React.memo(() => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isPremium } = usePremium();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  }, [logout, navigate]);

  const publicNavItems = useMemo(() => [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ai-interview-preview', label: 'AI Interview Practice', icon: MessageSquare },
    { path: '/ai-assistant-preview', label: 'AI Interview Assistant', icon: Zap },
    { path: '/demo', label: 'Demo', icon: Play },
    { path: '/contact', label: 'Contact Us', icon: Phone },
  ], []);

  const authenticatedNavItems = useMemo(() => [
    { path: '/setup', label: 'Neural Sync Meeting', icon: Brain },
    { path: '/ai-practice', label: 'AI Interview Practice', icon: MessageSquare },
    { path: '/summary', label: 'Interview Summary', icon: BarChart3, premiumOnly: true },
  ], []);

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  // Remove demo from authenticated nav if user is premium
  const filteredNavItems = useMemo(() => {
    if (isAuthenticated && isPremium) {
      return navItems.filter(item => item.path !== '/demo');
    }
    return navItems;
  }, [navItems, isAuthenticated, isPremium]);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Neural Sync
              </h1>
              <p className="text-xs text-gray-500 hidden lg:block">AI Interview Assistant</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NS
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isPremiumFeature = item.premiumOnly && !isPremium;
              
              return (
                <Link
                  key={item.path}
                  to={isPremiumFeature ? '/premium' : item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    isActive 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isPremiumFeature && <Crown className="w-3 h-3 text-amber-500" />}
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                {!isPremium && (
                  <Link
                    to="/premium"
                    className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium text-sm"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade Pro</span>
                  </Link>
                )}

                {isPremium && (
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-sm font-medium">
                    <Crown className="w-4 h-4" />
                    <span>Pro</span>
                  </div>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block font-medium text-gray-700 text-sm">{user?.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      {isPremium && (
                        <Link
                          to="/summary"
                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Interview Summary</span>
                        </Link>
                      )}
                      {!isPremium && (
                        <Link
                          to="/premium"
                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-sm"
                        >
                          <Crown className="w-4 h-4" />
                          <span>Upgrade to Pro</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isPremiumFeature = item.premiumOnly && !isPremium;
                
                return (
                  <Link
                    key={item.path}
                    to={isPremiumFeature ? '/premium' : item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    {isPremiumFeature && <Crown className="w-3 h-3 text-amber-500" />}
                  </Link>
                );
              })}
              
              {isAuthenticated && !isPremium && (
                <Link
                  to="/premium"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium mx-4"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade Pro</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';