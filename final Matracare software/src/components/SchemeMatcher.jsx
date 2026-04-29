import React from 'react';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';

const SCHEMES = [
  {
    id: 'pmmy',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    description: 'Cash incentive of ₹5,000 provided directly to the bank account of pregnant women and lactating mothers for first living child.',
    condition: (data) => data.isPregnant && data.trimester >= 1
  },
  {
    id: 'jsy',
    name: 'Janani Suraksha Yojana (JSY)',
    description: 'Cash assistance for institutional delivery to reduce maternal and neonatal mortality among poor pregnant women.',
    condition: (data) => data.isPregnant && (data.riskLevel === 'HIGH' || data.riskLevel === 'CRITICAL' || data.income === 'low')
  },
  {
    id: 'jssk',
    name: 'Janani Shishu Suraksha Karyakaram (JSSK)',
    description: 'Completely free and cashless services to pregnant women including normal deliveries and caesarean operations.',
    condition: (data) => data.isPregnant
  },
  {
    id: 'pmsma',
    name: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)',
    description: 'Free, assured, comprehensive and quality antenatal care to pregnant women on the 9th of every month.',
    condition: (data) => data.isPregnant && data.trimester >= 2
  }
];

const SchemeMatcher = ({ patientData }) => {
  if (!patientData) return null;
  
  // Create a mock current state based on latest entry or provided data
  const data = {
    isPregnant: patientData.isPregnant || false,
    trimester: patientData.trimester || 0,
    riskLevel: patientData.riskLevel || 'LOW',
    income: patientData.income || 'unknown'
  };

  const eligibleSchemes = SCHEMES.filter(scheme => scheme.condition(data));

  if (eligibleSchemes.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 md:p-8 border border-blue-100 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Eligible Government Benefits</h3>
          <p className="text-sm text-gray-500">Based on your profile, you may be eligible for these schemes.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {eligibleSchemes.map(scheme => (
          <div key={scheme.id} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1 pr-6">{scheme.name}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{scheme.description}</p>
              </div>
            </div>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 group-hover:text-blue-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemeMatcher;
