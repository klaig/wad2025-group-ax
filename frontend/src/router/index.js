import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import SignupPage from '../views/SignupPage.vue'
import PostPage from '../views/PostPage.vue'

const routes = [
    { path: '/', component: MainPage },
    { path: '/signup', component: SignupPage },
    { path: '/posts/:id', component: PostPage}
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})
