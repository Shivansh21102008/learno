import React from 'react';

interface LearnoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const LearnoLogo: React.FC<LearnoLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const iconSizes = {
    sm: { box: 'w-7 h-7', text: 'text-base', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { box: 'w-9 h-9', text: 'text-xl', badge: 'text-[9px] px-2 py-0.5' },
    lg: { box: 'w-11 h-11', text: 'text-2xl', badge: 'text-[10px] px-2.5 py-0.5' },
    xl: { box: 'w-14 h-14', text: 'text-3xl', badge: 'text-xs px-3 py-1' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Glitch9 Cyber Emblem */}
      <div
        className={`${iconSizes.box} relative rounded-xl bg-black border border-white/15 p-1 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:border-[#00FF66] group-hover:shadow-[0_0_20px_rgba(0,255,102,0.4)]`}
      >
        {/* Subtle cyber grid inside emblem */}
        <div className="absolute inset-0 rounded-xl bg-[radial-gradient(#00FF66_1px,transparent_1px)] [background-size:6px_6px] opacity-20 pointer-events-none" />

        {/* Glitch9 Cyber Skull / Academic Neural Node */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white transition-colors duration-200 group-hover:text-[#00FF66] drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]"
        >
          {/* Cybernetic Graduation Cap / Diamond Node */}
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(0,255,102,0.15)" stroke="#00FF66" />
          <path d="M2 17l10 5 10-5" stroke="#FFFFFF" />
          <path d="M2 12l10 5 10-5" stroke="#00FF66" />
        </svg>

        {/* Live Neon Rig Indicator */}
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
        </span>
      </div>

      {/* Brand Typography: Glitch9 Cyber Treatment */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-1 leading-none">
          <span className={`${iconSizes.text} font-display tracking-tight text-white uppercase`}>
            LEARN<span className="text-[#00FF66] drop-shadow-[0_0_12px_rgba(0,255,102,0.7)]">O</span>
          </span>
          <span className="font-mono text-[9px] text-[#00FF66] border border-[#00FF66]/30 px-1 py-0.5 rounded bg-[#00FF66]/10 ml-0.5 tracking-tighter">
            .AI
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`${iconSizes.badge} font-mono font-bold uppercase tracking-[0.2em] rounded border border-white/10 bg-white/[0.04] text-neutral-300 inline-flex items-center gap-1 leading-normal`}
            >
              RIG 5–9
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-400 hidden xl:inline">
              NCERT // CBSE
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
