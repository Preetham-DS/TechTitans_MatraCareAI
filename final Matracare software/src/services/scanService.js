import { decompressData } from '../utils/compression';
import { decryptData } from '../utils/encryption';

export const parsePatientQRData = (encryptedData) => {
  try {
    const compressed = decryptData(encryptedData);
    const jsonString = decompressData(compressed);
    const data = JSON.parse(jsonString);

    if (Date.now() > data.meta.expiresAt) {
      throw new Error("QR Code Expired");
    }

    return data;
  } catch (error) {
    console.error("Failed to parse QR:", error);
    throw new Error("Invalid or Expired QR Code");
  }
};
