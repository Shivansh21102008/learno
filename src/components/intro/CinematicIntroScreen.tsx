import React, { useState, useEffect } from 'react';

interface CinematicIntroScreenProps {
  onComplete: () => void;
}

export const CinematicIntroScreen: React.FC<CinematicIntroScreenProps> = ({ onComplete }) => {
  const line1Full = 'Made & Directed By';
  const line2Full = 'Rudra Giri';

  const [line1Text, setLine1Text] = useState('');
  const [line2Text, setLine2Text] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Exact 2.5-second cinematic duration (2-3 seconds as requested)
  const TOTAL_DURATION_MS = 2500;

  useEffect(() => {
    // 1. Fast cursor blink interval
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 200);

    // 2. Typing Sequence:
    // 0.15s: Start typing Line 1 ("Made & Directed By")
    const startLine1Timeout = setTimeout(() => {
      let index = 0;
      const typeLine1 = setInterval(() => {
        index++;
        setLine1Text(line1Full.slice(0, index));
        if (index >= line1Full.length) {
          clearInterval(typeLine1);

          // 0.8s: Line 2 ("Rudra Giri") types rapidly
          setTimeout(() => {
            let index2 = 0;
            const typeLine2 = setInterval(() => {
              index2++;
              setLine2Text(line2Full.slice(0, index2));
              if (index2 >= line2Full.length) {
                clearInterval(typeLine2);
              }
            }, 45);
          }, 80);
        }
      }, 35);
    }, 150);

    // 3. Smooth fade out at 2.1s (400ms transition)
    const fadeTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, 2100);

    // 4. Complete and reveal app at 2.5s
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, TOTAL_DURATION_MS);

    return () => {
      clearInterval(cursorInterval);
      clearTimeout(startLine1Timeout);
      clearTimeout(fadeTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div
      role="dialog"
      aria-label="Cinematic Intro Screen"
      className={`fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Glitch9 Cyber Grid Background */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Glitch9 Aurora Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.12)_0%,rgba(5,5,5,0.95)_70%,#050505_100%)]" />

      {/* Main Center Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center justify-center">
        {/* Line 1: Made & Directed By */}
        <div className="min-h-[1.75rem] sm:min-h-[2.25rem] flex items-center justify-center mb-1 sm:mb-2">
          <p className="font-mono text-xs sm:text-sm md:text-base font-medium tracking-[0.35em] sm:tracking-[0.45em] uppercase text-neutral-400">
            {line1Text}
            {line1Text.length > 0 && line2Text.length === 0 && (
              <span
                className={`inline-block ml-1 w-0.5 h-4 sm:h-5 bg-[#00FF66] shadow-[0_0_8px_#00FF66] align-middle ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </p>
        </div>

        {/* Line 2: Rudra Giri (Glitch9 Display Typography) */}
        <div className="min-h-[3.5rem] sm:min-h-[5.5rem] md:min-h-[6.5rem] flex items-center justify-center">
          <h1 className="font-display text-3xl sm:text-5xl md:text-8xl lg:text-9xl tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]">
            {line2Text === line2Full ? (
              <>
                Rudra <span className="text-[#00FF66] drop-shadow-[0_0_30px_rgba(0,255,102,0.8)]">Giri</span>
              </>
            ) : (
              line2Text
            )}
            {line2Text.length > 0 && (
              <span
                className={`inline-block ml-2 w-1 sm:w-1.5 h-8 sm:h-12 md:h-16 bg-[#00FF66] align-middle shadow-[0_0_15px_#00FF66] ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </h1>
        </div>

        {/* Glitch9 Laser Divider */}
        <div
          className={`h-px bg-gradient-to-r from-transparent via-[#00FF66] to-transparent shadow-[0_0_15px_#00FF66] transition-all duration-700 mt-4 sm:mt-6 ${
            line2Text.length === line2Full.length ? 'w-48 sm:w-96 opacity-100' : 'w-0 opacity-0'
          }`}
        />

        {/* Glitch9 Monospace Telemetry Subtext */}
        <div
          className={`mt-4 font-mono text-[10px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-[#00FF66] transition-opacity duration-700 ${
            line2Text.length === line2Full.length ? 'opacity-90' : 'opacity-0'
          }`}
        >
          [ ACADEMIC RIGS // ZERO LATENCY ]
        </div>
      </div>
    </div>
  );
};
