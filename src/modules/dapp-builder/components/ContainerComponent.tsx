// src/modules/dapp-builder/components/ContainerComponent.tsx
import React from 'react';

export interface ContainerComponentProps {
  // Example properties for a container
  backgroundColor?: string;
  padding?: string; // e.g., '10px', '1em'
  margin?: string;
  border?: string; // e.g., '1px solid #ddd'
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: string;
  // Children are passed by the renderer
}

const ContainerComponent: React.FC<{ properties: ContainerComponentProps, children?: React.ReactNode }> = ({ properties, children }) => {
  const {
    backgroundColor,
    padding,
    margin,
    border,
    flexDirection = 'column', // Default to column
    alignItems = 'flex-start',
    justifyContent = 'flex-start',
    gap
  } = properties;

  const style: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
    padding: padding || '10px', // Default padding
    margin: margin || '5px',    // Default margin
    border: border || '1px dashed #999', // Default border to visualize
    display: 'flex',
    flexDirection,
    alignItems,
    justifyContent,
    gap: gap || undefined,
    minHeight: '50px', // Ensure it's visible even if empty
  };

  return (
    <div style={style}>
      {children || <em style={{color: 'gray', fontSize: '0.9em'}}>Empty Container</em>}
    </div>
  );
};

export default ContainerComponent;
