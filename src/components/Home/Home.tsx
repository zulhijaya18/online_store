import { OrderSummary } from "../OrderSummary"
import { ProductTable } from "../ProductTable/ProductTable"
import styles from "./Home.module.css"

export const Home = () => {
    return (
        <div className={styles.home}>
            <div className={styles.wrapper}>
                <ProductTable />
                <OrderSummary />
            </div>
        </div>
    )
}