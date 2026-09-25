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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div data-lenis-prevent className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/70 dark:border-amber-900/60 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Change Academic Class</h3>
              <p className="text-xs text-amber-800 dark:text-amber-300">Syllabus & curriculum notice</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-amber-100/50 dark:hover:bg-amber-900/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-border dark:border-slate-700 text-xs text-text-secondary dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-text-primary dark:text-white">Important: </span>
            Changing your class will instantly switch your syllabus, subjects, and the 200 available
            chapter tests to match the new class curriculum.
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary dark:text-white mb-2">
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
                    className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <span>{c.replace('Class ', 'C-')}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-primary-100' : 'text-text-secondary dark:text-slate-400'}`}>
                      {c.replace('Class ', '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-text-secondary dark:text-slate-300 bg-blue-50/60 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
            <span>Currently enrolled in:</span>
            <span className="font-bold text-primary dark:text-primary-light">{user.class}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-secondary dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
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
