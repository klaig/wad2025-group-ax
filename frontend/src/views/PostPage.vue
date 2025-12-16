<template>
    <div v-if="loading && !isNewPost" class="post-page">
        <p>Loading post...</p>
    </div>
    <div v-else-if="error" class="post-page">
        <p class="error-message">{{ error }}</p>
    </div>

    <div v-else class="post-page">
        <h2>{{ isNewPost ? 'Create New Post' : `Edit Post ID #${id}` }}</h2>

        <div v-if="!isNewPost">
            <div class="field">
                <label>Author</label>
                <input :value="postData.username" readonly />
            </div>
            <div class="field">
                <label>Posted Date</label>
                <input type="text" :value="formatDate(postData.date)" readonly />
            </div>
        </div>

        <div class="field">
            <label>Content (Body)</label>
            <textarea v-model="form.content" rows="6" placeholder="Enter the body of your post..."></textarea>
        </div>

        <div class="buttons">
            <button v-if="!isNewPost" @click="updatePost" class="nav-btn" style="background-color: #A3BE8C;">Update Post</button>
            <button v-if="!isNewPost" @click="deletePost" class="nav-btn" style="background-color: #BF616A;">Delete Post</button>

            <button v-if="isNewPost" @click="createPost" :disabled="!isContentValid" class="nav-btn create-post">Create Post</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PostPage',

    data() {
        return {
            loading: true,
            error: null,
            postData: {},
            form: {
                content: ''
            }
        }
    },

    computed: {
        id() {
            return this.$route.params.id
        },
        token() {
            return this.$store.state.token
        },
        isNewPost() {
            return this.$route.path === '/add'
        },
        isContentValid() {
            return this.form.content.trim().length > 0;
        }
    },

    mounted() {
        if (!this.isNewPost) {
            this.fetchPost()
        } else {
            this.loading = false
            this.form.content = ''
        }
    },

    methods: {
        formatDate(dateString) {
            if (!dateString) return 'N/A'
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            })
        },

        async fetchPost() {
            this.loading = true
            this.error = null

            if (!this.token) {
                 this.error = 'Unauthorized'
                 this.loading = false
                 return
            }
            try {
                const response = await fetch(`http://localhost:3000/api/posts/${this.id}`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                })
                if (response.status === 401 || response.status === 403) {
                     throw new Error('Unauthorized')
                }
                if (!response.ok) {
                    throw new Error('Post not found or API error')
                }
                const post = await response.json()
                this.postData = post
                this.form.content = post.content ?? post.description ?? post.title ?? ''
            } catch (e) {
                this.error = e.message
            } finally {
                this.loading = false
            }
        },

        async createPost() {
            if (!this.isContentValid) {
                alert('Post content cannot be empty.')
                return
            }

            const postData = { content: this.form.content.trim() }

            try {
                await this.$store.dispatch('createPost', postData) 
                
                this.$router.push('/')
            } catch (error) {
                console.error('Error creating post:', error.message)
                alert('Failed to create post. Check console.')
            }
        },

        async updatePost() {
            try {
                const dataToSend = { content: this.form.content }
                const response = await fetch(`http://localhost:3000/api/posts/${this.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    },
                    body: JSON.stringify(dataToSend)
                })
                if (!response.ok) throw new Error('Failed to update post')
                await this.$store.dispatch('fetchPosts')
                await this.fetchPost()
                alert('Post updated successfully!')
            } catch (e) {
                alert(`Error updating post: ${e.message}`)
            }
        },

        async deletePost() {
            if (!confirm('Are you sure you want to delete this post?')) return
            try {
                const response = await fetch(`http://localhost:3000/api/posts/${this.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                if (!response.ok) throw new Error('Failed to delete post')
                await this.$store.dispatch('fetchPosts')
                this.$router.push('/')
            } catch (e) {
                alert(`Error deleting post: ${e.message}`)
            }
        }
    }
}
</script>

<style scoped>
.post-page {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background-color: #FFFFFF;
    border: 1px solid #D8DEE9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.field {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}
.field label {
    font-weight: 600;
    margin-bottom: 5px;
    color: #4C566A;
}
.field input, .field textarea {
    padding: 10px;
    border: 1px solid #81A1C1;
    border-radius: 4px;
    background-color: #E5E9F0;
}
.field textarea {
    resize: vertical;
}
.buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}
.error-message {
    color: #BF616A;
    font-weight: bold;
    text-align: center;
}
.nav-btn {
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    transition: opacity 0.3s;
}
.nav-btn:hover {
    opacity: 0.85;
}
</style>