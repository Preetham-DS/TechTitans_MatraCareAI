import React, { useState, useRef } from 'react';
import { User, Mail, Phone, Calendar, Droplets, Heart, Save, CheckCircle2, ArrowLeft, Shield, Sparkles, Camera, X, ImagePlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { updateUserProfile } from '../firebase/firestoreService';


const LABELS = {
  en: {
    title: 'My Profile',
    subtitle: 'Manage your personal information',
    nameLabel: 'Full Name',
    emailLabel: 'Email Address',
    phoneLabel: 'Phone Number',
    ageLabel: 'Age',
    bloodGroupLabel: 'Blood Group',
    emergencyContactLabel: 'Emergency Contact',
    emergencyNameLabel: 'Contact Name',
    emergencyPhoneLabel: 'Contact Phone',
    save: 'Save Changes',
    saved: 'Changes Saved!',
    welcomeTitle: 'Welcome to MatraCare! 🎉',
    welcomeText: 'Please complete your profile so we can personalize your experience.',
    completeProfile: 'Save & Get Started',
    back: 'Back to Home',
    personalInfo: 'Personal Information',
    healthInfo: 'Health Information',
    emergencyInfo: 'Emergency Contact',
    privacy: 'Your data is stored locally on your device and is never shared.',
    uploadPhoto: 'Upload Photo',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove',
    photoHint: 'JPG, PNG — max 2 MB',
  },
  hi: {
    title: 'मेरी प्रोफ़ाइल',
    subtitle: 'अपनी व्यक्तिगत जानकारी प्रबंधित करें',
    nameLabel: 'पूरा नाम',
    emailLabel: 'ईमेल पता',
    phoneLabel: 'फ़ोन नंबर',
    ageLabel: 'उम्र',
    bloodGroupLabel: 'रक्त समूह',
    emergencyContactLabel: 'आपातकालीन संपर्क',
    emergencyNameLabel: 'संपर्क का नाम',
    emergencyPhoneLabel: 'संपर्क फ़ोन',
    save: 'बदलाव सहेजें',
    saved: 'बदलाव सहेजे गए!',
    welcomeTitle: 'MatraCare में आपका स्वागत है! 🎉',
    welcomeText: 'कृपया अपनी प्रोफ़ाइल पूरी करें ताकि हम आपके अनुभव को वैयक्तिकृत कर सकें।',
    completeProfile: 'सहेजें और शुरू करें',
    back: 'होम पर वापस',
    personalInfo: 'व्यक्तिगत जानकारी',
    healthInfo: 'स्वास्थ्य जानकारी',
    emergencyInfo: 'आपातकालीन संपर्क',
    privacy: 'आपका डेटा आपके डिवाइस पर स्थानीय रूप से संग्रहीत है और कभी साझा नहीं किया जाता।',
    uploadPhoto: 'फ़ोटो अपलोड करें',
    changePhoto: 'फ़ोटो बदलें',
    removePhoto: 'हटाएं',
    photoHint: 'JPG, PNG — अधिकतम 2 MB',
  },
  kn: {
    title: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    subtitle: 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ನಿರ್ವಹಿಸಿ',
    nameLabel: 'ಪೂರ್ಣ ಹೆಸರು',
    emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ',
    phoneLabel: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    ageLabel: 'ವಯಸ್ಸು',
    bloodGroupLabel: 'ರಕ್ತ ಗುಂಪು',
    emergencyContactLabel: 'ತುರ್ತು ಸಂಪರ್ಕ',
    emergencyNameLabel: 'ಸಂಪರ್ಕ ಹೆಸರು',
    emergencyPhoneLabel: 'ಸಂಪರ್ಕ ಫೋನ್',
    save: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    saved: 'ಬದಲಾವಣೆಗಳು ಉಳಿಸಲಾಗಿದೆ!',
    welcomeTitle: 'MatraCare ಗೆ ಸುಸ್ವಾಗತ! 🎉',
    welcomeText: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ.',
    completeProfile: 'ಉಳಿಸಿ ಮತ್ತು ಪ್ರಾರಂಭಿಸಿ',
    back: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    personalInfo: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
    healthInfo: 'ಆರೋಗ್ಯ ಮಾಹಿತಿ',
    emergencyInfo: 'ತುರ್ತು ಸಂಪರ್ಕ',
    privacy: 'ನಿಮ್ಮ ಡೇಟಾ ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ ಮತ್ತು ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಲಾಗುವುದಿಲ್ಲ.',
    uploadPhoto: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್',
    changePhoto: 'ಫೋಟೋ ಬದಲಿಸಿ',
    removePhoto: 'ತೆಗೆದುಹಾಕಿ',
    photoHint: 'JPG, PNG — ಗರಿಷ್ಠ 2 MB',
  },
};

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PROFILE_KEY = 'matracare_profile';
const PROFILE_PIC_KEY = 'matracare_profile_pic';

const loadProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveProfile = (profile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch { /* ignore */ }
};

const loadProfilePic = () => {
  try {
    return localStorage.getItem(PROFILE_PIC_KEY) || null;
  } catch {
    return null;
  }
};

const saveProfilePic = (dataUrl) => {
  try {
    if (dataUrl) {
      localStorage.setItem(PROFILE_PIC_KEY, dataUrl);
    } else {
      localStorage.removeItem(PROFILE_PIC_KEY);
    }
  } catch { /* ignore */ }
};

const Profile = ({ user, onUpdateUser, onBack, isFirstTime = false }) => {
  const { language } = useApp();
  const t = LABELS[language] ?? LABELS.en;
  const fileInputRef = useRef(null);

  const saved = loadProfile();

  const [form, setForm] = useState({
    name: saved.name || user?.name || '',
    email: saved.email || user?.email || '',
    phone: saved.phone || '',
    age: saved.age || '',
    bloodGroup: saved.bloodGroup || '',
    emergencyName: saved.emergencyName || '',
    emergencyPhone: saved.emergencyPhone || '',
  });

  const [profilePic, setProfilePic] = useState(loadProfilePic());
  const [showSaved, setShowSaved] = useState(false);
  const [picDragging, setPicDragging] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePicSelect = (file) => {
    if (!file) return;
    // Validate type
    if (!file.type.startsWith('image/')) return;
    // Validate size (2 MB max)
    if (file.size > 2 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setProfilePic(dataUrl);
      saveProfilePic(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handlePicSelect(file);
    // Reset input so re-selecting the same file works
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePic = () => {
    setProfilePic(null);
    saveProfilePic(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setPicDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handlePicSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setPicDragging(true);
  };

  const handleDragLeave = () => {
    setPicDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    saveProfile(form);
    // Sync to Firestore if user uid is available via prop
    if (user?.uid) {
      try {
        await updateUserProfile(user.uid, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          age: form.age,
          bloodGroup: form.bloodGroup,
          emergencyName: form.emergencyName,
          emergencyPhone: form.emergencyPhone,
        });
      } catch (err) {
        console.warn('Profile Firestore sync failed:', err);
      }
    }
    if (onUpdateUser) {
      onUpdateUser({ name: form.name, email: form.email });
    }
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const inputClass =
    'w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400';

  const iconClass = 'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400';

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
      {/* Back button */}
      {!isFirstTime && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-dark font-medium text-sm mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.back}
        </button>
      )}

      {/* Welcome banner for first-time users */}
      {isFirstTime && (
        <div className="mb-8 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border border-pink-200 rounded-3xl p-6 md:p-8 text-center fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">{t.welcomeTitle}</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">{t.welcomeText}</p>
        </div>
      )}

      {/* Header with Profile Picture */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        {/* Profile picture upload area */}
        <div className="relative group">
          <div
            className={`w-28 h-28 rounded-3xl overflow-hidden shadow-lg border-4 transition-all cursor-pointer ${
              picDragging
                ? 'border-pink-400 scale-105 shadow-pink-200'
                : 'border-white hover:border-pink-200 hover:shadow-xl'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex flex-col items-center justify-center text-white">
                {user?.name ? (
                  <span className="text-4xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
              <Camera className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Remove button */}
          {profilePic && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemovePic(); }}
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
              title={t.removePhoto}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Name + subtitle + upload button */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-800">{isFirstTime ? t.welcomeTitle.replace(' 🎉', '') : t.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              {profilePic ? t.changePhoto : t.uploadPhoto}
            </button>
            <span className="text-gray-400 text-xs">{t.photoHint}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Personal Information ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-dark" />
            {t.personalInfo}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="relative">
              <User className={iconClass} />
              <input
                type="text"
                name="name"
                placeholder={t.nameLabel}
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className={iconClass} />
              <input
                type="email"
                name="email"
                placeholder={t.emailLabel}
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className={iconClass} />
              <input
                type="tel"
                name="phone"
                placeholder={t.phoneLabel}
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Age */}
            <div className="relative">
              <Calendar className={iconClass} />
              <input
                type="number"
                name="age"
                placeholder={t.ageLabel}
                value={form.age}
                onChange={handleChange}
                min="10"
                max="60"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ── Health Information ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            {t.healthInfo}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Blood Group */}
            <div className="relative">
              <Droplets className={iconClass} />
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">{t.bloodGroupLabel}</option>
                {BLOOD_GROUPS.filter(Boolean).map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Emergency Contact ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-500" />
            {t.emergencyInfo}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Emergency Name */}
            <div className="relative">
              <User className={iconClass} />
              <input
                type="text"
                name="emergencyName"
                placeholder={t.emergencyNameLabel}
                value={form.emergencyName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Emergency Phone */}
            <div className="relative">
              <Phone className={iconClass} />
              <input
                type="tel"
                name="emergencyPhone"
                placeholder={t.emergencyPhoneLabel}
                value={form.emergencyPhone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Privacy note */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">{t.privacy}</p>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl ${
            showSaved
              ? 'bg-emerald-500 text-white'
              : 'bg-primary-dark hover:bg-primary-dark/90 text-white'
          }`}
        >
          {showSaved ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {t.saved}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {isFirstTime ? t.completeProfile : t.save}
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default Profile;
