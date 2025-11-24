<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8">
          <h1
            class="text-3xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-4xl dark:text-white">
            Hồ Sơ Cá Nhân
          </h1>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div
              class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent">
            </div>
            <p class="mt-4 text-text-secondary-light dark:text-text-secondary-dark">Đang tải thông tin...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error"
          class="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Profile Content -->
        <div v-else-if="userProfile" class="space-y-6">
          <!-- Profile Header Card -->
          <div
            class="relative overflow-hidden rounded-2xl border border-border-light bg-gradient-to-br from-black via-red-600 to-yellow-600 p-8 dark:border-border-dark">
            <div class="relative z-10 flex flex-col items-center gap-6 sm:flex-row">
              <!-- Avatar -->
              <div class="relative">
                <div
                  class="flex h-32 w-32 items-center justify-center rounded-full bg-blue-500 text-5xl font-bold text-white shadow-2xl ring-4 ring-white dark:ring-gray-800">
                  {{ getInitials(userProfile.fullName) }}
                </div>
                <div
                  class="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white bg-green-500 dark:border-gray-800"
                  :class="userProfile.isActive ? 'bg-green-500' : 'bg-gray-400'"></div>
              </div>

              <!-- User Info -->
              <div class="flex-1 text-center sm:text-left">
                <h2 class="text-3xl font-bold text-white dark:text-white">
                  {{ userProfile.fullName }}
                </h2>
                <p class="mt-2 text-lg text-white dark:text-text-secondary-dark">
                  {{ userProfile.email }}
                </p>
                <div class="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                      </path>
                    </svg>
                    Tham gia: {{ formatDate(userProfile.createdAt) }}
                  </span>
                  <span
                    class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-yellow-600 shadow-sm dark:bg-gray-800 dark:text-blue-400">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Đã tham gia được {{ totalDays }} ngày
                  </span>
                </div>
              </div>
            </div>
          </div>



          <!-- Calendar & Account Info Grid -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Calendar -->
            <div>
              <div
                class="rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark">
                <h3 class="mb-4 text-xl font-bold text-primary-black dark:text-white">Lịch</h3>

                <!-- Month Navigation -->
                <div class="mb-4 flex items-center justify-between">
                  <button @click="previousMonth" class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <h4 class="text-base font-semibold text-primary-black dark:text-white">
                    {{ currentMonthName }} {{ currentYear }}
                  </h4>
                  <button @click="nextMonth" class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>

                <!-- Calendar Grid -->
                <div class="grid grid-cols-7 gap-1">
                  <!-- Day Headers -->
                  <div v-for="day in ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']" :key="day"
                    class="text-center text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark py-2">
                    {{ day }}
                  </div>

                  <!-- Calendar Days -->
                  <div v-for="(day, index) in calendarDays" :key="index"
                    class="aspect-square flex items-center justify-center text-sm">
                    <div v-if="day.date" class="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                      :class="day.isToday ? 'bg-black text-white font-bold dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-gray-800'">
                      {{ day.date }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Information -->
            <div>
              <div
                class="rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark">
                <h3 class="mb-6 text-xl font-bold text-primary-black dark:text-white">Thông Tin Tài Khoản</h3>

                <div class="space-y-4">
                  <div>
                    <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Họ và
                      tên</label>
                    <p
                      class="mt-1 rounded-lg border border-border-light bg-background-light px-4 py-2 text-sm text-primary-black dark:border-border-dark dark:bg-background-dark dark:text-white">
                      {{ userProfile.fullName }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Email</label>
                    <p
                      class="mt-1 rounded-lg border border-border-light bg-background-light px-4 py-2 text-sm text-primary-black dark:border-border-dark dark:bg-background-dark dark:text-white">
                      {{ userProfile.email }}
                    </p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Ngày tạo
                      tài khoản</label>
                    <p
                      class="mt-1 rounded-lg border border-border-light bg-background-light px-4 py-2 text-sm text-primary-black dark:border-border-dark dark:bg-background-dark dark:text-white">
                      {{ formatDateTime(userProfile.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import userService, { type User } from '@/services/user.service'
import Sidebar from '@/components/Sidebar.vue'

const authStore = useAuthStore()
const userProfile = ref<User | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Calendar state
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Mock data for demonstration
const studyStreak = ref(7)
const totalWords = ref(342)
const completionRate = ref(78)

// Activity data (mock)
const activityData = ref<Record<string, number>>({
  '2025-11-01': 5,
  '2025-11-02': 3,
  '2025-11-05': 8,
  '2025-11-10': 2,
  '2025-11-15': 6,
  '2025-11-20': 4,
  '2025-11-23': 7,
})

const recentActivities = ref([
  {
    id: 1,
    title: 'Hoàn thành bộ từ vựng "Cơ bản"',
    time: '2 giờ trước',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    iconPath: 'M5 13l4 4L19 7'
  },
  {
    id: 2,
    title: 'Học 25 từ mới',
    time: '5 giờ trước',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 3,
    title: 'Đạt chuỗi 7 ngày',
    time: 'Hôm nay',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z'
  },
  {
    id: 4,
    title: 'Tạo bộ từ mới',
    time: 'Hôm qua',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconPath: 'M12 4v16m8-8H4'
  }
])

// Computed
const totalDays = computed(() => {
  if (!userProfile.value || !userProfile.value.createdAt) return 0
  const createdDate = new Date(userProfile.value.createdAt)
  if (isNaN(createdDate.getTime())) return 0
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - createdDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const currentMonthName = computed(() => {
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
  return months[currentMonth.value]
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ date: null, isToday: false, hasActivity: false, activityLevel: 0 })
  }

  // Add days of the month
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const isToday = today.getDate() === i && today.getMonth() === currentMonth.value && today.getFullYear() === currentYear.value
    const activityLevel = activityData.value[dateStr] || 0

    days.push({
      date: i,
      isToday,
      hasActivity: activityLevel > 0,
      activityLevel
    })
  }

  return days
})

// Methods
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Không có thông tin'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Không có thông tin'
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateTime(dateString: string): string {
  if (!dateString) return 'Không có thông tin'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Không có thông tin'
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getDayClass(day: any) {
  if (!day.date) return ''

  if (day.activityLevel >= 5) {
    return 'bg-green-500 text-white font-semibold hover:bg-green-600 cursor-pointer'
  } else if (day.activityLevel > 0) {
    return 'bg-yellow-500 text-white font-semibold hover:bg-yellow-600 cursor-pointer'
  } else {
    return 'border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
  }
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

async function fetchUserProfile() {
  try {
    loading.value = true
    error.value = null

    // Try to get user profile by ID from auth store
    if (authStore.user?.id) {
      const response = await userService.getUserById(authStore.user.id)
      userProfile.value = response.data
    } else {
      throw new Error('No user ID found')
    }
  } catch (err: any) {
    console.error('Failed to fetch user profile:', err)

    // Fallback to auth store user data
    if (authStore.user) {
      userProfile.value = {
        id: authStore.user.id,
        fullName: authStore.user.fullName,
        email: authStore.user.email,
        isActive: authStore.user.isActive,
        createdAt: authStore.user.createdAt
      }
      error.value = null
    } else {
      error.value = err.response?.data?.message || 'Không thể tải thông tin người dùng'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>
