import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadPatientData } from '../utils/storage';

// ─── App-Level Context ──────────────────────────────────────────────────────
// Provides: language, setLanguage, lowDataMode, setLowDataMode
// Persisted to localStorage so settings survive page refresh.
// ────────────────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

const SETTINGS_KEY = 'matracare_settings';

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore quota errors */
  }
};

export const AppProvider = ({ children }) => {
  const saved = loadSettings();

  const [language, setLanguageState] = useState(saved.language || 'en');
  const [lowDataMode, setLowDataModeState] = useState(saved.lowDataMode || false);
  const [userRiskHistory, setUserRiskHistory] = useState([]);

  useEffect(() => {
    // Load the risk history on mount
    const data = loadPatientData();
    setUserRiskHistory(data.entries || []);
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    saveSettings({ ...loadSettings(), language: lang });
  };

  const setLowDataMode = (val) => {
    setLowDataModeState(val);
    saveSettings({ ...loadSettings(), lowDataMode: val });
  };

  // Apply / remove body class for Low-Data Mode
  useEffect(() => {
    if (lowDataMode) {
      document.body.classList.add('low-data-mode');
    } else {
      document.body.classList.remove('low-data-mode');
    }
  }, [lowDataMode]);

  return (
    <AppContext.Provider value={{ language, setLanguage, lowDataMode, setLowDataMode, userRiskHistory, setUserRiskHistory }}>
      {children}
    </AppContext.Provider>
  );
};

// Convenience hook
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

export default AppContext;
