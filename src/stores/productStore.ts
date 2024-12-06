import { Product } from "@/types/product";
import { create } from "zustand";

interface ProductState {
  listProducts: Product[];
  selectedItems: number[];
}

interface ProductAction {
  setListProducts: (products: Product[]) => void;
  setSelectedItems: (items: number[]) => void;
}

const initialState: ProductState = {
  listProducts: [],
  selectedItems: [],
};

export const productStore = create<ProductState & ProductAction>((set) => ({
  ...initialState,
  setListProducts: (products: Product[]) => set({ listProducts: products }),
  setSelectedItems: (items: number[]) => set({ selectedItems: items }),
}));
