import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import SignupPage from '../views/SignupPage.vue'
import LoginPage from '../views/LoginPage.vue'
import PostPage from '../views/PostPage.vue'
import ContactPage from '../views/ContactPage.vue'
import store from '../store'

const routes = [
    { path: '/', component: MainPage, meta: { requiresAuth: true } },
    { path: '/signup', component: SignupPage },
    { path: '/login', component: LoginPage },
    { path: '/posts/:id', component: PostPage },
    { path: '/contact', component: ContactPage }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated 
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
        next('/')
    } else {
        next()
    }
})

export default router