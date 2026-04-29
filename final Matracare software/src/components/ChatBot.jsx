import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { medicalPatterns, emergencyHelplines } from '../data/medicalContext';

const apiKey = import.meta.env.VITE_GEMINI_KEY || 'MOCK_KEY';
const genAI = new GoogleGenerativeAI(apiKey);

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi there. I am your MatraCare assistant. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      let reply = "";

      if (apiKey === 'MOCK_KEY') {
        // Fallback mock response for testing without an API key
        await new Promise(resolve => setTimeout(resolve, 1500));
        reply = "I understand you're feeling tired. Fatigue can be a normal symptom, but it's important to rest and stay hydrated. If it becomes severe or is accompanied by fainting, please consult a doctor.";
      } else {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemContext = `
          You are an empathetic, professional menstrual and maternal health assistant for MatraCare.
          Use this medical context for grounding:
          Patterns: ${JSON.stringify(medicalPatterns)}
          Emergency Helplines (India): ${JSON.stringify(emergencyHelplines)}
          
          Keep answers short (1-3 sentences), empathetic, and always suggest consulting a doctor if symptoms are severe (e.g., fainting, hemorrhage).
        `;

        const prompt = `${systemContext}\n\nUser: ${userMessage}\nAssistant:`;
        const result = await model.generateContent(prompt);
        reply = result.response.text();
      }

      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting right now. Please reach out to helpline 104 if you need immediate advice." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 bg-pink-600 text-white rounded-full shadow-2xl hover:bg-pink-700 transition-all z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-80 sm:w-96 bg-slate-50 border border-gray-200 shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden h-[520px] max-h-[82vh]">
          {/* Header */}
          <div className="bg-pink-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> MatraCare AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-pink-500 p-1 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-pink-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin text-pink-600" />
                  <span className="text-xs font-medium">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your health..."
              className="flex-1 bg-slate-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
