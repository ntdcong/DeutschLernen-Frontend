import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '@/views/home/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import DashboardPage from '@/views/home/DashboardPage.vue'
import FlashcardDeckPage from '@/views/flashcard/FlashcardDeckPage.vue'
import FlashcardLearnPage from '@/views/flashcard/FlashcardLearnPage.vue'
import ProfilePage from '@/views/home/ProfilePage.vue'

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
      component: () => import('@/views/flashcard/FlashcardAddWordsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/decks/:id/edit',
      name: 'EditWords',
      component: () => import('@/views/flashcard/FlashcardEditWordsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/decks/:id/practice',
      name: 'Practice',
      component: () => import('@/views/flashcard/FlashcardPracticePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: () => import('@/views/home/FavoriteSentencesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dictionary',
      name: 'Dictionary',
      component: () => import('@/views/home/DictionaryPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/public/learn/:token',
      name: 'PublicLearn',
      component: () => import('@/views/flashcard/PublicLearnPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/public/practice/:token',
      name: 'PublicPractice',
      component: () => import('@/views/flashcard/PublicPracticePage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/writing-practice',
      name: 'WritingPractice',
      component: () => import('@/views/home/WritingPracticePage.vue'),
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

