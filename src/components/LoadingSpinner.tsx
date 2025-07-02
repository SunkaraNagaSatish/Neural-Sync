import React from 'react';
import { Brain } from 'lucide-react';

export const LoadingSpinner: React.FC = React.memo(() => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div className="w-8 h-8 mx-auto mb-4 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin"></div>
        <p className="font-medium text-gray-600">Loading Neural Sync...</p>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';