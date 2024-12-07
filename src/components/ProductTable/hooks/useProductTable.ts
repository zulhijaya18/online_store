import { orderStore } from "@/stores/orderStore"
import { productStore } from "@/stores/productStore"
import { ResponseData } from "@/types/api"
import { Package } from "@/types/package"
import { PlaceOrderRequest } from "@/types/placeOrderRequest"
import { Product } from "@/types/product"
import { useCallback, useEffect, useState } from "react"

/**
 * Custom hook for managing product table functionality
 * Handles product fetching, selection, and orders
 * @returns {Object} Functions and state for product table interactions
 */
const useProductTable = () => {
  const { listProducts, selectedItems, setListProducts, setSelectedItems } =
    productStore()

  const { setListPackages } = orderStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/products")
      const responseData = (await res.json()) as ResponseData<Product[]>
      setListProducts(responseData.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [setListProducts])

  const handleCheckboxChange = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const body = {
        items: selectedItems,
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
    } catch (error) {
      console.error("Error submitting order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedItems, setListPackages])

  return {
    listProducts,
    handleCheckboxChange,
    fetchProducts,
    selectedItems,
    handleSubmit,
    isLoading,
    isSubmitting,
  }
}

export default useProductTable
