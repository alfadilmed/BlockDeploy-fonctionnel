// src/modules/dapp-builder/editor-ui/ComponentPalette.tsx
import React from 'react';
import useBuilderStore from '../state/builderStore'; // Example of accessing store if needed later
import { DndComponentType } from '../types'; // To list component types

const DraggableComponentItem: React.FC<{ type: DndComponentType, name: string }> = ({ type, name }) => {
  // Basic draggable placeholder
  return (
    <div
      style={{ padding: '8px', margin: '4px 0', border: '1px dashed gray', cursor: 'grab' }}
      // Draggable logic will be added here using @dnd-kit
    >
      {name} ({type})
    </div>
  );
}

const ComponentPalette: React.FC = () => {
  // const { currentDApp } = useBuilderStore(); // Example if store is needed

  return (
    <div style={{ border: '1px solid lightblue', padding: '10px', minWidth: '200px', height: '100%', overflowY: 'auto' }}>
      <h3>Components</h3>
      <DraggableComponentItem type={DndComponentType.Heading} name="Heading" />
      <DraggableComponentItem type={DndComponentType.Text} name="Text" />
      <DraggableComponentItem type={DndComponentType.Button} name="Button" />
      <DraggableComponentItem type={DndComponentType.Container} name="Container" />
      <hr style={{margin: '10px 0'}}/>
      <DraggableComponentItem type={DndComponentType.ConnectWalletButton} name="Connect Wallet" />
      <DraggableComponentItem type={DndComponentType.ContractDataReader} name="Contract Reader" />
      <DraggableComponentItem type={DndComponentType.ContractInteractionButton} name="Contract Button" />
      {/* Add more components as they are defined */}
      <p style={{marginTop: '20px', fontSize: '0.8em', color: 'gray'}}>Drag components to the canvas.</p>
    </div>
  );
};

export default ComponentPalette;
