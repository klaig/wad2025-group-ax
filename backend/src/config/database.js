import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool, Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Parse DATABASE_URL to extract components
function parseDbUrl(url) {
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    if (!match) throw new Error('Invalid DATABASE_URL format')
    return {
        user: match[1],
        password: match[2],
        host: match[3],
        port: match[4],
        database: match[5]
    }
}

// Create database if it doesn't exist
async function ensureDatabaseExists() {
    const dbConfig = parseDbUrl(process.env.DATABASE_URL)

    // Connect to default 'postgres' database to create our database
    const client = new Client({
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: dbConfig.port,
        database: 'postgres'
    })

    try {
        await client.connect()

        // Check if database exists
        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbConfig.database]
        )

        if (result.rows.length === 0) {
            // Database doesn't exist, create it
            await client.query(`CREATE DATABASE ${dbConfig.database}`)
            console.log(`Database '${dbConfig.database}' created successfully`)
        } else {
            console.log(`Database '${dbConfig.database}' already exists`)
        }
    } finally {
        await client.end()
    }
}

let pool

// Get the connection pool (initializes on first call)
async function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL
        })
    }
    return pool
}

// Auto-create tables on startup
async function initializeDatabase() {
    // Ensure database exists
    await ensureDatabaseExists()

    // connect to database and create tables
    const pool = await getPool()
    const client = await pool.connect()

    try {
        // Create posts table
        await client.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                title VARCHAR(255),
                description TEXT,
                image VARCHAR(500),
                likes INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `)
        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `)

        console.log('Database tables created successfully')

        // Check if posts table is empty and seed if needed
        const result = await client.query('SELECT COUNT(*) FROM posts')
        const count = parseInt(result.rows[0].count)

        if (count === 0) {
            await seedPosts(client)
        }

    } finally {
        client.release()
    }
}

// Seed posts from posts.json
async function seedPosts(client) {
    try {
        // Read posts.json from backend folder (two levels up from src/config)
        const postsPath = path.join(__dirname, '..', '..', 'posts.json')

        if (!fs.existsSync(postsPath)) {
            console.log('posts.json not found, skipping seed')
            return
        }

        const postsData = JSON.parse(fs.readFileSync(postsPath, 'utf8'))
        const posts = postsData.Posts

        for (const post of posts) {
            await client.query(
                `INSERT INTO posts (id, author, date, title, description, image, likes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [post.id, post.author, post.date, post.title, post.description || '', post.image || '', post.likes || 0]
            )
        }

        // Reset the sequence to continue after seeded IDs
        await client.query(`SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts))`)

        console.log(`Seeded ${posts.length} posts from posts.json`)

    } catch (error) {
        console.error('Error seeding posts:', error.message)
    }
}

export { getPool, initializeDatabase }
