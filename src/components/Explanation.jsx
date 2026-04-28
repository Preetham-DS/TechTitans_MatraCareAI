import React, { useState } from 'react';
import { Info, CheckCircle, ChevronDown, ChevronUp, Bot, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Explanation = ({ data }) => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Map language codes to BCP-47 locales for the SpeechSynthesis API
  const LOCALE_MAP = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN' };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_MAP[language] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (!data) return null;

  const explanationObj = typeof data.explanation === 'object' && data.explanation !== null 
    ? data.explanation 
    : { 
        why: typeof data.explanation === 'string' ? [data.explanation] : ["No specific factors identified. Continue regular monitoring."], 
        what: "Maintain a healthy diet, stay hydrated, and ensure you attend all your scheduled prenatal check-ups. Always listen to your body and contact your healthcare provider if you experience any unusual symptoms." 
      };

  return (
    <div id="details" className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 mt-8 overflow-hidden fade-in">
      {/* Header / Toggle */}
      <div 
        className="flex items-center justify-between p-6 md:px-10 md:py-8 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <Info className="w-6 h-6 text-primary-dark" />
          <h3 className="text-2xl font-bold text-gray-800">Why this result?</h3>
        </div>
        <button className="text-gray-500 focus:outline-none">
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-6 pb-6 md:px-10 md:pb-10 border-t border-gray-50 pt-6">
          <div className="bg-primary-light/30 p-6 rounded-2xl mb-8 border border-primary-light flex items-start space-x-4">
            <Bot className="w-8 h-8 text-primary-dark flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-800 mb-3">AI Engine Analysis: Why this result?</h4>
              <ul className="list-disc pl-5 text-gray-700 leading-relaxed font-medium space-y-1">
                {explanationObj.why.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start space-x-3">
              <div className="mt-1 bg-primary-light p-1 rounded-full"><CheckCircle className="w-4 h-4 text-primary-dark" /></div>
              <div>
                <p className="font-semibold text-gray-800">Vital Signs Checked</p>
                <p className="text-gray-600 text-sm">
                  Age: {data.age || '--'},
                  BP: {data.systolic || '--'}/{data.diastolic || '--'} mmHg, 
                  Glucose: {data.glucose || '--'} mg/dL, 
                  Hemoglobin: {data.hemoglobin || '--'} g/dL
                </p>
              </div>
            </li>
            
            {data.symptoms && data.symptoms.length > 0 && (
              <li className="flex items-start space-x-3">
                <div className="mt-1 bg-primary-light p-1 rounded-full"><CheckCircle className="w-4 h-4 text-primary-dark" /></div>
                <div>
                  <p className="font-semibold text-gray-800">Reported Symptoms</p>
                  <p className="text-gray-600 text-sm">{data.symptoms.join(', ').replace(/_/g, ' ')}</p>
                </div>
              </li>
            )}
          </ul>

          <div className="bg-secondary-light p-6 rounded-2xl border border-secondary">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-800">What should you do?</h4>
              <button
                type="button"
                onClick={() => speak(explanationObj.what)}
                title={isSpeaking ? 'Stop' : 'Read aloud'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  isSpeaking
                    ? 'bg-primary-dark text-white border-primary-dark shadow-md animate-pulse'
                    : 'bg-white text-primary-dark border-primary-dark hover:bg-primary-light'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isSpeaking ? 'Stop' : 'Read Aloud'}
              </button>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed font-medium">
              {explanationObj.what}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explanation;
