import { NextResponse } from "next/server"
import { ResponseData } from "@/types/api"
import { Product } from "@/types/product"
import { PlaceOrderRequest } from "@/types/placeOrderRequest"
import { ProductService } from "@/services/productService"
import { MAX_PACKAGE_WEIGHT } from "@/constants/maxPackageWeight"
import { courierCharge } from "./courierCharge"

interface Package {
    totalWeight: number
    totalPrice: number
    courierPrice: number
    items: Product[]
}

export async function POST(
  request: Request
): Promise<NextResponse<ResponseData<Package[]>>> {
  const requestBody: PlaceOrderRequest = await request.json()
  const { items } = requestBody

  try {
    const products = await ProductService.getProductsOrderByWeightAndPrice()
    const selectedItems = products.filter(item => items.includes(item.id))

    const totalAllPrices = selectedItems.reduce((acc, item) => acc + Number(item.price), 0)
    const totalAllWeights = selectedItems.reduce((acc, item) => acc + Number(item.weight), 0)
    const packagesCount = Math.ceil(totalAllPrices / MAX_PACKAGE_WEIGHT)
    const estimateWeightPerPackage = totalAllWeights / packagesCount

    const packages: Package[] = []

    for (let i = 0; i < packagesCount; i++) {
        packages.push({
            totalWeight: 0,
            totalPrice: 0,
            courierPrice: 0,
            items: []
        } as Package)
    }

    while(selectedItems.length > 0) {
        const currentItem = selectedItems.shift()
        if (!currentItem) {
            break
        }
        let addedToExistingPackage = false
        for (const packageItem of packages) {
            const estimateTotalPackageWeight = Number(packageItem.totalWeight) + Number(currentItem.weight)
            if ((Number(currentItem.price) + packageItem.totalPrice) < MAX_PACKAGE_WEIGHT && (estimateTotalPackageWeight <= estimateWeightPerPackage || packageItem.items.length === 0 || selectedItems.length === 0)) {
                packageItem.items.push(currentItem)
                packageItem.totalWeight += Number(currentItem.weight)
                packageItem.totalPrice += Number(currentItem.price)
                addedToExistingPackage = true
                break
            }
        }
        if (!addedToExistingPackage) {
            const packageItem = packages[0]
            packageItem.items.push(currentItem)
            packageItem.totalWeight += Number(currentItem.weight)
            packageItem.totalPrice += Number(currentItem.price)            
        }
    }
    for (const packageItem of packages) {
        packageItem.courierPrice = courierCharge(packageItem.totalWeight)
    }

    return NextResponse.json({
      message: "Packages retrieved successfully",
      data: packages,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        message: "Error retrieving packages",
        data: [],
      },
      { status: 500 }
    )
  }
}
