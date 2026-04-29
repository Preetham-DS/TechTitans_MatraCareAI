import React from 'react';
import { HeartPulse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-pink-600" />
            <span className="text-lg font-bold text-gray-800 tracking-tight">MatraCare</span>
          </div>

          {/* Disclaimer */}
          <p className="text-sm text-gray-500 text-center max-w-md leading-relaxed">
            <strong className="text-gray-700">Disclaimer:</strong> This is an early risk awareness tool, not a medical diagnosis. Always consult with a certified healthcare provider for medical advice.
          </p>

          {/* Copyright */}
          <div className="text-sm text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} MatraCare
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
