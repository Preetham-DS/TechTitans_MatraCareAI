import React, { useState } from 'react';
import { Droplets, Heart, Activity, Apple, Moon, Baby, ChevronDown, ChevronUp, Lightbulb, Brain, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ─── Multilingual Health Tips ─────────────────────────────────────────────────
const TIPS = [
  {
    id: 1,
    icon: <Droplets className="w-7 h-7" />,
    color: 'bg-blue-100 text-blue-600',
    tag: { en: 'Daily Habit', hi: 'दैनिक आदत', kn: 'ದೈನಂದಿನ ಅಭ್ಯಾಸ' },
    title: { en: 'Stay Hydrated', hi: 'पानी पीते रहें', kn: 'ಹೈಡ್ರೇಟ್ ಆಗಿರಿ' },
    body: {
      en: 'Drink at least 8–10 glasses of clean water daily. Dehydration can cause dizziness, headaches, and preterm contractions.',
      hi: 'प्रतिदिन कम से कम 8–10 गिलास साफ पानी पियें। निर्जलीकरण से चक्कर, सिरदर्द और समय से पहले प्रसव हो सकता है।',
      kn: 'ಪ್ರತಿದಿನ ಕನಿಷ್ಠ 8–10 ಗ್ಲಾಸ್ ಶುದ್ಧ ನೀರು ಕುಡಿಯಿರಿ. ನಿರ್ಜಲೀಕರಣದಿಂದ ತಲೆ ಸುತ್ತು, ತಲೆನೋವು ಮತ್ತು ಅಕಾಲಿಕ ಪ್ರಸವ ಆಗಬಹುದು.',
    },
  },
  {
    id: 2,
    icon: <Activity className="w-7 h-7" />,
    color: 'bg-red-100 text-red-600',
    tag: { en: 'Vital Watch', hi: 'महत्वपूर्ण निगरानी', kn: 'ಪ್ರಮುಖ ಮೇಲ್ವಿಚಾರಣೆ' },
    title: { en: 'Monitor Blood Pressure', hi: 'रक्तचाप की निगरानी करें', kn: 'ರಕ್ತದೊತ್ತಡ ಮೇಲ್ವಿಚಾರಣೆ' },
    body: {
      en: 'High BP is a major warning sign during pregnancy. Check your BP at least once a week and note any readings above 140/90.',
      hi: 'गर्भावस्था में उच्च रक्तचाप एक प्रमुख चेतावनी है। सप्ताह में कम से कम एक बार BP जांचें और 140/90 से ऊपर के पाठ्यांक पर ध्यान दें।',
      kn: 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಪ್ರಮುಖ ಎಚ್ಚರಿಕೆ. ವಾರಕ್ಕೊಮ್ಮೆ BP ತಪಾಸಣೆ ಮಾಡಿ, 140/90 ಮೀರಿದರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
    },
  },
  {
    id: 3,
    icon: <Apple className="w-7 h-7" />,
    color: 'bg-green-100 text-green-600',
    tag: { en: 'Nutrition', hi: 'पोषण', kn: 'ಪೋಷಣೆ' },
    title: { en: 'Eat Nutritious Food', hi: 'पौष्टिक भोजन खाएं', kn: 'ಪೌಷ್ಟಿಕ ಆಹಾರ ತಿನ್ನಿ' },
    body: {
      en: 'Include iron-rich foods (spinach, lentils), calcium (milk, curd), and protein (eggs, legumes). Avoid raw or undercooked food.',
      hi: 'आयरन युक्त खाद्य पदार्थ (पालक, दाल), कैल्शियम (दूध, दही) और प्रोटीन (अंडे, फलियां) शामिल करें। कच्चा या अधपका खाना न खाएं।',
      kn: 'ಕಬ್ಬಿಣ-ಸಮೃದ್ಧ (ಪಾಲಕ, ಅವರೆ), ಕ್ಯಾಲ್ಸಿಯಂ (ಹಾಲು, ಮೊಸರು), ಪ್ರೊಟೀನ್ (ಮೊಟ್ಟೆ) ಸೇರಿಸಿ. ಕಚ್ಚಾ ಅಥವಾ ಅರ್ಧ-ಬೇಯಿಸಿದ ಆಹಾರ ತಪ್ಪಿಸಿ.',
    },
  },
  {
    id: 4,
    icon: <Heart className="w-7 h-7" />,
    color: 'bg-pink-100 text-pink-600',
    tag: { en: 'Routine Care', hi: 'नियमित देखभाल', kn: 'ನಿಯಮಿತ ಆರೈಕೆ' },
    title: { en: 'Attend All Check-ups', hi: 'सभी जाँचों में भाग लें', kn: 'ಎಲ್ಲ ತಪಾಸಣೆಗಳಿಗೆ ಹೋಗಿ' },
    body: {
      en: 'Regular visits with a doctor or ASHA worker can catch complications early. Aim for at least 4 check-ups during pregnancy.',
      hi: 'डॉक्टर या आशा कार्यकर्ता के साथ नियमित दौरे से जटिलताओं को जल्दी पकड़ा जा सकता है। गर्भावस्था में कम से कम 4 जाँचें करें।',
      kn: 'ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಅಥವಾ ವೈದ್ಯರ ಭೇಟಿ ತೊಡಕುಗಳನ್ನು ಬೇಗ ಪತ್ತೆ ಮಾಡಲು ಸಹಾಯಕ. ಕನಿಷ್ಠ 4 ತಪಾಸಣೆ ಗುರಿ ಮಾಡಿ.',
    },
  },
  {
    id: 5,
    icon: <Moon className="w-7 h-7" />,
    color: 'bg-indigo-100 text-indigo-600',
    tag: { en: 'Rest & Sleep', hi: 'आराम और नींद', kn: 'ವಿಶ್ರಾಂತಿ & ನಿದ್ದೆ' },
    title: { en: 'Rest Adequately', hi: 'पर्याप्त आराम करें', kn: 'ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ತೆಗೆಯಿರಿ' },
    body: {
      en: 'Get 7–9 hours of sleep. Sleep on your left side in the third trimester to improve blood flow to the baby.',
      hi: '7–9 घंटे की नींद लें। तीसरी तिमाही में बाईं ओर सोएं ताकि बच्चे को रक्त प्रवाह बेहतर हो।',
      kn: '7–9 ಗಂಟೆ ನಿದ್ದೆ ಮಾಡಿ. ಮೂರನೇ ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ಎಡಗಡೆ ಮಲಗಿ – ಮಗುವಿಗೆ ರಕ್ತ ಹರಿಯಲು ಸಹಾಯ.',
    },
  },
  {
    id: 6,
    icon: <Baby className="w-7 h-7" />,
    color: 'bg-purple-100 text-purple-600',
    tag: { en: 'Baby Health', hi: 'बच्चे की सेहत', kn: 'ಮಗುವಿನ ಆರೋಗ್ಯ' },
    title: { en: 'Monitor Fetal Movement', hi: 'भ्रूण की हलचल देखें', kn: 'ಭ್ರೂಣ ಚಲನೆ ಮೇಲ್ವಿಚಾರಣೆ' },
    body: {
      en: 'From 28 weeks, count fetal kicks daily. You should feel at least 10 movements in 2 hours. Sudden reduction needs immediate attention.',
      hi: '28 सप्ताह से दैनिक भ्रूण की किक गिनें। 2 घंटे में कम से कम 10 हलचल होनी चाहिए। अचानक कमी पर तुरंत डॉक्टर से मिलें।',
      kn: '28 ವಾರದಿಂದ ದೈನಂದಿನ ಭ್ರೂಣ ಒದ್ದಾಟ ಎಣಿಸಿ. 2 ಗಂಟೆಯಲ್ಲಿ ಕನಿಷ್ಠ 10 ಚಲನೆ ಇರಬೇಕು. ಇದ್ದಕ್ಕಿದ್ದಂತೆ ಕಡಿಮೆಯಾದರೆ ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
    },
  },
  {
    id: 7,
    icon: <Brain className="w-7 h-7" />,
    color: 'bg-teal-100 text-teal-600',
    tag: { en: 'Mental Health', hi: 'मानसिक स्वास्थ्य', kn: 'ಮಾನಸಿಕ ಆರೋಗ್ಯ' },
    title: { en: 'Manage Stress', hi: 'तनाव कम करें', kn: 'ಒತ್ತಡ ನಿರ್ವಹಿಸಿ' },
    body: {
      en: 'High stress hormones can affect your baby. Practice light breathing, talk to a trusted person, or take short walks in fresh air.',
      hi: 'अधिक तनाव से शिशु पर असर पड़ सकता है। हल्की सांस लेने का अभ्यास करें, किसी विश्वसनीय व्यक्ति से बात करें या ताजी हवा में टहलें।',
      kn: 'ಅಧಿಕ ಒತ್ತಡ ಮಗುವಿನ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಬಹುದು. ಹಗುರ ಉಸಿರಾಟ, ವಿಶ್ವಾಸಾರ್ಹ ವ್ಯಕ್ತಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ ಅಥವಾ ಹೊರಾಂಗಣ ವಾಯು ವಿಹಾರ ಮಾಡಿ.',
    },
  },
  {
    id: 8,
    icon: <AlertTriangle className="w-7 h-7" />,
    color: 'bg-orange-100 text-orange-600',
    tag: { en: 'Emergency Signs', hi: 'आपातकालीन संकेत', kn: 'ತುರ್ತು ಸಂಕೇತಗಳು' },
    title: { en: 'Know Danger Signs', hi: 'खतरे के संकेत जानें', kn: 'ಅಪಾಯದ ಸಂಕೇತ ತಿಳಿಯಿರಿ' },
    body: {
      en: 'Seek help immediately for: heavy bleeding, severe headache + vision changes, no fetal movement, or fever above 38°C.',
      hi: 'तुरंत मदद लें: भारी रक्तस्राव, तेज सिरदर्द + दृष्टि बदलाव, भ्रूण की हलचल नहीं, या 38°C से ऊपर बुखार।',
      kn: 'ತಕ್ಷಣ ಸಹಾಯ ಪಡೆಯಿರಿ: ಭಾರೀ ರಕ್ತಸ್ರಾವ, ತೀವ್ರ ತಲೆನೋವು + ದೃಷ್ಟಿ ಬದಲಾವಣೆ, ಭ್ರೂಣ ಚಲಿಸದಿರುವಿಕೆ, ಅಥವಾ 38°C ಮೀರಿದ ಜ್ವರ.',
    },
  },
];

const SECTION_LABELS = {
  en: { title: 'Pregnancy Health Tips', subtitle: 'Simple steps to stay healthy during your pregnancy journey.', showMore: 'View All 8 Tips', showLess: 'Show Less' },
  hi: { title: 'गर्भावस्था स्वास्थ्य टिप्स', subtitle: 'अपनी गर्भावस्था यात्रा में स्वस्थ रहने के सरल उपाय।', showMore: 'सभी 8 टिप्स देखें', showLess: 'कम दिखाएं' },
  kn: { title: 'ಗರ್ಭಾವಸ್ಥೆ ಆರೋಗ್ಯ ಸಲಹೆಗಳು', subtitle: 'ನಿಮ್ಮ ಗರ್ಭಾವಸ್ಥೆಯ ಪ್ರಯಾಣದಲ್ಲಿ ಆರೋಗ್ಯಕರವಾಗಿ ಇರಲು ಸರಳ ಹೆಜ್ಜೆಗಳು.', showMore: 'ಎಲ್ಲ 8 ಸಲಹೆಗಳು ನೋಡಿ', showLess: 'ಕಡಿಮೆ ತೋರಿಸಿ' },
};

const HealthTips = () => {
  const { language } = useApp();
  const [expanded, setExpanded] = useState(false);

  const lang = (SECTION_LABELS[language] ? language : 'en');
  const sl = SECTION_LABELS[lang];
  const visible = expanded ? TIPS : TIPS.slice(0, 3);

  return (
    <section className="max-w-5xl mx-auto px-4 py-12" aria-label="Pregnancy Health Tips">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-light p-2 rounded-xl">
          <Lightbulb className="w-6 h-6 text-primary-dark" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">{sl.title}</h2>
      </div>
      <p className="text-gray-500 mb-8 ml-1">{sl.subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((tip) => (
          <div
            key={tip.id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 card-glow"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${tip.color}`}>
                {tip.icon}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {tip.tag[lang] ?? tip.tag.en}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 text-base">
              {tip.title[lang] ?? tip.title.en}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {tip.body[lang] ?? tip.body.en}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4" />{sl.showLess}</>
          ) : (
            <><ChevronDown className="w-4 h-4" />{sl.showMore}</>
          )}
        </button>
      </div>
    </section>
  );
};

export default HealthTips;
