import { createStore } from 'vuex'

export default createStore({
    state() {
        return {
            posts: [],
            token: localStorage.getItem('token') || '',
            user: null
        }
    },

    getters: {
        allPosts: (state) => state.posts,
        getPostById: (state) => (id) => state.posts.find(p => p.id === id),
        isAuthenticated: (state) => !!state.token
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
        },
        AUTH_SUCCESS(state, token) {
            state.token = token
        },
        LOGOUT(state) {
            state.token = ''
            state.user = null
        }
    },

    actions: {
        getAuthHeaders({ state }) {
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            }
        },
        async fetchPosts({ commit, state }) {
            const response = await fetch('http://localhost:3000/api/posts', {
                headers: { 'Authorization': `Bearer ${state.token}` } 
            })
            
            if (response.status === 401 || response.status === 403) {
                commit('LOGOUT')
                return
            }

            const data = await response.json()
            commit('SET_POSTS', data)
        },
        async likePost({ commit, state }, postId) {
            await fetch(`http://localhost:3000/api/posts/${postId}/like`, { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${state.token}` }
            })
            commit('INCREMENT_LIKE', postId)
        },
        async resetLikes({ commit, state }) {
            await fetch('http://localhost:3000/api/posts/reset-likes', { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${state.token}` }
            })
            commit('RESET_ALL_LIKES')
        },
        async deleteAllPosts({ commit, state }) {
             await fetch('http://localhost:3000/api/posts', { 
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${state.token}` }
            })
            commit('SET_POSTS', [])
        },
        async signup({ commit }, userData) {
            const response = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
            if (!response.ok) throw new Error('Signup failed')
            
            const data = await response.json()
            localStorage.setItem('token', data.token)
            commit('AUTH_SUCCESS', data.token)
        },
        async login({ commit }, userData) {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
            if (!response.ok) throw new Error('Login failed')

            const data = await response.json()
            localStorage.setItem('token', data.token)
            commit('AUTH_SUCCESS', data.token)
        },
        logout({ commit }) {
            localStorage.removeItem('token')
            commit('LOGOUT')
        }
    }
})
