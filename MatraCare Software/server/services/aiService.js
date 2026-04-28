import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Placeholder for Gemini API Key. Will fail gracefully if not provided.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'PLACEHOLDER' });

/**
 * Analyzes a medical lab report image/pdf and extracts vital signs.
 * @param {string} filePath - The path to the uploaded file.
 * @param {string} mimeType - The mime type of the file.
 * @returns {Object} Extracted vitals { systolic, diastolic, glucose, hemoglobin }
 */
export const analyzeReport = async (filePath, mimeType) => {
  if (process.env.GEMINI_API_KEY === 'PLACEHOLDER' || !process.env.GEMINI_API_KEY) {
    console.warn("No GEMINI_API_KEY provided. Returning mock data.");
    return {
      systolic: 120,
      diastolic: 80,
      glucose: 90,
      hemoglobin: 12.5,
      source: "ai_report_mock",
      timestamp: new Date().toISOString()
    };
  }

  try {
    const fileBytes = fs.readFileSync(filePath).toString("base64");
    
    const prompt = `
      You are a medical data extraction assistant. Analyze this lab report and extract the following values:
      1. Blood Pressure (Systolic and Diastolic)
      2. Blood Glucose (Fasting or Random, specify just the value)
      3. Hemoglobin (Hb)

      Return ONLY a valid JSON object in this exact format, with numbers only (no units). If a value is missing, return null for it.
      {
        "systolic": 120,
        "diastolic": 80,
        "glucose": 95,
        "hemoglobin": 13.2
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: fileBytes,
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    const jsonText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonText);
    
    return {
      ...result,
      source: "ai_report",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw new Error("Failed to analyze report");
  }
};

/**
 * Chats with the AI assistant providing medical context.
 * @param {string} query - The user's voice/text query.
 * @param {Object} context - The patient's current vitals and risk level.
 * @returns {string} The AI's response.
 */
export const chatWithAI = async (query, context) => {
  if (process.env.GEMINI_API_KEY === 'PLACEHOLDER' || !process.env.GEMINI_API_KEY) {
    console.warn("No GEMINI_API_KEY provided. Returning mock response.");
    return "Based on your recent BP readings, this could indicate a slight risk. Please consult a doctor if you feel unwell.";
  }

  try {
    const systemPrompt = `
      You are an AI-powered maternal healthcare assistant. 
      You provide safe, human-readable guidance based on the patient's current health data.
      DO NOT provide a definitive diagnosis. Always advise consulting a medical professional for serious symptoms.
      Keep the response simple, concise, and empathetic (1-3 sentences max).
      
      Patient Context:
      Risk Level: ${context.riskLevel || 'Unknown'}
      Latest Vitals: BP ${context.vitals?.systolic || '--'}/${context.vitals?.diastolic || '--'}, Glucose ${context.vitals?.glucose || '--'}
      Symptoms: ${context.symptoms?.join(', ') || 'None reported'}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Query: " + query }] }
      ]
    });

    return response.text;
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw new Error("Failed to generate response");
  }
};

/**
 * Generates a professional medical memo for a doctor based on patient data.
 * @param {Array} patientData - The last 30 days of patient logs.
 * @returns {string} The AI's clinical brief.
 */
export const generateDoctorBrief = async (patientData) => {
  if (process.env.GEMINI_API_KEY === 'PLACEHOLDER' || !process.env.GEMINI_API_KEY) {
    console.warn("No GEMINI_API_KEY provided. Returning mock brief.");
    return "Patient displays a stable trend with mild episodes of elevated BP. No critical deviations observed in the past 30 days. Suggest routine prenatal monitoring and standard diagnostic panel at next visit.";
  }

  try {
    const systemPrompt = `
      You are a senior obstetrician. Summarize this patient data into a 3-sentence clinical brief for a busy doctor. 
      Highlight only critical deviations and suggest the most urgent diagnostic next step.
      
      Patient History Data:
      ${JSON.stringify(patientData, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] }
      ]
    });

    return response.text;
  } catch (error) {
    console.error("Error generating doctor brief:", error);
    throw new Error("Failed to generate brief");
  }
};
