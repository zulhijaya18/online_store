export const courierCharge = (weight: number): number => {
    switch(true) {
        case weight <= 200:
            return 5
        case weight <= 500:
            return 10
        case weight <= 1000:
            return 15
        case weight <= 5000:
            return 20
        default:
            return 0
    }
}