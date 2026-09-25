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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-800 overflow-hidden transition-colors">
        {/* Banner */}
        <div className="bg-primary px-6 py-6 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center mb-3 backdrop-blur-sm border border-white/20">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Learno</h2>
          <p className="text-primary-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Practice your syllabus. Improve your knowledge. Track your progress.
          </p>
        </div>

        {/* Steps */}
        <div className="p-6">
          {step === 1 ? (
            <div>
              <div className="mb-4">
                <span className="text-[11px] font-bold text-primary dark:text-primary-light uppercase tracking-wider">
                  Step 1 of 2
                </span>
                <h3 className="text-lg font-bold text-text-primary dark:text-white mt-0.5">
                  Confirm Your Academic Class
                </h3>
                <p className="text-xs text-text-secondary dark:text-slate-400">
                  Learno strictly customizes syllabus and 200 practice tests based on your class.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
                {VALID_CLASSES.map((c) => {
                  const isSelected = selectedClass === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedClass(c)}
                      className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-primary bg-primary-50 dark:bg-primary-950/60 text-primary dark:text-primary-light ring-2 ring-primary/20 shadow-sm'
                          : 'border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-text-primary dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      <span className="text-base font-bold">{c}</span>
                      <span className="text-[11px] text-text-secondary dark:text-slate-400">200 Tests</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary-light mt-1" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Select Subjects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <span className="text-[11px] font-bold text-primary dark:text-primary-light uppercase tracking-wider">
                  Step 2 of 2
                </span>
                <h3 className="text-lg font-bold text-text-primary dark:text-white mt-0.5">
                  Select Your Subjects for {selectedClass}
                </h3>
                <p className="text-xs text-text-secondary dark:text-slate-400">
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
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-50/60 dark:bg-primary-950/60 ring-1 ring-primary/20'
                          : 'border-border dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 opacity-70'
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
                          <div className="text-xs font-bold text-text-primary dark:text-white">{subjName}</div>
                          <div className="text-[11px] text-text-secondary dark:text-slate-400">
                            {meta.testCount} Practice Tests
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600'
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
                  className="px-4 py-2.5 border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-secondary dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
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
