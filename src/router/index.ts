import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/posts'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue')
    },
    {
        path: '/posts',
        name: 'PostList',
        component: () => import('@/views/PostListView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(to => {
    const isAuthenticated = localStorage.getItem('token')
    if (to.name !== 'Login' && !isAuthenticated) {
        return { name: 'Login' }
    }
})

export default router
