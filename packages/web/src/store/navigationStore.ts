import { create } from "zustand";
import { useGameStore } from "./gameStore";

type NavigationStore = {
    activeScreen: string;
    setActiveScreen: (screen: string) => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
    activeScreen: "empire",
    setActiveScreen: (screen) => {
        const status = useGameStore.getState().status;
        if (status === "interrupted") {
            return;
        }
        set({ activeScreen: screen });
    },
}));
