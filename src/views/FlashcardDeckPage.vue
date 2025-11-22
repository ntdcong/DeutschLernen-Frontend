<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 text-text-primary-light sm:p-6 lg:p-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8">
          <h1
            class="text-3xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-4xl dark:text-white"
          >
            Học Từ Vựng
          </h1>
        </div>

        <!-- Actions Bar -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row">
          <button
            @click="showCreateModal = true"
            data-testid="create-deck-button"
            style="display: flex !important; visibility: visible !important; background-color: #DD0000 !important; color: white !important; opacity: 1 !important; border: 2px solid #DD0000 !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;"
            class="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-semibold transition-colors hover:bg-primary/90 sm:w-auto"
          >
            <span class="material-symbols-outlined" style="color: white !important;">add_circle</span>
            <span style="color: white !important;">Tạo bộ từ vựng mới</span>
          </button>
          <div class="relative flex-grow">
            <span
              class="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark"
            >
              search
            </span>
            <input
              v-model="searchQuery"
              class="w-full rounded-lg border border-border-light bg-surface-light py-2.5 pl-12 pr-4 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-surface-dark"
              placeholder="Tìm kiếm bộ từ vựng..."
              type="text"
            />
          </div>
          
          <!-- Sort Filter -->
          <div class="relative min-w-[200px]">
            <select
              v-model="sortBy"
              class="w-full appearance-none rounded-lg border border-border-light bg-surface-light py-2.5 pl-4 pr-10 focus:border-primary/50 focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="mostWords">Nhiều từ vựng nhất</option>
              <option value="leastWords">Ít từ vựng nhất</option>
            </select>
            <span class="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
              sort
            </span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="deckStore.loading" class="py-20 text-center">
          <p class="text-text-secondary-light dark:text-text-secondary-dark">Đang tải...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="deckStore.error" class="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {{ deckStore.error }}
        </div>

        <!-- Deck Grids -->
        <div v-else class="space-y-10">
          <!-- User's Decks -->
          <div>
            <h2 class="mb-4 text-xl font-bold leading-tight tracking-[-0.015em] text-primary-black dark:text-white">
              Bộ từ vựng của tôi
            </h2>
            
            <div v-if="userDecks.length === 0" class="rounded-xl border border-border-light bg-surface-light p-12 text-center dark:border-border-dark dark:bg-surface-dark">
              <p class="mb-4 text-text-secondary-light dark:text-text-secondary-dark">
                {{ searchQuery ? 'Không tìm thấy bộ từ vựng nào' : 'Bạn chưa có bộ từ vựng nào' }}
              </p>
              <button
                v-if="!searchQuery"
                @click="showCreateModal = true"
                class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Tạo bộ từ vựng đầu tiên
              </button>
            </div>

            <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="deck in userDecks"
                :key="deck.id"
                class="group flex flex-col overflow-hidden rounded-xl border border-border-light bg-surface-light transition-shadow duration-300 hover:shadow-lg dark:border-border-dark dark:bg-surface-dark"
              >
                <div class="flex-grow p-5">
                  <h3 class="text-lg font-bold text-primary-black dark:text-white">{{ deck.name }}</h3>
                  <p class="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {{ deck.wordCount || 0 }} từ
                  </p>
                </div>
                <div class="flex flex-col gap-2 border-t border-border-light bg-black/5 p-3 dark:border-border-dark dark:bg-white/5">
                  <router-link
                    :to="`/decks/${deck.id}/learn`"
                    class="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-black transition hover:bg-primary/90"
                  >
                    <span class="material-symbols-outlined text-base ">play_arrow</span>
                    <span>Học ngay</span>
                  </router-link>
                  <div class="flex justify-end gap-2">
                    <button
                      @click="editDeck(deck)"
                      class="rounded-full p-2 text-text-secondary-light hover:bg-black/10 dark:text-text-secondary-dark dark:hover:bg-white/10"
                    >
                      <span class="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      @click="confirmDelete(deck)"
                      class="rounded-full p-2 text-text-secondary-light hover:bg-black/10 dark:text-text-secondary-dark dark:hover:bg-white/10"
                    >
                      <span class="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Public Decks -->
          <div v-if="publicDecks.length > 0">
            <h2 class="mb-4 text-xl font-bold leading-tight tracking-[-0.015em] text-primary-black dark:text-white">
              Bộ từ vựng từ Germanly
            </h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="deck in publicDecks"
                :key="deck.id"
                class="flex flex-col overflow-hidden rounded-xl border border-border-light bg-surface-light transition-shadow duration-300 hover:shadow-lg dark:border-border-dark dark:bg-surface-dark"
              >
                <div class="flex-grow p-5">
                  <div class="mb-2 flex items-center gap-2">
                    <div class="rounded-full bg-primary px-2 py-0.5 text-[15px] font-bold text-yellow-500">
                      GERMANLY
                    </div>
                    <h3 class="text-lg font-bold text-primary-black dark:text-white">{{ deck.name }}</h3>
                  </div>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {{ deck.wordCount || 0 }} từ
                  </p>
                </div>
                <div class="border-t border-border-light bg-black/5 p-3 dark:border-border-dark dark:bg-white/5">
                  <router-link
                    :to="`/decks/${deck.id}/learn`"
                    class="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-black transition hover:bg-primary/90"
                  >
                    <span class="material-symbols-outlined text-base">play_arrow</span>
                    <span>Học ngay</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Deck Modal -->
        <div
          v-if="showCreateModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          @click.self="showCreateModal = false"
        >
          <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Tạo bộ từ vựng mới</h2>
            <form @submit.prevent="handleCreateDeck">
              <label class="flex flex-col">
                <span class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tên bộ từ vựng</span>
                <input
                  v-model="newDeckName"
                  required
                  class="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="VD: Từ vựng A1"
                  type="text"
                />
              </label>
              <div class="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  @click="showCreateModal = false"
                  class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  :disabled="deckStore.loading"
                  class="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {{ deckStore.loading ? 'Đang tạo...' : 'Tạo' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDeckStore } from '@/stores/deck'
import Sidebar from '@/components/Sidebar.vue'
import type { Deck } from '@/services/deck.service'

const authStore = useAuthStore()
const deckStore = useDeckStore()

const searchQuery = ref('')
const sortBy = ref('newest')
const showCreateModal = ref(false)
const newDeckName = ref('')

const userDecks = computed(() => {
  let decks = deckStore.decks.filter(deck => deck.userId === authStore.user?.id && !deck.isPublic)
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    decks = decks.filter(deck => deck.name.toLowerCase().includes(query))
  }

  // Sort
  return decks.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'mostWords':
        return (b.wordCount || 0) - (a.wordCount || 0)
      case 'leastWords':
        return (a.wordCount || 0) - (b.wordCount || 0)
      default:
        return 0
    }
  })
})

const publicDecks = computed(() => {
  return deckStore.decks.filter(deck => deck.isPublic)
})

async function handleCreateDeck() {
  try {
    await deckStore.createDeck({ name: newDeckName.value })
    newDeckName.value = ''
    showCreateModal.value = false
  } catch (error) {
    console.error('Failed to create deck:', error)
  }
}

function editDeck(deck: Deck) {
  // TODO: Implement edit functionality
  console.log('Edit deck:', deck)
}

function confirmDelete(deck: Deck) {
  if (confirm(`Bạn có chắc chắn muốn xóa bộ từ vựng "${deck.name}"?`)) {
    deckStore.deleteDeck(deck.id)
  }
}

onMounted(async () => {
  try {
    await deckStore.fetchDecks()
    // Fetch word counts for decks that don't have them
    await deckStore.fetchWordCounts()
  } catch (error) {
    console.error('Failed to load decks:', error)
  }
})
</script>
