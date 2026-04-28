import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, RefreshCw, ShieldCheck, FileBadge } from 'lucide-react';
import { generatePatientQRData } from '../services/qrService';

const GenerateQR = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('SHARE'); // SHARE | ID
  const [consentLevel, setConsentLevel] = useState('FULL'); // FULL | RISK_ONLY | SYMPTOMS_ONLY
  const [qrData, setQrData] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [error, setError] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  const generateNewQR = () => {
    const data = generatePatientQRData(consentLevel);
    if (!data) {
      setError("No health data available to share. Please complete an assessment first.");
    } else {
      setQrData(data);
      setTimeLeft(300); // Reset to 5 mins
      setError('');
      setIsGenerated(true);
    }
  };

  useEffect(() => {
    // Generate only if we are in SHARE tab and user confirmed consent (handled by button now)
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setQrData('');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 p-8 flex flex-col items-center text-center">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex w-full mb-6 bg-gray-100 p-1 rounded-full">
          <button 
            onClick={() => { setActiveTab('SHARE'); setIsGenerated(false); }} 
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'SHARE' ? 'bg-white shadow text-primary-dark' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Emergency Share
          </button>
          <button 
            onClick={() => setActiveTab('ID')} 
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'ID' ? 'bg-white shadow text-primary-dark' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Health ID
          </button>
        </div>

        {activeTab === 'SHARE' ? (
          <>
            <div className="bg-primary-light p-3 rounded-2xl mb-4">
              <QrCode className="w-8 h-8 text-primary-dark" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Share Health Data</h2>
            
            {!isGenerated ? (
              <div className="w-full text-left">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                  <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5" /> Consent Manager</h3>
                  <p className="text-sm text-blue-600 mb-4">Select what data you want to share with the health worker.</p>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <input type="radio" name="consent" value="FULL" checked={consentLevel === 'FULL'} onChange={() => setConsentLevel('FULL')} className="w-4 h-4 text-primary-dark focus:ring-primary-dark" />
                      <span className="text-sm font-medium text-gray-700">Full Medical Data (Recommended)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <input type="radio" name="consent" value="RISK_ONLY" checked={consentLevel === 'RISK_ONLY'} onChange={() => setConsentLevel('RISK_ONLY')} className="w-4 h-4 text-primary-dark focus:ring-primary-dark" />
                      <span className="text-sm font-medium text-gray-700">Risk Summary Only</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <input type="radio" name="consent" value="SYMPTOMS_ONLY" checked={consentLevel === 'SYMPTOMS_ONLY'} onChange={() => setConsentLevel('SYMPTOMS_ONLY')} className="w-4 h-4 text-primary-dark focus:ring-primary-dark" />
                      <span className="text-sm font-medium text-gray-700">Symptoms & Alerts Only</span>
                    </label>
                  </div>
                </div>
                
                <button 
                  onClick={generateNewQR}
                  className="w-full bg-primary-dark text-white py-3.5 rounded-full font-bold hover:bg-primary-dark/90 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Generate Secure QR
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-500 mb-6 text-sm">
                  Show this securely to your health worker.
                </p>

                {error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                  </div>
                ) : qrData ? (
                  <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 inline-block fade-in">
                    <QRCodeSVG value={qrData} size={256} level="M" includeMargin={true} />
                    <div className="mt-6 flex flex-col items-center">
                      <span className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-1">Expires in</span>
                      <span className={`text-3xl font-black tabular-nums ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary-dark'}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 fade-in">
                    <p className="text-red-500 font-bold mb-4">QR Code Expired</p>
                    <button 
                      onClick={generateNewQR}
                      className="flex items-center gap-2 mx-auto bg-primary-dark text-white px-6 py-3 rounded-full font-bold hover:bg-primary-dark/90 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" /> Generate New QR
                    </button>
                  </div>
                )}
                
                <div className="mt-8 text-xs text-gray-400 max-w-xs">
                  <p>Powered by local Peer-to-Peer encryption. Data never leaves your device until scanned.</p>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* FEATURE 3: DIGITAL HEALTH RECORD (PORTABLE ID) */}
            <div className="bg-blue-100 p-3 rounded-2xl mb-4">
              <FileBadge className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Digital Health ID</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Your portable health file. This QR does NOT expire and can be scanned anytime by a registered health worker.
            </p>
            
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 inline-block fade-in">
              <QRCodeSVG value="MATRACARE_HEALTH_ID_AB123XYZ_PERMANENT" size={256} level="Q" includeMargin={true} />
              <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-200 text-sm font-mono text-gray-600">
                ID: AB123XYZ
              </div>
            </div>
            
            <div className="mt-8 text-xs text-gray-400 max-w-xs">
              <p>Contains your basic health summary and pregnancy status.</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default GenerateQR;
