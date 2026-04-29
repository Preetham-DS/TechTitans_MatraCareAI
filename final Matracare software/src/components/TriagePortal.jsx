import React, { useState, useEffect } from 'react';
import {
  Users, ShieldAlert, AlertTriangle, CheckCircle2, Clock,
  TrendingUp, MessageCircle, Siren, RefreshCw, Search, QrCode, Map,
  ChevronDown, ChevronUp, FileText, Activity
} from 'lucide-react';
import ScanQR from './ScanQR';

// ─────────────────────────────────────────────────────────
// MOCK PATIENT DATA 
// ─────────────────────────────────────────────────────────
const generateMockPatients = () => {
  const now = Date.now();
  const h = 3600000; // ms per hour

  return [
    {
      id: 'p1', name: 'Priya Sharma', phone: '919876543210',
      currentRisk: 'CRITICAL',
      history: [ { score: 4, ts: now - 72 * h }, { score: 6, ts: now - 30 * h }, { score: 9, ts: now - 1 * h } ],
      reason: "Severe bleeding combined with extremely high blood pressure.",
      factors: ["Severe Bleeding", "High BP (180/110)", "Fetal movement decreased"],
      recommendedAction: "Immediate dispatch of ambulance to facility. Prepare for emergency triage.",
      lastUpdated: now - 1 * h,
    },
    {
      id: 'p2', name: 'Ananya Reddy', phone: '919876543211',
      currentRisk: 'HIGH',
      history: [ { score: 2, ts: now - 90 * h }, { score: 4, ts: now - 40 * h }, { score: 7, ts: now - 2 * h } ],
      reason: "High blood pressure and persistent dizziness detected.",
      factors: ["High BP (150/95)", "Dizziness", "History of preeclampsia"],
      recommendedAction: "Urgent checkup within 24 hours. Monitor blood pressure closely.",
      lastUpdated: now - 2 * h,
    },
    {
      id: 'p3', name: 'Deepa Patel', phone: '919876543213',
      currentRisk: 'MEDIUM',
      history: [ { score: 2, ts: now - 45 * h }, { score: 4, ts: now - 6 * h } ],
      reason: "Mild swelling in legs and slight fatigue.",
      factors: ["Mild Edema", "Fatigue"],
      recommendedAction: "Advise rest and elevation of legs. Follow up in 3 days.",
      lastUpdated: now - 6 * h,
    },
    {
      id: 'p4', name: 'Meena Iyer', phone: '919876543215',
      currentRisk: 'LOW',
      history: [ { score: 1, ts: now - 50 * h }, { score: 1, ts: now - 12 * h } ],
      reason: "No critical symptoms. Vitals are stable.",
      factors: ["Normal BP (120/80)", "Normal fetal movement"],
      recommendedAction: "Continue regular routine checkups and prenatal vitamins.",
      lastUpdated: now - 12 * h,
    },
    {
      id: 'p5', name: 'Kavitha Menon', phone: '919876543216',
      currentRisk: 'HIGH',
      history: [ { score: 6, ts: now - 48 * h }, { score: 7, ts: now - 3 * h } ],
      reason: "Gestational diabetes with uncontrolled blood sugar spikes.",
      factors: ["High Fasting Glucose", "Blurred Vision"],
      recommendedAction: "Consult endocrinologist immediately. Adjust insulin dosage.",
      lastUpdated: now - 3 * h,
    },
    {
      id: 'p6', name: 'Rani Desai', phone: '919876543217',
      currentRisk: 'MEDIUM',
      history: [ { score: 3, ts: now - 36 * h }, { score: 4, ts: now - 10 * h } ],
      reason: "Moderate abdominal cramping, no bleeding.",
      factors: ["Abdominal cramps", "Dehydration"],
      recommendedAction: "Increase oral fluid intake. Monitor for 24 hours.",
      lastUpdated: now - 10 * h,
    },
    {
      id: 'p7', name: 'Shalini Kumar', phone: '919876543219',
      currentRisk: 'CRITICAL',
      history: [ { score: 5, ts: now - 24 * h }, { score: 8, ts: now - 15 * h }, { score: 10, ts: now - 0.5 * h } ],
      reason: "Water broke early with suspected infection and high fever.",
      factors: ["Premature Rupture of Membranes", "Fever (102°F)", "Tachycardia"],
      recommendedAction: "Admit to emergency hospital wing immediately. Start IV antibiotics.",
      lastUpdated: now - 30 * 60000, // 30 mins ago
    },
    {
      id: 'p8', name: 'Amrita Ghosh', phone: '919876543223',
      currentRisk: 'LOW',
      history: [ { score: 1, ts: now - 55 * h }, { score: 1, ts: now - 20 * h } ],
      reason: "Healthy pregnancy progression.",
      factors: ["Good weight gain", "Active fetal movement"],
      recommendedAction: "Next standard ultrasound in 2 weeks.",
      lastUpdated: now - 20 * h,
    }
  ];
};

// ─────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────
const RISK_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

/**
 * Determine if the patient's risk score increased significantly recently.
 */
const hasHighRiskVelocity = (patient) => {
  if (!patient.history || patient.history.length < 2) return false;
  const recent = patient.history[patient.history.length - 1];
  const previous = patient.history[patient.history.length - 2];
  
  const within48h = (Date.now() - previous.ts) <= 48 * 3600000;
  if (!within48h || previous.score === 0) return false;
  
  const pctIncrease = ((recent.score - previous.score) / previous.score) * 100;
  return pctIncrease > 20;
};

const triageSort = (patients) => {
  return [...patients].sort((a, b) => {
    const riskDiff = RISK_ORDER[a.currentRisk] - RISK_ORDER[b.currentRisk];
    if (riskDiff !== 0) return riskDiff;
    const aVelocity = hasHighRiskVelocity(a) ? 0 : 1;
    const bVelocity = hasHighRiskVelocity(b) ? 0 : 1;
    return aVelocity - bVelocity;
  });
};

const formatTimeAgo = (ts) => {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
};

// ─────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────
const RiskBadge = ({ level, animate = false }) => {
  const styles = {
    CRITICAL: `bg-red-100 text-red-700 border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.5)] ${animate ? 'animate-pulse' : ''}`,
    HIGH:     'bg-orange-100 text-orange-700 border-orange-200',
    MEDIUM:   'bg-yellow-100 text-yellow-700 border-yellow-200',
    LOW:      'bg-green-100  text-green-700  border-green-200',
  };
  const icons = {
    CRITICAL: <ShieldAlert className="w-3.5 h-3.5" />,
    HIGH:     <AlertTriangle className="w-3.5 h-3.5" />,
    MEDIUM:   <AlertTriangle className="w-3.5 h-3.5" />,
    LOW:      <CheckCircle2 className="w-3.5 h-3.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[level]}`}>
      {icons[level]} {level}
    </span>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
const TriagePortal = ({ onBack }) => {
  const [patients, setPatients]       = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sosPatient, setSosPatient]   = useState(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [auditLog, setAuditLog]       = useState([]);
  const [expandedId, setExpandedId]   = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPatients(triageSort(generateMockPatients()));
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPatients(triageSort(generateMockPatients()));
      setIsLoading(false);
    }, 700);
  };

  const handleSOS = (patient) => {
    setSosPatient(patient);
    setTimeout(() => setSosPatient(null), 5000);
  };

  const handleScanSuccess = (scannedData) => {
    setShowScanner(false);
    const newLog = {
      time: new Date().toLocaleTimeString(),
      risk: scannedData.risk.level,
      action: "QR Scanned"
    };
    setAuditLog([newLog, ...auditLog]);

    const newPatient = {
      id: 'scanned_' + Date.now(),
      name: 'Anonymous (Scanned)',
      phone: 'N/A',
      currentRisk: scannedData.risk.level,
      history: [{ score: scannedData.risk.score, ts: Date.now() }],
      reason: "Data extracted from recent offline QR scan.",
      factors: ["Recent Scan Data"],
      recommendedAction: scannedData.risk.level === 'CRITICAL' || scannedData.risk.level === 'HIGH' 
        ? "Immediate follow-up required based on scanned vitals." 
        : "Standard monitoring.",
      lastUpdated: Date.now()
    };

    setPatients(triageSort([newPatient, ...patients]));
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const counts = patients.reduce((acc, p) => {
    acc[p.currentRisk] = (acc[p.currentRisk] || 0) + 1;
    return acc;
  }, {});

  const criticalCount = counts['CRITICAL'] || 0;
  const highCount = counts['HIGH'] || 0;
  const communityRiskLevel = (criticalCount + highCount) > 2 ? 'HIGH' : 'LOW';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-red-100 p-2 rounded-xl">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">Intelligent Triage Portal</h2>
          </div>
          <p className="text-gray-500 ml-1">AI-assisted prioritised view of community maternal health.</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button onClick={() => setShowScanner(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all">
            <QrCode className="w-4 h-4" /> Scan Patient QR
          </button>
          <button onClick={handleRefresh} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={onBack} className="px-5 py-2.5 rounded-full font-bold text-white bg-primary-dark hover:bg-primary-dark/90 shadow-md transition-all">
            ← Back
          </button>
        </div>
      </div>

      {/* SOS Notification Banner */}
      {sosPatient && (
        <div className="mb-6 bg-red-600 text-white p-4 rounded-2xl flex items-center gap-4 fade-in shadow-xl border border-red-500">
          <div className="bg-white/20 p-3 rounded-full animate-pulse">
            <Siren className="w-8 h-8" />
          </div>
          <div>
            <p className="font-bold text-xl uppercase tracking-wider">Emergency SOS Triggered!</p>
            <p className="text-sm mt-1 text-red-50">Immediate attention requested for <span className="font-bold text-white">{sosPatient.name}</span>. Ambulance and nearest facility have been pinged.</p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Critical', count: counts['CRITICAL'] || 0, color: 'bg-red-50 border-red-200 text-red-700 shadow-[0_0_15px_rgba(239,68,68,0.2)]' },
          { label: 'High',     count: counts['HIGH']     || 0, color: 'bg-orange-50 border-orange-200 text-orange-700' },
          { label: 'Medium',   count: counts['MEDIUM']   || 0, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: 'Low',      count: counts['LOW']      || 0, color: 'bg-green-50 border-green-200 text-green-700' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-2xl p-4 border ${color} flex items-center gap-3 transition-transform hover:scale-105`}>
            <p className="text-3xl font-black">{count}</p>
            <p className="font-semibold text-sm">{label} Risk</p>
          </div>
        ))}
      </div>

      {/* Community Risk Heatmap & Audit Log */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-center ${communityRiskLevel === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Map className="w-5 h-5" /> Dynamic Community Heatmap
            </h3>
            <div className={`px-4 py-1.5 rounded-full font-black text-sm border tracking-widest uppercase ${communityRiskLevel === 'HIGH' ? 'bg-red-100 text-red-700 border-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-green-100 text-green-700 border-green-300'}`}>
              {communityRiskLevel} RISK
            </div>
          </div>
          <p className="text-gray-700 font-medium bg-white/50 p-3 rounded-xl text-sm border border-black/5 mt-2">
            Community risk is currently <strong className={communityRiskLevel === 'HIGH' ? 'text-red-600' : 'text-green-600'}>{communityRiskLevel}</strong> due to {criticalCount} critical and {highCount} high-risk patients requiring monitoring.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 mb-3 text-sm tracking-wider uppercase text-gray-500">Recent Activity (Audit Log)</h3>
          <div className="flex-grow">
            {auditLog.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400 italic">No recent QR scans recorded in this session.</div>
            ) : (
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {auditLog.map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700">{log.action}</span>
                    <div className="flex items-center gap-3 text-gray-500">
                      <span>Risk: <RiskBadge level={log.risk} /></span>
                      <span className="text-xs">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patient by name or symptom..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-dark outline-none bg-white shadow-sm font-medium"
        />
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200 text-xs font-extrabold text-gray-600 uppercase tracking-wider">
          <div className="col-span-3">Patient & Reason</div>
          <div className="col-span-2 text-center">Risk Level</div>
          <div className="col-span-2 text-center">Trend / Velocity</div>
          <div className="col-span-2 text-center">Last Updated</div>
          <div className="col-span-3 text-center">Actions</div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <RefreshCw className="w-10 h-10 animate-spin mb-4 text-primary-dark" />
            <span className="font-bold text-lg">Analyzing patient data...</span>
            <span className="text-sm text-gray-400 mt-1">Applying condition-based logic rules</span>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-16 text-gray-500 font-medium">No patients found matching your search.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => {
              const velocity = hasHighRiskVelocity(patient);
              const isCritical = patient.currentRisk === 'CRITICAL';
              const isExpanded = expandedId === patient.id;

              return (
                <div key={patient.id} className={`transition-colors ${isCritical ? 'bg-red-50/30' : 'hover:bg-gray-50/50'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5">
                    
                    {/* Patient Name & Short Reason */}
                    <div className="col-span-3 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary-dark text-sm flex-shrink-0 shadow-sm mt-1">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">{patient.name}</p>
                          {isCritical && <span className="flex w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5" title="Assessment based on symptoms & history.">
                          {patient.reason}
                        </p>
                      </div>
                    </div>

                    {/* Risk Badge */}
                    <div className="col-span-2 flex md:justify-center">
                      <RiskBadge level={patient.currentRisk} animate={isCritical} />
                    </div>

                    {/* Trend / Velocity */}
                    <div className="col-span-2 flex md:justify-center">
                      {velocity ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm">
                          <TrendingUp className="w-3.5 h-3.5" /> Worsening
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <Activity className="w-3 h-3" /> Stable
                        </span>
                      )}
                    </div>

                    {/* Last Updated */}
                    <div className="col-span-2 flex md:justify-center items-center gap-1.5 text-gray-500 text-sm font-medium">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {formatTimeAgo(patient.lastUpdated)}
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 flex gap-2 md:justify-end flex-wrap">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : patient.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {isExpanded ? 'Hide' : 'Details'}
                      </button>
                      
                      {patient.currentRisk !== 'LOW' && (
                        <button
                          onClick={() => handleSOS(patient)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-sm"
                        >
                          <Siren className="w-3.5 h-3.5" /> Alert
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Details Section (Explainable AI) */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 fade-in">
                      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <h4 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                          <FileText className="w-4 h-4 text-primary-dark" /> Diagnostic Reasoning
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Reason for Risk Level</p>
                            <p className="text-gray-800 font-medium text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                              {patient.reason}
                            </p>
                            
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1 mt-4">Identified Factors</p>
                            <div className="flex flex-wrap gap-2">
                              {patient.factors.map((f, i) => (
                                <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-lg text-xs font-bold">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Recommended Action</p>
                            <div className={`p-4 rounded-xl text-sm font-semibold border ${isCritical ? 'bg-red-50 text-red-800 border-red-200' : patient.currentRisk === 'HIGH' ? 'bg-orange-50 text-orange-800 border-orange-200' : patient.currentRisk === 'MEDIUM' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
                              {patient.recommendedAction}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 font-medium">
        Intelligent Triage Engine • Patients are sorted by clinical severity, then by worsening velocity. Raw risk scores are analyzed but hidden to prevent misinterpretation.
      </p>

      {showScanner && <ScanQR onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess} />}
    </div>
  );
};

export default TriagePortal;
