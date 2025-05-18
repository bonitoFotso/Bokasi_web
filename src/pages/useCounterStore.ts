import { create } from 'zustand';
import { persist , devtools, createJSONStorage } from 'zustand/middleware';

type CounterState = {
    count: number;
    texte: string;
    // Actions
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    setCount: (value: number) => void;

    writeTexte: (value: string) => void;
    readTexte: () => string;
};

// Création d'un store simple pour un compteur
const useCounterStore = create<CounterState>()(
    devtools(
        persist(
            (set) => ({
                // État initial
                count: 0,
                texte: 'Hello world',

                // Actions pour modifier l'état
                increment: () => set((state) => ({ count: state.count + 1 })),
                decrement: () => set((state) => ({ count: state.count - 1 })),
                reset: () => set({ count: 0 }),

                // Action avec paramètre
                setCount: (value: number) => set({ count: value }),
                writeTexte: (value: string) => set({ texte: value }),
                readTexte: (): string => {
                    const state = useCounterStore.getState();
                    return state.texte;
                }
            }),
            {
                name: 'counter-storage', // name for localStorage key
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);

export default useCounterStore;
