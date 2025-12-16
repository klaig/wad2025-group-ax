import { createStore } from 'vuex'

export default createStore({
    state() {
        return {
            posts: []
        }
    },

    getters: {
        allPosts: (state) => state.posts,
        getPostById: (state) => (id) => state.posts.find(p => p.id === id)
    },

    mutations: {
        SET_POSTS(state, posts) {
            state.posts = posts
        },
        INCREMENT_LIKE(state, postId) {
            const post = state.posts.find(p => p.id === postId)
            if (post) post.likes++
        },
        RESET_ALL_LIKES(state) {
            state.posts.forEach(post => post.likes = 0)
        }
    },

    actions: {
        async fetchPosts({ commit }) {
            const response = await fetch('/api/posts')
            const data = await response.json()
            commit('SET_POSTS', data)
        },
        async likePost({ commit }, postId) {
            await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
            commit('INCREMENT_LIKE', postId)
        },
        async resetLikes({ commit }) {
            await fetch('/api/posts/reset-likes', { method: 'POST' })
            commit('RESET_ALL_LIKES')
        }
    }
})
