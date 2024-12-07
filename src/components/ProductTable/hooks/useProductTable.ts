import { orderStore } from "@/stores/orderStore"
import { productStore } from "@/stores/productStore"
import { ResponseData } from "@/types/api"
import { Package } from "@/types/package"
import { PlaceOrderRequest } from "@/types/placeOrderRequest"
import { Product } from "@/types/product"
import { useCallback, useEffect } from "react"

/**
 * Custom hook for managing product table functionality
 * Handles product fetching, selection, and orders
 * @returns {Object} Functions and state for product table interactions
 */
const useProductTable = () => {
  const { listProducts, selectedItems, setListProducts, setSelectedItems } =
    productStore()

  const { setListPackages } = orderStore()

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products")
    const responseData = (await res.json()) as ResponseData<Product[]>
    setListProducts(responseData.data)
  }, [setListProducts])

  const handleCheckboxChange = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id))
      return
    }
    setSelectedItems([...selectedItems, id])
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      items: selectedItems
    } as PlaceOrderRequest

    const res = await fetch("/api/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const responseData = (await res.json()) as ResponseData<Package[]>
    if (responseData.data) {
      setListPackages(responseData.data)
    }
  }, [selectedItems, setListPackages])

  return {
    listProducts,
    handleCheckboxChange,
    selectedItems,
    handleSubmit
  }
}

export default useProductTable
