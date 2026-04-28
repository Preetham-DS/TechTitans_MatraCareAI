import React, { useState } from 'react';
import { Lock, Wallet, Loader2, AlertCircle, Hash, CheckCircle } from 'lucide-react';

const Web3UI = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSecuring, setIsSecuring] = useState(false);
  const [secureMessage, setSecureMessage] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');

  const handleConnect = () => {
    setError('');
    setIsConnecting(true);
    // Simulate MetaMask connection delay
    setTimeout(() => {
      // Simulate random error chance for realism
      if (Math.random() > 0.8) {
        setError('Failed to connect to wallet network. Try again.');
        setIsConnecting(false);
        return;
      }
      setWalletConnected(true);
      setIsConnecting(false);
    }, 1200);
  };

  const handleSecureData = () => {
    if (!walletConnected) {
      setError('Please connect your wallet first to secure data.');
      return;
    }
    setError('');
    setIsSecuring(true);
    setSecureMessage('');
    setHash('');

    // Simulate blockchain transaction delay
    setTimeout(() => {
      setSecureMessage('Data securely encrypted on the blockchain!');
      // Generate a fake hash
      setHash('0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
      setIsSecuring(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Web3 Privacy Module</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Your health data is extremely sensitive. We use simulated Web3 tech to encrypt and decentralize your records.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center space-x-3 fade-in">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
          <p className="text-danger-700 font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {!walletConnected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-full font-bold transition-all disabled:opacity-70"
          >
            {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
            <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
          </button>
        ) : (
          <div className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-success/10 text-success-700 px-8 py-3.5 rounded-full font-bold border border-success/30">
            <CheckCircle className="w-5 h-5" />
            <span>Wallet Connected (0x123...4abc)</span>
          </div>
        )}

        <button
          onClick={handleSecureData}
          disabled={isSecuring}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-primary-light/50 text-primary-dark border border-primary-light hover:bg-primary-light px-8 py-3.5 rounded-full font-bold transition-all disabled:opacity-70"
        >
          {isSecuring ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
          <span>{isSecuring ? 'Encrypting...' : 'Secure Data on Chain'}</span>
        </button>
      </div>

      {secureMessage && (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 fade-in text-left">
          <div className="flex items-center space-x-2 text-success font-bold mb-3">
            <CheckCircle className="w-5 h-5" />
            <span>{secureMessage}</span>
          </div>
          <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-gray-200">
            <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <code className="text-xs text-gray-600 truncate">{hash}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default Web3UI;
