// src/modules/dapp-builder/editor-ui/CanvasArea.tsx
import React, { useEffect } from 'react'; // Add useEffect
import useBuilderStore, { initializeDemoDApp } from '../state/builderStore'; // Add initializeDemoDApp
import { DndComponent, DndComponentType } from '../types'; // Add DndComponentType

// At the top of CanvasArea.tsx:
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

// This will be a recursive component to render DndComponent and its children
const RenderDndComponent: React.FC<{ component: DndComponent }> = ({ component }) => {
  const { setSelectedComponent, selectedComponentId } = useBuilderStore();
  const isSelected = selectedComponentId === component.id;

  const styles: React.CSSProperties = {
    padding: '10px',
    margin: '5px',
    border: isSelected ? '2px solid blue' : '1px dashed #ccc',
    minHeight: '50px',
    // backgroundColor: component.type.startsWith('LAYOUT_') ? 'rgba(0,0,255,0.05)' : 'rgba(0,255,0,0.05)', // Keep or adjust as needed
  };

  const ComponentToRender = componentRegistry[component.type] || (({properties}) => <div style={properties?.style}>Unsupported type: {component.type}</div>);

  // Prepare children if they exist and the component is a container type
  let renderedChildren: React.ReactNode = null;
  if (component.type === DndComponentType.Container && component.children && component.children.length > 0) {
    renderedChildren = component.children.map(child => <RenderDndComponent key={child.id} component={child} />);
  } else if (component.children && component.children.length > 0) {
    // Fallback for non-container components with children (might indicate a data issue or different component type)
    // console.warn(`Component ${component.id} of type ${component.type} has children but is not a registered container.`);
    // Optionally render them anyway or handle as an error/warning
     renderedChildren = component.children.map(child => <RenderDndComponent key={child.id} component={child} />);
  }


  return (
    <div
      style={styles}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling to parent elements, especially the main canvas click
        setSelectedComponent(component.id);
      }}
    >
      <div style={{fontSize: '0.7em', color: 'gray', marginBottom: '5px', userSelect: 'none'}}>
        {component.name} [{component.type}]
      </div>
      <ComponentToRender properties={component.properties}>
        {renderedChildren}
      </ComponentToRender>
    </div>
  );
};

const CanvasArea: React.FC = () => {
  const { currentDApp, activePageId, setSelectedComponent } = useBuilderStore();

  // Inside CanvasArea component, before the return statement:
  useEffect(() => {
    // Check if a dApp is already loaded to prevent re-initializing on every render
    const isDAppLoaded = useBuilderStore.getState().currentDApp;
    if (!isDAppLoaded) {
      initializeDemoDApp();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

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
