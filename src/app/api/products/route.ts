import { NextResponse } from 'next/server'
import { ResponseData } from '@/types/api'
import { Product } from '@/types/product'
import { ProductService } from '@/services/productService'

/**
 * API endpoint to fetch all products
 * 
 * @route GET /api/products
 * @returns {NextResponse<ResponseData<Product[]>>} JSON response with products data
 * @throws {NextResponse} 500 if there's an error fetching products
 */
export async function GET(): Promise<NextResponse<ResponseData<Product[]>>> {
  try {
    // Validate database connection
    if (!process.env.DB_HOST) {
      throw new Error('Database connection string not found')
    }

    const products = await ProductService.getAllProducts()

    if (!products) {
      throw new Error('Failed to fetch products')
    }

    return NextResponse.json({
      message: 'Products retrieved successfully',
      data: products,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      {
        message: `Error retrieving products: ${errorMessage}`,
        data: [],
      },
      { status: 500 }
    )
  }
}
