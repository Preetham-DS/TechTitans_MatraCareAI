import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RiskForm from './components/RiskForm';
import RiskResult from './components/RiskResult';
import Explanation from './components/Explanation';
import EmergencyAlert from './components/EmergencyAlert';
import Web3UI from './components/Web3UI';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ReportUpload from './components/ReportUpload';
import HealthTips from './components/HealthTips';
import SupportSection from './components/SupportSection';
import TrustBadge from './components/TrustBadge';
import OfflineBanner from './components/OfflineBanner';
import Profile from './components/Profile';
import { Loader2 } from 'lucide-react';
import { calculateMaternalRisk } from './utils/riskEngine';
import { addEntry, addRiskHistory } from './utils/storage';

import { AppProvider } from './context/AppContext';

function AppInner() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isNewUser, setIsNewUser] = useState(false);

  const [assessmentData, setAssessmentData] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleLoginClick = () => setShowAuth(true);

  const handleStartAssessment = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    // Reset any previous result so the form is always visible
    setAssessmentData(null);
    setRiskLevel(null);
    setCurrentView('home');
    setTimeout(() => {
      document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLogin = (userData) => {
    const { isNewUser: firstTime, ...userInfo } = userData;
    setUser(userInfo);
    setShowAuth(false);
    // First-time signup → send to profile to complete details
    if (firstTime) {
      setIsNewUser(true);
      setCurrentView('profile');
    }
  };

  const handleUpdateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    // If first-time onboarding, go home after saving profile
    if (isNewUser) {
      setIsNewUser(false);
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    setAssessmentData(null);
    setRiskLevel(null);
  };

  const calculateRisk = (data) => {
    setIsCalculating(true);
    setAssessmentData(null);
    setRiskLevel(null);

    setTimeout(() => {
      // 1. Calculate Risk using updated engine
      const result = calculateMaternalRisk(data);

      // 2. Persist Data
      addEntry(data);
      addRiskHistory(result);

      // 3. Update UI
      setRiskLevel(result.level);
      setAssessmentData({ ...data, explanation: result.explanation });
      setIsCalculating(false);

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  const handleAIDataExtracted = (extractedData) => {
    // Store extracted values as prefill — let the user review in the form before submitting
    setPrefillData({ ...extractedData });
    // Scroll to the form so the user can see the filled values
    setTimeout(() => {
      document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleReset = () => {
    setAssessmentData(null);
    setRiskLevel(null);
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Offline / low-connectivity banner */}
      <OfflineBanner />

      <Navbar
        user={user}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        onStartAssessment={handleStartAssessment}
        onViewChange={(view) => setCurrentView(view)}
      />

      <Auth
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
      />

      <main className="flex-grow">
        {currentView === 'home' ? (
          <>
            <Hero onStartAssessment={handleStartAssessment} />

            {/* Trust & Disclaimer Badge — prominently below Hero */}
            <TrustBadge />

            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="assessment">
              {!user ? (
                <div className="text-center py-12 bg-primary-light/50 rounded-3xl border border-primary-light fade-in">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Please log in to start your assessment</h3>
                  <button
                    onClick={handleLoginClick}
                    className="bg-primary-dark hover:bg-primary-dark/90 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
                  >
                    Login / Sign Up
                  </button>
                </div>
              ) : (
                <>
                  {!isCalculating && !riskLevel && (
                    <div className="fade-in space-y-8">
                      <ReportUpload onDataExtracted={handleAIDataExtracted} />
                      <div className="relative flex items-center py-5">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 font-medium">OR ENTER MANUALLY</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                      <RiskForm onCalculate={calculateRisk} prefillData={prefillData} onPrefillApplied={() => setPrefillData(null)} />
                    </div>
                  )}

                  {isCalculating && (
                    <div className="flex flex-col items-center justify-center py-20 fade-in">
                      <Loader2 className="w-16 h-16 text-primary-dark animate-spin mb-4" />
                      <p className="text-xl font-medium text-gray-600 animate-pulse">Analyzing health data securely...</p>
                    </div>
                  )}

                  {riskLevel && !isCalculating && (
                    <div id="result-section" className="space-y-8 pt-8">
                      <EmergencyAlert isHighRisk={riskLevel === 'HIGH' || riskLevel === 'CRITICAL'} riskLevel={riskLevel} />
                      <RiskResult level={riskLevel} onReset={handleReset} />
                      <Explanation data={assessmentData} />
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Pregnancy Health Tips — always visible on home */}
            <HealthTips />

            {/* Support / Need Help section */}
            <SupportSection />

            <section className="py-12 px-4 sm:px-6 lg:px-8">
              <Web3UI />
            </section>
          </>
        ) : currentView === 'dashboard' ? (
          <Dashboard user={user} onStartNew={() => setCurrentView('home')} />
        ) : currentView === 'profile' ? (
          <Profile user={user} onUpdateUser={handleUpdateUser} onBack={() => { setIsNewUser(false); setCurrentView('home'); }} isFirstTime={isNewUser} />
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

export default App;
