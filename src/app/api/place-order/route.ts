import { NextResponse } from "next/server"
import { ResponseData } from "@/types/api"
import pool from "@/lib/db"
import { Product } from "@/types/product"
import { PlaceOrderRequest } from "@/types/placeOrderRequest"

interface Package {
    totalWeight: number
    totalPrice: number
    courierPrice: number
    items: Product[]
}

const courierCharge = (weight: number): number => {
    switch(true) {
        case weight <= 200:
            return 5
        case weight <= 500:
            return 10
        case weight <= 1000:
            return 15
        case weight <= 5000:
            return 20
        default:
            return 0
    }
}


export async function POST(
  request: Request
): Promise<NextResponse<ResponseData<Package[]>>> {
  const requestBody: PlaceOrderRequest = await request.json()
  const { items } = requestBody


  try {
    const result = await pool.query("SELECT * FROM products ORDER BY weight DESC, price DESC")
    const products: Product[] = result.rows
    const selectedItems = products.filter(item => items.includes(item.id))

    const packages: Package[] = []
    
    const totalAllPrices = selectedItems.reduce((acc, item) => acc + Number(item.price), 0)
    const totalAllWeights = selectedItems.reduce((acc, item) => acc + Number(item.weight), 0)
    const packagesCount = Math.ceil(totalAllPrices / 250)
    const estimateWeightPerPackage = totalAllWeights / packagesCount
    const estimateMinPrice = totalAllPrices / packagesCount

    const marginWeight = totalAllWeights * 1 / 4
    const estimateMinWeight = estimateWeightPerPackage - marginWeight
    const estimateMaxWeight = estimateWeightPerPackage + marginWeight


    const calculateWeightPriceRatio = ({totalPrice, totalWeight}: Package) => {
        const weight = totalWeight / estimateWeightPerPackage
        const price = totalPrice / estimateMinPrice

        return {
            weight,
            price
        }
    }

    for (let i = 0; i < packagesCount; i++) {
        packages.push({
            totalWeight: 0,
            totalPrice: 0,
            courierPrice: 0,
            items: []
        } as Package)
    }

    console.log(estimateWeightPerPackage, totalAllWeights, totalAllPrices, packagesCount)

    console.log(selectedItems)

    const sortByWeightDesc = (a: Product, b: Product) => {
        return Number(b.weight) - Number(a.weight)
    }
    const sortByPriceDesc = (a: Product, b: Product) => {
        return Number(b.price) - Number(a.price)
    }

    let packagesIsEqual = false
    while(selectedItems.length > 0) {
        for (const packageItem of packages) {
            if (packageItem.items.length === 0) {
                selectedItems.sort(sortByWeightDesc)
                const currentItem = selectedItems.shift()
                if (!currentItem) {
                    break
                }
                packageItem.items.push(currentItem)
                packageItem.totalWeight += Number(currentItem.weight)
                packageItem.totalPrice += Number(currentItem.price)
                console.log(currentItem)
            }
            
            let index = 0
            let isLooping = true
            while(isLooping) {
                const { weight: weightRatio, price: priceRatio } = calculateWeightPriceRatio(packageItem)
                if (weightRatio > priceRatio) {
                    selectedItems.sort(sortByPriceDesc)
                }else {
                    selectedItems.sort(sortByWeightDesc)
                }
                const currentItem = selectedItems[index]
                if (!currentItem) {
                    break
                }
                const estimateTotalPackageWeight = Number(packageItem.totalWeight) + Number(currentItem.weight)
                if ((Number(currentItem.price) + packageItem.totalPrice) < 250 && (estimateTotalPackageWeight <= estimateWeightPerPackage || packagesIsEqual)) {
                    console.log(estimateTotalPackageWeight, packagesIsEqual)
                    packageItem.items.push(currentItem)
                    packageItem.totalWeight += Number(currentItem.weight)
                    packageItem.totalPrice += Number(currentItem.price)
                    console.log(currentItem)
                    selectedItems.splice(selectedItems.indexOf(currentItem), 1)
                } else {
                    index++
                    if (index >= selectedItems.length) {
                        isLooping = false
                    }
                }
            }
        }
        if (packagesIsEqual && selectedItems.length > 0) {
            const { weight, price } = selectedItems[0]
            packages.push({
                totalWeight: Number(weight),
                totalPrice: Number(price),
                courierPrice: 0,
                items: [selectedItems[0]]
            })
            selectedItems.shift()
        }
        packagesIsEqual = true
    }

    // while(selectedItems.length > 0) {
    //     const currentItem = selectedItems.shift()
    //     if (!currentItem) {
    //         break
    //     }
    //     let addedToExistingPackage = false
    //     for (const packageItem of packages) {
    //         const estimateTotalPackageWeight = Number(packageItem.totalWeight) + Number(currentItem.weight)
    //         if ((Number(currentItem.price) + packageItem.totalPrice) < 250 && (estimateTotalPackageWeight <= estimateWeightPerPackage || packageItem.items.length === 0 || selectedItems.length === 0)) {
    //             packageItem.items.push(currentItem)
    //             packageItem.totalWeight += Number(currentItem.weight)
    //             packageItem.totalPrice += Number(currentItem.price)
    //             addedToExistingPackage = true
    //             break
    //         }
    //     }
    //     if (!addedToExistingPackage) {
    //         console.log(JSON.stringify(currentItem))
    //     }
    // }

    for (const packageItem of packages) {
        packageItem.courierPrice = courierCharge(packageItem.totalWeight)
    }

    console.log(packages)

    return NextResponse.json({
      message: "Products retrieved successfully",
      data: packages,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        message: "Error retrieving products",
        data: [],
      },
      { status: 500 }
    )
  }
}
