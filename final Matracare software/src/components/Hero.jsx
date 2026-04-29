import React, { useState } from 'react';
import { ShieldCheck, Heart, Zap, Lock, Star, Quote, Send, MessageSquarePlus, X, CheckCircle2 } from 'lucide-react';

const REVIEWS_KEY = 'matracare_reviews';

const loadReviews = () => {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveReviews = (reviews) => {
  try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)); } catch {}
};

const DEFAULT_REVIEWS = [
  {
    id: 'default-1',
    name: 'Sarah Jenkins',
    subtitle: 'First-time Mother',
    rating: 5,
    text: '"MatraCare gave me the reassurance I needed. When I had mild pain, the assessment correctly advised me that it was a low-risk scenario, saving me an anxious trip to the ER."',
    color: 'primary-dark',
  },
  {
    id: 'default-2',
    name: 'Maya Patel',
    subtitle: 'Expecting her second',
    rating: 5,
    text: '"The interface is so friendly and calming. Being pregnant is stressful enough, but checking my symptoms on this app actually feels supportive and simple."',
    color: 'secondary-dark',
  },
];

const StarRating = ({ rating, onRate, interactive = false, size = 'w-5 h-5' }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${size} transition-all ${
          star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:scale-125' : ''}`}
        onClick={interactive ? () => onRate(star) : undefined}
      />
    ))}
  </div>
);

const GRADIENT_COLORS = [
  'from-pink-500 to-rose-600',
  'from-purple-500 to-indigo-600',
  'from-teal-500 to-cyan-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-green-600',
];

const FEATURES = [
  {
    icon: <Zap className="w-7 h-7 text-pink-600" />,
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    iconBg: 'bg-pink-100',
    title: 'Instant AI Analysis',
    desc: 'Get immediate, data-driven insights on your symptoms and overall pregnancy risk profile in seconds.',
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-purple-600" />,
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
    title: 'Doctor Approved',
    desc: 'Built using established WHO & NICE medical guidelines to ensure reliable and safe early warnings.',
  },
  {
    icon: <Lock className="w-7 h-7 text-emerald-600" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    title: '100% Secure & Private',
    desc: 'Your health data is encrypted and stays on your device only. We never share your personal information.',
  },
];

const Hero = ({ onStartAssessment }) => {
  const [userReviews, setUserReviews] = useState(loadReviews());
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formText, setFormText] = useState('');
  const [formRating, setFormRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formText.trim() || formRating === 0) return;
    const newReview = {
      id: Date.now().toString(),
      name: formName.trim(),
      subtitle: 'MatraCare User',
      rating: formRating,
      text: `"${formText.trim()}"`,
      gradient: GRADIENT_COLORS[userReviews.length % GRADIENT_COLORS.length],
    };
    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    saveReviews(updated);
    setFormName(''); setFormText(''); setFormRating(0);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 2000);
  };

  const allReviews = [...userReviews, ...DEFAULT_REVIEWS];

  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="w-full bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">

            {/* Left — text content */}
            <div className="w-full md:w-1/2 space-y-7 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 border border-pink-200 px-4 py-2 rounded-full text-sm font-semibold fade-in">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>AI-Powered Health Assistant</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight fade-in" style={{ animationDelay: '0.1s' }}>
                Your Pregnancy,{' '}
                <span className="gradient-text block">Our Care</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto md:mx-0 fade-in" style={{ animationDelay: '0.2s' }}>
                Check your pregnancy risk instantly using our secure AI predictor. Fast, simple, and designed to support you every step of the way.
              </p>

              {/* Key proof points */}
              <ul className="space-y-2 text-sm text-gray-600 fade-in" style={{ animationDelay: '0.25s' }}>
                {['WHO & NICE guidelines', 'Works offline after load', 'Data never leaves your device'].map((pt) => (
                  <li key={pt} className="flex items-center gap-2 justify-center md:justify-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="fade-in pt-1" style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={onStartAssessment}
                  className="inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  <Heart className="w-5 h-5" />
                  Check My Risk Now
                </button>
              </div>
            </div>

            {/* Right — illustration */}
            <div className="w-full md:w-1/2 flex justify-center fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative">
                {/* Decorative blob */}
                <div className="absolute inset-0 bg-pink-200 rounded-full opacity-20 blur-3xl scale-110" />
                <div className="float relative z-10 bg-white p-5 rounded-[2.5rem] shadow-2xl border border-pink-100 hover-lift">
                  <img
                    src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=600&q=80"
                    alt="Pregnant Woman receiving care"
                    className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover rounded-[2rem]"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES / WHY CHOOSE ────────────────────────────── */}
      <section className="w-full bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14 fade-in">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full mb-4">
              Why MatraCare
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Why choose MatraCare?
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-base leading-relaxed">
              Our platform combines cutting-edge AI with secure technology to bring you peace of mind during your pregnancy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`flex flex-col h-full p-8 rounded-2xl border ${f.bg} ${f.border} card-glow fade-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${f.iconBg} flex items-center justify-center mb-6 flex-shrink-0`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12 fade-in">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Loved by mothers</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-base">
              See how MatraCare is making a difference in the lives of expecting parents everywhere.
            </p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquarePlus className="w-5 h-5" />
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showForm && (
            <div className="mb-10 fade-in max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 relative">
                <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Share your experience</h3>
                <p className="text-gray-500 text-sm mb-6">Your review helps other expecting mothers feel confident.</p>

                {submitted ? (
                  <div className="flex flex-col items-center py-8 fade-in">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-emerald-600 fill-current" />
                    </div>
                    <p className="text-xl font-bold text-gray-800">Thank you! 💕</p>
                    <p className="text-gray-500 text-sm mt-1">Your review has been published.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                      <StarRating rating={formRating} onRate={setFormRating} interactive size="w-8 h-8" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                      <input
                        type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                      <textarea
                        value={formText} onChange={(e) => setFormText(e.target.value)}
                        placeholder="Tell us about your experience with MatraCare..."
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400 resize-none"
                        required
                      />
                    </div>
                    <button
                      type="submit" disabled={formRating === 0}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      <Send className="w-4 h-4" />
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {allReviews.map((review, idx) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative flex flex-col fade-in hover:shadow-md transition-shadow"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-pink-100" />
                <StarRating rating={review.rating} />
                <p className="text-gray-700 text-base italic mb-6 mt-4 leading-relaxed flex-grow relative z-10">{review.text}</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${
                    review.gradient ? `bg-gradient-to-br ${review.gradient}` : `bg-${review.color}`
                  }`}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{review.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Hero;
