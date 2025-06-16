// src/modules/dapp-builder/editor-ui/PropertiesPanel.tsx
import React from 'react';
import useBuilderStore from '../state/builderStore';
import { DndComponent } from '../types';

const PropertiesPanel: React.FC = () => {
  const { currentDApp, selectedComponentId, updateComponentProperties } = useBuilderStore();

  let selectedComponent: DndComponent | null = null;

  if (currentDApp && selectedComponentId) {
    currentDApp.pages.forEach(page => {
      const findRecursive = (components: DndComponent[]): DndComponent | undefined => {
        for (const comp of components) {
          if (comp.id === selectedComponentId) return comp;
          if (comp.children) {
            const found = findRecursive(comp.children);
            if (found) return found;
          }
        }
        return undefined;
      };
      const found = findRecursive(page.components);
      if (found) selectedComponent = found;
    });
  }

  const handlePropertyChange = (propName: string, value: any) => {
    if (selectedComponentId) {
      updateComponentProperties(selectedComponentId, { [propName]: value });
    }
  };

  return (
    <div style={{ border: '1px solid lightcoral', padding: '10px', minWidth: '250px', height: '100%', overflowY: 'auto' }}>
      <h3>Properties Panel</h3>
      {selectedComponent ? (
        <div>
          <p><strong>ID:</strong> {selectedComponent.id}</p>
          <p><strong>Type:</strong> {selectedComponent.type}</p>
          <p><strong>Name:</strong> {selectedComponent.name}</p>
          <hr style={{margin: '10px 0'}} />
          <h4>Component Properties:</h4>
          {/* Example for a text-like component */}
          { (selectedComponent.type === 'UI_TEXT' || selectedComponent.type === 'UI_HEADING') && (
            <div>
              <label htmlFor="prop-content">Content:</label>
              <input
                id="prop-content"
                type="text"
                value={selectedComponent.properties.content || ''}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                style={{width: '100%', marginBottom: '10px'}}
              />
            </div>
          )}
          {/* Example for a button-like component */}
          { (selectedComponent.type === 'UI_BUTTON' || selectedComponent.type === 'WEB3_CONNECT_WALLET_BUTTON' || selectedComponent.type === 'WEB3_CONTRACT_INTERACTION_BUTTON') && (
             <div>
              <label htmlFor="prop-buttonText">Button Text:</label>
              <input
                id="prop-buttonText"
                type="text"
                value={selectedComponent.properties.buttonText || ''}
                onChange={(e) => handlePropertyChange('buttonText', e.target.value)}
                style={{width: '100%', marginBottom: '10px'}}
              />
            </div>
          )}
          {/* Add more specific property editors based on component.type */}
          <pre style={{fontSize: '0.8em', backgroundColor: '#f0f0f0', padding: '5px'}}>
            {JSON.stringify(selectedComponent.properties, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Select a component on the canvas to see its properties.</p>
      )}
    </div>
  );
};

export default PropertiesPanel;
