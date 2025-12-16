// backend/src/routes/auth.js
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getPool } from '../config/database.js'

const router = Router()

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '24h' }
    )
}

// Register user
router.post('/signup', async (req, res) => {
    const { email, password } = req.body
    const pool = await getPool()

    try {
        //Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Insert user into database
        const newUser = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        )

        // Generate Token
        const token = generateToken(newUser.rows[0])
        
        res.status(201).json({ user: newUser.rows[0], token })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const pool = await getPool()

    try {
        // Find user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        const user = result.rows[0]

        if (!user) return res.status(400).json({ error: 'User not found' })

        // Check password
        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) return res.status(400).json({ error: 'Invalid password' })

        // Generate Token
        const token = generateToken(user)
        
        // Return user info (excluding password) and token
        res.json({ 
            user: { id: user.id, email: user.email }, 
            token 
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router