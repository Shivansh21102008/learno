import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VALID_CLASSES, StudentClass } from '../../types';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';

interface ChangeClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeClassModal: React.FC<ChangeClassModalProps> = ({ isOpen, onClose }) => {
  const { user, changeClass } = useAuth();
  const [selectedClass, setSelectedClass] = useState<StudentClass>(user.class);

  if (!isOpen) return null;

  const handleConfirm = () => {
    changeClass(selectedClass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        role="dialog" 
        aria-modal="true"
        data-lenis-prevent 
        className="relative w-full max-w-md bg-glitch-panel rounded-xl shadow-2xl border border-glitch-border max-h-[92vh] overflow-y-auto transition-colors"
      >
        {/* Header */}
        <div className="p-5 bg-glitch-surface border-b border-glitch-border flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Change Academic Class</h3>
              <p className="text-xs text-amber-500">Syllabus & curriculum notice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-glitch-ink"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-glitch-surface rounded-xl border border-glitch-border text-xs text-text-secondary leading-relaxed">
            <span className="font-bold text-glitch-green">Important: </span>
            Changing your class will instantly switch your syllabus, subjects, and the 200 available
            chapter tests to match the new class curriculum.
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-2">
              Select Target Class (Exclusively Classes 5 to 9)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {VALID_CLASSES.map((c) => {
                const isSelected = selectedClass === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedClass(c)}
                    className={`py-2.5 px-1 min-h-[44px] rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-glitch-green bg-glitch-green text-glitch-ink shadow-sm'
                        : 'border-glitch-border bg-glitch-card text-text-primary hover:bg-glitch-surface'
                    }`}
                  >
                    <span>{c.replace('Class ', 'C-')}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-glitch-ink/80' : 'text-text-secondary'}`}>
                      {c.replace('Class ', '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-text-secondary bg-glitch-surface p-3 rounded-lg border border-glitch-border flex items-center justify-between font-mono">
            <span>Currently enrolled in:</span>
            <span className="font-bold text-glitch-green">{user.class}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-2.5 min-h-[44px] border border-glitch-border bg-glitch-card hover:bg-glitch-surface text-text-primary text-xs font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 p-2.5 min-h-[44px] bg-glitch-green hover:brightness-110 text-glitch-ink text-xs font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Confirm & Switch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
