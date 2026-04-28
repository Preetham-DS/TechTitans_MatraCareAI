import React, { useState, useEffect } from 'react';
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
import TriagePortal from './components/TriagePortal';
import TrustBadge from './components/TrustBadge';
import OfflineBanner from './components/OfflineBanner';
import Profile from './components/Profile';
import { Loader2 } from 'lucide-react';
import { addEntry, addRiskHistory } from './utils/storage';
import ChatBot from './components/ChatBot';

import { AppProvider } from './context/AppContext';
import { onAuthChange, logOut } from './firebase/authService';
import { getUserProfile, saveRiskAssessment, updateUserProfile } from './firebase/firestoreService';

function AppInner() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isNewUser, setIsNewUser] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [assessmentData, setAssessmentData] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // ── Persist auth session via Firebase observer ──────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch extended profile from Firestore (non-blocking fallback)
          let profile = null;
          try {
            profile = await getUserProfile(firebaseUser.uid);
          } catch (err) {
            console.warn('Firestore profile load skipped:', err.code);
          }
          setUser({
            uid: firebaseUser.uid,
            name: profile?.name || firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            photoURL: profile?.photoURL || firebaseUser.photoURL || null,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setUser(null);
      } finally {
        // Always unblock the app — never leave it stuck on the splash screen
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => setShowAuth(true);

  const handleStartAssessment = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
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
    if (firstTime) {
      setIsNewUser(true);
      setCurrentView('profile');
    }
  };

  const handleUpdateUser = async (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    // Persist profile updates to Firestore
    if (user?.uid) {
      try {
        await updateUserProfile(user.uid, updatedData);
      } catch (err) {
        console.warn('Profile sync error:', err);
      }
    }
    if (isNewUser) {
      setIsNewUser(false);
      setCurrentView('home');
    }
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    setCurrentView('home');
    setAssessmentData(null);
    setRiskLevel(null);
  };

  const calculateRisk = async (data) => {
    setIsCalculating(true);
    setAssessmentData(null);
    setRiskLevel(null);

    const result = data.result;

    // Save to Firestore if user is logged in
    if (user?.uid) {
      try {
        await saveRiskAssessment(user.uid, {
          ...data,
          level: result.level,
          score: result.score,
          explanations: result.explanations || [],
          geminiInsight: result.geminiInsight || '',
        });
      } catch (err) {
        console.warn('Firestore save error (assessment):', err);
      }
    }

    // Always keep local copy as offline fallback
    addRiskHistory({
      level: result.level,
      score: result.score,
      explanation: {
        why: result.explanations || [],
        what: result.geminiInsight || '',
      },
    });

    setTimeout(() => {
      setRiskLevel(result.level);
      setAssessmentData({
        ...data,
        explanation: {
          why: result.explanations || ['No specific flags found.'],
          what: result.geminiInsight || 'Maintain a healthy diet, stay hydrated, and monitor your symptoms.',
        },
      });
      setIsCalculating(false);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 500);
  };

  const handleAIDataExtracted = (extractedData) => {
    setPrefillData({ ...extractedData });
    setTimeout(() => {
      document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleReset = () => {
    setAssessmentData(null);
    setRiskLevel(null);
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
  };

  const runDemoMode = () => {
    setCurrentView('triage');
  };

  // Show a full-screen loader while Firebase resolves the auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 mb-4 shadow-xl animate-pulse">
            <span className="text-3xl">🌸</span>
          </div>
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mt-2" />
          <p className="text-gray-500 mt-3 font-medium">Loading MatraCare…</p>
        </div>
      </div>
    );
  }

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
        onRunDemo={runDemoMode}
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
        ) : currentView === 'triage' ? (
          <TriagePortal onBack={() => setCurrentView('home')} />
        ) : null}
      </main>

      <Footer />

      {/* FEATURE 4: SCALABILITY MESSAGE */}
      <div className="bg-gray-900 text-gray-400 text-xs text-center py-3 px-4 border-t border-gray-800 font-medium">
        This system can scale to national health programs by integrating with digital health IDs and government schemes.
      </div>

      <ChatBot />
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
