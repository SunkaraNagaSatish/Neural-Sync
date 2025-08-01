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
  Play,
  Volume2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';

// Add type for nav items
interface NavItem {
  path: string;
  label: string;
  icon: any;
  premiumOnly?: boolean;
}

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

  const handleLogoClick = useCallback(() => {
    if (isAuthenticated) {
      navigate('/setup');
    } else {
      navigate('/');
    }
    setIsMenuOpen(false);
  }, [isAuthenticated, navigate]);

  const publicNavItems: NavItem[] = useMemo(() => [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ai-interview-preview', label: 'AI Interview Practice', icon: MessageSquare },
    { path: '/ai-assistant-preview', label: 'AI Interview Assistant', icon: Zap },
    { path: '/live-recording', label: 'Live Recording', icon: Volume2 },
    { path: '/demo', label: 'Demo', icon: Play },
    { path: '/contact', label: 'Contact Us', icon: Phone },
  ], []);

  const authenticatedNavItems: NavItem[] = useMemo(() => [
    { path: '/setup', label: 'Neural Sync Meeting', icon: Brain },
    { path: '/ai-practice', label: 'AI Interview Practice', icon: MessageSquare },
    { path: '/live-recording', label: 'Live Recording', icon: Volume2 },
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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Clickable */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center flex-shrink-0 space-x-3 transition-opacity hover:opacity-80"
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Brain className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-transparent sm:text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                Neural Sync
              </h1>
              <p className="hidden text-xs text-gray-500 lg:block">AI Interview Assistant</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                NS
              </h1>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-1 lg:flex">
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
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">{item.label.split(' ')[0]}</span>
                  {isPremiumFeature && <Crown className="w-3 h-3 text-amber-500" />}
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-transparent sm:px-4 sm:py-2 hover:text-gray-900"
                  style={{ background: 'none', border: 'none' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login', { state: { showSignUp: true } })}
                  className="px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  style={{ border: 'none' }}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <>
                {!isPremium && (
                  <Link
                    to="/premium"
                    className="items-center hidden px-3 py-2 space-x-2 text-sm font-medium text-white transition-all duration-200 rounded-lg md:flex bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="hidden lg:inline">Upgrade Pro</span>
                    <span className="lg:hidden">Pro</span>
                  </Link>
                )}

                {isPremium && (
                  <div className="items-center hidden px-3 py-1 space-x-2 text-sm font-medium rounded-full md:flex bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700">
                    <Crown className="w-4 h-4" />
                    <span>Pro</span>
                  </div>
                )}

                <div className="relative group">
                  <button className="flex items-center p-2 space-x-2 transition-colors rounded-lg hover:bg-gray-100">
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden text-sm font-medium text-gray-700 truncate md:block max-w-24">{user?.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 invisible w-48 mt-2 transition-all duration-200 bg-white border border-gray-200 shadow-lg opacity-0 rounded-xl group-hover:opacity-100 group-hover:visible">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      {isPremium && (
                        <div className="flex items-center mt-1 space-x-1">
                          <Crown className="w-3 h-3 text-amber-500" />
                          <span className="text-xs font-medium text-amber-600">Premium Member</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center w-full px-3 py-2 space-x-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      {isPremium && (
                        <Link
                          to="/summary"
                          className="flex items-center w-full px-3 py-2 space-x-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Interview Summary</span>
                        </Link>
                      )}
                      {!isPremium && (
                        <Link
                          to="/premium"
                          className="flex items-center w-full px-3 py-2 space-x-2 text-sm text-left transition-colors rounded-lg text-amber-600 hover:bg-amber-50"
                        >
                          <Crown className="w-4 h-4" />
                          <span>Upgrade to Pro</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 space-x-2 text-sm text-left text-red-600 transition-colors rounded-lg hover:bg-red-50"
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
              className="p-2 transition-colors rounded-lg lg:hidden hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="py-4 border-t border-gray-200 lg:hidden">
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
                  className="flex items-center px-4 py-3 mx-4 space-x-2 font-medium text-white rounded-lg bg-gradient-to-r from-amber-500 to-orange-500"
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