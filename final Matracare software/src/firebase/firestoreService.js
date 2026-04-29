/**
 * MatraCare — Firestore Service
 * Handles: user profiles, risk assessments, patient entries
 */
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./config";

// ════════════════════════════════════════════════════════════════════════════
// USER PROFILES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Create a new user profile document in Firestore.
 */
export const createUserProfile = async (uid, profileData) => {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get a user's profile from Firestore.
 */
export const getUserProfile = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

/**
 * Update a user's profile fields in Firestore.
 */
export const updateUserProfile = async (uid, updates) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// ════════════════════════════════════════════════════════════════════════════
// RISK ASSESSMENTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Save a risk assessment result for a user.
 * Returns the Firestore document ID.
 */
export const saveRiskAssessment = async (uid, assessmentData) => {
  const ref = collection(db, "users", uid, "assessments");
  const docRef = await addDoc(ref, {
    ...assessmentData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Get all risk assessments for a user, ordered by most recent first.
 */
export const getRiskAssessments = async (uid) => {
  try {
    const ref = collection(db, "users", uid, "assessments");
    const q = query(ref, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      // Convert Firestore Timestamp → ISO string for compatibility
      timestamp: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn("getRiskAssessments error:", err);
    return [];
  }
};

/**
 * Delete a specific assessment by ID.
 */
export const deleteAssessment = async (uid, assessmentId) => {
  const ref = doc(db, "users", uid, "assessments", assessmentId);
  await deleteDoc(ref);
};

// ════════════════════════════════════════════════════════════════════════════
// PATIENT ENTRIES (vitals / form submissions)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Save a full patient form entry (vitals, habits, etc.)
 */
export const savePatientEntry = async (uid, entryData) => {
  const ref = collection(db, "users", uid, "entries");
  const docRef = await addDoc(ref, {
    ...entryData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Get all patient entries for a user, ordered by most recent first.
 */
export const getPatientEntries = async (uid) => {
  try {
    const ref = collection(db, "users", uid, "entries");
    const q = query(ref, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn("getPatientEntries error:", err);
    return [];
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ALERTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Save an emergency/triage alert.
 */
export const saveAlert = async (uid, alertData) => {
  const ref = collection(db, "users", uid, "alerts");
  await addDoc(ref, {
    ...alertData,
    createdAt: serverTimestamp(),
  });
};
