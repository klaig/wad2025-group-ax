import { Router } from 'express'
import { getAllPosts, getPostById, incrementLike, resetAllLikes } from '../models/index.js'

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

export default router
