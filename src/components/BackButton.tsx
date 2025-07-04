import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Don't show back button on these paths
  const hideOnPaths = [
    '/', 
    '/login', 
    '/setup' // Hide on setup page when authenticated
  ];
  
  // Hide back button on specific paths
  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  // Hide on preview pages when authenticated (they should use main navigation)
  if (isAuthenticated && (location.pathname === '/ai-assistant-preview' || location.pathname === '/ai-interview-preview')) {
    return null;
  }

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to appropriate page based on auth status
      navigate(isAuthenticated ? '/setup' : '/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className="fixed z-40 p-3 transition-all duration-200 border border-gray-200 shadow-lg top-20 left-4 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-xl group"
      title="Go back"
    >
      <ArrowLeft className="w-5 h-5 text-gray-600 transition-colors group-hover:text-indigo-600" />
    </button>
  );
};