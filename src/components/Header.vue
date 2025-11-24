<template>
  <header
    class="top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-[#0f172a]/80">
    <div class="mx-auto flex h-16 max-w-8xl items-center justify-between px-4 sm:px-6">
      <router-link to="/" class="flex items-center gap-2 group">
        <span class="text-lg font-bold tracking-tight">GERMANLY</span>
      </router-link>

      <!-- Not logged in -->
      <div v-if="!authStore.isAuthenticated" class="flex items-center gap-4">
        <router-link to="/login"
          class="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          Đăng nhập
        </router-link>
        <router-link to="/register"
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-all">
          Tạo tài khoản
        </router-link>
      </div>

      <!-- Logged in -->
      <div v-else class="flex items-center gap-4">
        <!-- User Menu -->
        <div class="relative">
          <button @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            @blur="handleBlur">
            <span class="material-symbols-outlined text-lg">account_circle</span>
            <span class="text-sm font-medium hidden sm:block">{{ authStore.user?.fullName }}</span>
            <span class="material-symbols-outlined text-sm">expand_more</span>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="showUserMenu"
            class="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div class="p-3 border-b border-slate-100 dark:border-slate-800">
              <p class="text-sm font-bold text-slate-900 dark:text-white">{{ authStore.user?.fullName }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ authStore.user?.email }}</p>
            </div>
            <div class="py-1">
              <router-link to="/profile" @click="showUserMenu = false"
                class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <span class="material-symbols-outlined text-lg">person</span>
                Hồ sơ
              </router-link>
              <router-link to="/dashboard" @click="showUserMenu = false"
                class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <span class="material-symbols-outlined text-lg">dashboard</span>
                Dashboard
              </router-link>
            </div>
            <div class="border-t border-slate-100 dark:border-slate-800 py-1">
              <button @click="handleLogout"
                class="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                <span class="material-symbols-outlined text-lg">logout</span>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const showUserMenu = ref(false)

const userInitials = computed(() => {
  const name = authStore.user?.fullName || ''
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

function handleBlur(event: FocusEvent) {
  // Delay to allow click events on menu items to fire
  setTimeout(() => {
    const relatedTarget = event.relatedTarget as HTMLElement
    if (!relatedTarget || !relatedTarget.closest('.relative')) {
      showUserMenu.value = false
    }
  }, 200)
}

async function handleLogout() {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/login')
}
</script>