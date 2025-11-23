<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-6xl">
        <!-- Welcome Section -->
        <div class="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-4xl dark:text-white">
              Xin chào, {{ authStore.user?.fullName || 'Bạn' }}! 👋
            </h1>
            <p class="text-base text-text-secondary-light dark:text-text-secondary-dark">
              Hôm nay bạn muốn học gì nào?
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark text-right">
              {{ currentDate }}
            </p>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
            <div class="relative z-10">
              <p class="mb-1 text-sm font-medium text-blue-100">Bộ từ vựng</p>
              <h3 class="text-3xl font-bold">{{ deckStore.decks.length }}</h3>
            </div>
            <span class="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:text-white/20 transition-colors">folder_open</span>
          </div>

          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
            <div class="relative z-10">
              <p class="mb-1 text-sm font-medium text-purple-100">Từ đã học</p>
              <h3 class="text-3xl font-bold">0</h3>
            </div>
            <span class="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:text-white/20 transition-colors">school</span>
          </div>

          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
            <div class="relative z-10">
              <p class="mb-1 text-sm font-medium text-green-100">Chuỗi ngày học</p>
              <h3 class="text-3xl font-bold">0 <span class="text-lg font-normal">ngày</span></h3>
            </div>
            <span class="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:text-white/20 transition-colors">local_fire_department</span>
          </div>

          <div class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
            <div class="relative z-10">
              <p class="mb-1 text-sm font-medium text-orange-100">Cấp độ</p>
              <h3 class="text-3xl font-bold">A1</h3>
            </div>
            <span class="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10 group-hover:text-white/20 transition-colors">stars</span>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Recent Decks (Left Column) -->
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-primary-black dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">history</span>
                Học gần đây
              </h2>
              <router-link to="/decks" class="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Xem tất cả
              </router-link>
            </div>

            <div v-if="deckStore.loading" class="flex justify-center py-12">
              <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>

            <div v-else-if="recentDecks.length === 0" class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-light bg-surface-light py-12 text-center dark:border-border-dark dark:bg-surface-dark">
              <div class="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                <span class="material-symbols-outlined text-4xl text-gray-400">library_books</span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Chưa có bộ từ vựng nào</h3>
              <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Hãy tạo bộ từ vựng đầu tiên để bắt đầu học nhé!</p>
              <router-link
                to="/decks"
                class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-transform hover:scale-105 hover:bg-primary/90"
              >
                <span class="material-symbols-outlined">add_circle</span>
                Tạo mới ngay
              </router-link>
            </div>

            <div v-else class="grid gap-4 sm:grid-cols-2">
              <div
                v-for="deck in recentDecks"
                :key="deck.id"
                class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-light bg-surface-light p-5 transition-all hover:border-primary/50 hover:shadow-lg dark:border-border-dark dark:bg-surface-dark"
              >
                <div class="mb-4">
                  <div class="mb-2 flex items-start justify-between">
                    <h3 class="line-clamp-1 text-lg font-bold text-primary-black dark:text-white" :title="deck.name">
                      {{ deck.name }}
                    </h3>
                    <span v-if="deck.isPublic" class="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      PUBLIC
                    </span>
                  </div>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
                    <span class="material-symbols-outlined text-base">style</span>
                    {{ deck.wordCount || 0 }} từ vựng
                  </p>
                </div>

                <div class="space-y-3">
                  <div class="w-full rounded-full bg-gray-100 dark:bg-gray-700 h-2">
                    <div class="h-2 rounded-full bg-primary transition-all duration-500" style="width: 0%"></div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">0% hoàn thành</span>
                    <router-link
                      :to="`/decks/${deck.id}/learn`"
                      class="flex items-center gap-1 rounded-lg bg-black/5 px-3 py-1.5 text-xs font-bold text-primary-black transition-colors hover:bg-primary hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-primary"
                    >
                      Tiếp tục
                      <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions & Tips (Right Column) -->
          <div class="space-y-8">
            <!-- Quick Actions -->
            <div class="rounded-2xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark">
              <h3 class="mb-4 text-lg font-bold text-primary-black dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-yellow-500">bolt</span>
                Thao tác nhanh
              </h3>
              <div class="space-y-3">
                <router-link
                  to="/decks"
                  class="flex w-full items-center gap-3 rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <span class="material-symbols-outlined">add</span>
                  </div>
                  <div class="flex-1">
                    <p class="font-bold text-gray-900 dark:text-white">Tạo bộ từ mới</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Thêm danh sách từ vựng của bạn</p>
                  </div>
                  <span class="material-symbols-outlined text-gray-400">chevron_right</span>
                </router-link>

                <button
                  class="flex w-full items-center gap-3 rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <span class="material-symbols-outlined">casino</span>
                  </div>
                  <div class="flex-1 text-left">
                    <p class="font-bold text-gray-900 dark:text-white">Ôn tập ngẫu nhiên</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Ôn lại các từ đã học</p>
                  </div>
                  <span class="material-symbols-outlined text-gray-400">chevron_right</span>
                </button>
              </div>
            </div>

            <!-- Daily Tip -->
            <div class="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-white shadow-lg">
              <div class="mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined rounded-full bg-white/20 p-1">lightbulb</span>
                <h3 class="font-bold">Mẹo học tập</h3>
              </div>
              <p class="mb-4 text-sm font-medium leading-relaxed opacity-90">
                "Học 10 từ mỗi ngày hiệu quả hơn học 100 từ một lần mỗi tuần. Hãy duy trì thói quen hàng ngày nhé!"
              </p>
              <button class="w-full rounded-lg bg-white/20 py-2 text-sm font-bold text-white transition-colors hover:bg-white/30">
                Xem thêm mẹo
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDeckStore } from '@/stores/deck'
import Sidebar from '@/components/Sidebar.vue'

const authStore = useAuthStore()
const deckStore = useDeckStore()

const currentDate = computed(() => {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const recentDecks = computed(() => {
  // Sort by updated at or created at if available, otherwise just take first 4
  // Assuming decks are already sorted or we just take the top ones
  return deckStore.decks.slice(0, 4)
})

onMounted(async () => {
  try {
    if (deckStore.decks.length === 0) {
      await deckStore.fetchDecks()
    }
  } catch (error) {
    console.error('Failed to load decks:', error)
  }
})
</script>
