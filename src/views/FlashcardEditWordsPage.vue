<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8 flex items-center gap-4">
          <router-link
            :to="`/decks`"
            class="flex items-center justify-center rounded-full p-2 text-text-secondary-light transition-colors hover:bg-black/5 dark:text-text-secondary-dark dark:hover:bg-white/5"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </router-link>
          <div>
            <h1 class="text-2xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-3xl dark:text-white">
              Chỉnh sửa từ vựng
            </h1>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {{ currentDeck?.name || 'Đang tải...' }}
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col h-[calc(100vh-12rem)]">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-bold text-primary-black dark:text-white">
              Danh sách từ vựng ({{ words.length }})
            </h3>
            <!-- Search/Filter could go here -->
          </div>

          <div class="flex-1 overflow-hidden rounded-xl border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark flex flex-col">
            <div class="overflow-y-auto flex-1 p-0">
              <table class="w-full text-left text-sm">
                <thead class="sticky top-0 bg-gray-50 text-xs uppercase text-text-secondary-light dark:bg-gray-800 dark:text-text-secondary-dark z-10">
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
                    <td colspan="5" class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      <span class="material-symbols-outlined animate-spin text-2xl">refresh</span>
                      <p class="mt-2">Đang tải danh sách...</p>
                    </td>
                  </tr>
                  <tr v-else-if="words.length === 0">
                    <td colspan="5" class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                      Chưa có từ vựng nào trong bộ thẻ này.
                    </td>
                  </tr>
                  <tr v-for="word in paginatedWords" :key="word.id" class="group hover:bg-gray-50 dark:hover:bg-white/5">
                    <td class="px-6 py-4">
                      <input
                        v-model="word.word"
                        @change="markModified(word.id)"
                        class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 transition-colors"
                        :class="{'text-primary font-medium': isModified(word.id)}"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        v-model="word.meaning"
                        @change="markModified(word.id)"
                        class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 transition-colors"
                        :class="{'text-primary font-medium': isModified(word.id)}"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <select
                        v-model="word.genus"
                        @change="markModified(word.id)"
                        class="bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 transition-colors"
                        :class="{'text-primary font-medium': isModified(word.id)}"
                      >
                        <option value="">-</option>
                        <option value="der">der</option>
                        <option value="die">die</option>
                        <option value="das">das</option>
                      </select>
                    </td>
                    <td class="px-6 py-4">
                      <input
                        v-model="word.plural"
                        @change="markModified(word.id)"
                        class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 transition-colors"
                        :class="{'text-primary font-medium': isModified(word.id)}"
                        placeholder="-"
                      />
                    </td>
                    <td class="px-6 py-4 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          v-if="isModified(word.id)"
                          @click="saveWord(word)"
                          class="text-primary hover:text-primary/80 transition-colors"
                          title="Lưu thay đổi"
                        >
                          <span class="material-symbols-outlined">save</span>
                        </button>
                        <button
                          @click="deleteWord(word)"
                          class="text-text-secondary-light hover:text-red-500 dark:text-text-secondary-dark dark:hover:text-red-400 transition-colors"
                          title="Xóa từ"
                        >
                          <span class="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="border-t border-border-light p-4 dark:border-border-dark flex justify-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="rounded p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
              >
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <span class="flex items-center px-2 text-sm">
                Trang {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="rounded p-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
              >
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
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
const modifiedWordIds = ref<Set<string>>(new Set())

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(words.value.length / itemsPerPage))
const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return words.value.slice(start, end)
})

function isModified(id: string) {
  return modifiedWordIds.value.has(id)
}

function markModified(id: string) {
  modifiedWordIds.value.add(id)
}

async function fetchWords() {
  isLoading.value = true
  try {
    const deckId = route.params.id as string
    const response = await wordService.getWordsByDeck(deckId)
    // Assuming response.data is the array of words based on service definition
    // Check if response is ApiResponse<Word[]> or just Word[]
    // Service says: return response.data which is ApiResponse<Word[]>
    // But ApiResponse usually has a data property. 
    // Let's check api.ts or deck.service.ts for ApiResponse definition if needed.
    // Based on previous usage, it seems response.data is the payload.
    // Let's assume standard structure: { data: [...] } or just [...]
    // Wait, in word.service.ts: return response.data.
    // If backend returns { data: [...] }, then response.data is { data: [...] }.
    // If backend returns [...], then response.data is [...].
    // Let's handle both.
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

async function saveWord(word: Word) {
  try {
    await wordService.updateWord(word.id, {
      word: word.word,
      meaning: word.meaning,
      genus: word.genus,
      plural: word.plural
    })
    modifiedWordIds.value.delete(word.id)
    // Optional: show toast
  } catch (error) {
    console.error('Failed to update word:', error)
    alert('Cập nhật thất bại.')
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
