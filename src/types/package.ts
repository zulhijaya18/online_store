import { Product } from "./product"

export type Package = {
    totalWeight: number
    totalPrice: number
    courierPrice: number
    items: Product[]
}