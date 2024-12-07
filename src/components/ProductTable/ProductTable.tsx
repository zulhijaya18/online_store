"use client"

import { useMemo } from "react"
import styles from "./ProductTable.module.css"
import useProductTable from "./hooks/useProductTable"

export const ProductTable = () => {
  const { listProducts, selectedItems, handleCheckboxChange, handleSubmit, isLoading, isSubmitting } = useProductTable()

  const renderProducts = useMemo(() => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4} className={styles.loadingCell}>
            Loading products...
          </td>
        </tr>
      )
    }

    if (listProducts.length === 0) {
      return (
        <tr>
          <td colSpan={4} className={styles.emptyCell}>
            No products available
          </td>
        </tr>
      )
    }

    return listProducts.map((product) => {
      const { id, name, price, weight } = product
      return (
        <tr key={id}>
          <td className={styles.td}>{name}</td>
          <td className={styles.td}>${price}</td>
          <td className={styles.td}>{weight}g</td>
          <td className={styles.td}>
            <input
              type="checkbox"
              checked={selectedItems.includes(id)}
              onChange={() => handleCheckboxChange(id)}
              className={styles.checkbox}
              disabled={isSubmitting}
            />
          </td>
        </tr>
      )
    })
  }, [listProducts, selectedItems, handleCheckboxChange, isLoading, isSubmitting])

  return (
    <div className={styles.productTable}>
      <form onSubmit={handleSubmit}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Weight</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {renderProducts}
          </tbody>
        </table>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={selectedItems.length === 0 || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
