// src/modules/dapp-builder/state/builderStore.ts

import { create } from 'zustand';
import { DAppDefinition, DndComponent, BuilderState, DAppPage, DndComponentType } from '../types';

// Define more specific actions for the store
interface BuilderActions {
  setCurrentDApp: (dapp: DAppDefinition) => void;
  setActivePage: (pageId: string)
  addComponent: (pageId: string, component: DndComponent, parentId?: string) => void;
  updateComponentProperties: (componentId: string, properties: Partial<Record<string, any>>) => void;
  setSelectedComponent: (componentId: string | null) => void;
  // TODO: Add actions for removing components, reordering, managing pages, etc.
}

// Create the store with an initial state and actions
const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  // Initial State
  currentDApp: undefined,
  activePageId: undefined,
  selectedComponentId: null,
  isSaving: false,

  // Actions
  setCurrentDApp: (dapp) => set({ currentDApp: dapp, activePageId: dapp.pages[0]?.id }),

  setActivePage: (pageId) => set({ activePageId: pageId, selectedComponentId: null }),

  addComponent: (pageId, component, parentId) => {
    const currentDApp = get().currentDApp;
    if (!currentDApp) return;

    const updatedPages = currentDApp.pages.map(page => {
      if (page.id === pageId) {
        // Logic to add to root of page or to a parent component
        if (parentId) {
          // TODO: Implement recursive search and add to parent's children
          // This is a simplified version for now, assuming we can find the parent
          const addRecursive = (components: DndComponent[]): DndComponent[] => {
            return components.map(c => {
              if (c.id === parentId) {
                return { ...c, children: [...(c.children || []), component] };
              }
              if (c.children) {
                return { ...c, children: addRecursive(c.children) };
              }
              return c;
            });
          };
          return { ...page, components: addRecursive(page.components) };
        } else {
          return { ...page, components: [...page.components, component] };
        }
      }
      return page;
    });
    set({ currentDApp: { ...currentDApp, pages: updatedPages } });
  },

  updateComponentProperties: (componentId, properties) => {
    const currentDApp = get().currentDApp;
    if (!currentDApp) return;

    const updateRecursive = (components: DndComponent[]): DndComponent[] => {
      return components.map(c => {
        if (c.id === componentId) {
          return { ...c, properties: { ...c.properties, ...properties } };
        }
        if (c.children) {
          return { ...c, children: updateRecursive(c.children) };
        }
        return c;
      });
    };
    const updatedPages = currentDApp.pages.map(page => ({
      ...page,
      components: updateRecursive(page.components)
    }));
    set({ currentDApp: { ...currentDApp, pages: updatedPages }});
  },

  setSelectedComponent: (componentId) => set({ selectedComponentId: componentId }),

}));

// --- Example Usage (for testing or demonstration) ---
// This part would typically not be in the store file itself.

/**
 * Function to create a unique ID.
 * Replace with a more robust UUID generator in a real app.
 */
const generateId = () => `id_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

export const initializeDemoDApp = () => {
  const demoPageId = generateId();
  const demoDApp: DAppDefinition = {
    id: generateId(),
    name: 'My Demo dApp',
    globalSettings: {
      targetNetwork: 'sepolia',
    },
    importedContracts: {},
    pages: [
      {
        id: demoPageId,
        name: 'Homepage',
        path: '/',
        components: [
          {
            id: generateId(),
            type: DndComponentType.Heading,
            name: 'Main Heading',
            properties: { content: 'Welcome to My dApp!', fontSize: '24px', color: '#333', textAlign: 'center' } as any,
          },
          {
            id: generateId(),
            type: DndComponentType.Text,
            name: 'Intro Paragraph',
            properties: { content: 'This is a dApp built with BlockDeploy\'s new dApp builder.', fontSize: '16px', color: '#555' } as any,
          },
          {
            id: generateId(),
            type: DndComponentType.ConnectWalletButton,
            name: 'Wallet Connect',
            properties: { buttonText: 'Connect Your Wallet' }
          }
        ],
      },
    ],
  };
  useBuilderStore.getState().setCurrentDApp(demoDApp);
};

export default useBuilderStore;
