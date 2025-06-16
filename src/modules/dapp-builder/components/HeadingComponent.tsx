// src/modules/dapp-builder/components/HeadingComponent.tsx
import React from 'react';
import { TextComponentProps } from '../types'; // Assuming Heading might share some props with Text

// For MVP, HeadingProps might be similar to TextComponentProps or a subset
// Let's reuse TextComponentProps for simplicity now, but it could be its own interface.
export interface HeadingComponentProps extends TextComponentProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const HeadingComponent: React.FC<{ properties: HeadingComponentProps }> = ({ properties }) => {
  const { content = 'Default Heading', level = 1, textAlign, color, fontSize, fontWeight } = properties;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const style: React.CSSProperties = {
    textAlign: textAlign || 'left',
    color: color || undefined,
    fontSize: fontSize || undefined,
    fontWeight: fontWeight || undefined,
  };

  return <Tag style={style}>{content}</Tag>;
};

export default HeadingComponent;
