import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { loadPatientData } from '../utils/storage';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setAiResponse('');
      };

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleQuery(text);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
  };

  const handleQuery = async (queryText) => {
    setIsProcessing(true);
    
    // Build context from storage
    const data = loadPatientData();
    const lastEntry = data.entries.length > 0 ? data.entries[data.entries.length - 1] : null;
    const lastRisk = data.riskHistory.length > 0 ? data.riskHistory[data.riskHistory.length - 1] : null;

    const context = {
      riskLevel: lastRisk ? lastRisk.level : 'Unknown',
      vitals: lastEntry ? {
        systolic: lastEntry.systolic,
        diastolic: lastEntry.diastolic,
        glucose: lastEntry.glucose
      } : null,
      symptoms: lastEntry ? lastEntry.symptoms : []
    };

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        query: queryText,
        context: context
      });
      
      const reply = res.data.response;
      setAiResponse(reply);
      speak(reply);
    } catch (error) {
      console.error(error);
      setAiResponse("I'm sorry, I couldn't process that right now. Please consult your doctor if you feel unwell.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    return null; // Don't render if not supported
  }

  return (
    <div className="bg-gradient-to-r from-primary-dark/5 to-primary-light/10 rounded-3xl p-6 shadow-sm border border-primary-light/50 my-8 max-w-3xl mx-auto flex items-start space-x-6">
      <button 
        onClick={toggleListening}
        className={`flex-shrink-0 p-5 rounded-full shadow-lg transition-all transform hover:scale-105 ${
          isListening ? 'bg-danger text-white animate-pulse' : 'bg-primary-dark text-white'
        }`}
      >
        {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
      </button>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
          <Volume2 className="w-5 h-5 mr-2 text-primary-dark" />
          AI Voice Assistant
        </h3>
        <p className="text-sm text-gray-500 mb-4">Tap the mic and say "I feel dizzy" or ask about your risk status.</p>
        
        {transcript && (
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">You said:</span>
            <p className="text-gray-800 font-medium">"{transcript}"</p>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center text-primary-dark">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            <span className="text-sm font-medium">Thinking...</span>
          </div>
        )}

        {aiResponse && (
          <div className="bg-primary-light/20 p-4 rounded-xl border border-primary-light/50">
            <span className="text-xs font-bold text-primary-dark uppercase">AI Response:</span>
            <p className="text-gray-800 font-medium mt-1">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
