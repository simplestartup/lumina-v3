import { create } from "zustand";

interface ContentStore {
  items: any[];
  // ... other store properties
}

export const useContentStore = create<ContentStore>((set) => ({
  items: [],
  // ... other store methods
}));
