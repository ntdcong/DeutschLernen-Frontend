<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8 flex items-center gap-4">
          <router-link :to="`/decks`"
            class="flex items-center justify-center rounded-full p-2 text-text-secondary-light transition-colors hover:bg-black/5 dark:text-text-secondary-dark dark:hover:bg-white/5">
            <span class="material-symbols-outlined">arrow_back</span>
          </router-link>
          <div>
            <h1
              class="text-2xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-3xl dark:text-white">
              Thêm từ vựng
            </h1>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {{ currentDeck?.name || 'Đang tải...' }}
            </p>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
          <!-- Left Column: Input Methods -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Tabs -->
            <div
              class="flex rounded-lg bg-surface-light p-1 dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" :class="[
                'flex-1 rounded-md py-2 text-sm font-medium transition-all',
                currentTab === tab.id
                  ? 'bg-primary text-black shadow-sm'
                  : 'text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-text-primary-dark'
              ]">
                {{ tab.label }}
              </button>
            </div>

            <!-- Manual Input -->
            <div v-if="currentTab === 'manual'"
              class="rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark">
              <h3 class="mb-4 text-lg font-bold text-primary-black dark:text-white">Nhập thủ công</h3>
              <form @submit.prevent="addManualWord" class="space-y-4">
                <div>
                  <label
                    class="mb-1 block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Từ
                    vựng (Word)</label>
                  <input v-model="manualForm.word" required
                    class="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-background-dark"
                    placeholder="VD: das Auto" />
                </div>
                <div>
                  <label
                    class="mb-1 block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Nghĩa
                    (Meaning)</label>
                  <input v-model="manualForm.meaning" required
                    class="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-background-dark"
                    placeholder="VD: Xe ô tô" />
                </div>
                <div>
                  <label
                    class="mb-1 block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Giống
                    (Genus)</label>
                  <select v-model="manualForm.genus"
                    class="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-background-dark">
                    <option value="">Không có</option>
                    <option value="der">der (Giống đực)</option>
                    <option value="die">die (Giống cái)</option>
                    <option value="das">das (Giống trung)</option>
                  </select>
                </div>
                <button type="submit"
                  class="w-full rounded-lg border border-border-light bg-black px-4 py-2 font-bold text-white transition hover:bg-primary/90">
                  Thêm vào danh sách
                </button>
              </form>
            </div>

            <!-- Excel Input -->
            <div v-if="currentTab === 'excel'"
              class="rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark">
              <h3 class="mb-4 text-lg font-bold text-primary-black dark:text-white">Nhập từ Excel</h3>
              <div
                class="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-light px-6 py-10 transition hover:border-primary dark:border-border-dark"
                @dragover.prevent @drop.prevent="handleFileDrop" @click="triggerFileInput">
                <input ref="fileInput" type="file" accept=".xlsx, .xls" class="hidden" @change="handleFileSelect" />
                <span
                  class="material-symbols-outlined mb-2 text-4xl text-text-secondary-light dark:text-text-secondary-dark">upload_file</span>
                <p class="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Kéo thả file Excel vào đây hoặc click để chọn
                </p>
                <p class="mt-1 text-xs text-text-secondary-light/70 dark:text-text-secondary-dark/70">
                  Hỗ trợ .xlsx, .xls
                </p>
              </div>
              <div class="mt-4">
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  * File Excel cần có các cột: Word, Meaning, Genus (tùy chọn)
                </p>
              </div>
            </div>

            <!-- AI Input -->
            <div v-if="currentTab === 'ai'"
              class="rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark">
              <h3 class="mb-4 text-lg font-bold text-primary-black dark:text-white">Tạo bằng AI</h3>
              <div class="space-y-4">
                <div>
                  <label
                    class="mb-1 block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Chủ
                    đề (Topic)</label>
                  <input v-model="aiForm.topic"
                    class="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-background-dark"
                    placeholder="VD: Gia đình, Du lịch..." />
                </div>
                <div>
                  <label
                    class="mb-1 block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Trình
                    độ</label>
                  <select v-model="aiForm.level"
                    class="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-background-dark">
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>
                <div>
                  <label
                    class="mb-1 block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Số
                    lượng từ</label>
                  <input v-model.number="aiForm.count" type="number" min="1" max="50"
                    class="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-background-dark" />
                </div>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">Lưu ý: Tạo từ vựng bằng AI
                  thì sẽ thêm thẳng vào Bộ từ vựng và sẽ không preview được!</p>
                <button @click="generateWords" :disabled="isGenerating"
                  class="flex w-full items-center justify-center gap-2 rounded-lg border border-border-light bg-black px-4 py-2 font-bold text-white transition hover:bg-primary/90 disabled:opacity-50">
                  <span v-if="isGenerating" class="material-symbols-outlined animate-spin">refresh</span>
                  <span v-else class="material-symbols-outlined">auto_awesome</span>
                  {{ isGenerating ? 'Đang tạo...' : 'Tạo từ vựng' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Preview List -->
          <div class="lg:col-span-2 flex flex-col h-[calc(100vh-12rem)]">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold text-primary-black dark:text-white">
                Danh sách xem trước ({{ pendingWords.length }})
              </h3>
              <div class="flex gap-2">
                <button v-if="pendingWords.length > 0" @click="clearAll"
                  class="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Xóa tất cả
                </button>
                <button @click="saveAll" :disabled="pendingWords.length === 0 || isSaving"
                  class="flex items-center gap-2 rounded-lg border border-border-light bg-black px-6 py-2 font-bold text-white transition hover:bg-primary/90 disabled:opacity-50">
                  <span v-if="isSaving" class="material-symbols-outlined animate-spin">refresh</span>
                  {{ isSaving ? 'Đang lưu...' : 'Lưu tất cả' }}
                </button>
              </div>
            </div>

            <div
              class="flex-1 overflow-hidden rounded-xl border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark flex flex-col">
              <div class="overflow-y-auto flex-1 p-0">
                <table class="w-full text-left text-sm">
                  <thead
                    class="sticky top-0 bg-gray-50 text-xs uppercase text-text-secondary-light dark:bg-gray-800 dark:text-text-secondary-dark">
                    <tr>
                      <th class="px-6 py-3">Từ vựng</th>
                      <th class="px-6 py-3">Nghĩa</th>
                      <th class="px-6 py-3">Giống</th>
                      <th class="px-6 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border-light dark:divide-border-dark">
                    <tr v-if="pendingWords.length === 0">
                      <td colspan="4"
                        class="px-6 py-8 text-center text-text-secondary-light dark:text-text-secondary-dark">
                        Chưa có từ vựng nào trong danh sách
                      </td>
                    </tr>
                    <tr v-for="(word, index) in paginatedWords" :key="index"
                      class="group hover:bg-gray-50 dark:hover:bg-white/5">
                      <td class="px-6 py-4">
                        <input v-model="word.word"
                          class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded px-1" />
                      </td>
                      <td class="px-6 py-4">
                        <input v-model="word.meaning"
                          class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded px-1" />
                      </td>
                      <td class="px-6 py-4">
                        <select v-model="word.genus"
                          class="bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded px-1">
                          <option value="">-</option>
                          <option value="der">der</option>
                          <option value="die">die</option>
                          <option value="das">das</option>
                        </select>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <button @click="removeWord(index + (currentPage - 1) * itemsPerPage)"
                          class="text-text-secondary-light hover:text-red-500 dark:text-text-secondary-dark dark:hover:text-red-400">
                          <span class="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1"
                class="border-t border-border-light p-4 dark:border-border-dark flex justify-center gap-2">
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeckStore } from '@/stores/deck'
import wordService from '@/services/word.service'
import Sidebar from '@/components/Sidebar.vue'
import * as XLSX from 'xlsx'
import apiClient from '@/services/api'

const route = useRoute()
const router = useRouter()
const deckStore = useDeckStore()

const currentDeck = computed(() => deckStore.decks.find(d => d.id === route.params.id))
const currentTab = ref('manual')
const tabs = [
  { id: 'manual', label: 'Thủ công' },
  { id: 'excel', label: 'Excel' },
  { id: 'ai', label: 'AI' }
]

// Manual Form
const manualForm = ref({
  word: '',
  meaning: '',
  genus: ''
})

// AI Form
const aiForm = ref({
  topic: '',
  level: 'A1',
  count: 10
})
const isGenerating = ref(false)

// Data
interface PendingWord {
  word: string
  meaning: string
  genus?: string
  audioUrl?: string
}
const pendingWords = ref<PendingWord[]>([])
const isSaving = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(pendingWords.value.length / itemsPerPage))
const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return pendingWords.value.slice(start, end)
})

function addManualWord() {
  if (!manualForm.value.word || !manualForm.value.meaning) return

  pendingWords.value.push({ ...manualForm.value })
  manualForm.value = { word: '', meaning: '', genus: '' }
}

// Excel Handling
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    parseExcel(target.files[0])
  }
}

function handleFileDrop(event: DragEvent) {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    parseExcel(event.dataTransfer.files[0])
  }
}

async function parseExcel(file: File) {
  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) {
      alert('File Excel không có sheet nào')
      return
    }
    const worksheet = workbook.Sheets[firstSheetName]
    if (!worksheet) {
      alert('Không thể đọc sheet đầu tiên')
      return
    }
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

    const newWords = jsonData.map(row => ({
      word: row['Word'] || row['word'] || row['Từ vựng'] || '',
      meaning: row['Meaning'] || row['meaning'] || row['Nghĩa'] || '',
      genus: row['Genus'] || row['genus'] || row['Giống'] || ''
    })).filter(w => w.word && w.meaning)

    if (newWords.length === 0) {
      alert('Không tìm thấy từ vựng hợp lệ trong file Excel. Vui lòng kiểm tra lại tên cột (Word, Meaning).')
      return
    }

    pendingWords.value.push(...newWords)
    if (fileInput.value) fileInput.value.value = ''
  } catch (error) {
    console.error('Excel parse error:', error)
    alert('Có lỗi khi đọc file Excel. Vui lòng thử lại.')
  }
}

// AI Generation
async function generateWords() {
  if (!aiForm.value.topic) return
  isGenerating.value = true
  try {
    const response = await apiClient.post('/words/generate', {
      deckId: route.params.id,
      topic: aiForm.value.topic,
      level: aiForm.value.level,
      count: aiForm.value.count
    })

    let newWords: any[] = []
    if (Array.isArray(response.data)) {
      newWords = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
      newWords = response.data.data
    }

    if (newWords.length > 0) {
      // Since the API saves the words immediately, we don't add them to pendingWords
      // to avoid duplication when the user clicks "Save All".
      alert(`Đã tạo và lưu thành công ${newWords.length} từ vựng vào bộ thẻ!`)

      // Optional: Redirect to learn page or just stay here
      // router.push(`/decks/${route.params.id}/learn`)
    } else {
      alert('Không có từ vựng nào được tạo.')
    }
  } catch (error) {
    console.error('AI Generation failed:', error)
    alert('Có lỗi khi tạo từ vựng bằng AI')
  } finally {
    isGenerating.value = false
  }
}

function removeWord(index: number) {
  pendingWords.value.splice(index, 1)
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
}

function clearAll() {
  if (confirm('Bạn có chắc muốn xóa tất cả danh sách xem trước?')) {
    pendingWords.value = []
    currentPage.value = 1
  }
}

async function saveAll() {
  if (pendingWords.value.length === 0) return
  isSaving.value = true

  try {
    // Loop through and save
    // We could use Promise.all but sequential might be safer for rate limits or order
    const deckId = route.params.id as string

    // Create promises
    const promises = pendingWords.value.map(word =>
      wordService.createWord({
        deckId,
        word: word.word,
        meaning: word.meaning,
        genus: word.genus,
        audioUrl: word.audioUrl
      })
    )

    await Promise.all(promises)

    alert('Đã lưu thành công ' + pendingWords.value.length + ' từ vựng!')
    pendingWords.value = []
    router.push(`/decks/${deckId}/learn`)
  } catch (error) {
    console.error('Save failed:', error)
    alert('Có lỗi khi lưu từ vựng. Vui lòng thử lại.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  if (!deckStore.decks.length) {
    deckStore.fetchDecks()
  }
})
</script>
