"use client"

import { useMemo } from "react"
import { useOrderSummary } from "./hooks/useOrderSummary"
import styles from "./OrderSummary.module.css"
import { Package } from "@/types/package"

export const OrderSummary = () => {
    const { listPackages } = useOrderSummary()

    const renderPackages = useMemo(() => {
        return listPackages.map((packageItem: Package, index: number) => {
            const { items, totalPrice, totalWeight, courierPrice } = packageItem
            return (
                <div key={index}>
                    <p className={styles.packageItem}>Package {index + 1}</p>
                    <span>Items - {items.map(item => item.name).join(", ")}</span>
                    <div className={styles.packageDetails}>
                        <span>Total weight</span>
                        <span>- {totalWeight}g</span>
                        <span>Total price</span>
                        <span>- ${totalPrice}</span>
                        <span>Courier price</span>
                        <span>- ${courierPrice}</span>
                    </div>
                </div>
            )
        })
    }, [listPackages])

    return (
        <div className={styles.orderSummary}>
            {listPackages.length > 0 && (
            <>
                <h5>This order has following packages:</h5>
                <div>
                    {renderPackages}
                </div>
            </>)}
        </div>
    )
}