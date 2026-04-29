import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { processMultimodalInput, generateSpeech } from '../utils/geminiService';

const VoiceAssistant = ({ onDataExtracted }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        await handleAudioProcessing(audioBlob);
      };

      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAiMessage('Listening...');
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setAiMessage("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleAudioProcessing = async (audioBlob) => {
    setIsProcessing(true);
    setAiMessage('Gemini is processing your voice...');
    
    try {
      // 1. Send audio to Gemini
      const extractedData = await processMultimodalInput(audioBlob);
      console.log("Gemini Extracted Data:", extractedData);
      
      setAiMessage('Data extracted successfully. Populating form...');
      
      // 2. Pass data to parent to auto-populate RiskForm fields
      if (onDataExtracted) {
        onDataExtracted(extractedData);
      }
      
      // 3. Trigger TTS confirmation
      const confirmText = "I have extracted your data. You can now analyze your risk.";
      generateSpeech(confirmText);
      setAiMessage(confirmText);
      
    } catch (error) {
      console.error("Error processing audio:", error);
      setAiMessage("Sorry, I couldn't understand that. Please try again or type manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-6 shadow-sm border border-pink-100 my-8 max-w-3xl mx-auto flex items-start space-x-6">
      <button 
        onClick={toggleRecording}
        className={`flex-shrink-0 p-5 rounded-full shadow-lg transition-all transform hover:scale-105 ${
          isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-pink-600 text-white hover:bg-pink-700'
        }`}
      >
        {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
      </button>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
          <Volume2 className="w-5 h-5 mr-2 text-pink-600" />
          Gemini Voice Assistant
        </h3>
        <p className="text-sm text-gray-500 mb-4">Tap the mic and describe your cycle length, pain level, and any symptoms.</p>
        
        {(isRecording || isProcessing) && (
          <div className="flex items-center text-pink-600 mb-3">
            {isProcessing && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            <span className="text-sm font-medium">{isRecording ? "Gemini is listening..." : "Processing..."}</span>
          </div>
        )}

        {aiMessage && (
          <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
            <span className="text-xs font-bold text-pink-600 uppercase">Assistant:</span>
            <p className="text-gray-800 font-medium mt-1">{aiMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
