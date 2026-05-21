import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUnitsStore = create(
  persist(
    (set) => ({

      units: [],

      addUnit: (unit) =>
        set((state) => ({
          units: [unit, ...state.units],
        })),

      deleteUnit: (id) =>
        set((state) => ({
          units: state.units.filter(
            (unit) => unit._id !== id
          ),
        })),
      
      updateUnit: (updatedUnit) =>
        set((state) => ({
          units: state.units.map((unit) =>
            unit._id === updatedUnit._id
              ? updatedUnit
              : unit
          )
        })),

    }),
    {
      name: "units-storage",
    }
  )
);

export const useGetUnits = () =>
  useUnitsStore((state) => state.units);

export const useAddUnit = () =>
  useUnitsStore((state) => state.addUnit);

export const useDeleteUnit = () =>
  useUnitsStore((state) => state.deleteUnit);

export const useUpdateUnit = () =>
  useUnitsStore((state) => state.updateUnit);