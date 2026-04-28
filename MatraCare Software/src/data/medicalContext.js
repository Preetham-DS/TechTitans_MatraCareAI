// Higham Scoring (Flow intensity) and Rotterdam Criteria (Cycle length anomalies)
export const medicalPatterns = {
  PCOS: {
    symptoms: ['sudden_cycle_shifts', 'cycle_greater_35'],
    description: 'Rotterdam Criteria indicator: Possible Polycystic Ovary Syndrome due to irregular and long cycles (>35 days).'
  },
  Menorrhagia: {
    symptoms: ['hemorrhage', 'large_clots', 'fainting'],
    description: 'Higham Scoring indicator: Signs of heavy menstrual bleeding (Menorrhagia), which can lead to anemia and requires medical evaluation.'
  },
  Dysmenorrhea: {
    symptoms: ['severe_pain', 'intense_cramping'],
    description: 'Severe menstrual cramps (Dysmenorrhea) that may require medical management.'
  }
};

export const emergencyHelplines = {
  health_advice: {
    number: '104',
    description: 'Medical Helpline for general health advice and non-emergency medical information.'
  },
  women_distress: {
    number: '181',
    description: 'Women Helpline for women in distress, including domestic violence and abuse.'
  },
  ambulance: {
    number: '102',
    description: 'National Ambulance Service for pregnant women and sick infants.'
  }
};
