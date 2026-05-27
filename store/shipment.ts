import { create } from "zustand";

interface ShipmentDraft {
  senderDetails: Partial<Record<string, string>>;
  recipientDetails: Partial<Record<string, string>>;
  packageInfo: {
    weightKg?: number;
    category?: string;
    description?: string;
    dimensions?: { length: number; width: number; height: number };
  };
  zone?: string;
}

interface ShipmentStore {
  draft: ShipmentDraft;
  setDraft: (draft: Partial<ShipmentDraft>) => void;
  clearDraft: () => void;
}

const INITIAL: ShipmentDraft = {
  senderDetails: {},
  recipientDetails: {},
  packageInfo: {},
};

export const useShipmentStore = create<ShipmentStore>((set) => ({
  draft: INITIAL,
  setDraft: (draft) => set((state) => ({ draft: { ...state.draft, ...draft } })),
  clearDraft: () => set({ draft: INITIAL }),
}));
