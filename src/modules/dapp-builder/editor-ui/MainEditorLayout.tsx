// src/modules/dapp-builder/editor-ui/MainEditorLayout.tsx
import React, { useRef } from 'react';
// Ensure initializeDemoDApp is exported from your store and imported here
import useBuilderStore, { initializeDemoDApp } from '../state/builderStore';
import { DAppDefinition } from '../types';

// Placeholder for sub-components - assuming they are defined elsewhere or will be
// For this task, we only focus on adding the export button logic here or in a refined EditorHeader
const ComponentPalette = () => <div style={{ border: '1px solid lightblue', padding: '10px', minWidth: '200px' }}>Component Palette Area</div>;
const CanvasArea = () => <div style={{ border: '1px solid lightgreen', padding: '10px', flexGrow: 1 }}>Canvas Area</div>;
const PropertiesPanel = () => <div style={{ border: '1px solid lightcoral', padding: '10px', minWidth: '250px' }}>Properties Panel Area</div>;

// Refined EditorHeader that includes Import and Export buttons
const EditorHeader: React.FC = () => {
  const { currentDApp, setCurrentDApp } = useBuilderStore(state => ({
    currentDApp: state.currentDApp,
    setCurrentDApp: state.setCurrentDApp
  }));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => { /* ... existing code ... */
    if (!currentDApp) {
      alert('No dApp data to export.');
      return;
    }
    try {
      const jsonString = JSON.stringify(currentDApp, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${currentDApp.name.replace(/\s+/g, '_') || 'dapp'}_config.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error exporting JSON:", error);
      alert('Failed to export dApp configuration.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click(); // Trigger click on hidden file input
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const importedDApp = JSON.parse(text) as DAppDefinition;

        // Basic validation of the imported structure
        if (importedDApp && importedDApp.id && importedDApp.name && Array.isArray(importedDApp.pages)) {
          // Further validation could be added here (e.g., check page structure, component types)
          setCurrentDApp(importedDApp);
          alert(`dApp '${importedDApp.name}' imported successfully!`);
        } else {
          throw new Error('Invalid dApp configuration file structure.');
        }
      } catch (error) {
        console.error("Error importing JSON:", error);
        alert(`Failed to import dApp configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    reader.onerror = (e) => {
        console.error("FileReader error:", e);
        alert('Failed to read the file.');
    }
    reader.readAsText(file);

    // Reset file input value to allow importing the same file again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

      const handleLoadDemo = () => {
        // Optional: Confirm with the user if they want to overwrite the current dApp
        if (currentDApp) {
          if (!window.confirm('Loading a demo will replace your current dApp configuration. Are you sure?')) {
            return;
          }
        }
        initializeDemoDApp(); // This function should call setCurrentDApp internally
        alert('Demo dApp loaded!');
      };

  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        Editor Header (Project: {currentDApp?.name || 'Untitled dApp'})
      </div>
      <div>
        <button
          onClick={handleLoadDemo}
          style={{padding: '5px 10px', marginLeft: '10px'}}
        >
          Load Demo
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          style={{ display: 'none' }}
        />
        <button
          onClick={handleImportClick}
          style={{padding: '5px 10px', marginLeft: '10px'}}
        >
          Import JSON
        </button>
        <button
          onClick={handleExportJson}
          disabled={!currentDApp}
          style={{padding: '5px 10px', marginLeft: '10px'}}
        >
          Export JSON
        </button>
      </div>
    </div>
  );
};

// MainEditorLayout and other sub-components (ComponentPalette, CanvasArea, PropertiesPanel) remain the same.
const ComponentPalette = () => <div style={{ border: '1px solid lightblue', padding: '10px', minWidth: '200px' }}>Component Palette Area</div>;
const CanvasArea = () => <div style={{ border: '1px solid lightgreen', padding: '10px', flexGrow: 1 }}>Canvas Area</div>;
const PropertiesPanel = () => <div style={{ border: '1px solid lightcoral', padding: '10px', minWidth: '250px' }}>Properties Panel Area</div>;

const MainEditorLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>
      <EditorHeader />
      <div style={{ display: 'flex', flexGrow: 1, gap: '10px', overflow: 'hidden' }}>
        <ComponentPalette />
        <CanvasArea />
        <PropertiesPanel />
      </div>
    </div>
  );
};
export default MainEditorLayout;
