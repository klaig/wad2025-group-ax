import { getPool } from '../config/database.js'

// Get all posts
export async function getAllPosts() {
    const pool = await getPool()
    const result = await pool.query('SELECT * FROM posts ORDER BY id ASC')
    return result.rows
}

// Get single post by ID
export async function getPostById(id) {
    const pool = await getPool()
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id])
    return result.rows[0]
}

// Increment like count for a post
export async function incrementLike(id) {
    const pool = await getPool()
    const result = await pool.query(
        'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes',
        [id]
    )
    return result.rows[0]
}

// Reset all likes to 0
export async function resetAllLikes() {
    const pool = await getPool()
    await pool.query('UPDATE posts SET likes = 0')
}
