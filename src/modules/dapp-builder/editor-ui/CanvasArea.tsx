// src/modules/dapp-builder/editor-ui/CanvasArea.tsx
import React, { useEffect } from 'react';
import useBuilderStore, { initializeDemoDApp } from '../state/builderStore';
import { DndComponent, DndComponentType } from '../types';
// Import useDraggable
import { DndContext, useDroppable, useDraggable, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';

import HeadingComponent from '../components/HeadingComponent';
import TextComponent from '../components/TextComponent';
import ConnectWalletButtonComponent from '../components/ConnectWalletButtonComponent';
import ContainerComponent from '../components/ContainerComponent';

const componentRegistry: Record<string, React.FC<any>> = {
  [DndComponentType.Heading]: HeadingComponent,
  [DndComponentType.Text]: TextComponent,
  [DndComponentType.ConnectWalletButton]: ConnectWalletButtonComponent,
  [DndComponentType.Container]: ContainerComponent,
  // Keep other placeholders for now
  [DndComponentType.Button]: ({ properties }) => <button style={properties?.style}>{properties?.buttonText || 'Button Placeholder'}</button>,
  [DndComponentType.Grid]: ({ properties }) => <div style={properties?.style}>Grid Placeholder</div>,
  [DndComponentType.Image]: ({ properties }) => <div style={properties?.style}>Image Placeholder</div>,
  [DndComponentType.Input]: ({ properties }) => <div style={properties?.style}>Input Placeholder</div>,
  [DndComponentType.AddressDisplay]: ({ properties }) => <div style={properties?.style}>Address Display Placeholder</div>,
  [DndComponentType.NetworkSelector]: ({ properties }) => <div style={properties?.style}>Network Selector Placeholder</div>,
  [DndComponentType.ContractDataReader]: ({ properties }) => <div style={properties?.style}>Contract Data Reader Placeholder</div>,
  [DndComponentType.ContractInteractionButton]: ({ properties }) => <div style={properties?.style}>Contract Interaction Button Placeholder</div>,
  [DndComponentType.BalanceDisplay]: ({ properties }) => <div style={properties?.style}>Balance Display Placeholder</div>,
  [DndComponentType.NftGallery]: ({ properties }) => <div style={properties?.style}>NFT Gallery Placeholder</div>,
  [DndComponentType.NftMinter]: ({ properties }) => <div style={properties?.style}>NFT Minter Placeholder</div>,
};

// Helper to generate new component IDs - ensure this is available or defined
// If generateId is in builderStore, it doesn't need to be redefined here.
// For this example, let's assume builderStore exports it or we define it locally for clarity.
const generateId = () => `comp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

interface RenderDndComponentProps {
  component: DndComponent;
  isDragOverlay?: boolean; // To indicate if it's rendered as a drag overlay
}

const RenderDndComponent: React.FC<RenderDndComponentProps> = ({ component, isDragOverlay = false }) => {
  const { setSelectedComponent, selectedComponentId } = useBuilderStore();
  const isSelected = selectedComponentId === component.id;

  const {attributes, listeners, setNodeRef: setDraggableNodeRef, transform, isDragging} = useDraggable({
    id: component.id, // Use component's own ID for dragging itself
    data: {
      componentId: component.id,
      isCanvasItem: true, // Flag to identify it's an item from the canvas
      componentData: component, // Pass the component data itself for potential use in overlays or dragEnd
    }
  });

  const style: React.CSSProperties = {
    padding: '10px',
    margin: '5px',
    border: isSelected && !isDragging ? '2px solid blue' : '1px dashed #ccc',
    minHeight: '50px',
    opacity: isDragging ? 0.5 : 1, // Make it semi-transparent while dragging
    cursor: isDragOverlay ? 'grabbing' : 'grab', // Change cursor for overlay
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    // backgroundColor: isDragging? 'lightblue' : (component.type.startsWith('LAYOUT_') ? 'rgba(0,0,255,0.05)' : 'rgba(0,255,0,0.05)'),
  };

  const ComponentToRender = componentRegistry[component.type] || (({properties}) => <div style={properties?.style}>Unsupported type: {component.type}</div>);

  let renderedChildren: React.ReactNode = null;
  if (component.type === DndComponentType.Container && component.children && component.children.length > 0) {
    renderedChildren = component.children.map(child => <RenderDndComponent key={child.id} component={child} />);
  } else if (component.children && component.children.length > 0) {
     renderedChildren = component.children.map(child => <RenderDndComponent key={child.id} component={child} />);
  }

  return (
    <div
      ref={setDraggableNodeRef} // Set ref for draggable
      style={style}
      {...listeners} // Spread listeners for drag handles
      {...attributes} // Spread attributes
      onClick={(e) => {
        if (isDragging) return; // Don't select if it was part of a drag
        e.stopPropagation();
        setSelectedComponent(component.id);
      }}
    >
      <div style={{fontSize: '0.7em', color: 'gray', marginBottom: '5px', userSelect: 'none', pointerEvents: 'none'}}>
        {component.name} [{component.type}] (ID: {component.id})
      </div>
      <ComponentToRender properties={component.properties}>
        {renderedChildren}
      </ComponentToRender>
    </div>
  );
};

const CanvasDropArea: React.FC = () => {
  const { currentDApp, activePageId, setSelectedComponent, selectedComponentId } = useBuilderStore();
  const { setNodeRef: setDroppableNodeRef, isOver, active } = useDroppable({ // `active` from useDroppable refers to the draggable item currently over it
    id: 'canvas-drop-area',
  });

  const activePage = currentDApp?.pages.find(p => p.id === activePageId);

  // Determine if the item being dragged over the canvas is a new palette item
  const isPaletteItemOver = active?.data.current?.isPaletteItem;

  const dropAreaStyle: React.CSSProperties = {
    // Highlight differently if a palette item is over vs a canvas item (for reordering)
    border: isOver ? (isPaletteItemOver ? '2px dashed green' : '2px dashed orange') : '1px solid lightgreen',
    padding: '10px',
    flexGrow: 1,
    height: '100%',
    overflowY: 'auto',
    position: 'relative',
  };

  return (
    <div
      ref={setDroppableNodeRef}
      style={dropAreaStyle}
      onClick={() => setSelectedComponent(null)}
    >
      <h2 style={{pointerEvents: 'none'}}>Canvas Area {isOver ? (isPaletteItemOver ? "(Drop New Component)" : "(Reorder Component)") : ""}</h2>
      {activePage ? (
        activePage.components.map(component => (
          // Each component needs to be a droppable target for reordering relative to it
          // For simplicity in this step, we only make the main canvas droppable.
          // A more advanced version would make each RenderDndComponent a droppable target.
          <RenderDndComponent key={component.id} component={component} />
        ))
      ) : (
        <p>No active page or dApp loaded. Select or create a page.</p>
      )}
    </div>
  );
};

const CanvasArea: React.FC = () => {
  const { addComponent, reorderComponents, activePageId } = useBuilderStore(state => ({
     addComponent: state.addComponent,
     reorderComponents: state.reorderComponents, // Get reorderComponents action
     activePageId: state.activePageId
  }));

  useEffect(() => {
    const isDAppLoaded = useBuilderStore.getState().currentDApp;
    if (!isDAppLoaded) {
      initializeDemoDApp();
    }
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    if (!activePageId) {
      console.warn("No active page for drag end operation.");
      return;
    }

    // Scenario 1: Dropping a new component from the palette
    if (over && over.id === 'canvas-drop-area' && active.data.current?.isPaletteItem) {
      const componentType = active.data.current.componentType as DndComponentType;
      const componentName = active.data.current.componentName as string;

      let defaultProps: Record<string, any> = {};
      // ... (defaultProps switch statement as before)
      switch(componentType) {
         case DndComponentType.Heading:
             defaultProps = { content: 'New Heading', level: 1, textAlign: 'left' };
             break;
         case DndComponentType.Text:
             defaultProps = { content: 'New text block...', textAlign: 'left' };
             break;
         case DndComponentType.ConnectWalletButton:
             defaultProps = { buttonText: 'Connect Wallet' };
             break;
         case DndComponentType.Container:
             defaultProps = { backgroundColor: '#f0f0f0', padding: '10px', children: [], placeholderText: 'Empty Container - Drop components here' };
             break;
         default:
             defaultProps = { info: `Default props for ${componentType}`}; // Generic default
             break;
      }


      const newComponent: DndComponent = {
        id: generateId(),
        type: componentType,
        name: `${componentName} ${generateId().substring(0,3)}`,
        properties: defaultProps,
        children: componentType === DndComponentType.Container ? [] : undefined,
      };
      // For simplicity, new components from palette are added to the end of the root level of the active page.
      // A more advanced version might determine drop position relative to other components.
      addComponent(activePageId, newComponent);
    }
    // Scenario 2: Reordering an existing component on the canvas
    else if (active.data.current?.isCanvasItem && over) {
       const activeId = active.id as string;
       // If dropping on canvas background, over.id is 'canvas-drop-area'.
       // If dropping on another component (for reordering relative to it), over.id is that component's ID.
       // For now, we'll simplify: if over.id is 'canvas-drop-area', it means drop at the end.
       // A more complex solution would involve making each RenderDndComponent a droppable target
       // and calculating insertion index based on that.
       const overId = over.id === 'canvas-drop-area' ? null : over.id as string;

       if (activeId !== overId) { // Prevent reordering on itself if not handled differently
         reorderComponents(activePageId, activeId, overId);
       }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <CanvasDropArea />
    </DndContext>
  );
};

export default CanvasArea;
