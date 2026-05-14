import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUnitsStore = create(
  persist(
    (set) => ({

      units: [],

      addUnit: (unit) =>
        set((state) => ({
          units: [...state.units, unit],
        })),

      deleteUnit: (id) =>
        set((state) => ({
          units: state.units.filter(
            (unit) => unit._id !== id
          ),
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