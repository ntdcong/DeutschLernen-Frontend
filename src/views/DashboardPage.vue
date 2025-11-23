<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-4xl">
        <!-- Header -->
        <div class="mb-8">
          <h1
            class="text-3xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-4xl dark:text-white"
          >
            Chào mừng trở lại, {{ authStore.user?.fullName || 'User' }}!
          </h1>
          <p class="mt-2 text-base font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
          </p>
        </div>

        <!-- Statistics Overview -->
        <div class="mb-8">
          <h2
            class="mb-4 text-xl font-bold leading-tight tracking-[-0.015em] text-primary-black dark:text-white"
          >
            Tổng quan tiến trình
          </h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
              class="flex flex-col gap-2 rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark"
            >
              <p class="text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark">
                Số bộ từ vựng
              </p>
              <p class="text-3xl font-bold leading-tight tracking-light text-primary-black dark:text-white">
                {{ deckStore.decks.length }}
              </p>
            </div>

            <div
              class="flex flex-col gap-2 rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark"
            >
              <p class="text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark">
                Số từ đã học
              </p>
              <p class="text-3xl font-bold leading-tight tracking-light text-primary-black dark:text-white">
                0
              </p>
            </div>

            <div
              class="flex flex-col gap-2 rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark"
            >
              <p class="text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark">
                Đã học được
              </p>
              <p class="text-3xl font-bold leading-tight tracking-light text-primary-black dark:text-white">
                0<span class="text-base text-text-secondary-light dark:text-text-secondary-dark"> ngày</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Recent Decks -->
        <div>
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-bold leading-tight tracking-[-0.015em] text-primary-black dark:text-white">
              Bộ từ vựng của bạn
            </h2>
            <router-link class="text-sm font-semibold text-primary hover:underline" to="/decks">
              Xem tất cả
            </router-link>
          </div>

          <!-- Loading State -->
          <div v-if="deckStore.loading" class="text-center py-8">
            <p class="text-text-secondary-light dark:text-text-secondary-dark">Đang tải...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="deckStore.decks.length === 0" class="text-center py-12 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <p class="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Bạn chưa có bộ từ vựng nào
            </p>
            <router-link
              to="/decks"
              class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Tạo bộ từ vựng đầu tiên
            </router-link>
          </div>

          <!-- Deck Grid -->
          <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              v-for="deck in recentDecks"
              :key="deck.id"
              class="flex flex-col justify-between rounded-xl border border-border-light bg-surface-light p-4 transition-shadow hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
            >
              <div>
                <h3 class="font-bold text-primary-black dark:text-white">{{ deck.name }}</h3>
                <p class="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {{ deck.wordCount || 0 }} từ vựng
                </p>
              </div>
              <div class="mt-4">
                <div
                  class="mb-1 flex justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark"
                >
                  <span>Tiến độ</span>
                  <span>0%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div class="h-2 rounded-full bg-primary" style="width: 0%"></div>
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
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDeckStore } from '@/stores/deck'
import Sidebar from '@/components/Sidebar.vue'

const authStore = useAuthStore()
const deckStore = useDeckStore()

const recentDecks = computed(() => {
  return deckStore.decks.slice(0, 4)
})

onMounted(async () => {
  try {
    await deckStore.fetchDecks()
  } catch (error) {
    console.error('Failed to load decks:', error)
  }
})
</script>
