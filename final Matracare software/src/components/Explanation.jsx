import React, { useState } from 'react';
import { 
  Info, ChevronDown, ChevronUp, Volume2, VolumeX, 
  ShieldAlert, Activity, AlertTriangle, Eye, HeartPulse, Stethoscope 
} from 'lucide-react';
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

  const level = data.result?.level || data.level || 'LOW';
  const symptomsObj = data.symptoms || {};
  const activeSymptoms = Object.entries(symptomsObj).filter(([k, v]) => v !== 'none').map(([k, v]) => k);
  const conditions = data.conditions || [];
  const { systolic, diastolic } = data;

  // 1. What this risk means
  const getRiskMeaning = () => {
    if (level === 'CRITICAL') return "This is a medical emergency. Your life and your baby's life might be in danger right now. You need immediate medical help from a hospital.";
    if (level === 'HIGH') return "Your health needs urgent attention. While it may not be a sudden emergency yet, waiting can be very dangerous for you and your baby.";
    if (level === 'MEDIUM') return "Your symptoms show that something is not completely normal. It is important to see a doctor soon to prevent it from getting worse.";
    return "Your health looks stable right now. However, pregnancy always needs careful monitoring to keep you and the baby safe.";
  };

  // 2. Why these symptoms are dangerous
  const getSymptomsExplanation = () => {
    if (activeSymptoms.length === 0) return "You haven't reported any major danger symptoms right now, which is a good sign.";
    
    const messages = [];
    if (activeSymptoms.includes('bleeding')) messages.push("Bleeding means you might be losing too much blood or there is a problem with the placenta.");
    if (activeSymptoms.includes('dizziness')) messages.push("Dizziness can mean your blood pressure is abnormal or you do not have enough blood (anemia).");
    if (activeSymptoms.includes('vision')) messages.push("Blurred vision is a strong warning sign of dangerously high blood pressure.");
    if (activeSymptoms.includes('headache')) messages.push("Severe headaches can be a sign of high blood pressure.");
    if (activeSymptoms.includes('swelling')) messages.push("Sudden swelling is a sign your kidneys might be struggling due to high blood pressure.");
    if (activeSymptoms.includes('fetalMovement')) messages.push("Reduced baby movement requires immediate checking to ensure the baby is safe.");
    
    if (messages.length === 0) {
      return `You have reported ${activeSymptoms.length} symptom(s). Any discomfort should be checked by a health worker to be safe.`;
    }
    return messages.join(" ");
  };

  // 3. Risk factor summary
  const dangerSignsCount = Object.values(symptomsObj).filter(v => v === 'severe').length;
  const medHistoryCount = conditions.length;
  let bpIssues = 0;
  if (systolic >= 140 || diastolic >= 90) bpIssues = 1;
  if (systolic <= 90 || diastolic <= 60) bpIssues = 1;

  // 4. What can happen if ignored
  const getConsequences = () => {
    if (level === 'CRITICAL' || level === 'HIGH') return "If ignored, this could lead to serious complications during delivery, severe weakness, or harm to your baby's growth and survival.";
    if (level === 'MEDIUM') return "Ignoring mild symptoms can allow them to turn into severe, life-threatening problems later in your pregnancy.";
    return "Even low risk can change. Skipping check-ups means we might miss early signs of new problems.";
  };

  // 5. Early warning guidance
  const getWarningGuidance = () => {
    if (level === 'CRITICAL') return "Do not wait. Go to the nearest hospital immediately. Do not drive yourself. Call an ambulance or have someone take you.";
    if (level === 'HIGH') return "Watch out for any sudden bleeding, sharp stomach pains, or extreme dizziness. Go to a clinic today.";
    if (level === 'MEDIUM') return "Rest well today. Drink plenty of water. If you feel worse tomorrow, visit your local health center.";
    return "Watch out for sudden headaches, blurry vision, or bleeding. Keep taking your prescribed vitamins and eat healthy food.";
  };

  const fullSpeechText = `${getRiskMeaning()} ${getSymptomsExplanation()} ${getConsequences()} ${getWarningGuidance()}`;

  return (
    <div id="details" className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 mt-8 overflow-hidden fade-in">
      {/* Header / Toggle */}
      <div 
        className="flex items-center justify-between p-6 md:px-8 md:py-6 cursor-pointer hover:bg-gray-50 transition-colors bg-gradient-to-r from-gray-50 to-white border-b border-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-primary-light/40 p-2.5 rounded-xl">
            <Info className="w-6 h-6 text-primary-dark" />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">Understanding Your Condition</h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); speak(fullSpeechText); }}
            title={isSpeaking ? 'Stop' : 'Read aloud'}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
              isSpeaking
                ? 'bg-primary-dark text-white border-primary-dark shadow-[0_0_12px_rgba(236,72,153,0.5)] animate-pulse'
                : 'bg-white text-primary-dark border-primary-dark hover:bg-primary-light shadow-sm'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isSpeaking ? 'Stop' : 'Listen'}
          </button>
          <button className="text-gray-400 hover:text-gray-600 focus:outline-none bg-gray-100 p-2 rounded-full transition-colors">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-6 md:p-8 bg-gray-50/50">
          <p className="text-gray-500 font-medium text-sm mb-6 uppercase tracking-wider">
            Patient Insights & Additional Information
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Card 1: What this risk means */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${level === 'CRITICAL' || level === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">What this risk means</h4>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed">
                {getRiskMeaning()}
              </p>
            </div>

            {/* Card 2: Why these symptoms are dangerous */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">Why symptoms matter</h4>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed">
                {getSymptomsExplanation()}
              </p>
            </div>

            {/* Card 3: What can happen if ignored */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">If ignored...</h4>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed">
                {getConsequences()}
              </p>
            </div>

            {/* Card 4: Early warning guidance */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-800 text-lg">What to watch next</h4>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed">
                {getWarningGuidance()}
              </p>
            </div>

          </div>

          {/* Card 5: Risk Factor Summary (Full Width) */}
          <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Your Risk Factor Summary</h4>
                <p className="text-sm text-gray-500 font-medium">Based on your provided data</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="font-black text-xl text-primary-dark">{dangerSignsCount}</span>
                <span className="text-sm font-semibold text-gray-600">Danger<br/>Symptoms</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="font-black text-xl text-primary-dark">{medHistoryCount}</span>
                <span className="text-sm font-semibold text-gray-600">Medical<br/>Conditions</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-2">
                <span className="font-black text-xl text-primary-dark">{bpIssues > 0 ? 'Yes' : 'No'}</span>
                <span className="text-sm font-semibold text-gray-600">Abnormal<br/>Vitals</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Explanation;
