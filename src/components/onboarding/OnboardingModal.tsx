import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VALID_CLASSES, StudentClass } from '../../types';
import { SUBJECT_METAS } from '../../data/curriculumData';
import { GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { BadgeIcon } from '../common/BadgeIcon';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, completeOnboarding, user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClass, setSelectedClass] = useState<StudentClass>(user.class || 'Class 8');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'Science',
    'English',
    'Social Science',
    'Computer',
    'Hindi',
  ]);

  if (!isOnboardingOpen) return null;

  const toggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectName));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

  const handleFinish = () => {
    completeOnboarding(selectedClass, selectedSubjects);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true"
        className="relative w-full max-w-xl bg-glitch-panel border border-glitch-border rounded-xl shadow-2xl overflow-y-auto max-h-[92vh] transition-colors"
      >
        {/* Banner */}
        <div className="bg-glitch-surface border-b border-glitch-border px-6 py-6 text-text-primary text-center relative">
          <div className="w-12 h-12 rounded-xl bg-glitch-ink mx-auto flex items-center justify-center mb-3 border border-glitch-border">
            <GraduationCap className="w-7 h-7 text-glitch-green" />
          </div>
          <h2 className="text-2xl font-display font-bold tracking-tight text-glitch-green">Welcome to Learno</h2>
          <p className="text-text-secondary text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Practice your syllabus. Improve your knowledge. Track your progress.
          </p>
        </div>

        {/* Steps */}
        <div className="p-6">
          {step === 1 ? (
            <div>
              <div className="mb-4">
                <span className="text-[11px] font-bold text-glitch-green font-mono uppercase tracking-wider">
                  Step 1 of 2
                </span>
                <h3 className="text-lg font-bold text-text-primary mt-0.5">
                  Confirm Your Academic Class
                </h3>
                <p className="text-xs text-text-muted">
                  Learno strictly customizes syllabus and 200 practice tests based on your class.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-5">
                {VALID_CLASSES.map((c) => {
                  const isSelected = selectedClass === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedClass(c)}
                      className={`p-2.5 min-h-[44px] rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-glitch-green bg-glitch-green/10 text-glitch-green ring-1 ring-glitch-green'
                          : 'border-glitch-border bg-glitch-surface text-text-primary hover:border-glitch-green/50'
                      }`}
                    >
                      <span className="text-sm font-bold">{c.replace('Class ', 'C-')}</span>
                      <span className="text-[10px] text-text-secondary">200 Tests</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-glitch-green mt-1" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full min-h-[44px] p-2.5 bg-glitch-green hover:brightness-110 text-glitch-ink text-xs font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Select Subjects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <span className="text-[11px] font-bold text-glitch-green font-mono uppercase tracking-wider">
                  Step 2 of 2
                </span>
                <h3 className="text-lg font-bold text-text-primary mt-0.5">
                  Select Your Subjects for {selectedClass}
                </h3>
                <p className="text-xs text-text-muted">
                  Configure the subjects you want to practice. All subjects are included in the 200-test curriculum.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-5 max-h-64 overflow-y-auto pr-1">
                {Object.entries(SUBJECT_METAS).map(([subjName, meta]) => {
                  const isSelected = selectedSubjects.includes(subjName);
                  return (
                    <button
                      key={subjName}
                      type="button"
                      onClick={() => toggleSubject(subjName)}
                      className={`p-3 min-h-[44px] rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-glitch-green bg-glitch-green/10 text-glitch-green'
                          : 'border-glitch-border bg-glitch-surface text-text-primary hover:bg-glitch-card'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm"
                          style={{ backgroundColor: meta.bgColor, color: meta.color }}
                        >
                          <BadgeIcon name={meta.iconName} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-text-primary">{subjName}</div>
                          <div className="text-[11px] text-text-secondary">
                            {meta.testCount} Practice Tests
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-glitch-green border-glitch-green text-glitch-ink' : 'border-glitch-border'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 p-2.5 min-h-[44px] border border-glitch-border bg-glitch-card hover:bg-glitch-surface text-text-primary text-xs font-bold rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex-1 p-2.5 min-h-[44px] bg-glitch-green hover:brightness-110 text-glitch-ink text-xs font-bold shadow-[0_0_12px_rgba(0,255,102,0.25)] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
