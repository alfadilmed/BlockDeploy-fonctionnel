// src/modules/dapp-builder/components/TextComponent.tsx
import React from 'react';
import { TextComponentProps } from '../types';

const TextComponent: React.FC<{ properties: TextComponentProps }> = ({ properties }) => {
  const { content = 'Default Text Paragraph', textAlign, color, fontSize, fontWeight } = properties;

  const style: React.CSSProperties = {
    textAlign: textAlign || 'left',
    color: color || undefined,
    fontSize: fontSize || undefined,
    fontWeight: fontWeight || undefined,
  };

  return <p style={style}>{content}</p>;
};

export default TextComponent;
