import React from 'react';
import { Phone, MessageCircle, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HELPLINES = [
  { label: { en: 'National Health Helpline', hi: 'राष्ट्रीय स्वास्थ्य हेल्पलाइन', kn: 'ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಸಹಾಯವಾಣಿ' }, number: '104', icon: <Phone className="w-5 h-5" />, color: 'bg-green-100 text-green-700' },
  { label: { en: 'Emergency Ambulance', hi: 'आपातकालीन एम्बुलेंस', kn: 'ತುರ್ತು ಅಂಬ್ಯುಲೆನ್ಸ್' }, number: '102', icon: <Phone className="w-5 h-5" />, color: 'bg-red-100 text-red-700' },
  { label: { en: 'Janani Suraksha Helpline', hi: 'जननी सुरक्षा हेल्पलाइन', kn: 'ಜನನಿ ಸುರಕ್ಷಾ ಸಹಾಯವಾಣಿ' }, number: '1800-180-1104', icon: <HeartHandshake className="w-5 h-5" />, color: 'bg-pink-100 text-pink-700' },
  { label: { en: 'Women Support (Mock)', hi: 'महिला सहायता (मॉक)', kn: 'ಮಹಿಳಾ ಸಹಾಯ (ಮಾದರಿ)' }, number: '1800-XXX-XXXX', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-purple-100 text-purple-700' },
];

const LABELS = {
  en: {
    title: 'Need Help?',
    subtitle: 'You are not alone. Reach out to these support resources anytime.',
    trustTitle: 'Trust & Safety',
    trustBadge: 'AI-Assisted',
    trustBody: 'MatraCare is an early risk awareness tool, not a substitute for professional medical diagnosis. All results should be discussed with a certified doctor or ASHA worker. Data is stored only on your device and never shared.',
  },
  hi: {
    title: 'मदद चाहिए?',
    subtitle: 'आप अकेले नहीं हैं। किसी भी समय इन सहायता संसाधनों से संपर्क करें।',
    trustTitle: 'विश्वास और सुरक्षा',
    trustBadge: 'AI-सहायता',
    trustBody: 'MatraCare एक प्रारंभिक जोखिम जागरूकता उपकरण है, जो पेशेवर चिकित्सा निदान का विकल्प नहीं है। सभी परिणामों की समीक्षा एक प्रमाणित डॉक्टर या आशा कार्यकर्ता से करें। डेटा केवल आपके डिवाइस पर संग्रहित है।',
  },
  kn: {
    title: 'ಸಹಾಯ ಬೇಕೇ?',
    subtitle: 'ನೀವು ಒಂಟಿಯಲ್ಲ. ಯಾವಾಗಲೂ ಈ ಬೆಂಬಲ ಸಂಪನ್ಮೂಲಗಳನ್ನು ತಲುಪಿ.',
    trustTitle: 'ವಿಶ್ವಾಸ ಮತ್ತು ಸುರಕ್ಷತೆ',
    trustBadge: 'AI-ಸಹಾಯ',
    trustBody: 'MatraCare ಒಂದು ಆರಂಭಿಕ ಅಪಾಯ ಜಾಗೃತಿ ಸಾಧನ, ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ರೋಗ ನಿರ್ಣಯದ ಬದಲಿ ಅಲ್ಲ. ಎಲ್ಲ ಫಲಿತಾಂಶಗಳನ್ನು ಪ್ರಮಾಣೀಕೃತ ವೈದ್ಯರು ಅಥವಾ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯೊಂದಿಗೆ ಚರ್ಚಿಸಿ. ಡೇಟಾ ಫೋನ್‌ನಲ್ಲಿ ಮಾತ್ರ ಸಂಗ್ರಹಿತ.',
  },
};

const SupportSection = () => {
  const { language } = useApp();
  const lang = LABELS[language] ? language : 'en';
  const t = LABELS[lang];

  return (
    <section className="max-w-5xl mx-auto px-4 pb-12" aria-label="Support and Helplines">
      <div className="bg-gradient-to-br from-primary-light to-secondary-light rounded-3xl p-8 border border-primary-light">
        <div className="flex items-center gap-3 mb-6">
          <HeartHandshake className="w-8 h-8 text-primary-dark" />
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800">{t.title}</h2>
            <p className="text-gray-500 text-sm">{t.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {HELPLINES.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className={`p-2 rounded-xl ${h.color}`}>
                {h.icon}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm group-hover:text-primary-dark transition-colors">
                  {h.label[lang] ?? h.label.en}
                </p>
                <p className="text-primary-dark font-black text-lg">{h.number}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Trust & Disclaimer */}
        <div className="bg-white/70 rounded-2xl p-5 border border-primary-light flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-primary-dark flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-800 mb-1 flex items-center gap-2">
              {t.trustTitle}
              <span className="text-xs bg-primary-dark text-white px-2 py-0.5 rounded-full font-bold">
                {t.trustBadge}
              </span>
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">{t.trustBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
