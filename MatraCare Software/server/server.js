import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { analyzeReport, chatWithAI, generateDoctorBrief } from './services/aiService.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for handling file uploads (storing temporarily in memory or a temp folder)
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Maternal Healthcare AI API is running.' });
});

// Endpoint: AI Lab Report Analysis
app.post('/api/analyze-report', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path: filePath, mimetype } = req.file;
    
    // Process file with Gemini
    const result = await analyzeReport(filePath, mimetype);

    res.json(result);
  } catch (error) {
    console.error('Error in /api/analyze-report:', error);
    res.status(500).json({ error: 'Failed to analyze report' });
  }
});

// Endpoint: AI Voice Assistant (Chat)
app.post('/api/chat', async (req, res) => {
  try {
    const { query, context } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await chatWithAI(query, context || {});
    
    res.json({ response });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Endpoint: Doctor Briefing
app.post('/api/generate-brief', async (req, res) => {
  try {
    const { patientData } = req.body;
    if (!patientData) {
      return res.status(400).json({ error: 'Patient data is required' });
    }
    const brief = await generateDoctorBrief(patientData);
    res.json({ brief });
  } catch (error) {
    console.error('Error in /api/generate-brief:', error);
    res.status(500).json({ error: 'Failed to generate brief' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
