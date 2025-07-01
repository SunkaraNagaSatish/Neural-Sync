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
    // Check for premium status immediately
    const checkPremiumStatus = () => {
      const premiumStatus = localStorage.getItem('neural_sync_premium');
      const newIsPremium = premiumStatus === 'true';
      
      if (newIsPremium !== isPremium) {
        setIsPremium(newIsPremium);
        console.log('Premium status updated:', newIsPremium);
      }
    };

    // Check immediately
    checkPremiumStatus();

    // Listen for premium status changes
    const handlePremiumStatusChange = (event: CustomEvent) => {
      const newIsPremium = event.detail.isPremium;
      setIsPremium(newIsPremium);
      console.log('Premium status changed via event:', newIsPremium);
    };

    window.addEventListener('premiumStatusChanged', handlePremiumStatusChange as EventListener);

    // Also check periodically in case of external changes
    const interval = setInterval(checkPremiumStatus, 1000);

    return () => {
      window.removeEventListener('premiumStatusChanged', handlePremiumStatusChange as EventListener);
      clearInterval(interval);
    };
  }, [isPremium]);

  const upgradeToPremium = () => {
    setIsPremium(true);
    localStorage.setItem('neural_sync_premium', 'true');
    console.log('Upgraded to premium');
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('premiumStatusChanged', { detail: { isPremium: true } }));
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