<template>
    <div v-if="loading" class="post-page">
        <p>Loading post...</p>
    </div>
    <div v-else-if="error" class="post-page">
        <p class="error-message">{{ error }}</p>
        <p v-if="error === 'Unauthorized'">Please log in to view and manage posts.</p>
    </div>

    <div v-else class="post-page">
        <h2>Post ID #{{ id }}</h2>

        <div class="field">
            <label>Author</label>
            <input :value="postData.username" readonly /> 
        </div>

        <div class="field">
            <label>Posted Date</label>
            <input type="text" :value="formatDate(postData.date)" readonly />
        </div>

        <div class="field">
            <label>Content</label>
            <textarea v-model="form.content" rows="6"></textarea>
        </div>

        <div class="field" v-if="postData.image">
            <label>Image URL (Read-only for now)</label>
            <input :value="postData.image" readonly />
            <img :src="postData.image" alt="Post Image" class="post-image-preview">
        </div>
        
        <div class="buttons">
            <button @click="updatePost" class="nav-btn" style="background-color: #A3BE8C;">Update Post</button>
            <button @click="deletePost" class="nav-btn" style="background-color: #BF616A;">Delete Post</button>
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
        }
    },

    mounted() {
        this.fetchPost()
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
                this.form.content = post.content ?? ''
                
            } catch (e) {
                this.error = e.message
            } finally {
                this.loading = false
            }
        },

        async updatePost() {
            try {
                const dataToSend = { content: this.form.content } 

                const response = await fetch(`http://localhost:3000/api/posts/${this.id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}` // SEND TOKEN
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
                        'Authorization': `Bearer ${this.token}` // SEND TOKEN
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
.post-image-preview {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin-top: 10px;
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
    opacity: 0.85
}
</style>