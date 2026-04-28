import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, CheckCircle, AlertTriangle, X, Search, ArrowDown } from 'lucide-react';
import { extractDocumentVitals } from '../utils/geminiService';

/**
 * Extracts medical vitals from raw text using regex pattern matching.
 * Looks for: BP (systolic/diastolic), glucose, hemoglobin, age, weight
 */
const extractVitalsFromText = (text) => {
  const result = {
    systolic: null,
    diastolic: null,
    glucose: null,
    hemoglobin: null,
    age: null,
    weight: null,
  };

  const clean = text.replace(/\s+/g, ' ');

  // Blood Pressure: various formats like "120/80", "BP: 120/80", "Blood Pressure: 120/80 mmHg"
  const bpPatterns = [
    /(?:blood\s*pressure|bp|b\.p\.?)\s*[:\-=]?\s*(\d{2,3})\s*[\/\\]\s*(\d{2,3})/i,
    /(?:systolic|sys)\s*[:\-=]?\s*(\d{2,3})[\s\S]{0,60}?(?:diastolic|dia)\s*[:\-=]?\s*(\d{2,3})/i,
    /(\d{2,3})\s*[\/\\]\s*(\d{2,3})\s*(?:mm\s*hg|mmhg)/i,
  ];
  for (const pattern of bpPatterns) {
    const match = clean.match(pattern);
    if (match) {
      const s = parseInt(match[1], 10);
      const d = parseInt(match[2], 10);
      if (s >= 60 && s <= 250 && d >= 30 && d <= 160) {
        result.systolic = s;
        result.diastolic = d;
        break;
      }
    }
  }
  // Try individual systolic/diastolic if not found together
  if (!result.systolic) {
    const sysMatch = clean.match(/(?:systolic|sys)\s*[:\-=]?\s*(\d{2,3})/i);
    if (sysMatch) { const v = parseInt(sysMatch[1], 10); if (v >= 60 && v <= 250) result.systolic = v; }
  }
  if (!result.diastolic) {
    const diaMatch = clean.match(/(?:diastolic|dia)\s*[:\-=]?\s*(\d{2,3})/i);
    if (diaMatch) { const v = parseInt(diaMatch[1], 10); if (v >= 30 && v <= 160) result.diastolic = v; }
  }

  // Blood Glucose
  const glucosePatterns = [
    /(?:blood\s*(?:sugar|glucose)|glucose|fasting\s*(?:sugar|glucose)|random\s*(?:sugar|glucose)|fbs|rbs|fasting\s*blood\s*sugar|blood\s*sugar\s*(?:fasting|random|level))\s*[:\-=]?\s*(\d{2,3}(?:\.\d{1,2})?)/i,
    /(?:glucose)\s*[:\-=]?\s*(\d{2,3}(?:\.\d{1,2})?)\s*(?:mg\s*[\/\\]\s*dl|mg\/dl)/i,
  ];
  for (const pattern of glucosePatterns) {
    const match = clean.match(pattern);
    if (match) {
      const v = parseFloat(match[1]);
      if (v >= 20 && v <= 500) { result.glucose = v; break; }
    }
  }

  // Hemoglobin
  const hbPatterns = [
    /(?:haemoglobin|hemoglobin|hb|hgb)\s*[:\-=]?\s*(\d{1,2}(?:\.\d{1,2})?)/i,
    /(?:hb|hgb)\s*[:\-=]?\s*(\d{1,2}(?:\.\d{1,2})?)\s*(?:g\s*[\/\\]\s*dl|g\/dl|gm\/dl)/i,
  ];
  for (const pattern of hbPatterns) {
    const match = clean.match(pattern);
    if (match) {
      const v = parseFloat(match[1]);
      if (v >= 3 && v <= 20) { result.hemoglobin = v; break; }
    }
  }

  // Age
  const agePatterns = [
    /(?:age|patient\s*age)\s*[:\-=]?\s*(\d{1,3})\s*(?:years?|yrs?|y)?/i,
    /(\d{1,2})\s*(?:years?\s*old|yrs?\s*old)/i,
  ];
  for (const pattern of agePatterns) {
    const match = clean.match(pattern);
    if (match) {
      const v = parseInt(match[1], 10);
      if (v >= 10 && v <= 65) { result.age = v; break; }
    }
  }

  // Weight
  const weightPatterns = [
    /(?:weight|body\s*weight|wt)\s*[:\-=]?\s*(\d{2,3}(?:\.\d{1,2})?)\s*(?:kg|kgs?)?/i,
  ];
  for (const pattern of weightPatterns) {
    const match = clean.match(pattern);
    if (match) {
      const v = parseFloat(match[1]);
      if (v >= 25 && v <= 200) { result.weight = v; break; }
    }
  }

  return result;
};

// Legacy text extractor left for manual text fallback only
const readFileAsText = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.readAsText(file);
  });
};

const FIELD_INFO = {
  systolic: { label: 'Systolic BP', unit: 'mmHg', icon: '🩺' },
  diastolic: { label: 'Diastolic BP', unit: 'mmHg', icon: '🩺' },
  glucose: { label: 'Blood Glucose', unit: 'mg/dL', icon: '🩸' },
  hemoglobin: { label: 'Hemoglobin', unit: 'g/dL', icon: '🔬' },
  age: { label: 'Age', unit: 'years', icon: '📅' },
  weight: { label: 'Weight', unit: 'kg', icon: '⚖️' },
};

const ReportUpload = ({ onDataExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [manualText, setManualText] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const processFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG/PNG), PDF, or text file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum 10 MB.');
      return;
    }
    setError('');
    setExtractedData(null);
    setNoDataFound(false);
    setShowManualInput(false);
    setSelectedFile(file);
  };

  const analyzeFile = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError('');
    setExtractedData(null);
    setNoDataFound(false);

    try {
      // Use Gemini to analyze the PDF or Image multimodally!
      const vitals = await extractDocumentVitals(selectedFile);

      const foundCount = Object.values(vitals).filter(v => v !== null && v !== undefined).length;

      if (foundCount === 0) {
        // No data found — offer manual text input
        setNoDataFound(true);
        setShowManualInput(true);
      } else {
        setExtractedData(vitals);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Could not read the file. Try pasting the report text below.');
      setShowManualInput(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeManualText = () => {
    if (!manualText.trim()) return;
    const vitals = extractVitalsFromText(manualText);
    const foundCount = Object.values(vitals).filter(v => v !== null).length;
    if (foundCount === 0) {
      setError('No medical values found in the text. Please make sure your report contains values like BP, glucose, hemoglobin, etc.');
      setNoDataFound(true);
    } else {
      setExtractedData(vitals);
      setNoDataFound(false);
      setError('');
    }
  };

  const handleFillForm = () => {
    if (!extractedData) return;
    // Only pass non-null values
    const filled = {};
    Object.entries(extractedData).forEach(([key, val]) => {
      if (val !== null) filled[key] = val;
    });
    if (onDataExtracted) onDataExtracted(filled);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setNoDataFound(false);
    setError('');
    setShowManualInput(false);
    setManualText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const foundFields = extractedData ? Object.entries(extractedData).filter(([, v]) => v !== null) : [];
  const missingFields = extractedData ? Object.entries(extractedData).filter(([, v]) => v === null) : [];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-primary-light max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <FileText className="w-6 h-6 mr-2 text-primary-dark" />
        AI Lab Report Analysis
      </h2>
      <p className="text-gray-500 mb-6">Upload your lab report and we'll scan it to automatically fill your health details below.</p>

      {/* Upload Area */}
      {!extractedData && (
        <div
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragging ? 'border-primary-dark bg-primary-light/30' : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <UploadCloud className="w-10 h-10 text-primary-dark" />
              </div>
              <p className="text-gray-700 font-medium mb-1">Drag and drop your report here</p>
              <p className="text-gray-400 text-sm mb-4">or</p>
              <label className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full cursor-pointer hover:bg-gray-50 transition shadow-sm font-medium">
                Browse Files
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf,.txt"
                  onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
                />
              </label>
              <p className="text-xs text-gray-400 mt-4">Supported: JPG, PNG, PDF, TXT (text-based reports work best)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FileText className="w-16 h-16 text-primary-dark mb-4" />
              <p className="text-gray-800 font-medium truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>

              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium"
                  disabled={isAnalyzing}
                >
                  Cancel
                </button>
                <button
                  onClick={analyzeFile}
                  disabled={isAnalyzing}
                  className="bg-primary-dark hover:bg-primary-dark/90 text-white px-6 py-2 rounded-full font-medium shadow-md transition flex items-center"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning Report...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Scan & Extract
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Text Input (fallback for images/unreadable PDFs) */}
      {showManualInput && !extractedData && (
        <div className="mt-6 fade-in">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">
                  {noDataFound ? "Couldn't extract values from this file" : 'Alternative: Paste your report text'}
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  Paste the text content of your medical report below, and we'll scan it for your vitals. Include values like BP, glucose, hemoglobin etc.
                </p>
              </div>
            </div>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={"Paste your report text here...\n\nExample:\nPatient Age: 28 years\nBlood Pressure: 130/85 mmHg\nFasting Blood Sugar: 98 mg/dL\nHemoglobin: 11.5 g/dL\nWeight: 62 kg"}
              rows={6}
              className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400 resize-none text-sm"
            />
            <button
              onClick={analyzeManualText}
              disabled={!manualText.trim()}
              className="mt-3 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-md transition flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4 mr-2" />
              Scan Text
            </button>
          </div>
        </div>
      )}

      {/* Extraction Results */}
      {extractedData && (
        <div className="mt-6 fade-in">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <h3 className="font-bold text-gray-800 text-lg">Scan Results</h3>
              </div>
              <button
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear & re-upload"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Found Values */}
            {foundFields.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">✅ Values Found ({foundFields.length})</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {foundFields.map(([key, val]) => (
                    <div key={key} className="bg-white rounded-2xl p-3 border border-emerald-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{FIELD_INFO[key]?.icon}</span>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">{FIELD_INFO[key]?.label}</p>
                          <p className="text-lg font-bold text-gray-800">
                            {val} <span className="text-xs text-gray-400 font-normal">{FIELD_INFO[key]?.unit}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Values */}
            {missingFields.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">⚠️ Not Found ({missingFields.length}) — fill manually below</p>
                <div className="flex flex-wrap gap-2">
                  {missingFields.map(([key]) => (
                    <span key={key} className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      {FIELD_INFO[key]?.icon} {FIELD_INFO[key]?.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fill Form Button */}
            <button
              onClick={handleFillForm}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <ArrowDown className="w-5 h-5" />
              Fill Form with Extracted Data
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">This will populate the assessment form below. You can review and edit before submitting.</p>
          </div>
        </div>
      )}

      {error && <p className="text-danger text-sm mt-3 text-center bg-danger/10 p-2 rounded">{error}</p>}
    </div>
  );
};

export default ReportUpload;
