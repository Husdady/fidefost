import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGpsContractsStore = create(
  persist(
    (set) => ({
      gpsContracts: [],

      addGpsContract: (contract) =>
        set((state) => ({
          gpsContracts: [
            contract,
            ...state.gpsContracts,
          ],
        })),
    
      updateGpsContract: (updatedContract) =>
        set((state) => ({
          gpsContracts: state.gpsContracts.map(
             (item) =>
                item._id === updatedContract._id
                   ? updatedContract
                   : item
                ),
            })),

      removeGpsContract: (_id) =>
        set((state) => ({
          gpsContracts:
            state.gpsContracts.filter(
              (item) => item._id !== _id
            ),
        })),
    }),
    {
      name: "gps-contracts-storage",
    }
  )
);

export default useGpsContractsStore;