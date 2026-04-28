import React, { useState } from 'react';
import { Phone, MapPin, AlertTriangle, Loader2, Navigation, MessageSquare, Hospital, Siren } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK FACILITY DATABASE
// In production: replace with Google Maps Places API response.
// Each facility has lat/lon so we can compute real distance from the user.
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_FACILITIES = [
  {
    id: 1,
    name: 'Bangalore Maternity & NICU Centre',
    type: 'Maternity Hospital + NICU',
    lat: 12.9716, lon: 77.5946,
    phone: '+91-80-2222-3333',
    address: '14 MG Road, Bangalore'
  },
  {
    id: 2,
    name: 'St. Martha\'s Hospital — OBS Dept.',
    type: 'Emergency Obstetric Care',
    lat: 12.9766, lon: 77.5993,
    phone: '+91-80-2227-7050',
    address: 'Nrupatunga Rd, Vasanth Nagar'
  },
  {
    id: 3,
    name: 'Manipal Hospital — Women\'s Centre',
    type: 'Maternity Hospital',
    lat: 12.9538, lon: 77.6417,
    phone: '+91-80-2502-4444',
    address: '98 HAL Airport Rd, Kodihalli'
  },
  {
    id: 4,
    name: 'Fortis La Femme',
    type: 'Emergency Obstetric Care + NICU',
    lat: 12.9352, lon: 77.6245,
    phone: '+91-80-4296-8888',
    address: 'No 78, 5th Main Rd, Richmond Town'
  },
  {
    id: 5,
    name: 'Cloudnine Hospital — Malleshwaram',
    type: 'Maternity Hospital',
    lat: 13.0035, lon: 77.5718,
    phone: '+91-80-4893-6666',
    address: '1533, 16th Cross, Malleshwaram'
  },
  {
    id: 6,
    name: 'BGS Gleneagles Global Hospital',
    type: 'Maternity Hospital + NICU',
    lat: 12.9121, lon: 77.5478,
    phone: '+91-80-2670-1111',
    address: 'Uttarahalli Main Rd, Kengeri'
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HAVERSINE FORMULA – Calculates real-world distance between two coordinates
// Returns distance in km
// ─────────────────────────────────────────────────────────────────────────────
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const EmergencyAlert = ({ isHighRisk, riskLevel }) => {
  const [phase, setPhase] = useState('idle'); // idle | locating | done | error
  const [userCoords, setUserCoords] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [smsLog, setSmsLog] = useState(null);
  const [error, setError] = useState('');

  const isCritical = riskLevel === 'CRITICAL';

  if (!isHighRisk) return null;

  // ── Locate and sort facilities ──
  const handleLocate = () => {
    setPhase('locating');
    setError('');
    setSmsLog(null);

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      setPhase('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });

        // Calculate distance for every facility and sort ascending
        const sorted = MOCK_FACILITIES
          .map(f => ({
            ...f,
            distanceKm: haversineDistance(latitude, longitude, f.lat, f.lon)
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm);

        setFacilities(sorted);
        setPhase('done');
      },
      () => {
        // Geolocation denied – fall back to mock data from a default coord
        const defaultLat = 12.9716, defaultLon = 77.5946;
        setUserCoords({ lat: defaultLat, lon: defaultLon });
        const sorted = MOCK_FACILITIES
          .map(f => ({
            ...f,
            distanceKm: haversineDistance(defaultLat, defaultLon, f.lat, f.lon)
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm);

        setFacilities(sorted);
        setPhase('done');
        setError('Location permission denied. Showing results based on approximate area.');
      },
      { timeout: 8000 }
    );
  };

  // ── Navigate Now: opens native maps app ──
  const handleNavigate = (facility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}&travelmode=driving`;
    window.open(url, '_blank');
  };

  // ── Simulate SMS ──
  const handleSimulateSMS = (facility) => {
    const locationLink = userCoords
      ? `https://maps.google.com/?q=${userCoords.lat},${userCoords.lon}`
      : 'Location unavailable';

    const message = [
      '🚨 MATRACARE EMERGENCY SOS 🚨',
      `Patient requires immediate obstetric care.`,
      `📍 Patient Location: ${locationLink}`,
      `🏥 Routing to: ${facility.name}`,
      `📞 Facility: ${facility.phone}`,
      `⏱ Distance: ${facility.distanceKm.toFixed(1)} km`,
      `Please respond immediately.`
    ].join('\n');

    console.log('\n' + '='.repeat(50));
    console.log(message);
    console.log('='.repeat(50) + '\n');

    setSmsLog({ facility, message, time: new Date().toLocaleTimeString() });
  };

  return (
    <div className={`max-w-3xl mx-auto mt-6 rounded-3xl shadow-xl overflow-hidden fade-in ${isCritical ? 'border-2 border-red-800' : 'border-2 border-orange-600'}`}>

      {/* ── Alert Header ── */}
      <div className={`relative p-6 text-white ${isCritical ? 'bg-red-600' : 'bg-orange-500'}`}>
        <AlertTriangle className="absolute -right-4 -bottom-4 w-48 h-48 text-white opacity-5" />

        <div className="text-center relative z-10 flex flex-col items-center">
          <div className={`p-4 rounded-full mb-4 ${isCritical ? 'bg-white/20 animate-ping absolute' : 'hidden'}`} />
          <div className="bg-white/20 p-4 rounded-full mb-4 relative z-10">
            <Siren className={`w-10 h-10 text-white ${isCritical ? 'animate-bounce' : ''}`} />
          </div>
          <h3 className="text-3xl font-black mb-2 uppercase tracking-wide">
            {isCritical ? '⚠️ Critical Risk — Act Now' : '🔶 High Risk Detected'}
          </h3>
          <p className="text-white/90 font-medium text-lg max-w-lg">
            {isCritical
              ? 'Your vitals require immediate medical intervention. Emergency services are available below.'
              : 'Elevated risk detected. Locate the nearest maternity facility now.'}
          </p>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className={`p-6 ${isCritical ? 'bg-red-50' : 'bg-orange-50'}`}>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
          <button
            onClick={handleLocate}
            disabled={phase === 'locating'}
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-800 px-6 py-3.5 rounded-full font-bold shadow hover:bg-gray-50 transition-all disabled:opacity-60"
          >
            {phase === 'locating'
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <MapPin className="w-5 h-5 text-red-500" />}
            {phase === 'locating' ? 'Finding Facilities...' : '📍 Find Nearest Hospitals'}
          </button>

          <a
            href="tel:102"
            className={`flex items-center justify-center gap-2 text-white px-6 py-3.5 rounded-full font-bold shadow transition-all ${isCritical ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            <Phone className="w-5 h-5" />
            Call 102 (Ambulance)
          </a>
        </div>

        {error && (
          <p className="text-center text-amber-700 bg-amber-50 border border-amber-200 text-sm font-medium p-3 rounded-xl mb-4">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* ── Facility Results ── */}
      {facilities.length > 0 && (
        <div className="bg-white px-6 pb-6">
          <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2 pt-4 border-t border-gray-100">
            <Hospital className="w-5 h-5 text-red-500" />
            Nearest Maternity & Emergency Obstetric Facilities
          </h4>
          <div className="space-y-3">
            {facilities.map((f, idx) => (
              <div
                key={f.id}
                className={`rounded-2xl border p-4 transition-all ${
                  idx === 0
                    ? 'border-red-300 bg-red-50 ring-2 ring-red-200'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${idx === 0 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900">{f.name}</p>
                        {idx === 0 && (
                          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">NEAREST</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{f.type} · {f.address}</p>
                      <p className="text-sm font-bold text-red-600 mt-1">
                        📍 {f.distanceKm.toFixed(1)} km away
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
                    <button
                      onClick={() => handleNavigate(f)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow"
                    >
                      <Navigation className="w-4 h-4" />
                      Navigate Now
                    </button>
                    <button
                      onClick={() => handleSimulateSMS(f)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all shadow"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Simulate SMS
                    </button>
                    <a
                      href={`tel:${f.phone}`}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all shadow"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SMS Simulation Log ── */}
      {smsLog && (
        <div className="bg-gray-900 text-green-400 font-mono text-xs p-5 rounded-b-3xl fade-in">
          <p className="text-green-300 font-bold mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> SMS SIMULATED TO EMERGENCY CONTACTS — {smsLog.time}
          </p>
          <pre className="whitespace-pre-wrap leading-relaxed opacity-90">{smsLog.message}</pre>
          <p className="text-gray-500 mt-2 text-xs">↑ Full message also logged to browser console.</p>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlert;
