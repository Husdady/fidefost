import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useContracts = create(
  persist(
    (set) => ({
      contracts: [],

      add: (newContract) =>
        set((state) => ({
          contracts: [...state.contracts, newContract],
        })),

      update: (id, data) =>
        set((state) => ({
          contracts: state.contracts.map((item) =>
            item._id === id ? { ...item, ...data } : item
          ),
        })),

      delete: (id) =>
        set((state) => ({
          contracts: state.contracts.filter((item) => item._id !== id),
        })),
    }),
    {
      name: "contracts-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUpdateContract = () => 
  useContracts((state) => state.update);

export const useGetContracts = () =>
  useContracts((state) => state.contracts);

export const useAddContract = () =>
  useContracts((state) => state.add);

export default useContracts;