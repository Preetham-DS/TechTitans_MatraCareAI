import React, { useState } from 'react';
import { HeartPulse, Menu, X, Globe, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

const NAV_LABELS = {
  en: { home: 'Home', checkRisk: 'Check Risk', about: 'About', dashboard: 'Dashboard', profile: 'Profile', login: 'Login to Start', startAssessment: 'Start Assessment', logout: 'Logout', hi: 'Hi' },
  hi: { home: 'होम', checkRisk: 'जोखिम जाँच', about: 'जानकारी', dashboard: 'डैशबोर्ड', profile: 'प्रोफ़ाइल', login: 'लॉगिन करें', startAssessment: 'जाँच शुरू करें', logout: 'लॉगआउट', hi: 'नमस्ते' },
  kn: { home: 'ಮುಖಪುಟ', checkRisk: 'ಅಪಾಯ ಪರಿಶೀಲಿಸಿ', about: 'ಮಾಹಿತಿ', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', profile: 'ಪ್ರೊಫೈಲ್', login: 'ಲಾಗಿನ್ ಮಾಡಿ', startAssessment: 'ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ', logout: 'ಲಾಗ್‌ಔಟ್', hi: 'ಹಲೋ' },
};

const PROFILE_PIC_KEY = 'matracare_profile_pic';

const Navbar = ({ user, onLoginClick, onLogout, onStartAssessment, onViewChange, onRunDemo }) => {
  const { language, setLanguage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = NAV_LABELS[language] ?? NAV_LABELS.en;

  // Load profile picture from localStorage
  const profilePic = (() => {
    try {
      return localStorage.getItem(PROFILE_PIC_KEY) || null;
    } catch {
      return null;
    }
  })();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-primary-light shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Profile Icon (top-left) + Logo */}
          <div className="flex items-center space-x-3">
            {/* Profile avatar — top-left, before the logo */}
            {user && (
              <button
                onClick={() => onViewChange('profile')}
                className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all ring-2 ring-pink-300 ring-offset-2 ring-offset-white overflow-hidden flex-shrink-0"
                title={t.profile}
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Online indicator dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
              </button>
            )}

            <HeartPulse className="h-8 w-8 text-primary-dark" />
            <span className="text-xl font-bold text-gray-800 tracking-tight">MatraCare</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#" className="text-gray-600 hover:text-primary-dark font-medium transition-colors text-sm">
              {t.home}
            </a>
            <button
              onClick={onStartAssessment}
              className="text-gray-600 hover:text-primary-dark font-medium transition-colors text-sm"
            >
              {t.checkRisk}
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-2.5 py-1.5 border border-gray-200">
              <Globe className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select language"
                className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>



            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onViewChange('dashboard')}
                  className="text-gray-600 hover:text-primary-dark font-medium transition-colors text-sm"
                >
                  {t.dashboard}
                </button>

                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
                >
                  {t.logout}
                </button>
                <button
                  onClick={() => { onViewChange('home'); onStartAssessment(); }}
                  className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t.startAssessment}
                </button>
                <button
                  onClick={onRunDemo}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  ▶ Run Demo Mode
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLoginClick}
                  className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t.login}
                </button>
                <button
                  onClick={onRunDemo}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  ▶ Demo Mode
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language dropdown on mobile */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1 border border-gray-200">
              <Globe className="w-3 h-3 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select language"
                className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              className="text-gray-600 hover:text-primary-dark p-1"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>


        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 bg-white fade-in">
            <a href="#" className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">{t.home}</a>
            <button onClick={() => { onStartAssessment(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">{t.checkRisk}</button>
            {user && (
              <>
                <button onClick={() => { onViewChange('dashboard'); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">{t.dashboard}</button>
                <button onClick={() => { onViewChange('profile'); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">{t.profile}</button>

              </>
            )}

            {user ? (
              <>
                <button onClick={() => { onViewChange('profile'); setMobileOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">{user.name.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  {t.profile}
                </button>
                <button onClick={() => { onLogout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 font-medium hover:bg-red-50 rounded-xl">{t.logout}</button>
              </>
            ) : (
              <button onClick={() => { onLoginClick(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 text-primary-dark font-bold hover:bg-primary-light rounded-xl">{t.login}</button>
            )}

            <button
              onClick={() => { onRunDemo(); setMobileOpen(false); }}
              className="block w-full text-center px-4 py-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-sm"
            >
              ▶ Run Demo Mode
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
