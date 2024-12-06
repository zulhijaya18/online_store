"use client"

import { useMemo } from "react"
import styles from "./ProductTable.module.css"
import useProductTable from "./hooks/useProductTable"

export const ProductTable = () => {
  const { listProducts, selectedItems, handleCheckboxChange, handleSubmit } = useProductTable()

  const renderProducts = useMemo(() => {
    return listProducts.map((product) => {
      const { id, name, price, weight } = product
      return (
        <tr key={id}>
          <td className={styles.td}>
            <input
              type="checkbox"
              checked={selectedItems.includes(id)}
              onChange={() => handleCheckboxChange(id)}
              className={styles.checkbox}
            />
          </td>
          <td className={styles.td}>{name}</td>
          <td className={styles.td}>${price}</td>
          <td className={styles.td}>{weight}g</td>
        </tr>
      )
    })
  }, [listProducts, selectedItems])

  return (
    <div className={styles.home}>
      <div className={styles.wrapper}>
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
        <button className={styles.button} onClick={handleSubmit}>
          Place Order
        </button>
      </div>
    </div>
  )
}