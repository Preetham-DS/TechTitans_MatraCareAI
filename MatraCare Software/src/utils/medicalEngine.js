const medicalPatterns = {
  PCOS: {
    symptoms: ['sudden_cycle_shifts', 'cycle_greater_35'],
    description: 'Possible Polycystic Ovary Syndrome due to irregular and long cycles.'
  },
  Menorrhagia: {
    symptoms: ['hemorrhage', 'large_clots', 'fainting'],
    description: 'Signs of heavy menstrual bleeding (Menorrhagia), which can lead to anemia.'
  },
  Dysmenorrhea: {
    symptoms: ['severe_pain', 'intense_cramping'],
    description: 'Severe menstrual cramps (Dysmenorrhea) that may require medical management.'
  }
};

export const calculateMenstrualRisk = (data) => {
  let score = 0;
  const { symptoms = [], painLevel = 0, cycleLength = 28 } = data;
  let explanations = [];

  // Red Flags (+40)
  if (symptoms.includes('fainting')) {
    score += 40;
    explanations.push('Fainting is a severe red flag.');
  }
  if (symptoms.includes('hemorrhage')) {
    score += 40;
    explanations.push('Hemorrhage or extremely heavy bleeding requires immediate attention.');
  }
  if (painLevel > 8 || symptoms.includes('severe_pain')) {
    score += 40;
    explanations.push('Severe pain (>8) is a critical symptom.');
  }
  if (cycleLength < 21 || cycleLength > 35 || symptoms.includes('cycle_less_21') || symptoms.includes('cycle_greater_35')) {
    score += 40;
    explanations.push(`A cycle length of ${cycleLength} days is outside the normal range (21-35 days).`);
  }

  // Moderate (+20)
  if (symptoms.includes('large_clots')) {
    score += 20;
    explanations.push('Large clots suggest heavy menstrual bleeding.');
  }
  if (symptoms.includes('intense_cramping')) {
    score += 20;
    explanations.push('Intense cramping can be a sign of underlying issues.');
  }
  if (symptoms.includes('sudden_cycle_shifts')) {
    score += 20;
    explanations.push('Sudden shifts in cycle regularity require monitoring.');
  }

  // Explainable AI Pattern Matching
  let possibleConditions = [];
  for (const [condition, pattern] of Object.entries(medicalPatterns)) {
    const hasPattern = pattern.symptoms.some(sym => symptoms.includes(sym));
    if (hasPattern) {
      possibleConditions.push({ condition, description: pattern.description });
    }
  }

  let level = 'LOW';
  if (score >= 40) level = 'CRITICAL';
  else if (score >= 20) level = 'MEDIUM';

  return {
    score,
    level,
    explanations,
    possibleConditions
  };
};
