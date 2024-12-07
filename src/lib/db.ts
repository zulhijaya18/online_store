import { Pool } from 'pg'

/**
 * This file sets up and exports a PostgreSQL connection pool.
 * It uses the 'pg' library to create a pool with the connection string
 * from the DB_HOST environment variable. SSL is configured to not
 * reject unauthorized connections, which may be necessary for some
 * cloud database services. Use this pool for database operations
 * throughout the application.
 */
const pool = new Pool({
  connectionString: process.env.DB_HOST,
  ssl: {
    rejectUnauthorized: false
  }
})

export default pool
