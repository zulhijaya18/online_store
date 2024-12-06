import { NextResponse } from 'next/server'
import { ResponseData } from '@/types/api'
import pool from '@/lib/db'
import { Product } from '@/types/product'

export async function GET(): Promise<NextResponse<ResponseData<Product[]>>> {
  try {
    const result = await pool.query('SELECT * FROM products')
    const products: Product[] = result.rows

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
