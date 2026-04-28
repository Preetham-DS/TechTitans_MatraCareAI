import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RiskResult = ({ level, onReset }) => {
  const { language } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  let bgColor, textColor, Icon;

  const CONTENT = {
    LOW: {
      en: { title: 'Low Risk', message: 'Your pregnancy seems to be progressing well with minimal risk factors detected.' },
      hi: { title: 'कम जोखिम', message: 'आपकी गर्भावस्था अच्छे से चल रही है। कोई बड़ा जोखिम नहीं मिला।' },
      kn: { title: 'ಕಡಿಮೆ ಅಪಾಯ', message: 'ನಿಮ್ಮ ಗರ್ಭಧಾರಣೆ ಚೆನ್ನಾಗಿ ಸಾಗುತ್ತಿದೆ. ಯಾವುದೇ ಹೆಚ್ಚಿನ ಅಪಾಯ ಕಂಡುಬಂದಿಲ್ಲ.' }
    },
    MEDIUM: {
      en: { title: 'Medium Risk', message: 'We detected some factors that require attention. Please schedule a check-up with your doctor.' },
      hi: { title: 'मध्यम जोखिम', message: 'कुछ जोखिम कारक मिले हैं। कृपया अपने डॉक्टर से जल्दी मिलें।' },
      kn: { title: 'ಮಧ್ಯಮ ಅಪಾಯ', message: 'ಕೆಲವು ಅಪಾಯದ ಅಂಶಗಳು ಕಂಡುಬಂದಿವೆ. ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.' }
    },
    HIGH: {
      en: { title: 'High Risk', message: 'High risk factors identified. Medical consultation is advised soon.' },
      hi: { title: 'उच्च जोखिम', message: 'उच्च जोखिम मिला है। जल्द से जल्द डॉक्टर से मिलें।' },
      kn: { title: 'ಹೆಚ್ಚಿನ ಅಪಾಯ', message: 'ಅಧಿಕ ಅಪಾಯದ ಅಂಶಗಳು ಕಂಡುಬಂದಿವೆ. ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.' }
    },
    CRITICAL: {
      en: { title: 'Critical Risk Detected', message: 'Critical risk factors identified. Immediate emergency medical consultation is strongly advised.' },
      hi: { title: 'गंभीर जोखिम', message: 'गंभीर जोखिम मिला है! तुरंत आपातकालीन चिकित्सा सहायता लें।' },
      kn: { title: 'ತೀವ್ರ ಅಪಾಯ', message: 'ತೀವ್ರ ಅಪಾಯ ಕಂಡುಬಂದಿದೆ! ತಕ್ಷಣ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.' }
    }
  };

  const LOCALE_MAP = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN' };

  switch (level) {
    case 'LOW':   bgColor = 'bg-success/10'; textColor = 'text-success'; Icon = CheckCircle2; break;
    case 'MEDIUM': bgColor = 'bg-warning/10'; textColor = 'text-warning'; Icon = AlertTriangle; break;
    case 'HIGH':  bgColor = 'bg-orange-100';  textColor = 'text-orange-600'; Icon = AlertTriangle; break;
    case 'CRITICAL': bgColor = 'bg-danger/10'; textColor = 'text-danger'; Icon = ShieldAlert; break;
    default: return null;
  }

  const content = CONTENT[level]?.[language] ?? CONTENT[level]?.en;
  const { title, message: msg } = content;

  const handleListen = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const text = `${title}. ${msg}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_MAP[language] || 'en-IN';
    utterance.rate = 0.85;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`max-w-2xl mx-auto rounded-3xl p-8 md:p-12 text-center shadow-2xl scale-in border ${bgColor}`}>
      <div className={`inline-flex justify-center items-center w-24 h-24 rounded-full ${bgColor} mb-6`}>
        <Icon className={`w-12 h-12 ${textColor}`} />
      </div>
      <h2 className={`text-4xl font-extrabold mb-4 ${textColor}`}>{title}</h2>
      <p className="text-xl text-gray-700 mb-6 max-w-md mx-auto">{msg}</p>

      {/* TTS Listen Button */}
      <button
        onClick={handleListen}
        className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border-2 transition-all mb-6 ${
          isSpeaking
            ? `${bgColor} ${textColor} border-current animate-pulse`
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
        }`}
      >
        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        {isSpeaking ? 'Stop Listening' : '🔊 Listen to Result'}
      </button>

      <div className="space-y-4">
        <button
          onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
          className={`btn-press w-full md:w-auto px-8 py-3 rounded-full text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-1 ${
            level === 'LOW' ? 'bg-success' : level === 'MEDIUM' ? 'bg-warning' : level === 'HIGH' ? 'bg-orange-500' : 'bg-danger'
          }`}
        >
          View Details
        </button>
        <div className="block">
          <button
            onClick={onReset}
            className="text-gray-500 hover:text-gray-800 font-medium underline underline-offset-4 mt-4"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskResult;
