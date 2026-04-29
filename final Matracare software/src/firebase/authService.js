/**
 * MatraCare — Firebase Auth Service
 * Handles: email/password signup, login, logout, Google sign-in, password reset
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";
import { createUserProfile, getUserProfile } from "./firestoreService";

const googleProvider = new GoogleAuthProvider();

// ── Sign Up ─────────────────────────────────────────────────────────────────
export const signUpWithEmail = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Set display name on Firebase Auth profile
  await updateProfile(user, { displayName: name });

  // Create Firestore user profile document (non-blocking — won't fail sign-up if rules block it)
  try {
    await createUserProfile(user.uid, {
      name,
      email,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore profile creation skipped (check security rules):', err.code);
  }

  return { uid: user.uid, name, email, isNewUser: true };
};

// ── Sign In ──────────────────────────────────────────────────────────────────
export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch extended profile from Firestore (non-blocking fallback)
  let profile = null;
  try {
    profile = await getUserProfile(user.uid);
  } catch (err) {
    console.warn('Firestore profile fetch skipped (check security rules):', err.code);
  }

  return {
    uid: user.uid,
    name: profile?.name || user.displayName || 'User',
    email: user.email,
    isNewUser: false,
  };
};

// ── Google Sign-In ───────────────────────────────────────────────────────────
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if profile already exists; if not, create one (non-blocking)
  let profile = null;
  let isNewUser = false;
  try {
    profile = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, {
        name: user.displayName || 'User',
        email: user.email,
        createdAt: new Date().toISOString(),
        photoURL: user.photoURL || null,
      });
      isNewUser = true;
    }
  } catch (err) {
    console.warn('Firestore profile sync skipped (check security rules):', err.code);
    isNewUser = true; // treat as new user since we couldn't check
  }

  return {
    uid: user.uid,
    name: profile?.name || user.displayName || 'User',
    email: user.email,
    photoURL: user.photoURL || null,
    isNewUser,
  };
};

// ── Sign Out ─────────────────────────────────────────────────────────────────
export const logOut = async () => {
  await signOut(auth);
};

// ── Password Reset ───────────────────────────────────────────────────────────
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// ── Auth State Observer ──────────────────────────────────────────────────────
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
