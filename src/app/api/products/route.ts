import { NextResponse } from 'next/server'
import { ResponseData } from '@/types/api'
import { Product } from '@/types/product'
import { ProductService } from '@/services/productService'

export async function GET(): Promise<NextResponse<ResponseData<Product[]>>> {
  try {
    const products = await ProductService.getAllProducts()

    return NextResponse.json({
      message: 'Products retrieved successfully',
      data: products,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        message: 'Error retrieving products',
        data: [],
      },
      { status: 500 }
    )
  }
}
