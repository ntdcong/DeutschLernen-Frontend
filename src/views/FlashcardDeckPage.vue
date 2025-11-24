<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              class="text-3xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-4xl dark:text-white">
              Học Từ Vựng
            </h1>
            <p class="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Quản lý và học các bộ từ vựng của bạn
            </p>
          </div>
          <button @click="showCreateModal = true"
            class="group flex items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40">
            <span class="material-symbols-outlined transition-transform group-hover:rotate-90">add</span>
            Tạo bộ từ vựng mới
          </button>
        </div>

        <!-- Filters Bar -->
        <div
          class="mb-8 flex flex-col gap-4 rounded-2xl bg-surface-light p-4 shadow-sm dark:bg-surface-dark sm:flex-row sm:items-center">
          <div class="relative flex-grow">
            <span
              class="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
              search
            </span>
            <input v-model="searchQuery"
              class="w-full rounded-xl bg-background-light py-3 pl-12 pr-4 font-medium placeholder-text-secondary-light focus:ring-2 focus:ring-primary/50 dark:bg-background-dark dark:placeholder-text-secondary-dark"
              placeholder="Tìm kiếm bộ từ vựng..." type="text" />
          </div>

          <div class="flex items-center gap-4">
            <div class="relative min-w-[200px]">
              <select v-model="sortBy"
                class="w-full appearance-none rounded-xl border-none bg-background-light py-3 pl-4 pr-10 font-medium text-text-primary-light focus:ring-2 focus:ring-primary/50 dark:bg-background-dark dark:text-text-primary-dark">
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="mostWords">Nhiều từ nhất</option>
                <option value="leastWords">Ít từ nhất</option>
              </select>
              <span
                class="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                sort
              </span>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="deckStore.loading" class="flex justify-center py-20">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="deckStore.error"
          class="rounded-xl bg-red-50 p-6 text-center text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <span class="material-symbols-outlined mb-2 text-4xl">error</span>
          <p>{{ deckStore.error }}</p>
          <button @click="deckStore.fetchDecks()" class="mt-4 font-bold underline">Thử lại</button>
        </div>

        <!-- Content -->
        <div v-else class="space-y-12">
          <!-- User's Decks -->
          <div>
            <div class="mb-6 flex items-center gap-3">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <span class="material-symbols-outlined text-xl">folder_shared</span>
              </span>
              <h2 class="text-xl font-bold text-primary-black dark:text-white">
                Bộ từ vựng của tôi
              </h2>
              <span
                class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {{ userDecks.length }}
              </span>
            </div>

            <div v-if="userDecks.length === 0"
              class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border-light bg-surface-light py-16 text-center dark:border-border-dark dark:bg-surface-dark">
              <div class="mb-4 rounded-full bg-gray-50 p-6 dark:bg-gray-800">
                <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">post_add</span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có bộ từ vựng nào' }}
              </h3>
              <p class="mt-2 max-w-sm text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {{ searchQuery ? 'Thử tìm kiếm với từ khóa khác xem sao.' : 'Tạo bộ từ vựng đầu tiên!' }}
              </p>
              <button v-if="!searchQuery" @click="showCreateModal = true"
                class="mt-6 rounded-xl bg-primary px-6 py-2.5 font-bold text-white transition-transform hover:scale-105 hover:bg-primary/90">
                Tạo ngay
              </button>
            </div>

            <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div v-for="deck in userDecks" :key="deck.id"
                class="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-light shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-surface-dark">
                <!-- Card Header with Gradient -->
                <div class="h-24 bg-yellow-400 p-4 dark:from-blue-600 dark:to-cyan-600">
                  <div class="flex justify-end">
                    <!-- Menu Button (could be added here) -->
                  </div>
                </div>

                <!-- Card Content -->
                <div class="flex flex-grow flex-col p-5 pt-0">
                  <div
                    class="-mt-10 mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md dark:bg-gray-800">
                    <span class="material-symbols-outlined text-3xl text-blue-500">style</span>
                  </div>

                  <h3 class="mb-1 line-clamp-2 text-lg font-bold text-primary-black dark:text-white" :title="deck.name">
                    {{ deck.name }}
                  </h3>

                  <div
                    class="mb-4 flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <span class="material-symbols-outlined text-base">format_list_bulleted</span>
                    {{ deck.wordCount || 0 }} từ vựng
                  </div>

                  <div class="mt-auto flex flex-col gap-3">
                    <router-link :to="`/decks/${deck.id}/learn`"
                      class="flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary py-2.5 font-bold text-black transition-colors hover:bg-primary/90">
                      <span class="material-symbols-outlined">play_circle</span>
                      Học ngay
                    </router-link>

                    <div class="grid grid-cols-3 gap-2">
                      <router-link :to="`/decks/${deck.id}/add`"
                        class="flex items-center justify-center rounded-lg bg-gray-100 py-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        title="Thêm từ">
                        <span class="material-symbols-outlined text-xl">add</span>
                      </router-link>
                      <router-link :to="`/decks/${deck.id}/edit`"
                        class="flex items-center justify-center rounded-lg bg-gray-100 py-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        title="Chỉnh sửa">
                        <span class="material-symbols-outlined text-xl">edit_note</span>
                      </router-link>
                      <button @click="editDeck(deck)"
                        class="flex items-center justify-center rounded-lg bg-gray-100 py-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        title="Cài đặt">
                        <span class="material-symbols-outlined text-xl">settings</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Delete Button (Absolute) -->
                <button @click="confirmDelete(deck)"
                  class="absolute right-2 top-2 rounded-full bg-black/20 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                  title="Xóa bộ từ vựng">
                  <span class="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Public Decks -->
          <div v-if="publicDecks.length > 0">
            <div class="mb-6 flex items-center gap-3">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                <span class="material-symbols-outlined text-xl">public</span>
              </span>
              <h2 class="text-xl font-bold text-primary-black dark:text-white">
                Thư viện Germanly
              </h2>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div v-for="deck in publicDecks" :key="deck.id"
                class="group flex flex-col overflow-hidden rounded-2xl bg-surface-light shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-surface-dark">
                <div class="h-24 bg-black p-4">
                  <div class="flex justify-start">
                    <span
                      class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      OFFICIAL
                    </span>
                  </div>
                </div>

                <div class="flex flex-grow flex-col p-5 pt-0">
                  <div
                    class="-mt-10 mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md dark:bg-gray-800">
                    <span class="material-symbols-outlined text-3xl text-yellow-500">school</span>
                  </div>

                  <h3 class="mb-1 text-lg font-bold text-primary-black dark:text-white">{{ deck.name }}</h3>
                  <p class="mb-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    {{ deck.wordCount || 0 }} từ vựng
                  </p>

                  <div class="mt-auto">
                    <router-link :to="`/decks/${deck.id}/learn`"
                      class="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-2.5 font-bold text-gray-900 transition-colors hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-white dark:hover:bg-primary">
                      <span class="material-symbols-outlined">play_circle</span>
                      Học ngay
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Deck Modal -->
        <div v-if="showCreateModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          @click.self="showCreateModal = false">
          <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Tạo bộ từ vựng mới</h2>
            <form @submit.prevent="handleCreateDeck">
              <label class="flex flex-col">
                <span class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tên bộ từ vựng</span>
                <input v-model="newDeckName" required
                  class="rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="VD: Từ vựng A1 - Gia đình" type="text" />
              </label>
              <div class="mt-8 flex justify-end gap-3">
                <button type="button" @click="showCreateModal = false"
                  class="rounded-xl px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                  Hủy
                </button>
                <button type="submit" :disabled="deckStore.loading"
                  class="rounded-xl border border-primary px-5 py-2.5 font-bold bg-black text-white disabled:opacity-50">
                  {{ deckStore.loading ? 'Đang tạo...' : 'Tạo mới' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Edit Deck Modal -->
        <div v-if="showEditModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          @click.self="showEditModal = false">
          <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
            <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Đổi tên bộ từ vựng</h2>
            <form @submit.prevent="handleUpdateDeck">
              <label class="flex flex-col">
                <span class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tên mới</span>
                <input v-model="editDeckName" required
                  class="rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  type="text" />
              </label>
              <div class="mt-8 flex justify-end gap-3">
                <button type="button" @click="showEditModal = false"
                  class="rounded-xl px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                  Hủy
                </button>
                <button type="submit" :disabled="deckStore.loading"
                  class="rounded-xl bg-black px-5 py-2.5 font-bold text-white hover:bg-primary/90 disabled:opacity-50">
                  {{ deckStore.loading ? 'Đang lưu...' : 'Lưu thay đổi' }}
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
const showEditModal = ref(false)
const newDeckName = ref('')
const editDeckName = ref('')
const editingDeck = ref<Deck | null>(null)

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
  editingDeck.value = deck
  editDeckName.value = deck.name
  showEditModal.value = true
}

async function handleUpdateDeck() {
  if (!editingDeck.value) return

  try {
    await deckStore.updateDeck(editingDeck.value.id, { name: editDeckName.value })
    showEditModal.value = false
    editingDeck.value = null
    editDeckName.value = ''
  } catch (error) {
    console.error('Failed to update deck:', error)
  }
}

function confirmDelete(deck: Deck) {
  if (confirm(`Bạn có chắc chắn muốn xóa bộ từ vựng "${deck.name}"?`)) {
    deckStore.deleteDeck(deck.id)
  }
}

onMounted(async () => {
  try {
    await deckStore.fetchDecks()
  } catch (error) {
    console.error('Failed to load decks:', error)
  }
})
</script>
