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
export async function updatePost(id, { author, date, title, description, image }) {
    const pool = await getPool()
    const result = await pool.query(
        `UPDATE posts 
         SET author = $1, date = $2, title = $3, description = $4, image = $5 
         WHERE id = $6 
         RETURNING *`,
        [author, date, title ?? null, description ?? null, image ?? null, id]
    )
    return result.rows[0]
}

// Add new post
export async function addPost({author, date, title, description, image}) {
    const pool = await getPool()
    const result = await pool.query('INSERT INTO posts (author, date, title, description, image, likes) VALUES ($1, $2, $3, $4, $5, 0) RETURNING *',
        [author, date, title ?? null, description ?? null, image ?? null]
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