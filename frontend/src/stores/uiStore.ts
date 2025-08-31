import { create } from 'zustand';
import type { Building, Hero, Enemy, Flag } from '../types/game';

interface UIState {
  selectedBuildingType: string | null;
  selectedFlagType: string | null;
  selectedEntity: { entity: Building | Hero | Enemy | Flag; type: string } | null;
  showGameOverModal: boolean;
  gameMessages: Array<{ id: string; text: string; type: 'success' | 'error' | 'info' }>;
}

interface UIActions {
  selectBuildingType: (type: string | null) => void;
  selectFlagType: (type: string | null) => void;
  cancelSelection: () => void;
  selectEntity: (entity: Building | Hero | Enemy | Flag, type: string) => void;
  setShowGameOverModal: (show: boolean) => void;
  addGameMessage: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeGameMessage: (id: string) => void;
  clearGameMessages: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  selectedBuildingType: null,
  selectedFlagType: null,
  selectedEntity: null,
  showGameOverModal: false,
  gameMessages: [],

  // Actions
  selectBuildingType: (type) => {
    set({
      selectedBuildingType: type,
      selectedFlagType: null,
      selectedEntity: null
    });
  },

  selectFlagType: (type) => {
    set({
      selectedFlagType: type,
      selectedBuildingType: null,
      selectedEntity: null
    });
  },

  cancelSelection: () => {
    set({
      selectedBuildingType: null,
      selectedFlagType: null
    });
  },

  selectEntity: (entity, type) => {
    set({ selectedEntity: { entity, type } });
  },

  setShowGameOverModal: (show) => {
    set({ showGameOverModal: show });
  },

  addGameMessage: (text, type = 'info') => {
    const id = Date.now().toString();
    const message = { id, text, type };
    set((state) => ({
      gameMessages: [...state.gameMessages, message]
    }));

    // Auto-remove message after 4 seconds
    setTimeout(() => {
      get().removeGameMessage(id);
    }, 4000);
  },

  removeGameMessage: (id) => {
    set((state) => ({
      gameMessages: state.gameMessages.filter(msg => msg.id !== id)
    }));
  },

  clearGameMessages: () => {
    set({ gameMessages: [] });
  },
}));
