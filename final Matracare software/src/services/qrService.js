import { compressData } from '../utils/compression';
import { encryptData } from '../utils/encryption';
import { loadPatientData } from '../utils/storage';

export const generatePatientQRData = (consentLevel = 'FULL') => {
  const patientData = loadPatientData();
  const history = patientData.entries.slice(-30); // Last 30 entries
  
  if (history.length === 0) return null;

  const latestEntry = history[history.length - 1];

  const payload = {
    meta: {
      version: "1.0",
      generatedAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000 // Expires in 5 minutes
    },
    user: {
      id: "anonymous" // Privacy first
    },
    pregnancy: {
      status: latestEntry.isPregnant || false,
      trimester: latestEntry.trimester || 0
    },
    risk: {
      level: latestEntry.riskLevel || "LOW",
      score: consentLevel === 'SYMPTOMS_ONLY' ? undefined : (latestEntry.riskScore || 0),
      history: consentLevel === 'FULL' ? history.map(h => ({ date: h.date, level: h.riskLevel })) : undefined
    },
    symptoms: consentLevel === 'RISK_ONLY' ? undefined : (latestEntry.symptoms || []),
    alerts: consentLevel === 'RISK_ONLY' ? undefined : []
  };

  const jsonString = JSON.stringify(payload);
  const compressed = compressData(jsonString);
  const encrypted = encryptData(compressed);
  
  return encrypted;
};
