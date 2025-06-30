import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, Zap, Shield, Users, Award, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFooterClick = (path: string) => {
    // If it's an internal link, scroll to top after navigation
    if (path.startsWith('/')) {
      setTimeout(() => scrollToTop(), 100);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Neural Sync
                </h3>
                <p className="text-xs text-gray-400">AI Interview Assistant</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Revolutionizing interview preparation with lightning-fast AI responses and real-time assistance.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Made with passion for your success</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link 
                  to="/ai-assistant-preview" 
                  onClick={() => handleFooterClick('/ai-assistant-preview')}
                  className="hover:text-white transition-colors flex items-center space-x-2 group"
                >
                  <Brain className="w-3 h-3 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  <span>AI Interview Assistant</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/ai-interview-preview" 
                  onClick={() => handleFooterClick('/ai-interview-preview')}
                  className="hover:text-white transition-colors flex items-center space-x-2 group"
                >
                  <Zap className="w-3 h-3 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span>AI Interview Practice</span>
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-green-400" />
                <span>Secure & Private</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="w-3 h-3 text-blue-400" />
                <span>Real-time Collaboration</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link 
                  to="/" 
                  onClick={() => handleFooterClick('/')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={() => handleFooterClick('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a 
                  href="#careers" 
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-3 h-3" />
                <span>support@neuralsync.ai</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3 h-3" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-3 h-3" />
                <span>San Francisco, CA</span>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={() => handleFooterClick('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-400">
              <span>© 2024 Neural Sync. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>Trusted by 10,000+ professionals</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">All systems operational</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <div className="flex flex-wrap justify-center space-x-6 text-xs text-gray-500">
              <a 
                href="#privacy" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                className="hover:text-gray-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a 
                href="#terms" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                className="hover:text-gray-300 transition-colors cursor-pointer"
              >
                Terms of Service
              </a>
              <a 
                href="#cookies" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                className="hover:text-gray-300 transition-colors cursor-pointer"
              >
                Cookie Policy
              </a>
              <a 
                href="#gdpr" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                className="hover:text-gray-300 transition-colors cursor-pointer"
              >
                GDPR
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};