import { orderStore } from "@/stores/orderStore"

export const useOrderSummary = () => {
    const { listPackages } = orderStore()

    return {
        listPackages
    }
}