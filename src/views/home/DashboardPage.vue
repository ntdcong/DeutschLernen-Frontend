<template>
  <div
    class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-sans selection:bg-primary/20">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 sm:p-6 lg:p-8 lg:pt-8">
      <div class="mx-auto max-w-7xl space-y-8">
        <!-- Welcome Section -->
        <div
          class="relative overflow-hidden rounded-3xl bg-surface-light p-8 shadow-sm border border-border-light dark:bg-surface-dark dark:border-border-dark">
          <!-- Background Decoration -->
          <div class="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 -mb-20 -ml-20 h-40 w-40 rounded-full bg-white"></div>

          <div class="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div
                class="flex items-center gap-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">
                <span class="material-symbols-outlined text-lg">calendar_today</span>
                {{ currentDate }}
              </div>
              <h1 class="font-display text-3xl font-bold tracking-tight text-primary-black sm:text-4xl dark:text-white">
                Willkommen zurück, <span class="text-primary">{{ authStore.user?.fullName || 'Bạn' }}</span>!
              </h1>
              <p class="mt-2 text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl">
                Có hứng học chưa? Hay không tự giác được!
              </p>
            </div>

            <!-- Quick Stats Summary -->
            <div class="flex gap-6 md:border-l md:border-border-light md:pl-6 md:dark:border-border-dark">
              <div>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Chuỗi ngày</p>
                <div class="flex items-center gap-1">
                  <span class="font-display text-2xl font-bold text-orange-500">0</span>
                  <span class="material-symbols-outlined text-orange-500 text-xl">local_fire_department</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <!-- Left Column: Stats & Recent Decks (8 cols) -->
          <div class="lg:col-span-8 space-y-8">
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div
                class="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-border-light transition-all hover:shadow-md hover:border-primary/30 dark:bg-surface-dark dark:border-border-dark">
                <div class="relative z-10">
                  <div
                    class="mb-3 inline-flex rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <span class="material-symbols-outlined">folder_open</span>
                  </div>
                  <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Bộ từ vựng</p>
                  <h3 class="font-display text-2xl font-bold text-primary-black dark:text-white">{{
                    deckStore.decks.length }}</h3>
                </div>
              </div>

              <div
                class="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-border-light transition-all hover:shadow-md hover:border-primary/30 dark:bg-surface-dark dark:border-border-dark">
                <div class="relative z-10">
                  <div
                    class="mb-3 inline-flex rounded-xl bg-green-50 p-2 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    <span class="material-symbols-outlined">school</span>
                  </div>
                  <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Từ đã thuộc</p>
                  <h3 class="font-display text-2xl font-bold text-primary-black dark:text-white">0</h3>
                </div>
              </div>

              <div
                class="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-border-light transition-all hover:shadow-md hover:border-primary/30 dark:bg-surface-dark dark:border-border-dark">
                <div class="relative z-10">
                  <div
                    class="mb-3 inline-flex rounded-xl bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    <span class="material-symbols-outlined">history</span>
                  </div>
                  <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Đang học</p>
                  <h3 class="font-display text-2xl font-bold text-primary-black dark:text-white">0</h3>
                </div>
              </div>

              <div
                class="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-border-light transition-all hover:shadow-md hover:border-primary/30 dark:bg-surface-dark dark:border-border-dark">
                <div class="relative z-10">
                  <div
                    class="mb-3 inline-flex rounded-xl bg-orange-50 p-2 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                    <span class="material-symbols-outlined">trending_up</span>
                  </div>
                  <p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Tiến độ</p>
                  <h3 class="font-display text-2xl font-bold text-primary-black dark:text-white">0%</h3>
                </div>
              </div>
            </div>

            <!-- Recent Decks -->
            <div>
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-display text-xl font-bold text-primary-black dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">schedule</span>
                  Học gần đây
                </h2>
                <router-link to="/decks"
                  class="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  Xem tất cả
                  <span class="material-symbols-outlined text-base">arrow_forward</span>
                </router-link>
              </div>

              <div v-if="deckStore.loading" class="flex justify-center py-12">
                <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>

              <div v-else-if="recentDecks.length === 0"
                class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border-light bg-surface-light/50 py-16 text-center dark:border-border-dark dark:bg-surface-dark/50">
                <div class="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                  <span class="material-symbols-outlined text-4xl text-gray-400">library_books</span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Chưa có bộ từ vựng nào</h3>
                <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Hãy tạo bộ từ vựng đầu tiên để bắt đầu hành trình chinh phục tiếng Đức nhé!
                </p>
                <router-link to="/decks"
                  class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5">
                  <span class="material-symbols-outlined">add_circle</span>
                  Tạo mới ngay
                </router-link>
              </div>

              <div v-else class="grid gap-4 sm:grid-cols-2">
                <div v-for="deck in recentDecks" :key="deck.id"
                  class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-light bg-white p-5 transition-all hover:border-primary/50 hover:shadow-lg dark:border-border-dark dark:bg-surface-dark">
                  <div class="mb-4">
                    <div class="mb-3 flex items-start justify-between">
                      <div class="flex-1 mr-2">
                        <h3
                          class="line-clamp-1 text-lg font-bold text-primary-black dark:text-white group-hover:text-primary transition-colors"
                          :title="deck.name">
                          {{ deck.name }}
                        </h3>
                        <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                          Cập nhật: {{ new Date(deck.updatedAt || new Date()).toLocaleDateString('vi-VN') }}
                        </p>
                      </div>
                      <span v-if="deck.isPublic"
                        class="shrink-0 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        PUBLIC
                      </span>
                    </div>

                    <div
                      class="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-base">style</span>
                        {{ deck.wordCount || 0 }} từ
                      </div>
                    </div>
                  </div>

                  <div class="space-y-3 pt-3 border-t border-border-light dark:border-border-dark">
                    <router-link :to="`/decks/${deck.id}/learn`"
                      class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-sm font-bold text-primary-black transition-all hover:bg-black hover:text-white dark:bg-white/5 dark:text-white dark:group-hover:bg-primary">
                      Tiếp tục học
                      <span class="material-symbols-outlined text-lg">arrow_forward</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Quick Actions & Tips (4 cols) -->
          <div class="lg:col-span-4 space-y-8">
            <!-- Quick Actions -->
            <div
              class="rounded-3xl border border-border-light bg-white p-6 dark:border-border-dark dark:bg-surface-dark">
              <h3
                class="mb-6 font-display text-lg font-bold text-primary-black dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-yellow-500">bolt</span>
                Thao tác nhanh
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <router-link to="/decks"
                  class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-4 text-center transition-all hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-inherit dark:bg-gray-700">
                    <span class="material-symbols-outlined">add</span>
                  </div>
                  <span class="text-xs font-bold">Tạo bộ từ</span>
                </router-link>

                <button
                  class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-4 text-center transition-all hover:bg-purple-50 hover:text-purple-600 dark:bg-gray-800 dark:hover:bg-purple-900/20 dark:hover:text-purple-400">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-inherit dark:bg-gray-700">
                    <span class="material-symbols-outlined">casino</span>
                  </div>
                  <span class="text-xs font-bold">Ôn ngẫu nhiên</span>
                </button>

                <router-link to="/dictionary"
                  class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-4 text-center transition-all hover:bg-green-50 hover:text-green-600 dark:bg-gray-800 dark:hover:bg-green-900/20 dark:hover:text-green-400">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-inherit dark:bg-gray-700">
                    <span class="material-symbols-outlined">search</span>
                  </div>
                  <span class="text-xs font-bold">Tra từ điển</span>
                </router-link>

                <router-link to="/profile"
                  class="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gray-50 p-4 text-center transition-all hover:bg-orange-50 hover:text-orange-600 dark:bg-gray-800 dark:hover:bg-orange-900/20 dark:hover:text-orange-400">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-inherit dark:bg-gray-700">
                    <span class="material-symbols-outlined">person</span>
                  </div>
                  <span class="text-xs font-bold">Hồ sơ</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
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
