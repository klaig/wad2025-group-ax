import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initializeDatabase } from './config/database.js'
import postsRouter from './routes/posts.js'
import authRouter from './routes/auth.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/posts', postsRouter)
app.use('/api/auth', authRouter)

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    })
    .catch(error => {
        console.error('Failed to initialize database:', error)
        process.exit(1)
    })
