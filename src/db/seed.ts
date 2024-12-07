import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { promises as fs } from 'fs'
import path from 'path'
import pkg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pkg
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Seeds the database with initial data from a SQL file.
 * 
 * This function performs the following steps:
 * 1. Connects to the PostgreSQL database using the connection string from environment variables.
 * 2. Reads the seed.sql file from the same directory.
 * 3. Splits the SQL file into individual statements.
 * 4. Executes each statement sequentially.
 * 5. Logs the execution of each statement and overall success or failure.
 * 
 * @throws {Error} If there's an issue connecting to the database or executing SQL statements.
 */
async function seed() {
  const pool = new Pool({
    connectionString: process.env.DB_HOST,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Connected to PostgreSQL server')

    // Read and execute seed file
    const seedPath = path.join(__dirname, 'seed.sql')
    const seedSQL = await fs.readFile(seedPath, 'utf8')
    
    // Split SQL statements and execute them one by one
    const statements = seedSQL
      .split(';')
      .filter(statement => statement.trim().length > 0)

    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement)
        console.log('Executed:', statement.trim().split('\n')[0])
      }
    }

    console.log('Database seeded successfully')
    await pool.end()
    
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()
