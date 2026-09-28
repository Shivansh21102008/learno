import React from 'react';
import { VALID_CLASSES } from '../../types';
import { LearnoLogo } from './LearnoLogo';
import { Cpu, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 mt-20 pb-24 lg:pb-12 text-neutral-400 relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <LearnoLogo size="md" />
            <p className="font-sans text-xs text-neutral-400 leading-relaxed max-w-md">
              High-performance cloud academic platform engineered for Classes 5 to 9.
              Streamlining chapter test rigs, AI Viva verbal cognition, and competitive syllabus practice with zero friction.
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#00FF66]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse" />
              <span>100% CBSE & NCERT ALIGNED RIGS</span>
            </div>
          </div>

          {/* Supported Class Rigs */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white mb-3 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>Supported Rigs</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {VALID_CLASSES.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 font-mono text-xs rounded border border-white/15 bg-white/[0.04] text-neutral-300 hover:border-[#00FF66]/50 hover:text-white transition-colors"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="font-mono text-[10px] text-neutral-400 mt-3 tracking-wider">
              Classes 5, 6, 7, 8 & 9.
            </p>
          </div>

          {/* Core Telemetry Specifications */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>Platform Specs</span>
            </h4>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-center gap-2 text-neutral-300">
                <span className="w-1 h-1 rounded-full bg-[#00FF66]" />
                <span>200 Chapter Test Rigs</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <span className="w-1 h-1 rounded-full bg-[#00FF66]" />
                <span>AI Oral Viva Hub</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <span className="w-1 h-1 rounded-full bg-[#00FF66]" />
                <span>Real-Time Accuracy Telemetry</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-300">
                <span className="w-1 h-1 rounded-full bg-[#00FF66]" />
                <span>24/7 Neural AI Copilot</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Glitch9 Telemetry Status */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between font-mono text-[11px] text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} LEARNO.AI // ALL RIGHTS RESERVED.</p>
          
          <div className="flex flex-wrap items-center gap-5 text-neutral-400">
            <a href="#" className="hover:text-[#00FF66] transition-colors cursor-pointer">
              PRIVACY // PROTOCOL
            </a>
            <span aria-hidden="true">•</span>
            <a href="#" className="hover:text-[#00FF66] transition-colors cursor-pointer">
              TERMS OF SERVICE
            </a>
            <span aria-hidden="true">•</span>
            <a href="#" className="hover:text-[#00FF66] transition-colors cursor-pointer">
              NCERT SYLLABUS
            </a>
          </div>

          {/* Live Glitch9 Status Beacon */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/60 font-mono text-[10px] text-neutral-300 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66] animate-pulse" />
            <span>ALL RIGS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
