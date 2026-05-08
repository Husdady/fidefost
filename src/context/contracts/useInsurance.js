import { create } from "zustand";
import { persist } from "zustand/middleware";

const useInsurance = create(
  persist(
    (set) => ({
      insurance: [],

      addInsurance: (data) =>
        set((state) => ({
          insurance: [
            ...state.insurance,
            data
          ],
        })),

      deleteInsurance: (id) =>
        set((state) => ({
          insurance:
            state.insurance.filter(
              (item) => item._id !== id
            ),
        })),

      updateInsurance: (id, newData) =>
        set((state) => ({
          insurance:
            state.insurance.map((item) =>
              item._id === id
                ? { ...item, ...newData }
                : item
            ),
        })),
    }),
    {
      name: "insurance-storage",
    }
  )
);

export const useAddInsurance = () =>
  useInsurance((state) => state.addInsurance);

export const useGetInsurance = () =>
  useInsurance((state) => state.insurance);

export const useDeleteInsurance = () =>
  useInsurance((state) => state.deleteInsurance);

export const useUpdateInsurance = () =>
  useInsurance((state) => state.updateInsurance);

export default useInsurance;