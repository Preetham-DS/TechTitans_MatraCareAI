import { jsPDF } from "jspdf";
import "jspdf-autotable";

const STORAGE_KEY = 'matracare_user_data';
const FORM_DRAFT_KEY = 'matracare_form_draft';

const getInitialData = () => ({
  entries: [],
  riskHistory: [],
  alerts: []
});

export const loadPatientData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getInitialData();
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return getInitialData();
  }
};

export const savePatientData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const addEntry = (entry) => {
  const data = loadPatientData();
  const newEntry = { ...entry, id: Date.now(), timestamp: new Date().toISOString() };
  data.entries.push(newEntry);
  savePatientData(data);
  return newEntry;
};

export const addRiskHistory = (riskResult) => {
  const data = loadPatientData();
  const newHistory = { ...riskResult, id: Date.now(), timestamp: new Date().toISOString() };
  data.riskHistory.push(newHistory);
  savePatientData(data);
  return newHistory;
};

export const clearPatientData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Save the last form draft so users can resume after offline/refresh.
 */
export const saveLastFormInput = (formData) => {
  try {
    localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(formData));
  } catch {
    /* ignore */
  }
};

/**
 * Load the last saved form draft.
 * @returns {object|null}
 */
export const loadLastFormInput = () => {
  try {
    const raw = localStorage.getItem(FORM_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Phase 5: Checks if the patient missed taking their iron tablet for the last N consecutive entries.
 * @param {number} N - Number of consecutive missed days to trigger the alert (default 3)
 * @returns {boolean} true if iron compliance alert should fire
 */
export const checkIronCompliance = (N = 3) => {
  const data = loadPatientData();
  const entries = data.entries || [];
  if (entries.length < N) return false;

  const lastN = entries.slice(-N);
  // Every one of the last N entries must have explicitly answered "No" (false) to iron tablet
  return lastN.every(e => e.habits && e.habits.ironTablet === false);
};

export const saveEntry = (data, result) => {
  const patientData = loadPatientData();
  const entry = {
    ...data,
    result,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  patientData.entries.push(entry);
  patientData.riskHistory.push(entry); // storing both for backward compatibility
  savePatientData(patientData);
  return entry;
};

export const getHistory = () => {
  return loadPatientData().entries;
};

export const deleteHistory = () => {
  clearPatientData();
};

export const generateMedicalPDF = (history) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("MatraCare Doctor-Ready Brief", 14, 22);
  
  doc.setFontSize(12);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 32);

  // Filter last 6 entries
  const recentHistory = history.slice(-6);

  const tableColumn = ["Date", "Cycle Length", "Pain Level", "Symptoms", "Risk Level"];
  const tableRows = [];

  recentHistory.forEach(entry => {
    const rowData = [
      new Date(entry.timestamp).toLocaleDateString(),
      entry.cycleLength || "N/A",
      entry.painLevel || "N/A",
      (entry.symptoms || []).join(", "),
      entry.result?.level || "N/A"
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
  });

  doc.save("MatraCare_Doctor_Brief.pdf");
};
