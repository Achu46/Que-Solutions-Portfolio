import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Fallback2D() {
  const { isDark } = useTheme();

  return (
    <div 
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Subtle radial ambient glow using brand palette */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, #54703F 0%, #1E2917 60%, transparent 100%)' 
            : 'radial-gradient(circle, #94B380 0%, #D7E3CD 50%, transparent 100%)',
        }}
      />

      {/* Decorative procedural geometric SVG rings */}
      <svg 
        className="w-[450px] h-[450px] opacity-15"
        viewBox="0 0 400 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="200" r="180" stroke="#54703F" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="200" cy="200" r="130" stroke="#425832" strokeWidth="1" />
        <circle cx="200" cy="200" r="80" stroke="#54703F" strokeWidth="2" strokeDasharray="12 4" />
        <line x1="20" y1="200" x2="380" y2="200" stroke="#54703F" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="200" y1="20" x2="200" y2="380" stroke="#54703F" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}
