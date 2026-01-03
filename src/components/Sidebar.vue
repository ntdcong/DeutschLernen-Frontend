<template>
  <div>
    <button v-if="!isMobileMenuOpen" @click="toggleMobileMenu"
      class="fixed left-4 top-4 z-[100] flex size-10 items-center justify-center rounded-full bg-white text-black shadow-md transition-all hover:bg-gray-100 lg:hidden"
      aria-label="Open mobile menu">
      <span class="material-symbols-outlined text-xl">menu</span>
    </button>

    <button v-if="!isDesktopSidebarOpen" @click="toggleDesktopSidebar"
      class="fixed left-4 top-4 z-[40] hidden size-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-50 lg:flex dark:border-gray-700 dark:bg-surface-dark dark:text-gray-300"
      aria-label="Open desktop sidebar">
      <span class="material-symbols-outlined text-xl">dock_to_right</span>
    </button>

    <Transition name="fade">
      <div v-if="isMobileMenuOpen" @click="closeMobileMenu" class="fixed inset-0 z-[90] bg-black/50 lg:hidden">
      </div>
    </Transition>

    <Transition name="slide">
      <aside v-show="shouldShowSidebar"
        class="fixed inset-y-0 left-0 z-[95] flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-all duration-300 lg:sticky lg:top-0 lg:z-0 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3 overflow-hidden">
            <span class="material-symbols-outlined text-lg">account_circle</span>
            <div class="flex min-w-0 flex-col">
              <h1 class="truncate text-sm font-bold text-gray-900 dark:text-white">
                {{ authStore.user?.fullName || 'Germanly User' }}
              </h1>
            </div>
          </div>

          <button @click="handleCloseSidebar"
            class="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <span class="material-symbols-outlined text-xl">
              {{ isDesktop ? 'dock_to_left' : 'close' }}
            </span>
          </button>
        </div>

        <div class="flex flex-1 flex-col justify-between overflow-y-auto p-3">
          <div class="flex flex-col gap-2">

            <router-link v-for="item in navItems" :key="item.path" :to="item.path" @click="handleNavClick"
              class="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200"
              :class="getLinkClass(item.path)">
              <span class="material-symbols-outlined text-[22px]" :class="{ 'fill-current': isActive(item.path) }">
                {{ item.icon }}
              </span>
              <p class="text-sm font-medium">{{ item.label }}</p>
            </router-link>

            <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>
            <p class="px-3 text-xs font-bold uppercase text-gray-400">Sắp ra mắt</p>

            <a v-for="item in disabledItems" :key="item.label"
              class="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-gray-400 opacity-60 grayscale hover:bg-gray-50 dark:hover:bg-white/5"
              href="#">
              <span class="material-symbols-outlined text-[22px]">{{ item.icon }}</span>
              <p class="text-sm font-medium">{{ item.label }}</p>
            </a>
          </div>

          <div class="flex flex-col gap-1 border-t border-gray-200 pt-3 dark:border-gray-700">
            <button @click="router.push('/')"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 hover:bg-yellow-100 dark:text-gray-300 dark:hover:bg-yellow-50">
              <span class="material-symbols-outlined">home</span>
              <p class="text-sm font-medium">Trang chủ</p>
            </button>
            <button @click="handleLogout"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
              <span class="material-symbols-outlined">logout</span>
              <p class="text-sm font-medium">Đăng xuất</p>
            </button>
          </div>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// --- Configuration Data ---
const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/decks', label: 'Học Từ Vựng', icon: 'translate' },
  { path: '/dictionary', label: 'Từ điển', icon: 'book' },
  { path: '/favorites', label: 'Câu yêu thích', icon: 'favorite' },
  { path: '/writing-practice', label: 'Luyện Viết', icon: 'edit_note' },
  { path: '/shadowing', label: 'Luyện Phát Âm', icon: 'record_voice_over' },
  { path: '/profile', label: 'Hồ sơ', icon: 'person' },
]

const disabledItems = [
  { label: 'Ngữ Pháp', icon: 'menu_book' },
  { label: 'Luyện Nói', icon: 'mic' },
]

// --- State ---
const isMobileMenuOpen = ref(false)
const isDesktopSidebarOpen = ref(true)
const isDesktop = ref(true)
const activeColorClass = ref('')

// --- German Flag Colors Palette ---
const germanColors = [
  'bg-gray-900 text-white dark:bg-white dark:text-black shadow-md',
  'bg-[#DD0000] text-white shadow-md shadow-red-500/20',
  'bg-[#FFCE00] text-black shadow-md shadow-yellow-500/20'
]

// --- Computed ---
const userInitials = computed(() => {
  return (authStore.user?.fullName || 'U').substring(0, 2).toUpperCase()
})

// Logic hiển thị sidebar: Mobile (theo biến toggle) OR Desktop (theo biến toggle desktop)
const shouldShowSidebar = computed(() => {
  if (isDesktop.value) return isDesktopSidebarOpen.value
  return isMobileMenuOpen.value
})

// --- Methods ---

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

// Hàm tạo màu ngẫu nhiên mỗi khi chuyển trang
function randomizeColor() {
  const randomIndex = Math.floor(Math.random() * germanColors.length)
  activeColorClass.value = germanColors[randomIndex] || ''
}

// Hàm lấy class cho từng link
function getLinkClass(path: string) {
  if (isActive(path)) {
    return activeColorClass.value
  }
  // Style mặc định khi không active
  return 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function toggleDesktopSidebar() {
  isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value
}

// Nút X (hoặc icon đóng sidebar) sẽ hành xử khác nhau tùy thiết bị
function handleCloseSidebar() {
  if (isDesktop.value) {
    toggleDesktopSidebar() // Trên desktop thì ẩn đi (có thể mở lại bằng nút dock)
  } else {
    closeMobileMenu() // Trên mobile thì đóng overlay
  }
}

function handleNavClick() {
  if (!isDesktop.value) closeMobileMenu()
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function handleResize() {
  isDesktop.value = window.innerWidth >= 1024
  // Nếu chuyển từ desktop về mobile, đảm bảo menu đóng để không bị che màn hình
  if (!isDesktop.value) {
    isMobileMenuOpen.value = false
  } else {
    // Nếu về lại desktop, khôi phục trạng thái mở (hoặc giữ nguyên ý muốn người dùng)
    if (isDesktopSidebarOpen.value === false) isDesktopSidebarOpen.value = true
  }
}

// --- Watchers & Hooks ---

// Theo dõi sự thay đổi route để đổi màu cờ Đức
watch(
  () => route.path,
  () => {
    randomizeColor()
  },
  { immediate: true } // Chạy ngay lần đầu load
)

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Fill icon styles */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.material-symbols-outlined.fill-current {
  font-variation-settings: 'FILL' 1;
}
</style>