import { create } from 'zustand';

type NavigationStore = {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
  activeScreen: 'empire',
  setActiveScreen: (screen) => set({ activeScreen: screen }),
}));
