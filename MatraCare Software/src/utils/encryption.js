import CryptoJS from 'crypto-js';

const SECRET_KEY = "MATRACARE_P2P_SECRET_KEY"; // In real prod, derived dynamically

export const encryptData = (dataString) => {
  return CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
};

export const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
