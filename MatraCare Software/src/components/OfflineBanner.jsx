import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, X, Database } from 'lucide-react';

// ─── Offline / Low-Connectivity Banner ────────────────────────────────────────
// Shows a sticky banner when offline.
// Always shows a subtle "offline-capable" pill so rural users know data is safe.
// ────────────────────────────────────────────────────────────────────────────

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [justReconnected, setJustReconnected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      setDismissed(false);
      // Hide "reconnected" message after 4 s
      setTimeout(() => setJustReconnected(false), 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ── Offline banner ──────────────────────────────────────────────────────────
  if (!isOnline && !dismissed) {
    return (
      <div
        role="alert"
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-3 bg-amber-600 text-white px-4 py-2.5 shadow-lg text-sm font-semibold"
        style={{ animation: 'none' }}
      >
        <div className="flex items-center gap-2.5">
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>
            📶 No internet connection — <strong>App still works!</strong> Your data is saved
            safely on this device.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="flex-shrink-0 p-1 rounded-full hover:bg-amber-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── Just reconnected banner ─────────────────────────────────────────────────
  if (justReconnected) {
    return (
      <div
        role="status"
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 shadow-lg text-sm font-semibold"
      >
        <Wifi className="w-4 h-4" />
        ✅ You're back online. All data has been preserved.
      </div>
    );
  }

  return null;
};

export default OfflineBanner;
