// src/modules/dapp-builder/editor-ui/PropertiesPanel.tsx
import React from 'react';
import useBuilderStore from '../state/builderStore';
import { DndComponent, DndComponentType } from '../types'; // Ensure DndComponentType is imported

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
              {/* Inside the return statement, after <hr style={{margin: '10px 0'}} /> */}
    <h4>Component Properties:</h4>
    {selectedComponent.type === DndComponentType.Heading && (
      <>
        <div>
          <label htmlFor="prop-content" style={{display: 'block', margin: '5px 0'}}>Content:</label>
          <input
            id="prop-content"
            type="text"
            value={selectedComponent.properties.content || ''}
            onChange={(e) => handlePropertyChange('content', e.target.value)}
            style={{width: 'calc(100% - 12px)', padding: '5px', marginBottom: '10px'}}
          />
        </div>
        <div>
          <label htmlFor="prop-level" style={{display: 'block', margin: '5px 0'}}>Level (1-6):</label>
          <select
            id="prop-level"
            value={selectedComponent.properties.level || 1}
            onChange={(e) => handlePropertyChange('level', parseInt(e.target.value, 10))}
            style={{width: '100%', padding: '5px', marginBottom: '10px'}}
          >
            {[1, 2, 3, 4, 5, 6].map(lvl => <option key={lvl} value={lvl}>H{lvl}</option>)}
          </select>
        </div>
      </>
    )}

    {selectedComponent.type === DndComponentType.Text && (
      <div>
        <label htmlFor="prop-content" style={{display: 'block', margin: '5px 0'}}>Content:</label>
        <textarea
          id="prop-content"
          value={selectedComponent.properties.content || ''}
          onChange={(e) => handlePropertyChange('content', e.target.value)}
          style={{width: 'calc(100% - 12px)', minHeight: '80px', padding: '5px', marginBottom: '10px'}}
        />
      </div>
    )}

    {/* Common style properties for Text and Heading */}
    {(selectedComponent.type === DndComponentType.Text || selectedComponent.type === DndComponentType.Heading) && (
      <>
        <div>
          <label htmlFor="prop-fontSize" style={{display: 'block', margin: '5px 0'}}>Font Size (e.g., 16px, 1.2em):</label>
          <input
            id="prop-fontSize"
            type="text"
            value={selectedComponent.properties.fontSize || ''}
            onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
            placeholder="e.g., 16px or 1.2em"
            style={{width: 'calc(100% - 12px)', padding: '5px', marginBottom: '10px'}}
          />
        </div>
        <div>
          <label htmlFor="prop-color" style={{display: 'block', margin: '5px 0'}}>Color (e.g., #FF0000):</label>
          <input
            id="prop-color"
            type="text"
            value={selectedComponent.properties.color || ''}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            placeholder="e.g., #333333 or red"
            style={{width: 'calc(100% - 12px)', padding: '5px', marginBottom: '10px'}}
          />
        </div>
        <div>
          <label htmlFor="prop-textAlign" style={{display: 'block', margin: '5px 0'}}>Text Align:</label>
          <select
            id="prop-textAlign"
            value={selectedComponent.properties.textAlign || 'left'}
            onChange={(e) => handlePropertyChange('textAlign', e.target.value)}
            style={{width: '100%', padding: '5px', marginBottom: '10px'}}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <label htmlFor="prop-fontWeight" style={{display: 'block', margin: '5px 0'}}>Font Weight:</label>
          <select
            id="prop-fontWeight"
            value={selectedComponent.properties.fontWeight || 'normal'}
            onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
            style={{width: '100%', padding: '5px', marginBottom: '10px'}}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="bolder">Bolder</option>
          </select>
        </div>
      </>
    )}

    {selectedComponent.type === DndComponentType.ConnectWalletButton && (
      <div>
        <label htmlFor="prop-buttonText" style={{display: 'block', margin: '5px 0'}}>Button Text:</label>
        <input
          id="prop-buttonText"
          type="text"
          value={selectedComponent.properties.buttonText || 'Connect Wallet'}
          onChange={(e) => handlePropertyChange('buttonText', e.target.value)}
          style={{width: 'calc(100% - 12px)', padding: '5px', marginBottom: '10px'}}
        />
      </div>
    )}

    {selectedComponent.type === DndComponentType.Container && (
      <>
        <div>
          <label htmlFor="prop-backgroundColor" style={{display: 'block', margin: '5px 0'}}>Background Color:</label>
          <input
            id="prop-backgroundColor"
            type="text"
            value={selectedComponent.properties.backgroundColor || ''}
            onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
            placeholder="e.g., #FFFFFF or lightblue"
            style={{width: 'calc(100% - 12px)', padding: '5px', marginBottom: '10px'}}
          />
        </div>
        <div>
          <label htmlFor="prop-padding" style={{display: 'block', margin: '5px 0'}}>Padding (e.g., 10px):</label>
          <input
            id="prop-padding"
            type="text"
            value={selectedComponent.properties.padding || ''}
            onChange={(e) => handlePropertyChange('padding', e.target.value)}
            placeholder="e.g., 10px or 1em 0.5em"
            style={{width: 'calc(100% - 12px)', padding: '5px', marginBottom: '10px'}}
          />
        </div>
         <div>
          <label htmlFor="prop-flexDirection" style={{display: 'block', margin: '5px 0'}}>Flex Direction:</label>
          <select
            id="prop-flexDirection"
            value={selectedComponent.properties.flexDirection || 'column'}
            onChange={(e) => handlePropertyChange('flexDirection', e.target.value)}
            style={{width: '100%', padding: '5px', marginBottom: '10px'}}
          >
            <option value="column">Column</option>
            <option value="row">Row</option>
          </select>
        </div>
        {/* Add more specific style editors for Container (alignItems, justifyContent, gap) as needed */}
      </>
    )}

    <p style={{marginTop: '15px', fontSize: '0.9em', color: 'gray'}}>Raw Properties:</p>
    <pre style={{fontSize: '0.8em', backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
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
