import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWizardStore = create(
  persist(
    (set) => ({
      step: 1,
      data: {
        step1: {},
        step2: {},
        step3: {}
      },
      
      setStep: (step) => set({ step }),
      
      setStepData: (stepNum, data) =>
        set((state) => ({
          data: {
            ...state.data,
            [`step${stepNum}`]: data
          }
        })),
      
      setCategory: (category) =>
        set((state) => {
          // Clear steps 2 and 3 when category changes
          const currentCategory = state.data.step1?.category;
          if (currentCategory && currentCategory !== category) {
            return {
              data: {
                ...state.data,
                step1: { ...state.data.step1, category },
                step2: {},
                step3: {}
              }
            };
          }
          return {
            data: {
              ...state.data,
              step1: { ...state.data.step1, category }
            }
          };
        }),
      
      reset: () =>
        set({
          step: 1,
          data: {
            step1: {},
            step2: {},
            step3: {}
          }
        })
    }),
    {
      name: 'wizard-storage',
      partialize: (state) => ({ data: state.data }),
      // Only run on client side
      storage: typeof window !== 'undefined' ? {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            // Ignore errors
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            // Ignore errors
          }
        }
      } : undefined
    }
  )
);

export default useWizardStore;
