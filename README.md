A Next.js application for an calculating optimized shipping packages for delivery.

## Features
- Product listing with details (name, weight, price)
- Multiple item selection for orders
- Automatic package optimization based on:
  - Weight distribution
  - Price limits
  - Package count optimization
- Dynamic courier pricing based on package weight
- Real-time order summary with package details

## Tech Stack

- **Frontend**:
  - Next.js 13+ (App Router)
  - TypeScript
  - Tailwind CSS
  - Zustand (State Management)

- **Backend**:
  - Next.js API Routes
  - PostgreSQL Database (CockroachDB as DB provider)

## Project Structure

```
src/
├── app/
│   └── api/            # API routes
│       ├── products/   # Product listing endpoint
│       └── place-order/# Order processing endpoint
├── components/         # React components
│   ├── Home/
│   ├── ProductTable/   # Product listing and selection
│   └── OrderSummary/   # Package details display
├── constants/         # Application constants
├── lib/              # Database and utility functions
├── services/         # Business logic layer
├── stores/           # Zustand state management
└── types/            # TypeScript type definitions
```

## Getting Started
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
   ```
   yarn install
   ```
3. Set up your environment variables in `.env`:
   ```
   DB_HOST=your_postgresql_connection_string
   ```
4. Run database seed:
   ```bash
   npm run seed
   ```
   ```
   yarn seed
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
   ```
   yarn dev
   ```

## API Endpoints

### GET /api/products
Returns list of available products

### POST /api/place-order
Creates optimized packages based on selected items

Request body:
```json
{
  "items": number[] // Array of product IDs
}
```

Response:
```json
{
  "message": string,
  "data": [
    {
      "totalWeight": number,
      "totalPrice": number,
      "courierPrice": number,
      "items": Product[]
    }
  ]
}
```

## Business Rules
- Maximum package price: 250
- Courier charges based on weight:
  - ≤ 200g: $5
  - ≤ 500g: $10
  - ≤ 1000g: $15
  - ≤ 5000g: $20