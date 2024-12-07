import styles from "./OrderSummary.module.css"

export const OrderSummary = () => {
    return (
        <div className={styles.orderSummary}>
            <h5>This order has following packages:</h5>
            <div>
                <p className="my-4">Package 1</p>
                <span>Items - Item 1, Item 2</span>
                <div className="grid grid-cols-2 w-80">
                    <span>Total weight</span>
                    <span>- 300g</span>
                    <span>Total price</span>
                    <span>- $100</span>
                    <span>Courier price</span>
                    <span>- $10</span>
                </div>
            </div>
        </div>
    )
}