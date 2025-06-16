// src/modules/dapp-builder/editor-ui/CanvasArea.tsx
import React from 'react';
import useBuilderStore from '../state/builderStore';
import { DndComponent } from '../types';

// This will be a recursive component to render DndComponent and its children
const RenderDndComponent: React.FC<{ component: DndComponent }> = ({ component }) => {
  const { setSelectedComponent, selectedComponentId } = useBuilderStore();
  const isSelected = selectedComponentId === component.id;

  const styles: React.CSSProperties = {
    padding: '10px',
    margin: '5px',
    border: isSelected ? '2px solid blue' : '1px dashed #ccc',
    minHeight: '50px',
    backgroundColor: component.type.startsWith('LAYOUT_') ? 'rgba(0,0,255,0.05)' : 'rgba(0,255,0,0.05)',
  };

  // In a real scenario, we'd have a map of DndComponentType to actual React components
  const renderContent = () => {
    switch(component.type) {
      case 'UI_HEADING': return <h1>{component.properties.content || 'Heading'}</h1>;
      case 'UI_TEXT': return <p>{component.properties.content || 'Text Block'}</p>;
      case 'UI_BUTTON': return <button>{component.properties.buttonText || 'Button'}</button>;
      case 'WEB3_CONNECT_WALLET_BUTTON': return <button>{component.properties.buttonText || 'Connect Wallet'}</button>;
      default: return component.name || component.type;
    }
  }

  return (
    <div style={styles} onClick={(e) => { e.stopPropagation(); setSelectedComponent(component.id); }}>
      <div style={{fontSize: '0.7em', color: 'gray'}}>{component.name} [{component.type}]</div>
      {renderContent()}
      {component.children && component.children.map(child => (
        <RenderDndComponent key={child.id} component={child} />
      ))}
    </div>
  );
};

const CanvasArea: React.FC = () => {
  const { currentDApp, activePageId, setSelectedComponent } = useBuilderStore();

  const activePage = currentDApp?.pages.find(p => p.id === activePageId);

  // This is where @dnd-kit's <Droppable> context would be
  return (
    <div
      style={{ border: '1px solid lightgreen', padding: '10px', flexGrow: 1, height: '100%', overflowY: 'auto' }}
      onClick={() => setSelectedComponent(null)} // Deselect if clicking on canvas background
    >
      <h2>Canvas Area</h2>
      {activePage ? (
        activePage.components.map(component => (
          <RenderDndComponent key={component.id} component={component} />
        ))
      ) : (
        <p>No active page or dApp loaded. Select or create a page.</p>
      )}
    </div>
  );
};

export default CanvasArea;
