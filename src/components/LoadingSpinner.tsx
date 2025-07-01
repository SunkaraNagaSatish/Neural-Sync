import React from 'react';
import { Brain } from 'lucide-react';

export const LoadingSpinner: React.FC = React.memo(() => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading Neural Sync...</p>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';