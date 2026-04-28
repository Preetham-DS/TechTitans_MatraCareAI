# MatraCare AI – Progress Document

## Project Title
MatraCare AI: Real-Time Maternal Risk Prediction and Decision Support System

---

## Problem Understanding

- Identified maternal mortality as a major issue due to delayed detection of high-risk pregnancies
- Focused on lack of real-time decision support in low-resource environments
- Defined need for early risk prediction and actionable guidance
- Recognized the gap in offline-capable tools for rural healthcare workers

---

## Idea Finalization

- Selected maternal risk prediction as the core problem
- Defined system as a decision-support tool (not a diagnostic system)
- Finalized key inputs:
  - Age
  - Blood pressure (systolic / diastolic)
  - Blood glucose level
  - Symptoms (headache, swelling, bleeding, etc.)
  - Pregnancy history and week
  - Habits (iron tablet compliance, ANC visits)
- Added explainable AI (XAI) output so users understand why a risk level was assigned

---

## UI/UX Development

- Built frontend using React 19 + Vite 8
- Styled with Tailwind CSS v4 — responsive, mobile-first design
- Designed and implemented:
  - Landing page (Hero section with CTA)
  - Maternal data input form (RiskForm)
  - Risk result screen with level and score
  - Dashboard with assessment history and vitals chart
  - User profile page with photo upload
  - Triage Portal for healthcare workers
  - Emergency Alert overlay for High/Critical risk

- Added visual elements:
  - Color-coded risk indicators (Low / Medium / High / Critical)
  - Recharts vitals trend graph with 7-day forecast line
  - Card-based layout for readability
  - Trust badge and disclaimer section

- Improved UI with:
  - Fade-in animations and micro-interactions
  - Glassmorphism-inspired card styles
  - Responsive layout for mobile, tablet, and desktop
  - Multilingual support (English, Hindi, Kannada)

---

## Feature Implementation

### Completed Features

- User input form for maternal health data
- WHO-aligned risk classification engine (Low / Medium / High / Critical)
- Risk score generation with explanations
- Explainable AI (XAI) — per-flag reasoning surfaced to users
- Gemini 1.5 Flash AI integration for personalized health insights
- AI-powered medical report upload and data extraction (PDF/image OCR)
- Predictive trend analysis (7-day vitals forecast)
- Iron tablet compliance alert after 3 consecutive missed entries
- Emergency Alert overlay for critical risk levels
- Triage Portal for healthcare workers with patient queue management
- QR code generation for encrypted offline patient data sharing (AES-256)
- QR code scanner for receiving patient data
- Doctor-ready medical memo (PDF export via jsPDF)
- Government scheme matcher (PMMVY, Janani Suraksha, etc.)
- Voice assistant integration
- AI chatbot (Gemini-powered) for maternal health Q&A
- Offline-first mode: full localStorage fallback when network is unavailable
- Offline banner indicator for connectivity status
- Firebase Authentication (email/password + Google OAuth)
- Firebase Firestore database for cloud-synced assessment history and profiles
- User profile with photo upload (drag-and-drop)
- Dashboard with assessment filter, summary stats, and risk history
- Session persistence — auth state survives page refresh

### Architecture Decisions

- Offline-first: every Firestore call has a localStorage fallback
- Auth is resilient — app works without Firestore (rules permitting)
- QR bridge uses AES-256 + LZ compression for secure, compact data transfer
- Risk engine is fully client-side — no backend required for core functionality

---

## Backend & Logic Development

- Core risk engine implemented client-side in JavaScript (no server required)
- Rule-based logic with weighted scoring:
  - High blood pressure → elevated risk
  - High blood sugar → elevated risk
  - Previous complications → elevated risk
  - Danger symptoms (seizures, heavy bleeding) → automatic High/Critical flag
- Gemini 1.5 Flash used for:
  - Personalized clinical insight generation
  - Medical report OCR and data extraction
  - AI chatbot responses
- Firebase Firestore used for:
  - Cloud-synced user profiles
  - Assessment history (sub-collection per user)
  - Patient form entries
- Firebase Authentication for:
  - Email/password sign-up and sign-in
  - Google OAuth (one-click sign-in)
  - Password reset via email
  - Persistent sessions via onAuthStateChanged observer

---

## Integration Status

- Frontend: Completed and running locally at `http://localhost:5174`
- Firebase Auth: Integrated and functional (email + Google)
- Firestore: Integrated with offline localStorage fallback
- Gemini AI: Integrated (requires VITE_GEMINI_KEY environment variable)
- Data flow:
  - User Input → Risk Engine (client-side) → Risk Result + Gemini Insight → Firestore + localStorage

---

## Repository Setup

- Project structured as a Vite + React application
- Organized directory structure:
  ```
  src/
  ├── components/     # All React UI components
  ├── context/        # AppContext (language, settings)
  ├── data/           # Static data (schemes, medical context)
  ├── firebase/       # Firebase config, auth service, Firestore service
  ├── services/       # QR generation and scan services
  └── utils/          # Risk engine, storage, encryption, Gemini service
  ```
- `.gitignore` includes `node_modules/`, `dist/`, `.env`
- Environment variables stored in `.env` (not committed)

---

## Environment Variables Required

```
VITE_GEMINI_KEY=your_gemini_api_key_here
```

---

## Current Status

- Fully functional frontend prototype with Firebase backend integration
- All core features implemented and tested
- Auth working: email/password sign-up, sign-in, Google OAuth, password reset
- Firestore sync working for profiles and assessment history
- Offline fallback verified — app works without internet
- Risk engine, Gemini AI insights, and Triage Portal operational

---

## Next Steps

- Set Firestore security rules (allow read/write per authenticated user)
- Enable Email/Password and Google providers in Firebase Console
- Add push notifications for high-risk alerts
- Integrate government API for real-time scheme eligibility
- Deploy to Firebase Hosting or Vercel
- Conduct user testing with healthcare workers
- Optimize for low-end Android devices (PWA support)
- Prepare final demo and video walkthrough

---

## Challenges Faced

- Designing effective risk logic within limited time
- Managing project size and Firebase SDK bundle size
- Ensuring Firestore security rules don't block auth flow (fixed with non-blocking pattern)
- Balancing offline-first design with cloud sync
- Implementing AES-256 QR bridge within browser without a server
- Handling multilingual content across all components

---

## Summary

The project has progressed from initial idea validation to a fully functional, Firebase-backed maternal health platform. The system includes real-time risk prediction, AI-powered insights via Gemini, encrypted offline QR data sharing, a Triage Portal for healthcare workers, and cloud-synced user profiles and history. The current focus is on Firestore security rules, production deployment, and field testing.
