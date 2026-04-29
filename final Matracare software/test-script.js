import { calculateRisk } from './src/utils/healthEngine.js';

const formData = {
  age: 25,
  systolic: 120,
  diastolic: 80,
  glucose: 90,
  weight: 60,
  hemoglobin: 12,
  cycleLength: 28,
  painLevel: 0,
  symptoms: {
    headache: "none",
    vision: "none",
    swelling: "none",
    dizziness: "none",
    fetalMovement: "none",
    bleeding: "none"
  },
  highBP: false,
  diabetes: false,
  habits: { ironTablet: true, drankWater: true, highSalt: false },
};

try {
  console.log("Running engine...");
  const result = calculateRisk(formData);
  console.log("Result:", result);
} catch (error) {
  console.error("Error running engine:", error);
}
