// src/modules/dapp-builder/editor-ui/MainEditorLayout.tsx
import React from 'react';

// Placeholder for sub-components - will be created in subsequent steps
const ComponentPalette = () => <div style={{ border: '1px solid lightblue', padding: '10px', minWidth: '200px' }}>Component Palette Area</div>;
const CanvasArea = () => <div style={{ border: '1px solid lightgreen', padding: '10px', flexGrow: 1 }}>Canvas Area</div>;
const PropertiesPanel = () => <div style={{ border: '1px solid lightcoral', padding: '10px', minWidth: '250px' }}>Properties Panel Area</div>;
const EditorHeader = () => <div style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>Editor Header (Project Name, Save, Preview, Publish)</div>;

const MainEditorLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>
      <EditorHeader />
      <div style={{ display: 'flex', flexGrow: 1, gap: '10px' }}>
        <ComponentPalette />
        <CanvasArea />
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default MainEditorLayout;
