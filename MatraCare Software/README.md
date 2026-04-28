# MatraCare AI

**Real-Time Maternal Risk Prediction and Decision Support System**

MatraCare AI is an offline-first maternal health platform that provides real-time pregnancy risk assessment, AI-powered insights, and decision support for patients and healthcare workers — with no backend server required for core functionality.

---

## Features

- WHO-aligned risk classification (Low / Medium / High / Critical)
- Gemini 1.5 Flash AI personalized health insights
- AI-powered medical report upload and data extraction
- 7-day predictive vitals trend analysis
- Triage Portal for healthcare workers
- Encrypted QR code patient data sharing (AES-256, offline)
- Doctor-ready PDF medical memo export
- Government scheme eligibility matcher (PMMVY, Janani Suraksha, etc.)
- AI chatbot for maternal health Q&A
- Firebase Authentication (email/password + Google OAuth)
- Firebase Firestore cloud sync with localStorage offline fallback
- Multilingual support (English, Hindi, Kannada)
- Fully responsive, mobile-first design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 1.5 Flash |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Charts | Recharts |
| PDF | jsPDF + jsPDF-AutoTable |
| QR | qrcode.react, html5-qrcode |
| Encryption | CryptoJS (AES-256) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project (see setup below)
- A Google Gemini API key

### Installation

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_GEMINI_KEY=your_gemini_api_key_here
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project named `matracare-app` (or use your existing project)
3. Enable **Authentication** → Sign-in method → **Email/Password** and **Google**
4. Enable **Firestore Database** in production mode
5. Set Firestore Security Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Run Locally

```bash
npm run dev
```

Opens at `http://localhost:5173`

---

## Project Structure

```
src/
├── components/     # React UI components (Auth, Dashboard, RiskForm, etc.)
├── context/        # AppContext — language and settings state
├── data/           # Static data (government schemes, medical context)
├── firebase/       # Firebase config, auth service, Firestore service
├── services/       # QR generation and scanner services
└── utils/          # Risk engine, storage, encryption, Gemini AI service
```

---

## Progress

See [progress.md](./progress.md) for a full development progress document.

---

## Disclaimer

MatraCare AI is a **decision-support tool** and is **not a medical diagnostic system**. All outputs should be reviewed by a qualified healthcare professional. In an emergency, please contact your local emergency services immediately.
