import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PremiumProvider } from './contexts/PremiumContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BackButton } from './components/BackButton';

// Lazy load components for better performance with preloading
const LoginScreen = lazy(() => 
  import('./components/LoginScreen').then(module => ({ default: module.LoginScreen }))
);
const SetupScreen = lazy(() => 
  import('./components/SetupScreen').then(module => ({ default: module.SetupScreen }))
);
const MeetingScreen = lazy(() => 
  import('./components/MeetingScreen').then(module => ({ default: module.MeetingScreen }))
);
const AIInterviewPractice = lazy(() => 
  import('./components/AIInterviewPractice').then(module => ({ default: module.AIInterviewPractice }))
);
const UserProfile = lazy(() => 
  import('./components/UserProfile').then(module => ({ default: module.UserProfile }))
);
const PremiumPage = lazy(() => 
  import('./components/PremiumPage').then(module => ({ default: module.PremiumPage }))
);
const PaymentPage = lazy(() => 
  import('./components/PaymentPage').then(module => ({ default: module.PaymentPage }))
);
const DemoMeeting = lazy(() => 
  import('./components/DemoMeeting').then(module => ({ default: module.DemoMeeting }))
);
const LandingPage = lazy(() => 
  import('./components/LandingPage').then(module => ({ default: module.LandingPage }))
);
const ContactUs = lazy(() => 
  import('./components/ContactUs').then(module => ({ default: module.ContactUs }))
);
const AIInterviewPreview = lazy(() => 
  import('./components/AIInterviewPreview').then(module => ({ default: module.AIInterviewPreview }))
);
const AIAssistantPreview = lazy(() => 
  import('./components/AIAssistantPreview').then(module => ({ default: module.AIAssistantPreview }))
);
const InterviewSummary = lazy(() => 
  import('./components/InterviewSummary').then(module => ({ default: module.InterviewSummary }))
);

// Preload critical components
const preloadComponents = () => {
  const componentsToPreload = [
    () => import('./components/LoginScreen'),
    () => import('./components/SetupScreen'),
    () => import('./components/MeetingScreen'),
  ];
  
  componentsToPreload.forEach(importFn => {
    importFn().catch(() => {
      // Silently handle preload failures
    });
  });
};

// Start preloading after a short delay
setTimeout(preloadComponents, 1000);

// Protected Route Component with performance optimization
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

// Public Route Component (redirects authenticated users)
const PublicRoute: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/setup" replace />;
  }
  
  return <>{children}</>;
});

PublicRoute.displayName = 'PublicRoute';

const AppContent: React.FC = React.memo(() => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BackButton />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/ai-interview-preview" element={<AIInterviewPreview />} />
            <Route path="/ai-assistant-preview" element={<AIAssistantPreview />} />
            <Route path="/demo" element={<DemoMeeting />} />
            
            {/* Auth Routes (redirect if already authenticated) */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/setup" element={
              <ProtectedRoute>
                <SetupScreen />
              </ProtectedRoute>
            } />
            <Route path="/meeting" element={
              <ProtectedRoute>
                <MeetingScreen />
              </ProtectedRoute>
            } />
            <Route path="/ai-practice" element={
              <ProtectedRoute>
                <AIInterviewPractice />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/premium" element={
              <ProtectedRoute>
                <PremiumPage />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } />
            <Route path="/summary" element={
              <ProtectedRoute>
                <InterviewSummary />
              </ProtectedRoute>
            } />
            
            {/* Fallback redirect */}
            <Route path="*" element={
              <Navigate to={isAuthenticated ? "/setup" : "/"} replace />
            } />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
});

AppContent.displayName = 'AppContent';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PremiumProvider>
          <AppContent />
        </PremiumProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;