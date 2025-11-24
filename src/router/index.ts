import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import FlashcardDeckPage from '@/views/FlashcardDeckPage.vue'
import FlashcardLearnPage from '@/views/FlashcardLearnPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta: { requiresAuth: false, redirectIfAuth: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage,
      meta: { requiresAuth: false, redirectIfAuth: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/decks',
      name: 'Decks',
      component: FlashcardDeckPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/decks/:id/learn',
      name: 'LearnFlashcard',
      component: FlashcardLearnPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/decks/:id/add',
      name: 'AddWords',
      component: () => import('@/views/FlashcardAddWordsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/decks/:id/edit',
      name: 'EditWords',
      component: () => import('@/views/FlashcardEditWordsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/FavoriteSentencesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Redirect authenticated users away from login/register pages
  if (to.meta.redirectIfAuth && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router

