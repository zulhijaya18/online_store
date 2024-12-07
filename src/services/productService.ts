import pool from "@/lib/db"
import { Product } from "@/types/product"

/**
 * Service class for handling product-related database operations.
 * Provides methods to retrieve products with various sorting and filtering options.
 */
export class ProductService {
    static async getProductsOrderByWeightAndPrice(): Promise<Product[]> {
        const query = "SELECT * FROM products ORDER BY weight DESC, price DESC"
        const result = await pool.query(query)
        return result.rows
    }

    static async getAllProducts(): Promise<Product[]> {
        const query = "SELECT * FROM products"
        const result = await pool.query(query)
        return result.rows
    }
}
