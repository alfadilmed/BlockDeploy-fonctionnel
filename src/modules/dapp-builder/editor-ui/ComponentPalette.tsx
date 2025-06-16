// src/modules/dapp-builder/editor-ui/ComponentPalette.tsx
import React from 'react';
import { DndComponentType } from '../types';
import { useDraggable }
 from '@dnd-kit/core'; // Import useDraggable

interface DraggableComponentItemProps {
  type: DndComponentType;
  name: string;
}

const DraggableComponentItem: React.FC<DraggableComponentItemProps> = ({ type, name }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-palette-item-${type}`, // Unique ID for the draggable item
    data: { // Pass data about the component being dragged
      componentType: type,
      componentName: name,
      isPaletteItem: true, // Flag to identify it comes from the palette
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    padding: '8px',
    margin: '4px 0',
    border: '1px dashed gray',
    cursor: 'grab',
    backgroundColor: 'white', // Ensure it's visible while dragging
    zIndex: 1000, // Ensure it's above other elements while dragging
  } : {
    padding: '8px',
    margin: '4px 0',
    border: '1px dashed gray',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {name}
    </div>
  );
}

const ComponentPalette: React.FC = () => {
  return (
    <div style={{ border: '1px solid lightblue', padding: '10px', minWidth: '200px', height: '100%', overflowY: 'auto' }}>
      <h3>Components</h3>
      <DraggableComponentItem type={DndComponentType.Heading} name="Heading" />
      <DraggableComponentItem type={DndComponentType.Text} name="Text" />
      <DraggableComponentItem type={DndComponentType.Button} name="Button (UI)" />
      <DraggableComponentItem type={DndComponentType.Container} name="Container" />
      <hr style={{margin: '10px 0'}}/>
      <DraggableComponentItem type={DndComponentType.ConnectWalletButton} name="Connect Wallet Btn" />
      <DraggableComponentItem type={DndComponentType.ContractDataReader} name="Contract Reader" />
      <DraggableComponentItem type={DndComponentType.ContractInteractionButton} name="Contract Action Btn" />
      {/* Add more components as they are defined */}
      <p style={{marginTop: '20px', fontSize: '0.8em', color: 'gray'}}>Drag components to the canvas.</p>
    </div>
  );
};

export default ComponentPalette;
