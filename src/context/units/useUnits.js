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
      
      removeInsuranceFromUnits: (insuranceNumber) =>
        set((state) => ({
          units: state.units.map((unit) => ({

            ...unit,

            soat:
              unit.soat === insuranceNumber
                ? ""
                : unit.soat,

            polizaVehicular:
              unit.polizaVehicular === insuranceNumber
                ? ""
                : unit.polizaVehicular,

            polizaCarga:
              unit.polizaCarga === insuranceNumber
                ? ""
                : unit.polizaCarga,

            polizaEndoso:
              unit.polizaEndoso === insuranceNumber
                ? ""
                : unit.polizaEndoso,

            archivos: (unit.archivos || []).filter(
              (file) => {

                if (
                  file.insuranceType === "soat" &&
                  unit.soat === insuranceNumber
                ) {
                  return false;
                }

                if (
                  file.insuranceType === "polizaVehicular" &&
                  unit.polizaVehicular === insuranceNumber
                ) {
                  return false;
                }

                if (
                  file.insuranceType === "polizaCarga" &&
                  unit.polizaCarga === insuranceNumber
                ) {
                  return false;
                }

                if (
                  file.insuranceType === "polizaEndoso" &&
                  unit.polizaEndoso === insuranceNumber
                ) {
                  return false;
                }

                return true;
              }
            )
          }))
        })),

        updateInsuranceInUnits: (
          oldInsuranceNumber,
          newInsuranceNumber
        ) =>
          set((state) => ({
            units: state.units.map((unit) => ({

              ...unit,

              soat:
                unit.soat === oldInsuranceNumber
                  ? newInsuranceNumber
                  : unit.soat,

              polizaVehicular:
                unit.polizaVehicular === oldInsuranceNumber
                  ? newInsuranceNumber
                  : unit.polizaVehicular,

              polizaCarga:
                unit.polizaCarga === oldInsuranceNumber
                  ? newInsuranceNumber
                  : unit.polizaCarga,

              polizaEndoso:
                unit.polizaEndoso === oldInsuranceNumber
                  ? newInsuranceNumber
                  : unit.polizaEndoso,

            }))
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

export const useRemoveInsuranceFromUnits = () =>
  useUnitsStore((state) => state.removeInsuranceFromUnits);

export const useUpdateInsuranceInUnits = () =>
  useUnitsStore(
    (state) => state.updateInsuranceInUnits
  );