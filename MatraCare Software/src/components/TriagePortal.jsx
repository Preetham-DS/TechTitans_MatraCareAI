import React, { useState, useEffect } from 'react';
import {
  Users, ShieldAlert, AlertTriangle, CheckCircle2, Clock,
  TrendingUp, MessageCircle, Siren, RefreshCw, Search, QrCode, Map
} from 'lucide-react';
import ScanQR from './ScanQR';

// ─────────────────────────────────────────────────────────
// MOCK PATIENT DATA (replace getDocs(collection(db,'assessments'))
// with this array once Firebase is connected)
// ─────────────────────────────────────────────────────────
const generateMockPatients = () => {
  const now = Date.now();
  const h = 3600000; // ms per hour

  return [
    {
      id: 'p1', name: 'Priya Sharma',    phone: '919876543210',
      currentRisk: 'CRITICAL', currentScore: 9,
      prevScore: 6,    prevTimestamp: now - 30 * h,
      lastUpdated: now - 1 * h,
    },
    {
      id: 'p2', name: 'Ananya Reddy',   phone: '919876543211',
      currentRisk: 'HIGH',     currentScore: 7,
      prevScore: 4,    prevTimestamp: now - 40 * h,
      lastUpdated: now - 2 * h,
    },
    {
      id: 'p3', name: 'Lakshmi Nair',   phone: '919876543212',
      currentRisk: 'HIGH',     currentScore: 6,
      prevScore: 5.8,  prevTimestamp: now - 20 * h,
      lastUpdated: now - 4 * h,
    },
    {
      id: 'p4', name: 'Deepa Patel',    phone: '919876543213',
      currentRisk: 'MEDIUM',   currentScore: 4,
      prevScore: 2,    prevTimestamp: now - 45 * h,
      lastUpdated: now - 6 * h,
    },
    {
      id: 'p5', name: 'Sunita Rao',     phone: '919876543214',
      currentRisk: 'MEDIUM',   currentScore: 3,
      prevScore: 2.8,  prevTimestamp: now - 25 * h,
      lastUpdated: now - 8 * h,
    },
    {
      id: 'p6', name: 'Meena Iyer',     phone: '919876543215',
      currentRisk: 'LOW',      currentScore: 1,
      prevScore: 1,    prevTimestamp: now - 50 * h,
      lastUpdated: now - 12 * h,
    },
    {
      id: 'p7', name: 'Kavitha Menon',  phone: '919876543216',
      currentRisk: 'HIGH',     currentScore: 7,
      prevScore: 7,    prevTimestamp: now - 48 * h,
      lastUpdated: now - 3 * h,
    },
    {
      id: 'p8', name: 'Rani Desai',     phone: '919876543217',
      currentRisk: 'MEDIUM',   currentScore: 4,
      prevScore: 3,    prevTimestamp: now - 36 * h,
      lastUpdated: now - 10 * h,
    },
    {
      id: 'p9', name: 'Geeta Kulkarni', phone: '919876543218',
      currentRisk: 'LOW',      currentScore: 2,
      prevScore: 2,    prevTimestamp: now - 60 * h,
      lastUpdated: now - 24 * h,
    },
    {
      id: 'p10', name: 'Shalini Kumar', phone: '919876543219',
      currentRisk: 'CRITICAL',  currentScore: 10,
      prevScore: 8,   prevTimestamp: now - 15 * h,
      lastUpdated: now - 30,
    },
    {
      id: 'p11', name: 'Bhavana Singh', phone: '919876543220',
      currentRisk: 'LOW',      currentScore: 1,
      prevScore: 1,    prevTimestamp: now - 72 * h,
      lastUpdated: now - 48 * h,
    },
    {
      id: 'p12', name: 'Nirmala Verma', phone: '919876543221',
      currentRisk: 'MEDIUM',   currentScore: 5,
      prevScore: 2,    prevTimestamp: now - 46 * h,
      lastUpdated: now - 5 * h,
    },
    {
      id: 'p13', name: 'Pooja Joshi',   phone: '919876543222',
      currentRisk: 'HIGH',     currentScore: 6,
      prevScore: 5,    prevTimestamp: now - 38 * h,
      lastUpdated: now - 7 * h,
    },
    {
      id: 'p14', name: 'Amrita Ghosh',  phone: '919876543223',
      currentRisk: 'LOW',      currentScore: 2,
      prevScore: 1,    prevTimestamp: now - 55 * h,
      lastUpdated: now - 20 * h,
    },
    {
      id: 'p15', name: 'Usha Pillai',   phone: '919876543224',
      currentRisk: 'MEDIUM',   currentScore: 4,
      prevScore: 3,    prevTimestamp: now - 47 * h,
      lastUpdated: now - 9 * h,
    },
  ];
};

// ─────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────
const RISK_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

/**
 * Determine if the patient's risk score increased by >20% in the last 48 hours.
 */
const hasHighRiskVelocity = (patient) => {
  const within48h = (Date.now() - patient.prevTimestamp) <= 48 * 3600000;
  if (!within48h || patient.prevScore === 0) return false;
  const pctIncrease = ((patient.currentScore - patient.prevScore) / patient.prevScore) * 100;
  return pctIncrease > 20;
};

/**
 * Intelligent dual-priority sort:
 * 1. Risk level (CRITICAL first)
 * 2. Within same level, high-velocity patients come first
 */
const triageSort = (patients) => {
  return [...patients].sort((a, b) => {
    const riskDiff = RISK_ORDER[a.currentRisk] - RISK_ORDER[b.currentRisk];
    if (riskDiff !== 0) return riskDiff;
    // Same risk level — velocity wins
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
const RiskBadge = ({ level }) => {
  const styles = {
    CRITICAL: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
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
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${styles[level]}`}>
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

  // Simulate async Firestore fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const sorted = triageSort(generateMockPatients());
      setPatients(sorted);
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const sorted = triageSort(generateMockPatients());
      setPatients(sorted);
      setIsLoading(false);
    }, 700);
  };

  const handleSOS = (patient) => {
    setSosPatient(patient);
    console.log(`[EMERGENCY SOS] Patient: ${patient.name} | Phone: +${patient.phone}`);
    setTimeout(() => setSosPatient(null), 4000);
  };

  const handleScanSuccess = (scannedData) => {
    setShowScanner(false);
    
    // Add to audit log (Feature 8)
    const newLog = {
      time: new Date().toLocaleTimeString(),
      risk: scannedData.risk.level,
      action: "QR Scanned"
    };
    setAuditLog([newLog, ...auditLog]);

    // Create a mock patient from scanned data
    const newPatient = {
      id: 'scanned_' + Date.now(),
      name: 'Anonymous (Scanned)',
      phone: 'N/A',
      currentRisk: scannedData.risk.level,
      currentScore: scannedData.risk.score,
      prevScore: 0,
      prevTimestamp: Date.now(),
      lastUpdated: Date.now()
    };

    setPatients(triageSort([newPatient, ...patients]));
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Summary counts
  const counts = patients.reduce((acc, p) => {
    acc[p.currentRisk] = (acc[p.currentRisk] || 0) + 1;
    return acc;
  }, {});

  // Feature 9: Community Risk Heatmap Logic
  const highRiskCount = (counts['CRITICAL'] || 0) + (counts['HIGH'] || 0);
  const communityRiskLevel = highRiskCount > 2 ? 'HIGH' : 'LOW';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-red-100 p-2 rounded-xl">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">Community Triage Portal</h2>
          </div>
          <p className="text-gray-500 ml-1">Prioritised view of all registered maternal patients.</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
          >
            <QrCode className="w-4 h-4" />
            Scan Patient QR
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-full font-bold text-white bg-primary-dark hover:bg-primary-dark/90 shadow-md transition-all"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* SOS Notification Banner */}
      {sosPatient && (
        <div className="mb-6 bg-red-600 text-white p-4 rounded-2xl flex items-center gap-3 fade-in shadow-lg">
          <Siren className="w-6 h-6 animate-bounce flex-shrink-0" />
          <div>
            <p className="font-bold">Emergency SOS Triggered!</p>
            <p className="text-sm opacity-90">Alert sent for {sosPatient.name} (+{sosPatient.phone}). Emergency contacts and nearby facilities are being notified.</p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Critical', count: counts['CRITICAL'] || 0, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'High',     count: counts['HIGH']     || 0, color: 'bg-orange-50 border-orange-200 text-orange-700' },
          { label: 'Medium',   count: counts['MEDIUM']   || 0, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: 'Low',      count: counts['LOW']      || 0, color: 'bg-green-50 border-green-200 text-green-700' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-2xl p-4 border ${color} flex items-center gap-3 shadow-sm`}>
            <p className="text-3xl font-black">{count}</p>
            <p className="font-semibold text-sm">{label} Risk</p>
          </div>
        ))}
      </div>

      {/* Community Risk Heatmap & Audit Log */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-3xl border shadow-sm flex items-center justify-between ${communityRiskLevel === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div>
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-1">
              <Map className="w-5 h-5" /> Community Risk Heatmap
            </h3>
            <p className="text-sm text-gray-600">Based on recent patient scans and aggregate data.</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-black text-xl border ${communityRiskLevel === 'HIGH' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
            {communityRiskLevel}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 text-sm tracking-wider uppercase text-gray-500">Recent Activity (Audit Log)</h3>
          {auditLog.length === 0 ? (
            <p className="text-sm text-gray-400">No recent QR scans recorded in this session.</p>
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

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patient by name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-dark outline-none bg-white shadow-sm"
        />
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Patient</div>
          <div className="col-span-2 text-center">Risk Level</div>
          <div className="col-span-2 text-center">Velocity</div>
          <div className="col-span-2 text-center">Last Updated</div>
          <div className="col-span-3 text-center">Quick Actions</div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mr-3" />
            <span className="font-medium">Loading patient records...</span>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No patients found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredPatients.map((patient, idx) => {
              const velocity = hasHighRiskVelocity(patient);
              return (
                <div
                  key={patient.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 transition-colors hover:bg-gray-50/80 ${patient.currentRisk === 'CRITICAL' ? 'bg-red-50/40' : ''}`}
                >
                  {/* Name + Score */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary-dark text-sm flex-shrink-0">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{patient.name}</p>
                      <p className="text-xs text-gray-400">Score: {patient.currentScore}</p>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <div className="col-span-2 flex md:justify-center">
                    <RiskBadge level={patient.currentRisk} />
                  </div>

                  {/* Risk Velocity */}
                  <div className="col-span-2 flex md:justify-center">
                    {velocity ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                        <TrendingUp className="w-3.5 h-3.5" /> High Velocity
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs font-medium">Stable</span>
                    )}
                  </div>

                  {/* Last Updated */}
                  <div className="col-span-2 flex md:justify-center items-center gap-1.5 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {formatTimeAgo(patient.lastUpdated)}
                  </div>

                  {/* Quick Actions */}
                  <div className="col-span-3 flex gap-2 md:justify-center flex-wrap">
                    <a
                      href={`https://wa.me/${patient.phone}?text=Hello%20${encodeURIComponent(patient.name)}%2C%20your%20MatraCare%20health%20worker%20is%20checking%20in.%20Please%20provide%20an%20update%20on%20your%20condition.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <button
                      onClick={() => handleSOS(patient)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <Siren className="w-3.5 h-3.5" />
                      SOS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Patients are sorted by risk severity, then by risk velocity (fastest-worsening first). Data refreshed on load.
      </p>

      {showScanner && <ScanQR onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess} />}
    </div>
  );
};

export default TriagePortal;
