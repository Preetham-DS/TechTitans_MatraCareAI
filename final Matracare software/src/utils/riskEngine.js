import { loadPatientData } from './storage';

/**
 * Maternal Risk Calculation Engine
 * Multi-layer intelligent system (Basic -> Advanced -> Trend)
 */

export const calculateMaternalRisk = (data) => {
  let score = 0;
  let riskFactors = [];
  let recommendation = "Vitals are within normal ranges. Continue regular monitoring.";
  let level = 'LOW';
  
  // Extract Data
  const {
    age,
    systolic,
    diastolic,
    glucose,
    hemoglobin,
    symptoms = [],
    highBP, // Medical History
    diabetes,
    habits = {}
  } = data;

  const { ironTablet, drankWater, highSalt } = habits;

  const isHighBP = (systolic >= 140 || diastolic >= 90) || highBP;
  const isDiabetes = (glucose > 140) || diabetes;
  const hasBleeding = symptoms.includes('bleeding');
  const hasSevereHeadache = symptoms.includes('severe_headache');
  const hasBlurredVision = symptoms.includes('blurred_vision');
  
  // LAYER 1: BASIC RULE-BASED ENGINE
  if (age > 35) {
    score += 2;
    riskFactors.push("Advanced maternal age (>35).");
  }
  if (hasBleeding) {
    score += 3;
    riskFactors.push("Reported vaginal bleeding.");
  }
  if (isHighBP) {
    score += 2;
    riskFactors.push(highBP ? "History of High BP." : "Elevated blood pressure reading.");
  }
  if (isDiabetes) {
    score += 2;
    riskFactors.push(diabetes ? "History of Diabetes." : "Elevated blood glucose.");
  }
  if (hemoglobin && hemoglobin < 11.0) {
    score += 2;
    riskFactors.push("Anemia indicated by low hemoglobin.");
  }

  // LAYER 2: INTERMEDIATE LOGIC (CONDITION COMBINATIONS)
  if (hasBleeding && isHighBP) {
    score += 3;
    riskFactors.push("Combination of bleeding and high BP significantly escalates risk.");
  }
  if (isDiabetes && isHighBP) {
    score += 2;
    riskFactors.push("Combination of diabetes and high BP increases risk severity.");
  }
  if (symptoms.length >= 3) {
    score += 2;
    riskFactors.push(`Multiple symptoms reported (${symptoms.length}).`);
  }

  // LAYER 2b: HABIT-BASED LOGIC (Phase 5)
  if (isHighBP && highSalt === true) {
    score += 2;
    riskFactors.push("High salt intake combined with elevated blood pressure is a critical dietary risk factor.");
  }
  if (ironTablet === false) {
    score += 1;
    riskFactors.push("Iron supplement not taken today — risk of anemia worsening.");
  }
  if (drankWater === false && isHighBP) {
    score += 1;
    riskFactors.push("Insufficient hydration combined with high BP detected.");
  }

  // LAYER 3: ADVANCED LOGIC (CONTEXT-AWARE REASONING)
  let forceMinimumRisk = null;
  
  // Critical symptom -> force minimum MEDIUM or HIGH
  if (hasBleeding || hasSevereHeadache || hasBlurredVision) {
    forceMinimumRisk = score >= 5 ? 'HIGH' : 'MEDIUM';
    if (!hasBleeding) riskFactors.push("Critical symptoms present (severe headache/blurred vision).");
  }
  
  // Multiple history conditions
  if (highBP && diabetes) {
    score += 2;
    riskFactors.push("Multiple chronic conditions present (High BP + Diabetes).");
  }
  
  // Extreme vitals trigger CRITICAL
  if (systolic >= 160 || diastolic >= 110) {
    forceMinimumRisk = 'CRITICAL';
    riskFactors.push("Critically elevated blood pressure (Severe Hypertension/Preeclampsia risk).");
  }

  // LAYER 4: TREND-BASED SIMULATION
  try {
    const historyData = loadPatientData();
    const pastEntries = historyData.riskHistory || [];
    
    // Check if last entry had high risk or repeated critical symptoms
    if (pastEntries.length >= 1) {
      const lastEntry = pastEntries[pastEntries.length - 1];
      
      if (lastEntry.level === 'HIGH' && score >= 5) {
        score += 2;
        riskFactors.push("Trend alert: High risk level persisting over multiple entries.");
      } else if (lastEntry.level === 'MEDIUM' && score >= 5) {
        riskFactors.push("Trend alert: Risk level is escalating compared to previous entry.");
      }
    }
  } catch (err) {
    console.error("Error analyzing trends:", err);
  }

  // LAYER 5: FINAL RISK DECISION SYSTEM
  if (forceMinimumRisk === 'CRITICAL' || score >= 8) {
    level = 'CRITICAL';
    recommendation = "Immediate medical intervention required. Please go to the nearest emergency room or contact your healthcare provider immediately.";
  } else if (forceMinimumRisk === 'HIGH' || score >= 6) {
    level = 'HIGH';
    recommendation = "High risk detected. Schedule an urgent consultation with your doctor. Monitor symptoms closely.";
  } else if (forceMinimumRisk === 'MEDIUM' || score >= 3) {
    level = 'MEDIUM';
    recommendation = "Moderate risk. Please discuss these symptoms and readings at your next prenatal check-up.";
  } else {
    level = 'LOW';
    recommendation = "Low risk. Vitals and symptoms are within normal parameters. Continue regular monitoring and prenatal care.";
  }

  // Append high-priority habit-specific recommendation
  if (isHighBP && highSalt === true) {
    recommendation = "Your salt intake is likely exacerbating your blood pressure. Avoid processed foods immediately. " + recommendation;
  }

  // LAYER 6: EXPLANATION MODULE STRUCTURE
  const explanationObj = {
    why: riskFactors.length > 0 ? riskFactors : ["All provided inputs are within normal ranges. No immediate risk factors detected."],
    what: recommendation
  };

  return { 
    level, 
    score, 
    explanation: explanationObj,
    timestamp: new Date().toISOString()
  };
};

/**
 * Predicts future trend based on the last 5 entries using Linear Regression.
 * Calculates slope for Systolic BP and Glucose to project 7 days into the future.
 */
export const predictFutureTrend = (historicalLogs) => {
  if (!historicalLogs || historicalLogs.length < 2) return null;

  // Take the last 5 entries
  const recentLogs = historicalLogs.slice(-5);
  
  // Helper for linear regression
  const calculateSlope = (dataKey) => {
    const n = recentLogs.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    recentLogs.forEach((log, i) => {
      // Treat 'i' as time unit (assuming roughly uniform intervals, or days)
      const x = i;
      const y = log[dataKey] || 0;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const denominator = (n * sumXX) - (sumX * sumX);
    if (denominator === 0) return 0;
    
    return ((n * sumXY) - (sumX * sumY)) / denominator;
  };

  const systolicSlope = calculateSlope('systolic');
  const glucoseSlope = calculateSlope('glucose');

  const latestLog = recentLogs[recentLogs.length - 1];
  const currentSystolic = latestLog.systolic || 0;
  const currentGlucose = latestLog.glucose || 0;

  // Predict 7 units (days) ahead
  const predictedSystolic = currentSystolic + (systolicSlope * 7);
  const predictedGlucose = currentGlucose + (glucoseSlope * 7);

  // High Risk Thresholds
  const SYSTOLIC_HIGH = 140;
  const GLUCOSE_HIGH = 140;

  if (predictedSystolic >= SYSTOLIC_HIGH && systolicSlope > 0) {
    const daysToRisk = Math.max(1, Math.round((SYSTOLIC_HIGH - currentSystolic) / systolicSlope));
    return {
      alert: true,
      daysToRisk: Math.min(daysToRisk, 7),
      metric: 'Systolic BP',
      message: `Predictive Alert: Upward trend detected in BP. Potential risk in ${Math.min(daysToRisk, 7)} days.`,
      forecastData: { systolic: Math.round(predictedSystolic), glucose: Math.round(predictedGlucose) }
    };
  }

  if (predictedGlucose >= GLUCOSE_HIGH && glucoseSlope > 0) {
    const daysToRisk = Math.max(1, Math.round((GLUCOSE_HIGH - currentGlucose) / glucoseSlope));
    return {
      alert: true,
      daysToRisk: Math.min(daysToRisk, 7),
      metric: 'Blood Glucose',
      message: `Predictive Alert: Upward trend detected in Blood Sugar. Potential risk in ${Math.min(daysToRisk, 7)} days.`,
      forecastData: { systolic: Math.round(predictedSystolic), glucose: Math.round(predictedGlucose) }
    };
  }

  return {
    alert: false,
    forecastData: { systolic: Math.round(predictedSystolic), glucose: Math.round(predictedGlucose) }
  };
};
