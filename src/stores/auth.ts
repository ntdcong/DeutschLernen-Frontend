import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authService, { type LoginDto, type RegisterDto } from '@/services/auth.service'

interface User {
  id: string
  email: string
  fullName: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'teacher')
  const isLearner = computed(() => user.value?.role === 'learner')

  // Initialize from localStorage
  function initializeAuth() {
    const storedToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedRefreshToken && storedUser) {
      accessToken.value = storedToken
      refreshToken.value = storedRefreshToken
      user.value = JSON.parse(storedUser)
    }
  }

  // Login action
  async function login(credentials: LoginDto) {
    try {
      loading.value = true
      error.value = null
      const response = await authService.login(credentials)

      user.value = response.data.user
      accessToken.value = response.data.accessToken
      refreshToken.value = response.data.refreshToken

      // Persist to localStorage
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Register action
  async function register(data: RegisterDto) {
    try {
      loading.value = true
      error.value = null
      const response = await authService.register(data)

      user.value = response.data.user
      accessToken.value = response.data.accessToken
      refreshToken.value = response.data.refreshToken

      // Persist to localStorage
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout action
  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    error.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  // Refresh access token
  async function refreshAccessToken() {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken({ refreshToken: refreshToken.value })
      accessToken.value = response.data.accessToken

      localStorage.setItem('accessToken', response.data.accessToken)

      return response
    } catch (err) {
      logout()
      throw err
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isLearner,
    initializeAuth,
    login,
    register,
    logout,
    refreshAccessToken
  }
})
