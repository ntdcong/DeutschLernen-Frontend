<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <router-link :to="`/decks`"
              class="flex items-center justify-center rounded-full p-2 text-text-secondary-light transition-colors hover:bg-black/5 dark:text-text-secondary-dark dark:hover:bg-white/5">
              <span class="material-symbols-outlined">arrow_back</span>
            </router-link>
            <div>
              <h1
                class="text-2xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-3xl dark:text-white">
                Chỉnh sửa từ vựng
              </h1>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {{ currentDeck?.name || 'Đang tải...' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col h-[calc(100vh-12rem)]">
          <!-- Toolbar: Search & Stats -->
          <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 class="text-lg font-bold text-primary-black dark:text-white">
              Danh sách từ vựng ({{ filteredWords.length }})
            </h3>

            <div class="relative w-full sm:w-64">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
                <span class="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input v-model="searchQuery" type="text" placeholder="Tìm kiếm từ vựng..."
                class="w-full rounded-xl border border-border-light bg-surface-light py-2 pl-10 pr-4 text-sm text-primary-black focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-white" />
            </div>
          </div>

          <div
            class="flex-1 overflow-hidden rounded-xl border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark flex flex-col">

            <!-- Desktop Table View -->
            <div class="hidden md:block overflow-y-auto flex-1 p-0">
              <table class="w-full text-left text-sm">
                <thead
                  class="sticky top-0 bg-gray-50 text-xs uppercase text-text-secondary-light dark:bg-gray-800 dark:text-text-secondary-dark z-10">
                  <tr>
                    <th class="px-6 py-3">Từ vựng</th>
                    <th class="px-6 py-3">Nghĩa</th>
                    <th class="px-6 py-3">Giống</th>
                    <th class="px-6 py-3">Số nhiều</th>
                    <th class="px-6 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                  <tr v-if="isLoading">
                    <td colspan="5"
                      class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      <span class="material-symbols-outlined animate-spin text-2xl">refresh</span>
                      <p class="mt-2">Đang tải danh sách...</p>
                    </td>
                  </tr>
                  <tr v-else-if="filteredWords.length === 0">
                    <td colspan="5"
                      class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      {{ searchQuery ? 'Không tìm thấy từ nào phù hợp.' : 'Chưa có từ vựng nào trong bộ thẻ này.' }}
                    </td>
                  </tr>
                  <tr v-for="word in paginatedWords" :key="word.id"
                    class="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td class="px-6 py-4 font-medium text-primary-black dark:text-white">
                      {{ word.word }}
                    </td>
                    <td class="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                      {{ word.meaning }}
                    </td>
                    <td class="px-6 py-4">
                      <span v-if="word.genus" :class="{
                        'text-blue-500': word.genus === 'der',
                        'text-red-500': word.genus === 'die',
                        'text-green-500': word.genus === 'das'
                      }" class="font-medium">
                        {{ word.genus }}
                      </span>
                      <span v-else class="text-text-secondary-light/50">-</span>
                    </td>
                    <td class="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                      {{ word.plural || '-' }}
                    </td>
                    <td class="px-6 py-4 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-2">
                        <button @click="openEditModal(word)"
                          class="rounded-lg p-2 text-text-secondary-light hover:bg-gray-100 hover:text-primary dark:text-text-secondary-dark dark:hover:bg-white/10 dark:hover:text-primary transition-colors"
                          title="Chỉnh sửa">
                          <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button @click="deleteWord(word)"
                          class="rounded-lg p-2 text-text-secondary-light hover:bg-red-50 hover:text-red-500 dark:text-text-secondary-dark dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                          title="Xóa từ">
                          <span class="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Card View -->
            <div class="md:hidden overflow-y-auto flex-1 p-4 space-y-3">
              <div v-if="isLoading" class="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
                <span class="material-symbols-outlined animate-spin text-2xl">refresh</span>
                <p class="mt-2">Đang tải danh sách...</p>
              </div>
              <div v-else-if="filteredWords.length === 0"
                class="text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
                {{ searchQuery ? 'Không tìm thấy từ nào phù hợp.' : 'Chưa có từ vựng nào trong bộ thẻ này.' }}
              </div>

              <div v-for="word in paginatedWords" :key="word.id"
                class="rounded-xl border border-border-light bg-white p-4 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="text-lg font-bold text-primary-black dark:text-white">{{ word.word }}</h4>
                      <span v-if="word.genus" :class="{
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': word.genus === 'der',
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': word.genus === 'die',
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': word.genus === 'das'
                      }" class="rounded px-1.5 py-0.5 text-xs font-bold uppercase">
                        {{ word.genus }}
                      </span>
                    </div>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">{{ word.meaning }}</p>
                  </div>
                </div>

                <div
                  class="mt-3 flex items-center justify-between border-t border-border-light pt-3 dark:border-border-dark">
                  <div class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    <span v-if="word.plural">Plural: <span class="font-medium text-primary-black dark:text-white">{{
                      word.plural }}</span></span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button @click="openEditModal(word)"
                      class="rounded-lg p-2 text-text-secondary-light hover:bg-gray-100 hover:text-primary dark:text-text-secondary-dark dark:hover:bg-white/10 dark:hover:text-primary transition-colors">
                      <span class="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button @click="deleteWord(word)"
                      class="rounded-lg p-2 text-text-secondary-light hover:bg-red-50 hover:text-red-500 dark:text-text-secondary-dark dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors">
                      <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1"
              class="border-t border-border-light p-4 dark:border-border-dark flex justify-center gap-2 bg-surface-light dark:bg-surface-dark">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="rounded p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <span class="flex items-center px-2 text-sm">
                Trang {{ currentPage }} / {{ totalPages }}
              </span>
              <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="rounded p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="closeModal">
      <div
        class="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-surface-dark animate-in fade-in zoom-in duration-200">
        <div class="border-b border-border-light p-6 dark:border-border-dark">
          <h3 class="text-xl font-bold text-primary-black dark:text-white">
            Chỉnh sửa từ vựng
          </h3>
        </div>

        <div class="p-6 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Từ vựng <span class="text-red-500">*</span>
              </label>
              <input v-model="editingWord.word" type="text"
                class="w-full rounded-lg border border-border-light bg-transparent px-4 py-2 text-primary-black focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:text-white"
                placeholder="Ví dụ: Haus" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Nghĩa <span class="text-red-500">*</span>
              </label>
              <input v-model="editingWord.meaning" type="text"
                class="w-full rounded-lg border border-border-light bg-transparent px-4 py-2 text-primary-black focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:text-white"
                placeholder="Ví dụ: Ngôi nhà" />
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Giống (Genus)
              </label>
              <select v-model="editingWord.genus"
                class="w-full rounded-lg border border-border-light bg-transparent px-4 py-2 text-primary-black focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:text-white">
                <option value="">Không có</option>
                <option value="der">der (Giống đực)</option>
                <option value="die">die (Giống cái)</option>
                <option value="das">das (Giống trung)</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Số nhiều (Plural)
              </label>
              <input v-model="editingWord.plural" type="text"
                class="w-full rounded-lg border border-border-light bg-transparent px-4 py-2 text-primary-black focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:text-white"
                placeholder="Ví dụ: die Häuser" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-border-light p-6 dark:border-border-dark">
          <button @click="closeModal"
            class="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-white/5 transition-colors">
            Hủy bỏ
          </button>
          <button @click="saveEdit" :disabled="isSaving || !editingWord.word || !editingWord.meaning"
            class="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50 transition-colors">
            <span v-if="isSaving" class="material-symbols-outlined animate-spin text-lg">refresh</span>
            <span>{{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDeckStore } from '@/stores/deck'
import wordService, { type Word } from '@/services/word.service'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const deckStore = useDeckStore()

const currentDeck = computed(() => deckStore.decks.find(d => d.id === route.params.id))
const words = ref<Word[]>([])
const isLoading = ref(true)
const searchQuery = ref('')

// Filtered Words
const filteredWords = computed(() => {
  if (!searchQuery.value.trim()) return words.value

  const query = searchQuery.value.toLowerCase()
  return words.value.filter(word =>
    word.word.toLowerCase().includes(query) ||
    word.meaning.toLowerCase().includes(query)
  )
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(filteredWords.value.length / itemsPerPage))
const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredWords.value.slice(start, end)
})

// Modal & Editing
const isModalOpen = ref(false)
const isSaving = ref(false)
const editingWord = ref<Partial<Word>>({})

function openEditModal(word: Word) {
  editingWord.value = { ...word }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingWord.value = {}
}

async function saveEdit() {
  if (!editingWord.value.id || !editingWord.value.word || !editingWord.value.meaning) return

  isSaving.value = true
  try {
    const response = await wordService.updateWord(editingWord.value.id, {
      word: editingWord.value.word,
      meaning: editingWord.value.meaning,
      genus: editingWord.value.genus,
      plural: editingWord.value.plural
    })

    const index = words.value.findIndex(w => w.id === editingWord.value.id)
    if (index !== -1) {
      // Handle ApiResponse structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedData = (response as any).data || response
      words.value[index] = { ...words.value[index], ...updatedData }
    }

    closeModal()
  } catch (error) {
    console.error('Failed to update word:', error)
    alert('Cập nhật thất bại.')
  } finally {
    isSaving.value = false
  }
}

async function fetchWords() {
  isLoading.value = true
  try {
    const deckId = route.params.id as string
    const response = await wordService.getWordsByDeck(deckId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawData = response as any
    if (Array.isArray(rawData)) {
      words.value = rawData
    } else if (Array.isArray(rawData.data)) {
      words.value = rawData.data
    } else {
      words.value = []
    }
  } catch (error) {
    console.error('Failed to fetch words:', error)
    alert('Không thể tải danh sách từ vựng.')
  } finally {
    isLoading.value = false
  }
}

async function deleteWord(word: Word) {
  if (!confirm(`Bạn có chắc muốn xóa từ "${word.word}"?`)) return

  try {
    await wordService.deleteWord(word.id)
    words.value = words.value.filter(w => w.id !== word.id)
    // Adjust pagination if needed
    if (currentPage.value > totalPages.value) {
      currentPage.value = Math.max(1, totalPages.value)
    }
  } catch (error) {
    console.error('Failed to delete word:', error)
    alert('Xóa thất bại.')
  }
}

onMounted(() => {
  if (!deckStore.decks.length) {
    deckStore.fetchDecks()
  }
  fetchWords()
})
</script>
