import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on home page or login page
  const hideOnPaths = ['/', '/login'];
  
  if (hideOnPaths.includes(location.pathname)) {
    return null;
  }

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to home page
      navigate('/');
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