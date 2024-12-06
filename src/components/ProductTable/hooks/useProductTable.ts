import { productStore } from "@/stores/productStore"
import { ResponseData } from "@/types/api"
import { Product } from "@/types/product"
import { useEffect } from "react"

const useProductTable = () => {
  const { listProducts, selectedItems, setListProducts, setSelectedItems } =
    productStore()

  const fetchProducts = async () => {
    const res = await fetch("/api/products")
    const responseData = (await res.json()) as ResponseData<Product[]>
    setListProducts(responseData.data)
  }

  const handleCheckboxChange = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id))
      return
    }
    setSelectedItems([...selectedItems, id])
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = async () => {
    await fetch("/api/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedItems }),
    })
  }

  return {
    listProducts,
    handleCheckboxChange,
    selectedItems,
    handleSubmit
  }
}

export default useProductTable
