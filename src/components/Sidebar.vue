<template>
  <aside
    class="sticky top-0 hidden h-screen w-64 flex-col border-r border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark lg:flex"
  >
    <div class="flex h-full flex-col justify-between p-4">
      <div class="flex flex-col gap-4">
        <!-- User Profile -->
        <div class="flex items-center gap-3 p-2">
          <div class="size-10 rounded-full bg-gradient-to-br from-primary to-primary-yellow flex items-center justify-center text-white font-bold">
            {{ userInitials }}
          </div>
          <div class="flex flex-col">
            <h1 class="text-base font-semibold leading-normal text-text-primary-light dark:text-text-primary-dark">
              {{ authStore.user?.fullName || 'User' }}
            </h1>
            <p class="text-sm font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              {{ roleLabel }}
            </p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-2">
          <router-link
            to="/dashboard"
            class="flex items-center gap-3 rounded-lg px-3 py-2"
            :class="isActive('/dashboard') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-black/5 dark:hover:bg-white/5'"
          >
            <span class="material-symbols-outlined" :class="{ 'fill': isActive('/dashboard') }">dashboard</span>
            <p class="text-sm font-medium leading-normal">Dashboard</p>
          </router-link>

          <router-link
            to="/decks"
            class="flex items-center gap-3 rounded-lg px-3 py-2"
            :class="isActive('/decks') ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-black/5 dark:hover:bg-white/5'"
          >
            <span class="material-symbols-outlined" :class="{ 'fill': isActive('/decks') }">translate</span>
            <p class="text-sm font-medium leading-normal">Học Từ Vựng</p>
          </router-link>

          <a class="flex items-center gap-3 rounded-lg px-3 py-2 opacity-50 cursor-not-allowed" href="#">
            <span class="material-symbols-outlined">menu_book</span>
            <p class="text-sm font-medium leading-normal">Ngữ Pháp</p>
          </a>

          <a class="flex items-center gap-3 rounded-lg px-3 py-2 opacity-50 cursor-not-allowed" href="#">
            <span class="material-symbols-outlined">mic</span>
            <p class="text-sm font-medium leading-normal">Luyện Phát Âm</p>
          </a>

          <a class="flex items-center gap-3 rounded-lg px-3 py-2 opacity-50 cursor-not-allowed" href="#">
            <span class="material-symbols-outlined">smart_toy</span>
            <p class="text-sm font-medium leading-normal">Học cùng AI</p>
          </a>
        </nav>
      </div>

      <!-- Settings and Logout -->
      <div class="flex flex-col gap-1">
        <a class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5" href="#">
          <span class="material-symbols-outlined">settings</span>
          <p class="text-sm font-medium leading-normal">Cài đặt</p>
        </a>
        <button
          @click="handleLogout"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <span class="material-symbols-outlined">logout</span>
          <p class="text-sm font-medium leading-normal">Đăng xuất</p>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.fullName || 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const roleLabel = computed(() => {
  const role = authStore.user?.role || 'learner'
  const labels = {
    admin: 'Quản trị viên',
    teacher: 'Giáo viên',
    learner: 'Học viên'
  }
  return labels[role as keyof typeof labels] || 'Học viên'
})

function isActive(path: string) {
  return route.path === path
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
