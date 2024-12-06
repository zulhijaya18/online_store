import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DB_HOST,
  ssl: {
    rejectUnauthorized: false
  }
})

export default pool
