import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { parsePatientQRData } from '../services/scanService';
import { X, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const ScanQR = ({ onClose, onScanSuccess }) => {
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const data = parsePatientQRData(decodedText);
          scanner.clear();
          setSuccessData(data);
          setTimeout(() => {
            onScanSuccess(data);
          }, 4000); // Give them 4 seconds to read the follow-up suggestion
        } catch (err) {
          setError(err.message || "Invalid QR Code");
          setTimeout(() => setError(''), 3000);
        }
      },
      (err) => {
        // Ignored, continuous scanning
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 p-8 flex flex-col items-center">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">Scan Patient QR</h2>

        {!successData ? (
          <div className="w-full">
            <div id="qr-reader" className="w-full rounded-2xl overflow-hidden border-2 border-primary-light"></div>
            {error && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            <p className="text-center text-sm text-gray-500 mt-6">
              Align the patient's Health Passport QR code within the frame.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center fade-in">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sync Successful!</h3>
            <p className="text-gray-500 mb-6">Patient data securely transferred.</p>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl w-full text-left">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Follow-Up Recommendation
              </h4>
              <p className="text-sm text-blue-700">
                Risk Level: <strong>{successData.risk.level}</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Next recommended visit: <strong>
                  {successData.risk.level === 'CRITICAL' ? 'IMMEDIATE' :
                   successData.risk.level === 'HIGH' ? '1 day' : 
                   successData.risk.level === 'MEDIUM' ? '3 days' : '7 days'}
                </strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQR;
