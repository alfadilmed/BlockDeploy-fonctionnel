// src/modules/dapp-builder/types/index.ts

/**
 * Enum for different types of Draggable and Droppable (Dnd) components.
 * These will be the items available in the component palette.
 */
export enum DndComponentType {
  // Layout
  Container = 'LAYOUT_CONTAINER',
  Grid = 'LAYOUT_GRID', // Example: 2-column, 3-column

  // UI Standard
  Text = 'UI_TEXT',
  Heading = 'UI_HEADING',
  Button = 'UI_BUTTON',
  Image = 'UI_IMAGE',
  Input = 'UI_INPUT', // For user input in dApp forms

  // Web3 Specific
  ConnectWalletButton = 'WEB3_CONNECT_WALLET_BUTTON',
  AddressDisplay = 'WEB3_ADDRESS_DISPLAY',
  NetworkSelector = 'WEB3_NETWORK_SELECTOR', // Or just display current network
  ContractDataReader = 'WEB3_CONTRACT_DATA_READER', // Reads and displays data from a contract view function
  ContractInteractionButton = 'WEB3_CONTRACT_INTERACTION_BUTTON', // Triggers a write function
  BalanceDisplay = 'WEB3_BALANCE_DISPLAY', // ETH or ERC20
  NftGallery = 'WEB3_NFT_GALLERY', // Displays NFTs from a collection
  NftMinter = 'WEB3_NFT_MINTER', // Simple interface to mint an NFT from a specific contract
}

/**
 * Represents a generic component instance on the canvas.
 * Each component will have its own specific set of properties.
 */
export interface DndComponent {
  id: string; // Unique ID for this instance
  type: DndComponentType; // Type of the component
  name: string; // User-defined name for this instance (e.g., "Main Title", "Submit KYC Button")
  properties: Record<string, any>; // Component-specific properties (e.g., text content, API endpoint, contract function)
  parentId?: string | null; // ID of the parent component, if nested
  children?: DndComponent[]; // For container-like components
}

/**
 * Represents a single page within the dApp being built.
 * A dApp can have multiple pages.
 */
export interface DAppPage {
  id: string; // Unique ID for the page
  name: string; // User-defined name for the page (e.g., "Homepage", "Minting Section")
  path: string; // URL path for the page (e.g., "/", "/mint")
  components: DndComponent[]; // Root-level components on this page
}

/**
 * Represents the entire definition of a dApp project created by the user.
 * This structure can be serialized to JSON for saving and loading.
 */
export interface DAppDefinition {
  id: string; // Unique ID for the dApp project
  name: string; // User-defined name for the dApp project
  globalSettings: {
    targetNetwork?: string; // Default network for the dApp
    // Other global settings like theme, default font, etc.
  };
  pages: DAppPage[];
  // Could also include imported contract ABIs, global state variables for the dApp, etc.
  importedContracts: Record<string, { address: string; abi: any[] }>; // Map contract name to address & ABI
}

/**
 * Represents the state of the dApp builder itself (managed by Zustand or similar).
 */
export interface BuilderState {
  currentDApp?: DAppDefinition;
  activePageId?: string | null;
  selectedComponentId?: string | null;
  isSaving: boolean;
  // Add other UI states of the editor: e.g., current tab in palette, zoom level
}

// Example of specific properties for a Text component
export interface TextComponentProps {
  content: string;
  fontSize: string; // e.g., '16px', '1.2em'
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  color: string;
}

// Example of specific properties for a ContractInteractionButton
export interface ContractInteractionButtonProps {
  buttonText: string;
  contractId: string; // Reference to an imported contract in DAppDefinition
  functionName: string;
  args: Array<{ name: string; type: string; valueSource: 'static' | 'input' | 'state'; staticValue?: any; inputFieldId?: string; stateVarName?: string }>;
  successMessage: string;
  errorMessage: string;
}

// Later, we can create a discriminated union for component properties
// type AllComponentProperties = TextComponentProps | ContractInteractionButtonProps | ... ;
// and use it in DndComponent: properties: AllComponentProperties; (this would require 'type' to be part of properties for discrimination)

// For now, Record<string, any> is flexible for the MVP.
