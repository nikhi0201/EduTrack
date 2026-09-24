import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SplashIntro } from './components/SplashIntro';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash intro once per session
    return !sessionStorage.getItem('edutrack_splash_shown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('edutrack_splash_shown', 'true');
    setShowSplash(false);
  };

  const handleReplayIntro = () => {
    setShowSplash(true);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        {showSplash && <SplashIntro onComplete={handleSplashComplete} />}

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage onReplayIntro={handleReplayIntro} />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Dashboard Application */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
