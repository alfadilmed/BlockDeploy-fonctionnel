
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepNames?: string[]; // Optional names for each step
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, stepNames }) => {
  const percentage = Math.max(0, Math.min(100, (currentStep / totalSteps) * 100));

  if (totalSteps <= 0) return null;

  return (
    <div className="w-full my-8">
      {stepNames && stepNames.length === totalSteps ? (
        <div className="flex justify-between items-center mb-2">
          {stepNames.map((name, index) => (
            <div
              key={index}
              className={`flex-1 text-center ${
                index < currentStep ? 'text-brand-accent-blue' :
                index === currentStep ? 'text-sky-300 font-semibold' :
                'text-slate-500'
              }`}
            >
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 ${
                    index < currentStep ? 'bg-brand-accent-blue border-brand-accent-blue text-white' :
                    index === currentStep ? 'border-sky-300 bg-slate-700' :
                    'border-slate-600 bg-slate-800'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className="text-xs md:text-sm">{name}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-300 mb-1">
          Step {currentStep + 1} of {totalSteps}
        </div>
      )}
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-brand-accent-purple to-brand-accent-blue h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
