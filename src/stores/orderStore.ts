import { Package } from "@/types/package"
import { create } from "zustand"

interface OrderState {
  listPackages: Package[]
}

interface OrderAction {
  setListPackages: (packages: Package[]) => void
}

const initialState: OrderState = {
  listPackages: [],
}

export const orderStore = create<OrderState & OrderAction>((set) => ({
  ...initialState,
  setListPackages: (packages: Package[]) => set({ listPackages: packages }),
}))
