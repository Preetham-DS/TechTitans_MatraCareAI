import React, { useState } from 'react';
import { ShieldCheck, Heart, Zap, Lock, Star, Quote, Send, MessageSquarePlus, X } from 'lucide-react';

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
          star <= rating ? 'text-warning fill-current' : 'text-gray-300'
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
    <div>
      {/* Main Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6 z-10 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-secondary-light px-4 py-2 rounded-full text-secondary-dark font-semibold text-sm fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>AI-Powered Health Assistant</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight fade-in" style={{ animationDelay: '0.1s' }}>
            Your Pregnancy, <br/>
            <span className="gradient-text">Our Care</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0 fade-in" style={{ animationDelay: '0.2s' }}>
            Check your pregnancy risk instantly using our secure AI predictor. Fast, simple, and designed to support you every step of the way.
          </p>
          <div className="fade-in pt-2" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={onStartAssessment}
              className="bg-primary-dark hover:bg-primary-dark/90 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 w-full md:w-auto flex items-center justify-center space-x-2 mx-auto md:mx-0"
            >
              <Heart className="w-5 h-5" />
              <span>Check My Risk Now</span>
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-16 md:mt-0 flex justify-center fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="relative w-72 h-72 md:w-96 md:h-96 bg-primary-DEFAULT rounded-full opacity-20 absolute filter blur-3xl"></div>
          <div className="float relative z-10 bg-white p-6 rounded-[3rem] shadow-xl border border-primary-light hover-lift">
            <img
              src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=600&q=80"
              alt="Pregnant Woman"
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-[2rem]"
            />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl font-extrabold text-gray-900">Why choose MatraCare?</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Our platform combines cutting-edge AI with secure technology to bring you peace of mind during your pregnancy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-light/30 p-8 rounded-3xl border border-primary-light/50 text-center fade-in card-glow">
              <div className="bg-primary-light w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary-dark" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Instant AI Analysis</h3>
              <p className="text-gray-600">Get immediate, data-driven insights on your symptoms and overall risk profile.</p>
            </div>
            <div className="bg-secondary-light/30 p-8 rounded-3xl border border-secondary-light/50 text-center fade-in card-glow" style={{ animationDelay: '0.1s' }}>
              <div className="bg-secondary-light w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-secondary-dark" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Doctor Approved</h3>
              <p className="text-gray-600">Built using established medical guidelines to ensure reliable and safe early warnings.</p>
            </div>
            <div className="bg-success/5 p-8 rounded-3xl border border-success/10 text-center fade-in card-glow" style={{ animationDelay: '0.2s' }}>
              <div className="bg-success/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-success-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">100% Secure & Private</h3>
              <p className="text-gray-600">Your health data is encrypted and secure. We never share your personal information.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h2 className="text-3xl font-extrabold text-gray-900">Loved by mothers</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">See how MatraCare is making a difference in the lives of expecting parents everywhere.</p>
            {/* Write Review Button */}
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
            <div className="mb-10 fade-in">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 max-w-2xl mx-auto relative">
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
                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                      <StarRating rating={formRating} onRate={setFormRating} interactive size="w-8 h-8" />
                    </div>
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                        required
                      />
                    </div>
                    {/* Review Text */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                      <textarea
                        value={formText}
                        onChange={(e) => setFormText(e.target.value)}
                        placeholder="Tell us about your experience with MatraCare..."
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400 resize-none"
                        required
                      />
                    </div>
                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formRating === 0}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allReviews.map((review, idx) => (
              <div key={review.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative fade-in" style={{ animationDelay: `${idx * 0.07}s` }}>
                <Quote className="absolute top-6 right-8 w-12 h-12 text-primary-light opacity-50" />
                <StarRating rating={review.rating} />
                <p className="text-gray-700 text-lg italic mb-6 mt-4 relative z-10">{review.text}</p>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-xl ${
                    review.gradient ? `bg-gradient-to-br ${review.gradient}` : `bg-${review.color}`
                  }`}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.subtitle}</p>
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
