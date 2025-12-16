import { Router } from 'express'
import { getAllPosts, getPostById, incrementLike, resetAllLikes, addPost, deleteAllPosts, updatePost, deletePostById } from '../models/index.js'

const router = Router()

// GET /api/posts
router.get('/', async (req, res) => {
    try {
        const posts = await getAllPosts()
        res.json(posts)
    } catch (error) {
        console.error('Error fetching posts:', error)
        res.status(500).json({ error: 'Failed to fetch posts' })
    }
})

// POST /api/posts
router.post('/', async (req, res) => {
    try {
        const {author, date, title, description, image} = req.body
        if (!author || !date) {
            return res.status(400).json({error: 'author and date are required' })
        }
        const post = await addPost({author, date, title, description, image})
        res.status(201).json(post)
    } catch (error) {
        console.error('Error adding post:', error)
        res.status(500).json({ error: 'Failed to add post'})
    }
})

// DELETE /api/posts
router.delete('/', async (req, res) => {
    try {
        await deleteAllPosts()
        res.json({ success: true})
    } catch (error) {
        console.error('Error deleting all posts:', error)
        res.status(500).json({ error: 'Failed to delete all posts'})
    }
})

// POST /api/posts/reset-likes
router.post('/reset-likes', async (req, res) => {
    try {
        await resetAllLikes()
        res.json({ success: true })
    } catch (error) {
        console.error('Error resetting likes:', error)
        res.status(500).json({ error: 'Failed to reset likes' })
    }
})

// POST /api/posts/:id/like
router.post('/:id/like', async (req, res) => {
    try {
        const result = await incrementLike(req.params.id)
        if (!result) {
            return res.status(404).json({ error: 'Post not found' })
        }
        res.json({ success: true, likes: result.likes })
    } catch (error) {
        console.error('Error liking post:', error)
        res.status(500).json({ error: 'Failed to like post' })
    }
})

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { author, date, title, description, image} = req.body
        if (!author || !date) {
            return res.status(400).json({ error: 'author and date are required'})
        }
        const updated = await updatePost(id, {author, date, title, description, image})
        if (!updated) return res.status(404).json({ error: 'Post not found'})
        res.json(updated)    
    } catch (error) {
        console.error('Error updating post:', error)
        res.status(500).json({ error: 'Failed to update post'})
    }
})

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const deleted = await deletePostById(id)
        if (!deleted) return res.status(404).json({ error: 'Post not found' })
        
        res.json({ success: true})    
    } catch (error) {
        console.error('Error deleting post', error)
        res.status(500).json({ error: 'Failed to delete post'})
    }
})

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
    try {
        const post = await getPostById(req.params.id)
        if (!post) {
            return res.status(404).json({ error: 'Post not found' })
        }
        res.json(post)
    } catch (error) {
        console.error('Error fetching post:', error)
        res.status(500).json({ error: 'Failed to fetch post' })
    }
})

export default router
