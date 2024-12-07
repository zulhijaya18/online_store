"use client"

import { useMemo } from "react"
import styles from "./ProductTable.module.css"
import useProductTable from "./hooks/useProductTable"

export const ProductTable = () => {
  const { listProducts, selectedItems, handleCheckboxChange, handleSubmit } = useProductTable()

  const renderProducts = useMemo(() => {
    return listProducts.map((product) => (
      <tr key={product.id}>
        <td>
          <input
            type="checkbox"
            checked={selectedItems.includes(product.id)}
            onChange={() => handleCheckboxChange(product.id)}
          />
        </td>
        <td>{product.name}</td>
        <td>${product.price}</td>
        <td>{product.weight}g</td>
      </tr>
    ))
  }, [listProducts, selectedItems, handleCheckboxChange])

  return (
    <div className={styles.productTable}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}></th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Weight</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {renderProducts}
        </tbody>
      </table>
      <button type="submit" className={styles.button} onClick={(e: React.FormEvent) => handleSubmit(e)}>
        Place Order
      </button>
    </div>
  )
}
