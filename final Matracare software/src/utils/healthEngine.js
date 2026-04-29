/**
 * MatraCare Health Engine
 * Calculates risk levels based on weighted clinical inputs and WHO Danger Signs.
 */

export const calculateRisk = (data) => {
  let score = 0;
  const { 
    symptoms = {}, 
    conditions = [], 
    systolic = null, 
    diastolic = null, 
    glucose = null, 
    hemoglobin = null,
    highBP,
    diabetes
  } = data;
  
  let reasons = [];

  // 1. Vitals Scoring
  if (systolic && diastolic) {
    if (systolic >= 160 || diastolic >= 110) {
      score += 60;
      reasons.push(`Severely high blood pressure (${systolic}/${diastolic}).`);
    } else if (systolic >= 140 || diastolic >= 90) {
      score += 40;
      reasons.push(`High blood pressure (${systolic}/${diastolic}).`);
    } else if (systolic >= 130 || diastolic >= 85) {
      score += 20;
      reasons.push(`Slightly elevated blood pressure (${systolic}/${diastolic}).`);
    } else if (systolic < 90 || diastolic < 60) {
      score += 25;
      reasons.push(`Low blood pressure (${systolic}/${diastolic}).`);
    }
  }

  if (glucose) {
    if (glucose > 200) {
      score += 40;
      reasons.push(`Dangerously high glucose (${glucose} mg/dL).`);
    } else if (glucose > 140) {
      score += 25;
      reasons.push(`Elevated glucose (${glucose} mg/dL).`);
    }
  }

  if (hemoglobin) {
    if (hemoglobin < 7) {
      score += 40;
      reasons.push(`Severe anemia (Hemoglobin: ${hemoglobin} g/dL).`);
    } else if (hemoglobin < 10) {
      score += 25;
      reasons.push(`Moderate anemia (Hemoglobin: ${hemoglobin} g/dL).`);
    }
  }

  // 2. Conditions (Medical History) Scoring
  if (highBP || conditions.includes('hypertension') || conditions.includes('preeclampsia')) {
    score += 30;
    reasons.push("History of high blood pressure or preeclampsia.");
  }
  if (diabetes || conditions.includes('diabetes')) {
    score += 25;
    reasons.push("History of diabetes.");
  }
  if (conditions.includes('anemia')) {
    score += 20;
    reasons.push("History of anemia.");
  }

  // 3. Symptoms Scoring (Severity levels: none, mild, moderate, severe)
  let hasCriticalDanger = false;
  const criticalKeys = ['vision', 'bleeding', 'fetalMovement', 'headache'];

  Object.entries(symptoms).forEach(([key, level]) => {
    if (level === 'none') return;

    // Friendly display name for reasons
    const displayKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();

    if (level === 'mild') {
      score += 5;
      reasons.push(`Mild ${displayKey}.`);
    } else if (level === 'moderate') {
      score += 15;
      reasons.push(`Moderate ${displayKey}.`);
    } else if (level === 'severe') {
      score += 40;
      reasons.push(`Severe ${displayKey}.`);
      if (criticalKeys.includes(key)) {
        hasCriticalDanger = true;
      }
    }
  });

  // 4. Exact Threshold Logic
  let riskLevel = "LOW";
  
  if (score >= 75) {
    riskLevel = "CRITICAL";
  } else if (score >= 55) {
    riskLevel = "HIGH";
  } else if (score >= 30) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  // 5. WHO Danger Sign Override
  if (hasCriticalDanger) {
    riskLevel = "CRITICAL";
    reasons.push("CRITICAL OVERRIDE: Severe WHO danger sign detected.");
  }

  // Confidence Calculation
  const confidence = Math.min(100, 70 + (Object.values(symptoms).filter(v => v !== 'none').length * 5) + (conditions.length * 5));

  // 6. Debug Logging
  console.log("Final Score:", score);
  console.log("Risk Level:", riskLevel);

  // Return Structured Output
  return {
    score,
    riskLevel,
    level: riskLevel, // Backwards compatibility for App.jsx
    confidence,
    reasons,
    explanations: reasons, // Backwards compatibility for App.jsx
    possibleConditions: []
  };
};
