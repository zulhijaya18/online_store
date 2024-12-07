import { Pool } from 'pg'

/**
 * This file sets up and exports a PostgreSQL connection pool.
 * It uses the 'pg' library to create a pool with the connection string
 * from the DB_HOST environment variable. SSL is configured to not
 * reject unauthorized connections, which may be necessary for some
 * cloud database services. Use this pool for database operations
 * throughout the application.
 */
if (!process.env.DB_HOST) {
  throw new Error('Database connection string not found in environment variables')
}

const pool = new Pool({
  connectionString: process.env.DB_HOST,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Verify connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database', err)
  }
  if (client) {
    client.query('SELECT NOW()', (err, result) => {
      done()
      if (err) {
        console.error('Error executing test query', err)
      } else {
        console.log('Database connection successful')
      }
    })
  }
})

export default pool
