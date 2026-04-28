import React from 'react';
import { HeartPulse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <HeartPulse className="h-6 w-6 text-primary-dark" />
          <span className="text-lg font-bold text-gray-800 tracking-tight">MatraCare</span>
        </div>
        
        <p className="text-sm text-gray-500 text-center md:text-left max-w-md">
          <strong className="text-gray-700">Disclaimer:</strong> This is an early risk awareness tool, not a medical diagnosis. Always consult with a certified healthcare provider for medical advice.
        </p>
        
        <div className="mt-4 md:mt-0 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} MatraCare
        </div>
      </div>
    </footer>
  );
};

export default Footer;
