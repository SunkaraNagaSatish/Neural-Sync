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
    '/ai-assistant-preview', // Hide on AI assistant preview when logged in
    '/ai-interview-preview'  // Hide on AI interview preview when logged in
  ];
  
  // Hide back button on preview pages when user is authenticated
  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  // Also hide on preview pages when authenticated
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
      className="fixed top-20 left-4 z-40 p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 group"
      title="Go back"
    >
      <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
    </button>
  );
};