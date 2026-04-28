import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Clock, Calendar, Activity, ShieldAlert, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { loadPatientData, checkIronCompliance } from '../utils/storage';
import { predictFutureTrend } from '../utils/riskEngine';
import DoctorBriefing from './DoctorBriefing';

// Lazy-load VoiceAssistant — prevents Dashboard crash when backend is unavailable
const VoiceAssistant = lazy(() => import('./VoiceAssistant'));


const Dashboard = ({ user, onStartNew }) => {
  const [filter, setFilter] = useState('ALL');
  const [patientData, setPatientData] = useState({ entries: [], riskHistory: [], alerts: [] });
  const [trendAlert, setTrendAlert] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [ironAlert, setIronAlert] = useState(false);

  useEffect(() => {
    const data = loadPatientData();
    setPatientData(data);
    
    if (data.entries && data.entries.length >= 2) {
      const trend = predictFutureTrend(data.entries);
      if (trend) {
        if (trend.alert) setTrendAlert(trend);
        setForecastData(trend.forecastData);
      }
    }

    // Phase 5: Iron compliance check
    setIronAlert(checkIronCompliance(3));
  }, []);

  const history = patientData.riskHistory;
  const filteredHistory = history.filter(record => 
    filter === 'ALL' ? true : record.level === filter
  );

  // Prepare chart data
  const chartData = [];
  
  patientData.entries.forEach((entry, index) => {
    const point = {
      name: new Date(entry.timestamp).toLocaleDateString(),
      systolic: entry.systolic,
      diastolic: entry.diastolic,
      glucose: entry.glucose
    };
    
    // Connect forecast line to the last actual point
    if (index === patientData.entries.length - 1 && forecastData) {
      point.forecastSystolic = entry.systolic;
      point.forecastGlucose = entry.glucose;
    }
    
    chartData.push(point);
  });

  if (forecastData && patientData.entries.length >= 2) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    chartData.push({
      name: 'Forecast (+7d)',
      forecastSystolic: forecastData.systolic,
      forecastGlucose: forecastData.glucose
    });
  }

  const getRiskIcon = (level) => {
    switch (level) {
      case 'LOW': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'MEDIUM': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'HIGH': 
      case 'CRITICAL': return <ShieldAlert className="w-5 h-5 text-danger" />;
      default: return null;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return 'bg-success/10 text-success-700 border-success/20';
      case 'MEDIUM': return 'bg-warning/10 text-warning-700 border-warning/20';
      case 'HIGH': 
      case 'CRITICAL': return 'bg-danger/10 text-danger-700 border-danger/20';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            Welcome back, <span className="gradient-text">{user?.name || 'Jane'}</span>
          </h2>
          <p className="text-gray-500 mt-1">Here is your maternal health dashboard.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setIsBriefingOpen(true)}
            className="flex items-center justify-center space-x-2 bg-secondary text-secondary-900 hover:bg-secondary-dark px-6 py-3 rounded-full font-bold shadow-sm transition-all hover-lift border border-secondary-dark/20"
          >
            <span>Generate Medical Memo</span>
          </button>
          <button 
            onClick={onStartNew}
            className="btn-press bg-primary-dark hover:bg-primary-dark/90 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all hover-lift"
          >
            New Assessment
          </button>
        </div>
      </div>

      {trendAlert && (
        <div className="mb-6 bg-danger/10 border-l-4 border-danger p-4 rounded-r-2xl flex items-center space-x-4 shadow-sm fade-in">
          <ShieldAlert className="w-8 h-8 text-danger flex-shrink-0" />
          <div>
            <h4 className="font-bold text-danger-700">Predictive Alert Detected</h4>
            <p className="text-danger-700 font-medium">{trendAlert.message}</p>
          </div>
        </div>
      )}

      {ironAlert && (
        <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-2xl flex items-center space-x-4 shadow-sm fade-in">
          <span className="text-3xl flex-shrink-0">💊</span>
          <div>
            <h4 className="font-bold text-orange-700">Iron Compliance Alert</h4>
            <p className="text-orange-700 font-medium">You have not taken your iron tablet for the last 3 consecutive entries. Iron deficiency during pregnancy can lead to serious anemia. Please take your supplement today and consult your doctor.</p>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        <VoiceAssistant />
      </Suspense>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4 card-glow">
          <div className="bg-primary-light p-3 rounded-2xl">
            <Activity className="w-6 h-6 text-primary-dark" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Assessments</p>
            <p className="text-2xl font-bold text-gray-800">{history.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4 card-glow">
          <div className="bg-danger/10 p-3 rounded-2xl">
            <ShieldAlert className="w-6 h-6 text-danger" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">High Risk Alerts</p>
            <p className="text-2xl font-bold text-gray-800">
              {history.filter(h => h.level === 'HIGH' || h.level === 'CRITICAL').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center space-x-4 card-glow">
          <div className="bg-gray-100 p-3 rounded-2xl">
            <Clock className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Last Assessment</p>
            <p className="text-xl font-bold text-gray-800">
              {history.length > 0 ? new Date(history[history.length - 1].timestamp).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 text-primary-dark mr-2" />
            Vitals Trends
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Line type="monotone" dataKey="systolic" stroke="#E11D48" strokeWidth={3} activeDot={{ r: 8 }} name="Systolic BP" />
                <Line type="monotone" dataKey="forecastSystolic" stroke="#E11D48" strokeWidth={3} strokeDasharray="5 5" name="Forecast (Systolic)" />
                <Line type="monotone" dataKey="diastolic" stroke="#F43F5E" strokeWidth={3} name="Diastolic BP" />
                <Line type="monotone" dataKey="glucose" stroke="#3B82F6" strokeWidth={3} name="Glucose" />
                <Line type="monotone" dataKey="forecastGlucose" stroke="#3B82F6" strokeWidth={3} strokeDasharray="5 5" name="Forecast (Glucose)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary-dark" />
            <span>Assessment History</span>
          </h3>
          
          <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-full border border-gray-200">
            <Filter className="w-4 h-4 text-gray-400 ml-2" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 outline-none pr-4 cursor-pointer"
            >
              <option value="ALL">All Results</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
            </select>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto p-6 md:p-8 space-y-4 bg-gray-50/50">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No history records found.
            </div>
          ) : (
            [...filteredHistory].reverse().map((record) => (
              <div 
                key={record.id} 
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border transition-all card-glow ${getRiskColor(record.level)}`}
              >
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    {getRiskIcon(record.level)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{new Date(record.timestamp).toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {typeof record.explanation === 'object' && record.explanation !== null
                        ? record.explanation.what || (record.explanation.why || []).join(' ')
                        : record.explanation || 'Assessment completed.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <span className="px-4 py-1.5 rounded-full bg-white font-bold text-sm shadow-sm flex-1 sm:flex-none text-center">
                    {record.level} RISK
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DoctorBriefing 
        isOpen={isBriefingOpen} 
        onClose={() => setIsBriefingOpen(false)} 
        patientData={patientData} 
      />
    </div>
  );
};

export default Dashboard;
