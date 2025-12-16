<template>
  <div v-if="loading">Loading post...</div>
  <div v-else-if="error">{{ error }}</div>

  <div v-else class="post-page">
    <h2>Post #{{ id }}</h2>

    <div class="field">
      <label>Author</label>
      <input v-model="form.author" />
    </div>

    <div class="field">
      <label>Date</label>
      <input type="date" v-model="form.date" />
    </div>

    <div class="field">
      <label>Title</label>
      <input v-model="form.title" />
    </div>

    <div class="field">
      <label>Description</label>
      <textarea v-model="form.description"></textarea>
    </div>

    <div class="field">
      <label>Image URL</label>
      <input v-model="form.image" />
    </div>

    <div class="buttons">
      <button @click="updatePost">Update</button>
      <button @click="deletePost">Delete</button>
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
      form: {
        author: '',
        date: '',
        title: '',
        description: '',
        image: ''
      }
    }
  },

  computed: {
    id() {
      return this.$route.params.id
    }
  },

  mounted() {
    this.fetchPost()
  },

  methods: {
    async fetchPost() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`/api/posts/${this.id}`)
        if (!response.ok) throw new Error('Post not found')
        const post = await response.json()

        this.form.author = post.author ?? ''
        this.form.date = (post.date ?? '').slice(0, 10)
        this.form.title = post.title ?? ''
        this.form.description = post.description ?? ''
        this.form.image = post.image ?? ''
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async updatePost() {
      try {
        const response = await fetch(`/api/posts/${this.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        })

        if (!response.ok) throw new Error('Failed to update post')

        await this.$store.dispatch('fetchPosts')
        await this.fetchPost()
      } catch (e) {
        alert(e.message)
      }
    },

    async deletePost() {
      if (!confirm('Are you sure you want to delete this post?')) return
      try {
        const response = await fetch(`/api/posts/${this.id}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Failed to delete post')

        await this.$store.dispatch('fetchPosts')
        this.$router.push('/')
      } catch (e) {
        alert(e.message)
      }
    }
  }
}
</script>

<style scoped>
.post-page {
  max-width: 520px;
  margin: 0 auto;
}
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.buttons {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
</style>