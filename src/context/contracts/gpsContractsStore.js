import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGpsContractsStore = create(
  persist(
    (set) => ({
      gpsContracts: [],

      addGpsContract: (contract) =>
        set((state) => ({
          gpsContracts: [
            ...state.gpsContracts,
            contract,
          ],
        })),

      removeGpsContract: (id) =>
        set((state) => ({
          gpsContracts:
            state.gpsContracts.filter(
              (item) => item.id !== id
            ),
        })),
    }),
    {
      name: "gps-contracts-storage",
    }
  )
);

export default useGpsContractsStore;