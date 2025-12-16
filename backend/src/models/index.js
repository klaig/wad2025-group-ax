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

// Update existing post
export async function updatePost(postId, userId, { content }) {
    const pool = await getPool()

    const result = await pool.query(
        `UPDATE posts 
         SET description = $1
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [content, postId, userId]
    )
    return result.rows[0]
}

// Add new post
export const addPost = async (userId, username, content) => {
    const now = new Date().toISOString()
    const pool = await getPool() 

    const result = await pool.query(
        `INSERT INTO posts (user_id, author, description, date, likes) 
         VALUES ($1, $2, $3, $4, 0)
         RETURNING *`,
        [userId, username, content, now] 
    )

    return result.rows[0]
}

// Delete single post by ID
export async function deletePostById(id) {
    const pool = await getPool()
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id])
    return result.rows.length > 0
}

// Delete all posts
export async function deleteAllPosts() {
    const pool = await getPool()
    await pool.query('DELETE FROM posts')
}