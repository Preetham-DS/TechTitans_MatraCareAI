import React from 'react';
import { ShieldCheck, Lock, Stethoscope, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ─── Trust & Disclaimer UI ────────────────────────────────────────────────────
// Prominently displayed on the home page to build user trust and prevent misuse.
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT = {
  en: {
    badge: 'AI-Assisted · Not a Medical Diagnosis',
    headline: 'Your safety is our priority',
    disclaimer:
      'MatraCare is an early risk awareness tool designed to support — not replace — professional medical care. All results should be reviewed with a certified doctor or ASHA worker.',
    pillars: [
      {
        icon: <Lock className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-700',
        title: 'Privacy First',
        desc: 'Data stays on your device only',
      },
      {
        icon: <Stethoscope className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-700',
        title: 'Clinically Guided',
        desc: 'Based on WHO & NICE guidelines',
      },
      {
        icon: <Smartphone className="w-5 h-5" />,
        color: 'bg-emerald-100 text-emerald-700',
        title: 'Works Offline',
        desc: 'No internet needed after load',
      },
    ],
  },
  hi: {
    badge: 'AI-सहायता · चिकित्सा निदान नहीं',
    headline: 'आपकी सुरक्षा हमारी प्राथमिकता है',
    disclaimer:
      'MatraCare एक प्रारंभिक जोखिम जागरूकता उपकरण है जो पेशेवर चिकित्सा देखभाल का समर्थन करता है, प्रतिस्थापित नहीं करता। सभी परिणामों की समीक्षा एक प्रमाणित डॉक्टर या आशा कार्यकर्ता से करें।',
    pillars: [
      {
        icon: <Lock className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-700',
        title: 'गोपनीयता पहले',
        desc: 'डेटा केवल आपके डिवाइस पर रहता है',
      },
      {
        icon: <Stethoscope className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-700',
        title: 'चिकित्सकीय मार्गदर्शन',
        desc: 'WHO दिशानिर्देशों पर आधारित',
      },
      {
        icon: <Smartphone className="w-5 h-5" />,
        color: 'bg-emerald-100 text-emerald-700',
        title: 'ऑफ़लाइन काम करता है',
        desc: 'लोड के बाद इंटरनेट की आवश्यकता नहीं',
      },
    ],
  },
  kn: {
    badge: 'AI-ಸಹಾಯ · ವೈದ್ಯಕೀಯ ರೋಗ ನಿರ್ಣಯ ಅಲ್ಲ',
    headline: 'ನಿಮ್ಮ ಸುರಕ್ಷತೆ ನಮ್ಮ ಆದ್ಯತೆ',
    disclaimer:
      'MatraCare ಒಂದು ಆರಂಭಿಕ ಅಪಾಯ ಜಾಗೃತಿ ಸಾಧನವಾಗಿದೆ. ಎಲ್ಲಾ ಫಲಿತಾಂಶಗಳನ್ನು ಪ್ರಮಾಣೀಕೃತ ವೈದ್ಯರು ಅಥವಾ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.',
    pillars: [
      {
        icon: <Lock className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-700',
        title: 'ಗೌಪ್ಯತೆ ಮೊದಲ',
        desc: 'ಡೇಟಾ ಫೋನ್‌ನಲ್ಲಿ ಮಾತ್ರ ಇರುತ್ತದೆ',
      },
      {
        icon: <Stethoscope className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-700',
        title: 'ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ',
        desc: 'WHO ಮಾರ್ಗಸೂಚಿ ಆಧಾರಿತ',
      },
      {
        icon: <Smartphone className="w-5 h-5" />,
        color: 'bg-emerald-100 text-emerald-700',
        title: 'ಆಫ್‌ಲೈನ್ ಕಾರ್ಯ',
        desc: 'ಲೋಡ್ ನಂತರ ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿಲ್ಲ',
      },
    ],
  },
};

const TrustBadge = () => {
  const { language } = useApp();
  const c = CONTENT[language] ?? CONTENT.en;

  return (
    <section
      aria-label="Trust and Safety Information"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="bg-gradient-to-r from-pink-50 via-white to-purple-50 border border-pink-100 rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary-dark p-3 rounded-2xl flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="text-xs font-black bg-primary-dark text-white px-3 py-0.5 rounded-full tracking-wide uppercase">
                  {c.badge}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-800">{c.headline}</h2>
            </div>
          </div>
        </div>

        {/* Disclaimer text */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-3xl">
          {c.disclaimer}
        </p>

        {/* Trust pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {c.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
            >
              <div className={`p-2 rounded-xl flex-shrink-0 ${pillar.color}`}>
                {pillar.icon}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{pillar.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadge;
