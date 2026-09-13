import React from 'react';

interface JharkhandEmblemProps {
  className?: string;
  size?: number;
}

export const JharkhandEmblem: React.FC<JharkhandEmblemProps> = ({
  className = '',
  size = 48,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${className}`}
      style={{ width: size, height: size }}
      title="Government of Jharkhand Official Emblem"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Ring with subtle border */}
        <circle cx="50" cy="50" r="48" fill="#0d5c3a" stroke="#d4af37" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="45" fill="#146c43" stroke="#fef3c7" strokeWidth="1" />
        
        {/* Outer Ring Concentric Tribal Dancers / Motif Ring */}
        <circle cx="50" cy="50" r="38" fill="#ffffff" stroke="#0d5c3a" strokeWidth="1.5" />
        
        {/* Decorative Ring of Palash Flowers & Green leaves */}
        <circle cx="50" cy="50" r="36" fill="none" stroke="#e06c27" strokeWidth="1" strokeDasharray="2 3" />
        
        {/* Inner Gold / White Disc */}
        <circle cx="50" cy="50" r="30" fill="#fcfbf7" stroke="#d4af37" strokeWidth="1.2" />

        {/* Ashoka Lion Capital (Simha Stambha) Stylized Representation */}
        {/* Base Pedestal with Ashoka Chakra */}
        <path d="M38 64 H62 V68 H38 Z" fill="#996515" />
        <circle cx="50" cy="66" r="2.5" fill="#0d5c3a" stroke="#d4af37" strokeWidth="0.5" />
        
        {/* Central Lion Body & Pillars */}
        <path
          d="M44 48 C44 44 47 40 50 40 C53 40 56 44 56 48 L55 64 H45 Z"
          fill="#c68a2c"
          stroke="#78470a"
          strokeWidth="0.8"
        />
        {/* Left Lion */}
        <path
          d="M39 50 C38 46 41 42 45 42 L46 64 H41 Z"
          fill="#b87d24"
          stroke="#78470a"
          strokeWidth="0.6"
        />
        {/* Right Lion */}
        <path
          d="M61 50 C62 46 59 42 55 42 L54 64 H59 Z"
          fill="#b87d24"
          stroke="#78470a"
          strokeWidth="0.6"
        />
        
        {/* Lion Heads / Crowns */}
        <circle cx="50" cy="38" r="4.5" fill="#d4af37" stroke="#78470a" strokeWidth="0.8" />
        <circle cx="43" cy="41" r="3.5" fill="#c68a2c" stroke="#78470a" strokeWidth="0.7" />
        <circle cx="57" cy="41" r="3.5" fill="#c68a2c" stroke="#78470a" strokeWidth="0.7" />

        {/* Elephant silhouettes on green circle ring */}
        <path d="M22 48 Q25 45 28 48 Q29 52 26 53 Z" fill="#ffffff" opacity="0.9" />
        <path d="M72 48 Q75 45 78 48 Q79 52 76 53 Z" fill="#ffffff" opacity="0.9" />
        <path d="M48 20 Q50 17 53 20 Q54 24 51 25 Z" fill="#ffffff" opacity="0.9" />

        {/* Text Arc or Representation */}
        {/* Top Text Arc: JHARKHAND SARKAR */}
        <path
          id="textArcTop"
          d="M 18 50 A 32 32 0 0 1 82 50"
          fill="none"
        />
        <text fontSize="5" fill="#d4af37" fontWeight="bold" letterSpacing="1">
          <textPath href="#textArcTop" startOffset="50%" textAnchor="middle">
            झारखण्ड सरकार
          </textPath>
        </text>

        {/* Bottom Text Arc: GOVT OF JHARKHAND */}
        <path
          id="textArcBottom"
          d="M 82 50 A 32 32 0 0 1 18 50"
          fill="none"
        />
        <text fontSize="4.2" fill="#fef3c7" fontWeight="bold" letterSpacing="0.8">
          <textPath href="#textArcBottom" startOffset="50%" textAnchor="middle">
            GOVT. OF JHARKHAND
          </textPath>
        </text>

        {/* Satyameva Jayate Banner under capital */}
        <rect x="36" y="70" width="28" height="4" rx="1" fill="#0d5c3a" stroke="#d4af37" strokeWidth="0.5" />
        <text x="50" y="73.2" fontSize="2.8" fill="#ffffff" textAnchor="middle" fontWeight="bold">
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
};
