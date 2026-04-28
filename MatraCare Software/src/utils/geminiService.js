import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini SDK
// Note: In production, ensure your key is protected.
const apiKey = import.meta.env.VITE_GEMINI_KEY || 'MOCK_KEY';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Helper to convert Blob/File to the Generative Part format
 */
async function fileToGenerativePart(blob) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: blob.type },
  };
}

/**
 * Send raw audio to Gemini 1.5 Flash to extract JSON data.
 */
export async function processMultimodalInput(audioBlob) {
  if (!apiKey || apiKey === 'MOCK_KEY') {
    // Fallback mock JSON for testing without an API key
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      cycle_length: 28,
      pain_level: 8,
      symptoms: ["severe_headache", "dizziness"]
    };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const audioPart = await fileToGenerativePart(audioBlob);

  const prompt = "Extract cycle_length, symptoms[], and pain_level from this audio and return as JSON only.";

  const result = await model.generateContent([prompt, audioPart]);
  let text = result.response.text();
  
  // Clean up potential markdown formatting from JSON
  if (text.startsWith("```json")) {
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  } else if (text.startsWith("```")) {
    text = text.replace(/```/g, '').trim();
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", text);
    throw new Error("Invalid JSON format returned from Gemini.");
  }
}

/**
 * Send score and symptoms to Gemini to get an expert insight.
 */
export async function getExpertInsight(data, lang = 'English') {
  if (!apiKey || apiKey === 'MOCK_KEY') {
    throw new Error("Missing VITE_GEMINI_KEY in environment variables.");
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Act as a specialized gynecological assistant. 
Data: ${JSON.stringify(data)}
Language: ${lang}

Provide a 2-sentence empathetic explanation of the risk and a clear 'Next Step' in ${lang}. Format your response plainly.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Use Gemini's native multimodal output to generate a TTS audio response for the advice.
 * Since native audio generation is not fully supported in the basic SDK yet, we simulate it
 * or use Web Speech API as a functional fallback.
 */
export async function generateSpeech(text) {
  return new Promise((resolve, reject) => {
    // Conceptual placeholder for Gemini Audio Output if supported in the future
    // e.g. model.generateContent({ prompt: text, outputFormat: 'audio' })
    
    // Functional Fallback: Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a female/empathetic voice if possible
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find(v => v.name.includes('Female')) || voices[0];
      utterance.rate = 0.9; // Slightly slower for empathy
      utterance.pitch = 1.1;
      
      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("TTS not supported in this browser.");
      resolve();
    }
  });
}

/**
 * Send a document (PDF or Image) to Gemini 1.5 Flash to extract medical vitals.
 */
export async function extractDocumentVitals(fileBlob) {
  if (!apiKey || apiKey === 'MOCK_KEY') {
    // Fallback mock extraction for testing without an API key
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      systolic: 120,
      diastolic: 80,
      glucose: 95,
      hemoglobin: 12.5,
      age: 28,
      weight: 65
    };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const filePart = await fileToGenerativePart(fileBlob);

  const prompt = "Extract the following medical vitals from this document if present: systolic (BP), diastolic (BP), glucose, hemoglobin, age, weight. Return ONLY a valid JSON object with these exact keys in lowercase. If a value is missing or not found, set it to null. Ensure values are numbers.";

  const result = await model.generateContent([prompt, filePart]);
  let text = result.response.text();
  
  if (text.startsWith("```json")) {
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  } else if (text.startsWith("```")) {
    text = text.replace(/```/g, '').trim();
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", text);
    throw new Error("Invalid JSON format returned from Gemini.");
  }
}

/**
 * Generate a clinical medical memo for a doctor based on patient data history.
 */
export async function generateMedicalMemo(patientData) {
  if (!apiKey || apiKey === 'MOCK_KEY') {
    // Fallback mock response
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "Patient is exhibiting regular cycles with moderate pain. Vitals are within normal limits. Recommend continued monitoring and daily iron supplementation.";
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Act as an expert gynecological AI assistant.
Review the following patient data history (last 30 entries):
${JSON.stringify(patientData)}

Write a concise, professional Clinical Medical Memo (approx 3-5 sentences) summarizing the patient's condition, noting any significant symptoms (like hemorrhage or severe pain), and suggesting a clinical recommendation.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
