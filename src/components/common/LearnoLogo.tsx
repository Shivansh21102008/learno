import React from 'react';

interface LearnoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  isLink?: boolean;
}

export const LearnoLogo: React.FC<LearnoLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  // Dimensions according to size
  const iconSizes = {
    sm: { box: 'w-8 h-8', svg: 22, text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.2' },
    md: { box: 'w-10 h-10', svg: 28, text: 'text-xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { box: 'w-12 h-12', svg: 34, text: 'text-2xl', badge: 'text-[11px] px-2.5 py-0.5' },
    xl: { box: 'w-16 h-16', svg: 44, text: 'text-3xl', badge: 'text-xs px-3 py-1' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem Icon */}
      <div
        className={`${iconSizes.box} relative rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-0.5 shadow-lg shadow-blue-500/25 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
      >
        {/* Subtle inner highlight border */}
        <div className="absolute inset-0.5 rounded-[14px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        <svg
          width={iconSizes.svg}
          height={iconSizes.svg}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-md"
        >
          {/* Open Book Wings (Knowledge Base) */}
          <path
            d="M8 34C13 32 20 33 24 36C28 33 35 32 40 34V14C35 12 28 13 24 16C20 13 13 12 8 14V34Z"
            fill="white"
            fillOpacity="0.95"
          />
          {/* Book Spine Center Divider */}
          <path
            d="M24 16V36"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Academic Graduation Cap (Mortarboard Top) */}
          <path
            d="M24 6L6 14L24 22L42 14L24 6Z"
            fill="#1E293B"
            stroke="#F8FAFC"
            strokeWidth="1.5"
          />

          {/* Graduation Cap Base Underlayer */}
          <path
            d="M14 18V25C14 28.5 18.5 31 24 31C29.5 31 34 28.5 34 25V18"
            fill="#0F172A"
            fillOpacity="0.8"
            stroke="#F8FAFC"
            strokeWidth="1"
          />

          {/* Golden Tassel & Intellect Star */}
          <path
            d="M38 14.5V23.5M38 23.5L40 25M38 23.5L36 25"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Shining Intellect Spark (4-point star in center) */}
          <path
            d="M24 11V17M21 14H27"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="14" r="1.5" fill="#FEF08A" />
        </svg>

        {/* Ambient Corner Sparkle */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-white" />
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`${iconSizes.text} font-black tracking-tight text-slate-900 dark:text-white flex items-center`}
          >
            Learn
            <span className="text-primary bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              o
            </span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mb-1 animate-pulse" />
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`${iconSizes.badge} font-extrabold uppercase tracking-wider rounded-md bg-blue-50 dark:bg-blue-950/80 text-primary dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 inline-flex items-center gap-1 leading-normal`}
            >
              Classes 5–9
            </span>
            <span className="text-[10px] text-text-secondary dark:text-slate-400 font-medium hidden sm:inline">
              CBSE & NCERT
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
