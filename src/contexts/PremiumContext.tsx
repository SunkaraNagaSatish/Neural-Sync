import React, { createContext, useContext, useState, useEffect } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  premiumFeatures: string[];
  upgradeToPremium: () => void;
  checkPremiumAccess: (feature: string) => boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  const premiumFeatures = [
    'unlimited_meetings',
    'advanced_ai_responses',
    'meeting_analytics',
    'custom_templates',
    'priority_support',
    'export_features',
    'ai_interview_practice'
  ];

  useEffect(() => {
    // Check for premium status
    const premiumStatus = localStorage.getItem('neural_sync_premium');
    if (premiumStatus === 'true') {
      setIsPremium(true);
    }
  }, []);

  const upgradeToPremium = () => {
    setIsPremium(true);
    localStorage.setItem('neural_sync_premium', 'true');
  };

  const checkPremiumAccess = (feature: string): boolean => {
    return isPremium || !premiumFeatures.includes(feature);
  };

  return (
    <PremiumContext.Provider value={{ 
      isPremium, 
      premiumFeatures, 
      upgradeToPremium, 
      checkPremiumAccess 
    }}>
      {children}
    </PremiumContext.Provider>
  );
};