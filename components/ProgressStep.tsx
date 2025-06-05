
import React from 'react';
import { Check, CircleDot, Circle } from 'lucide-react';

interface Step {
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  icon?: React.ReactNode; // Optional custom icon for the step
  description?: string; // Optional short description for the step
}

interface ProgressStepProps {
  steps: Step[];
  currentStepIndex: number; // Explicitly pass current index
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const ProgressStep: React.FC<ProgressStepProps> = ({
  steps,
  currentStepIndex,
  orientation = 'horizontal',
  className = '',
}) => {
  return (
    <div className={`flex ${orientation === 'horizontal' ? 'flex-row space-x-2 md:space-x-4 items-start' : 'flex-col space-y-2'} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed' || index < currentStepIndex;
        const isCurrent = step.status === 'current' || index === currentStepIndex;
        const isUpcoming = step.status === 'upcoming' || index > currentStepIndex;

        let IconComponent = Circle;
        let iconColor = 'text-slate-500';
        let textColor = 'text-slate-500';
        let lineColor = 'bg-slate-700';

        if (isCompleted) {
          IconComponent = Check;
          iconColor = 'text-white';
          textColor = 'text-brand-accent-blue';
          lineColor = 'bg-brand-accent-blue';
        } else if (isCurrent) {
          IconComponent = CircleDot; // Or a custom pulsing icon
          iconColor = 'text-brand-accent-blue';
          textColor = 'text-sky-300 font-semibold';
          lineColor = 'bg-brand-accent-blue'; // Line leading to current is colored
        }
        // Upcoming stays as default

        return (
          <React.Fragment key={index}>
            <div className={`flex ${orientation === 'horizontal' ? 'flex-col items-center' : 'flex-row items-center'} relative`}>
              <div 
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1
                  ${isCompleted ? 'bg-brand-accent-blue border-brand-accent-blue' : ''}
                  ${isCurrent ? 'border-sky-300 bg-slate-700' : ''}
                  ${isUpcoming ? 'border-slate-600 bg-slate-800' : ''}
                  ${orientation === 'horizontal' ? '' : 'mr-3'}
                `}
                aria-label={`${step.name} - ${step.status}`}
              >
                {step.icon ? React.cloneElement(step.icon as React.ReactElement<{ size?: number, className?: string }>, { size: 16, className: iconColor }) : <IconComponent size={16} className={iconColor} />}
              </div>
              <div className={`${orientation === 'horizontal' ? 'text-center' : ''}`}>
                <span className={`text-xs md:text-sm ${textColor}`}>{step.name}</span>
                {step.description && <p className={`text-xs ${isCurrent ? 'text-slate-400' : 'text-slate-600'} ${orientation === 'horizontal' ? '' : 'mt-0.5'}`}>{step.description}</p>}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`flex-grow 
                  ${orientation === 'horizontal' ? 'h-0.5 mt-4 mx-1 md:mx-2' : 'w-0.5 ml-4 my-1 min-h-[20px]'} 
                  ${index < currentStepIndex ? 'bg-brand-accent-blue' : 'bg-slate-700'}
                `}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressStep;