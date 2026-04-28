import { medicalPatterns } from '../data/medicalContext';

export const calculateRisk = (data) => {
  let score = 0;
  const { symptoms = [], painLevel = 0, cycleLength = 28 } = data;
  let explanations = [];

  // Critical Red Flags (+40)
  if (symptoms.includes('fainting')) {
    score += 40;
    explanations.push('Fainting is a severe critical red flag.');
  }
  if (symptoms.includes('hemorrhage')) {
    score += 40;
    explanations.push('Hemorrhage or extremely heavy bleeding requires immediate attention.');
  }
  if (painLevel > 7 || symptoms.includes('severe_pain')) {
    score += 40;
    explanations.push('Severe pain (>7) is a critical symptom requiring medical management.');
  }
  if (cycleLength < 21 || cycleLength > 35 || symptoms.includes('cycle_less_21') || symptoms.includes('cycle_greater_35')) {
    score += 40;
    explanations.push(`A cycle length of ${cycleLength} days indicates anomalies outside the normal Rotterdam criteria range (21-35 days).`);
  }

  // Moderate (+20)
  if (symptoms.includes('large_clots')) {
    score += 20;
    explanations.push('Large clots suggest heavy menstrual flow (Higham scoring).');
  }
  if (symptoms.includes('intense_cramping')) {
    score += 20;
    explanations.push('Intense cramping is a moderate indicator of underlying issues.');
  }
  if (symptoms.includes('sudden_cycle_shifts')) {
    score += 20;
    explanations.push('Sudden shifts in cycle regularity are a moderate concern.');
  }

  // Mild (+5)
  if (symptoms.includes('headache') || symptoms.includes('fatigue')) {
    score += 5;
    explanations.push('Mild symptoms like fatigue or headache noted.');
  }

  const whoDangerSigns = ['bleeding', 'severe_headache', 'blurred_vision', 'swelling', 'low_fetal_movement'];
  let whoTriggered = [];

  whoDangerSigns.forEach(sign => {
    if (symptoms.includes(sign)) {
      whoTriggered.push(sign);
      explanations.push(`WHO Danger Sign Detected: ${sign.replace('_', ' ')}`);
      score += 50; // Heavily weight WHO signs
    }
  });

  // Explainable AI Pattern Matching
  let possibleConditions = [];
  for (const [condition, pattern] of Object.entries(medicalPatterns)) {
    const hasPattern = pattern.symptoms.some(sym => symptoms.includes(sym));
    if (hasPattern) {
      possibleConditions.push({ condition, description: pattern.description });
    }
  }

  let level = 'LOW';
  if (score >= 40 || whoTriggered.length > 0) level = 'CRITICAL';
  else if (score >= 20) level = 'HIGH';
  else if (score >= 10) level = 'MEDIUM';

  // Override to HIGH if WHO triggered but wasn't critical (though score makes it CRITICAL, keeping prompt logic)
  if (whoTriggered.length > 0 && level !== 'CRITICAL') {
    level = 'HIGH';
  }

  // Feature 4: Priority Engine
  let priorityAction = 'Monitor';
  if (level === 'CRITICAL' || whoTriggered.length > 0) {
    priorityAction = 'Immediate Visit Required';
  } else if (level === 'HIGH') {
    priorityAction = 'Visit Today';
  }

  // Confidence calculation (mock XAI)
  const confidence = Math.min(100, 60 + (symptoms.length * 10) + (score > 0 ? 15 : 0));

  return {
    score,
    level,
    confidence,
    reasons: explanations, // XAI explanations
    priorityAction,
    whoTriggered,
    explanations,
    possibleConditions
  };
};
