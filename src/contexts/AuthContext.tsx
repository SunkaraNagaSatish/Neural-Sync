import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedUser = localStorage.getItem('neural_sync_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User restored from localStorage:', userData.email);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('neural_sync_user');
        localStorage.removeItem('neural_sync_premium');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for premium credentials
    if (email === 'sunkaranagasathishssmb@gmail.com' && password === 'Satish78') {
      const userData: User = {
        id: 'premium-user',
        email,
        name: 'Satish Sunkara',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('neural_sync_user', JSON.stringify(userData));
      localStorage.setItem('neural_sync_premium', 'true'); // Auto-grant premium
      console.log('Premium user logged in:', email);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('premiumStatusChanged', { detail: { isPremium: true } }));
      
      return true;
    }
    
    // Accept any other email/password for demo
    if (email && password) {
      const userData: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('neural_sync_user', JSON.stringify(userData));
      console.log('Regular user logged in:', email);
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password) {
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('neural_sync_user', JSON.stringify(userData));
      console.log('User registered:', email);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('neural_sync_user');
    localStorage.removeItem('neural_sync_premium');
    console.log('User logged out');
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('premiumStatusChanged', { detail: { isPremium: false } }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};