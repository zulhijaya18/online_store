import { NextResponse } from "next/server"
import { ResponseData } from "@/types/api"
import { PlaceOrderRequest } from "@/types/placeOrderRequest"
import { ProductService } from "@/services/productService"
import { MAX_PACKAGE_WEIGHT } from "@/constants/maxPackageWeight"
import { courierCharge } from "./courierCharge"
import { Package } from "@/types/package"

/**
 * API endpoint to place an order and create packages
 * 
 * @route POST /api/place-order
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse<ResponseData<Package[]>>>} JSON response with created packages
 * @throws {NextResponse} 500 if there's an error processing the order
 */
export async function POST(
  request: Request
): Promise<NextResponse<ResponseData<Package[]>>> {
  const requestBody: PlaceOrderRequest = await request.json()
  const { items } = requestBody

  try {
    // Fetch products ordered by weight and price
    const products = await ProductService.getProductsOrderByWeightAndPrice()
    const selectedItems = products.filter(item => items.includes(item.id))

    // Calculate totals and estimate package distribution
    const totalAllPrices = selectedItems.reduce((acc, item) => acc + Number(item.price), 0)
    const totalAllWeights = selectedItems.reduce((acc, item) => acc + Number(item.weight), 0)
    const packagesCount = Math.ceil(totalAllPrices / MAX_PACKAGE_WEIGHT)
    const estimateWeightPerPackage = totalAllWeights / packagesCount

    // Initialize packages
    const packages: Package[] = Array.from({ length: packagesCount }, () => ({
      totalWeight: 0,
      totalPrice: 0,
      courierPrice: 0,
      items: []
    }))

    // Distribute items into packages
    while(selectedItems.length > 0) {
        const currentItem = selectedItems.shift()
        if (!currentItem) break

        let addedToExistingPackage = false
        for (const packageItem of packages) {
            const estimateTotalPackageWeight = Number(packageItem.totalWeight) + Number(currentItem.weight)
            if ((Number(currentItem.price) + packageItem.totalPrice) < MAX_PACKAGE_WEIGHT && 
                (estimateTotalPackageWeight <= estimateWeightPerPackage || packageItem.items.length === 0 || selectedItems.length === 0)) {
                packageItem.items.push(currentItem)
                packageItem.totalWeight += Number(currentItem.weight)
                packageItem.totalPrice += Number(currentItem.price)
                addedToExistingPackage = true
                break
            }
        }
        
        if (!addedToExistingPackage) {
            const newPackageItem = {
                totalWeight: Number(currentItem.weight),
                totalPrice: Number(currentItem.price),
                courierPrice: 0,
                items: [currentItem]
            }
            packages.push(newPackageItem)
        }
    }

    // Calculate courier charges for each package
    packages.forEach(packageItem => {
        packageItem.courierPrice = courierCharge(packageItem.totalWeight)
    })

    // Return successful response with packages
    return NextResponse.json({
      message: "Packages retrieved successfully",
      data: packages,
    })
  } catch (error) {
    // Handle and log any errors
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
