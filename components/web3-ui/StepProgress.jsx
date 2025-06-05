import React from 'react';
import { Check, CircleDot, Circle } from 'lucide-react';

const StepProgress = ({ steps = ["Select Type", "Configure", "Deploy"], currentStep = 1 }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="flex items-start space-x-1 sm:space-x-2">
        {steps.map((stepName, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          // const isUpcoming = stepNumber > currentStep; // Not explicitly used for styling differentiation beyond current

          let statusStyles = {
            iconContainer: 'bg-slate-700 border-slate-600',
            icon: 'text-slate-400',
            name: 'text-slate-400',
            connector: 'bg-slate-700',
          };

          if (isCompleted) {
            statusStyles = {
              iconContainer: 'bg-brand-accent-blue border-brand-accent-blue',
              icon: 'text-white',
              name: 'text-brand-accent-blue',
              connector: 'bg-brand-accent-blue',
            };
          } else if (isCurrent) {
            statusStyles = {
              iconContainer: 'border-brand-accent-blue ring-1 sm:ring-2 ring-brand-accent-blue bg-slate-700',
              icon: 'text-brand-accent-blue',
              name: 'text-brand-accent-blue font-semibold',
              connector: 'bg-slate-700', // Connector leading to current is upcoming style
            };
          }
          // Upcoming uses default statusStyles

          return (
            <li key={stepName} className={`relative ${index < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
                <div className="flex items-center">
                  <span className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 ${statusStyles.iconContainer} transition-colors duration-300`}>
                    {isCompleted ? <Check size={16} className={statusStyles.icon} /> : 
                     isCurrent ? <CircleDot size={16} className={statusStyles.icon} /> : 
                     <Circle size={16} className={statusStyles.icon} /> 
                    }
                  </span>
                  <span className={`ml-0 sm:ml-2 mt-1 sm:mt-0 text-xs sm:text-sm ${statusStyles.name} transition-colors duration-300`}>{stepName}</span>
                </div>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 sm:left-3.5 top-3.5 sm:top-3.5 h-0.5 w-full" aria-hidden="true" style={{ transform: 'translateX(-50%) sm:translateX(0)'}}>
                   <div className={`absolute top-0 h-0.5 w-full ${index < currentStep - 1 ? statusStyles.connector : 'bg-slate-700'} transition-colors duration-300`} style={{left: 'calc(50% + 0.5rem)', width: 'calc(100% - 1rem)'}}/>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepProgress;