import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
import Settings from '../views/Settings.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../views/BlogPost.vue'
import Consulting from '../views/Consulting.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Index
        },
        { path: '/login', name: 'login', component: Login },
        {
            path: '/login/:login_type',
            name: 'loginCallback',
            query: true,
            component: Login
        },
        {
            path: '/settings',
            component: Settings
        },
        {
            path: '/blog',
            component: Blog
        },
        {
            path: '/blog/:id',
            component: BlogPost
        },
        {
            path: '/consulting',
            component: Consulting
        }
    ]
})

export default router
