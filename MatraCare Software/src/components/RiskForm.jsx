import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, Eye, Baby, Droplets, Accessibility, Mic, MicOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { saveLastFormInput, loadLastFormInput, saveEntry } from '../utils/storage';
import { calculateRisk } from '../utils/healthEngine';
import { getExpertInsight, generateSpeech } from '../utils/geminiService';
import VoiceAssistant from './VoiceAssistant';

// ─── Symptom definitions (used in both modes) ─────────────────────────────────
const SYMPTOMS = [
  {
    id: 'severe_headache',
    label: 'Severe Headache',
    easyLabel: { en: 'Head Pain', hi: 'सिर दर्द', kn: 'ತಲೆನೋವು' },
    emoji: '🤕',
    color: 'bg-orange-100 border-orange-300 text-orange-700',
    selectedColor: 'bg-orange-500 border-orange-600 text-white',
    icon: <AlertCircle className="w-8 h-8" />,
  },
  {
    id: 'blurred_vision',
    label: 'Blurred Vision',
    easyLabel: { en: 'Blurry Eyes', hi: 'धुंधला दिखना', kn: 'ಮಸುಕಾದ ದೃಷ್ಟಿ' },
    emoji: '👁️',
    color: 'bg-purple-100 border-purple-300 text-purple-700',
    selectedColor: 'bg-purple-500 border-purple-600 text-white',
    icon: <Eye className="w-8 h-8" />,
  },
  {
    id: 'swelling',
    label: 'Swelling (Hands/Face)',
    easyLabel: { en: 'Swollen Hands', hi: 'सूजन', kn: 'ಊತ' },
    emoji: '🤲',
    color: 'bg-blue-100 border-blue-300 text-blue-700',
    selectedColor: 'bg-blue-500 border-blue-600 text-white',
    icon: <Activity className="w-8 h-8" />,
  },
  {
    id: 'dizziness',
    label: 'Dizziness',
    easyLabel: { en: 'Dizzy / Fainting', hi: 'चक्कर आना', kn: 'ತಲೆ ಸುತ್ತು' },
    emoji: '😵',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    selectedColor: 'bg-yellow-500 border-yellow-600 text-white',
    icon: <Activity className="w-8 h-8" />,
  },
  {
    id: 'reduced_fetal_movement',
    label: 'Reduced Fetal Movement',
    easyLabel: { en: 'Baby Not Moving', hi: 'बच्चा कम हिल रहा', kn: 'ಮಗು ಚಲಿಸುತ್ತಿಲ್ಲ' },
    emoji: '👶',
    color: 'bg-pink-100 border-pink-300 text-pink-700',
    selectedColor: 'bg-pink-500 border-pink-600 text-white',
    icon: <Baby className="w-8 h-8" />,
  },
  {
    id: 'bleeding',
    label: 'Vaginal Bleeding',
    easyLabel: { en: 'Bleeding', hi: 'रक्तस्राव', kn: 'ರಕ್ತಸ್ರಾವ' },
    emoji: '🩸',
    color: 'bg-red-100 border-red-300 text-red-700',
    selectedColor: 'bg-red-500 border-red-600 text-white',
    icon: <Droplets className="w-8 h-8" />,
  },
];

const VOICE_STATUS_LABELS = {
  en: { listening: 'Listening...', noSupport: 'Voice input not supported in this browser.', noDetect: 'No symptoms recognised. Try: headache, dizziness, bleeding...', error: 'Could not capture voice. Please try again.' },
  hi: { listening: 'सुन रहा है...', noSupport: 'इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है।', noDetect: 'कोई लक्षण पहचाना नहीं गया। कहें: सिर दर्द, चक्कर, रक्तस्राव...', error: 'आवाज़ नहीं पकड़ पाया। कृपया दोबारा कोशिश करें।' },
  kn: { listening: 'ಆಲಿಸುತ್ತಿದೆ...', noSupport: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.', noDetect: 'ಯಾವ ಲಕ್ಷಣವೂ ಪತ್ತೆಯಾಗಿಲ್ಲ. ಹೇಳಿ: ತಲೆನೋವು, ತಲೆ ಸುತ್ತು, ರಕ್ತಸ್ರಾವ...', error: 'ಧ್ವನಿ ಸೆರೆಹಿಡಿಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' },
};

// Simple label lookup for vitals in easy mode
const VITALS_LABELS = {
  en: { age: 'Your Age', systolic: 'BP Upper Number', diastolic: 'BP Lower Number', glucose: 'Blood Sugar', weight: 'Weight (kg)', hemoglobin: 'Blood Level (Hb)' },
  hi: { age: 'आयु', systolic: 'BP ऊपरी संख्या', diastolic: 'BP निचली संख्या', glucose: 'रक्त शर्करा', weight: 'वजन (किग्रा)', hemoglobin: 'रक्त स्तर (Hb)' },
  kn: { age: 'ವಯಸ್ಸು', systolic: 'BP ಮೇಲ್ಭಾಗ', diastolic: 'BP ಕೆಳಭಾಗ', glucose: 'ರಕ್ತ ಸಕ್ಕರೆ', weight: 'ತೂಕ (ಕೆಜಿ)', hemoglobin: 'ರಕ್ತ ಮಟ್ಟ (Hb)' },
};

const HISTORY_LABELS = {
  en: { highBP: 'I have High Blood Pressure', diabetes: 'I have Diabetes', submit: 'Check My Risk' },
  hi: { highBP: 'मुझे उच्च रक्तचाप है', diabetes: 'मुझे मधुमेह है', submit: 'जोखिम जांचें' },
  kn: { highBP: 'ನನಗೆ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಇದೆ', diabetes: 'ನನಗೆ ಮಧುಮೇಹ ಇದೆ', submit: 'ಅಪಾಯ ಪರಿಶೀಲಿಸಿ' },
};

// ─── Main Component ────────────────────────────────────────────────────────────
const RiskForm = ({ onCalculate, prefillData, onPrefillApplied }) => {
  const { language, lowDataMode } = useApp();
  const saved = loadLastFormInput() || {};

  const [vitals, setVitals] = useState({
    age: saved.age ?? '', systolic: saved.systolic ?? '', diastolic: saved.diastolic ?? '',
    glucose: saved.glucose ?? '', weight: saved.weight ?? '', hemoglobin: saved.hemoglobin ?? '',
    cycleLength: saved.cycleLength ?? 28, painLevel: saved.painLevel ?? 0
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState(saved.selectedSymptoms || []);
  const [highBP, setHighBP] = useState(saved.highBP || false);
  const [diabetes, setDiabetes] = useState(saved.diabetes || false);

  // Phase 4 additions
  const [easyMode, setEasyMode] = useState(false);

  // Phase 5 additions – Daily Habits
  const [ironTablet, setIronTablet] = useState(null);
  const [drankWater, setDrankWater] = useState(null);
  const [highSalt, setHighSalt] = useState(null);

  // Voice Input
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [ageError, setAgeError] = useState('');

  // Auto-save form to localStorage for offline resume
  useEffect(() => {
    saveLastFormInput({ ...vitals, selectedSymptoms, highBP, diabetes });
  }, [vitals, selectedSymptoms, highBP, diabetes]);

  // Apply prefill data from report scan
  const [prefilled, setPrefilled] = useState(false);
  useEffect(() => {
    if (prefillData && typeof prefillData === 'object') {
      setVitals(prev => ({
        age: prefillData.age ?? prev.age,
        systolic: prefillData.systolic ?? prev.systolic,
        diastolic: prefillData.diastolic ?? prev.diastolic,
        glucose: prefillData.glucose ?? prev.glucose,
        weight: prefillData.weight ?? prev.weight,
        hemoglobin: prefillData.hemoglobin ?? prev.hemoglobin,
      }));
      setPrefilled(true);
      if (onPrefillApplied) onPrefillApplied();
      // Auto-dismiss the banner after 6 seconds
      setTimeout(() => setPrefilled(false), 6000);
    }
  }, [prefillData]);

  const handleVoiceData = (data) => {
    if (data.cycle_length) {
      setVitals(prev => ({ ...prev, cycleLength: data.cycle_length }));
    }
    if (data.pain_level !== undefined) {
      setVitals(prev => ({ ...prev, painLevel: data.pain_level }));
    }
    if (data.symptoms && Array.isArray(data.symptoms)) {
      setSelectedSymptoms(prev => [...new Set([...prev, ...data.symptoms])]);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const vsl = VOICE_STATUS_LABELS[language] ?? VOICE_STATUS_LABELS.en;
    if (!SpeechRecognition) {
      setVoiceStatus(vsl.noSupport);
      return;
    }
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setVoiceStatus(vsl.listening);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceStatus(`🎙️ "${transcript}"`);
      const KEYWORD_MAP = [
        { keywords: ['headache', 'head', 'sir dard', 'sar dard', 'ತಲೆನೋವು'], id: 'severe_headache' },
        { keywords: ['vision', 'blur', 'eye', 'dhundhla', 'ಮಸುಕು'], id: 'blurred_vision' },
        { keywords: ['swelling', 'swollen', 'sujan', 'ಊತ'], id: 'swelling' },
        { keywords: ['dizzy', 'dizziness', 'chakkar', 'ತಲೆ ಸುತ್ತು'], id: 'dizziness' },
        { keywords: ['movement', 'baby', 'fetal', 'ಮಗು', 'bachcha', 'hilna'], id: 'reduced_fetal_movement' },
        { keywords: ['bleed', 'bleeding', 'blood', 'rakta', 'ರಕ್ತ', 'khoon'], id: 'bleeding' },
      ];
      const detected = KEYWORD_MAP
        .filter(({ keywords }) => keywords.some(kw => transcript.includes(kw)))
        .map(({ id }) => id);
      if (detected.length > 0) {
        setSelectedSymptoms(prev => [...new Set([...prev, ...detected])]);
        setVoiceStatus(`✅ ${detected.map(d => d.replace(/_/g, ' ')).join(', ')}`);
      } else {
        setVoiceStatus(vsl.noDetect);
      }
    };
    recognition.onerror = () => setVoiceStatus(vsl.error);
    recognition.onend = () => setIsListening(false);
  };

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleVitalChange = (e) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
    // Real-time age validation
    if (name === 'age') {
      const age = parseInt(value, 10);
      if (value === '') {
        setAgeError('');
      } else if (isNaN(age) || age <= 18) {
        setAgeError('Age must be above 18');
      } else if (age > 50) {
        setAgeError('Age must be 50 or below for maternal health assessment.');
      } else {
        setAgeError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const age = parseInt(vitals.age, 10);
    if (isNaN(age) || age <= 18) {
      setAgeError('Age must be above 18');
      return;
    }
    if (age > 50) {
      setAgeError('Age must be 50 or below for maternal health assessment.');
      return;
    }
    setAgeError('');
    
    const formData = {
      age,
      systolic: parseFloat(vitals.systolic) || 0,
      diastolic: parseFloat(vitals.diastolic) || 0,
      glucose: parseFloat(vitals.glucose) || 0,
      weight: parseFloat(vitals.weight) || 0,
      hemoglobin: parseFloat(vitals.hemoglobin) || 0,
      cycleLength: parseInt(vitals.cycleLength, 10) || 28,
      painLevel: parseInt(vitals.painLevel, 10) || 0,
      symptoms: selectedSymptoms,
      highBP,
      diabetes,
      habits: { ironTablet, drankWater, highSalt },
    };

    // 1. Run Local Medical Engine
    const localResult = calculateRisk(formData);
    
    // 2. Check online status & fetch Gemini insight if available
    if (navigator.onLine) {
      try {
        const insight = await getExpertInsight(localResult, language);
        localResult.geminiInsight = insight;
        if (!lowDataMode) generateSpeech(insight); // Trigger TTS only if lowDataMode is disabled
      } catch (error) {
        console.error("Gemini Insight failed, falling back to local:", error);
      }
    } else {
      localResult.geminiInsight = "Offline Mode: Based on local data, please consult a doctor if symptoms persist.";
    }

    // 3. Save to Privacy Vault
    const savedEntry = saveEntry(formData, localResult);

    // 4. Trigger result card via callback
    onCalculate({ ...formData, result: localResult });
  };

  const vl = VITALS_LABELS[language];
  const hl = HISTORY_LABELS[language];

  return (
    <div id="assessment" className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-primary-light">

      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {easyMode ? '🌸 Easy Health Check' : 'Manual Data Entry'}
        </h2>
        <button
          type="button"
          onClick={() => setEasyMode(prev => !prev)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border text-sm font-bold transition-all ${
            easyMode
              ? 'bg-primary-dark text-white border-primary-dark shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-primary-dark'
          }`}
        >
          <Accessibility className="w-4 h-4" />
          Easy Mode
        </button>
      </div>

      <VoiceAssistant onDataExtracted={handleVoiceData} />

      {/* Prefill banner */}
      {prefilled && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 fade-in">
          <span className="text-xl">✅</span>
          <div>
            <p className="font-bold text-emerald-800 text-sm">Report data filled!</p>
            <p className="text-emerald-700 text-xs mt-0.5">Values from your report have been filled below. Please review and complete any missing fields before submitting.</p>
          </div>
          <button onClick={() => setPrefilled(false)} className="ml-auto text-emerald-400 hover:text-emerald-600 text-sm">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Vitals Grid ── */}
        <div>
          <h3 className={`font-semibold text-gray-700 mb-4 border-b pb-2 ${easyMode ? 'text-xl' : 'text-lg'}`}>
            {easyMode ? '📋 Your Numbers' : 'Vital Signs'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'age', placeholder: 'e.g. 28', min: 19, max: 50, step: 1, required: true },
              { key: 'systolic', placeholder: 'e.g. 120', min: 50, max: 250, step: 1, required: true },
              { key: 'diastolic', placeholder: 'e.g. 80', min: 30, max: 150, step: 1, required: true },
              { key: 'glucose', placeholder: 'e.g. 95', min: 20, max: 400, step: 1 },
              { key: 'weight', placeholder: 'e.g. 65.5', min: 30, max: 200, step: 0.1 },
              { key: 'hemoglobin', placeholder: 'e.g. 12.5', min: 4, max: 20, step: 0.1 },
              { key: 'cycleLength', placeholder: 'e.g. 28', min: 10, max: 60, step: 1 },
              { key: 'painLevel', placeholder: 'Scale 0-10', min: 0, max: 10, step: 1 },
            ].map(({ key, placeholder, min, max, step, required }) => (
              <div key={key}>
                <label className={`block text-gray-600 font-medium mb-1 ${easyMode ? 'text-base' : 'text-sm'}`}>
                  {easyMode ? vl[key] : `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} ${key === 'systolic' || key === 'diastolic' ? '(mmHg)' : key === 'glucose' ? '(mg/dL)' : key === 'weight' ? '(kg)' : key === 'hemoglobin' ? '(g/dL)' : '(Years)'}`}
                </label>
                <input
                  type="number"
                  name={key}
                  value={vitals[key]}
                  onChange={handleVitalChange}
                  className={`w-full border rounded-xl focus:ring-2 focus:ring-primary-dark outline-none transition-all ${easyMode ? 'p-4 text-xl font-bold' : 'p-3'} ${key === 'age' && ageError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  placeholder={placeholder}
                  min={min} max={max} step={step}
                  required={required}
                />
                {key === 'age' && ageError && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>⚠️</span> {ageError}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Symptoms ── */}
        <div>
          <h3 className={`font-semibold text-gray-700 mb-4 border-b pb-2 ${easyMode ? 'text-xl' : 'text-lg'}`}>
            {easyMode ? '🤒 How do you feel?' : 'Symptoms'}
          </h3>

          {easyMode ? (
            /* EASY MODE: large icon buttons */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SYMPTOMS.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    type="button"
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all font-bold text-sm shadow-sm active:scale-95 ${
                      isSelected ? symptom.selectedColor + ' shadow-lg scale-105' : symptom.color
                    }`}
                  >
                    <span className="text-3xl">{symptom.emoji}</span>
                    <span className="text-center leading-tight">{symptom.easyLabel[language]}</span>
                    {isSelected && <span className="text-xs font-black bg-white/30 px-2 py-0.5 rounded-full">✓ Selected</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            /* NORMAL MODE: pill chips */
            <div className="flex flex-wrap gap-3">
              {SYMPTOMS.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    type="button"
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all text-sm font-medium border ${
                      isSelected
                        ? 'bg-primary-dark text-white border-primary-dark shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary-dark hover:bg-primary-light'
                    }`}
                  >
                    {symptom.icon}
                    <span>{symptom.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Medical History ── */}
        <div>
          <h3 className={`font-semibold text-gray-700 mb-4 border-b pb-2 ${easyMode ? 'text-xl' : 'text-lg'}`}>
            {easyMode ? '📖 Past Health' : 'Prior Medical History'}
          </h3>
          <div className={`flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 ${easyMode ? 'flex-col' : 'flex-row flex-wrap'}`}>
            {[
              { state: highBP, setter: setHighBP, label: hl.highBP },
              { state: diabetes, setter: setDiabetes, label: hl.diabetes },
            ].map(({ state, setter, label }) => (
              <label key={label} className={`flex items-center gap-3 cursor-pointer ${easyMode ? 'bg-white rounded-xl p-3 border border-gray-200 shadow-sm' : ''}`}>
                <input
                  type="checkbox"
                  checked={state}
                  onChange={e => setter(e.target.checked)}
                  className={`text-primary-dark rounded focus:ring-primary-dark border-gray-300 ${easyMode ? 'w-7 h-7' : 'w-5 h-5'}`}
                />
                <span className={`text-gray-700 font-medium ${easyMode ? 'text-base' : ''}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Daily Habits (Phase 5) ── */}
        <div>
          <h3 className={`font-semibold text-gray-700 mb-4 border-b pb-2 ${easyMode ? 'text-xl' : 'text-lg'}`}>
            🌿 Today's Daily Habits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Iron Tablet */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">💊</span>
                <p className="font-bold text-gray-800 text-sm">Took Iron Tablet?</p>
              </div>
              <p className="text-xs text-gray-500 mb-2">Daily iron supplement</p>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setIronTablet(true)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${ironTablet === true ? 'bg-green-500 text-white border-green-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                  Yes ✅
                </button>
                <button type="button" onClick={() => setIronTablet(false)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${ironTablet === false ? 'bg-red-400 text-white border-red-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-400'}`}>
                  No ❌
                </button>
              </div>
            </div>

            {/* Water */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">💧</span>
                <p className="font-bold text-gray-800 text-sm">Drank 3L Water?</p>
              </div>
              <p className="text-xs text-gray-500 mb-2">Adequate hydration today</p>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setDrankWater(true)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${drankWater === true ? 'bg-green-500 text-white border-green-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                  Yes ✅
                </button>
                <button type="button" onClick={() => setDrankWater(false)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${drankWater === false ? 'bg-red-400 text-white border-red-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-400'}`}>
                  No ❌
                </button>
              </div>
            </div>

            {/* Salt */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🧂</span>
                <p className="font-bold text-gray-800 text-sm">High Salt Intake?</p>
              </div>
              <p className="text-xs text-gray-500 mb-2">Processed / salty foods</p>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setHighSalt(true)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${highSalt === true ? 'bg-red-500 text-white border-red-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-400'}`}>
                  Yes 🧂
                </button>
                <button type="button" onClick={() => setHighSalt(false)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${highSalt === false ? 'bg-green-500 text-white border-green-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                  No ✅
                </button>
              </div>
            </div>

          </div>

          {/* Inline warning: High BP + Salt */}
          {highBP && highSalt === true && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl fade-in flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-700 font-semibold text-sm">
                High salt intake with existing high blood pressure significantly increases your risk. Avoid processed foods and salty snacks immediately.
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!!ageError}
          className={`w-full bg-primary-dark hover:bg-primary-dark/90 text-white rounded-2xl font-bold shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${easyMode ? 'py-5 text-2xl' : 'py-4 text-lg'}`}
        >
          {easyMode ? `✅ ${hl.submit}` : 'Analyze Risk'}
        </button>
      </form>
    </div>
  );
};

export default RiskForm;
