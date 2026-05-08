import { create } from "zustand";

const useInsurance = create((set) => ({
  insurance: [],

  addInsurance: (data) =>
    set((state) => ({
      insurance: [...state.insurance, data],
    })),
}));

export const useAddInsurance = () =>
  useInsurance((state) => state.addInsurance);

export const useGetInsurance = () =>
  useInsurance((state) => state.insurance);

export default useInsurance;