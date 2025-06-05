import React from 'react';

// This is a VERY basic modal structure.
// For a production-ready modal, consider using Radix UI Dialog or Headless UI Dialog
// for accessibility and feature completeness (focus trapping, portal, etc.).

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`bg-card text-card-foreground rounded-lg shadow-xl p-6 w-full ${sizeStyles[size]} ${className}`}>
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-primary p-1 rounded-full"
                aria-label="Close modal"
              >
                ✕ {/* Replace with proper Icon component */}
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export { Modal };
export default Modal;
