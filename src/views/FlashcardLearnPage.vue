<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
    <!-- Header -->
    <header class="sticky top-0 z-10 flex items-center justify-between border-b border-solid border-black/10 bg-background-light/80 px-4 py-3 backdrop-blur-md sm:px-10 dark:border-white/10 dark:bg-background-dark/80">
      <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
        <router-link to="/decks" class="flex items-center gap-2 transition-colors hover:text-primary">
          <span class="material-symbols-outlined">close</span>
          <span class="hidden text-sm font-medium sm:inline">Thoát</span>
        </router-link>
      </div>
      
      <div class="flex flex-1 justify-center px-4">
        <div class="flex w-full max-w-sm flex-col gap-2">
          <div class="flex items-center justify-between gap-6">
            <p class="text-xs font-medium leading-normal text-text-light/70 sm:text-sm dark:text-text-dark/70">Tiến độ</p>
            <p class="text-xs font-medium leading-normal text-text-light/70 sm:text-sm dark:text-text-dark/70">
              {{ currentIndex + 1 }}/{{ totalWords }}
            </p>
          </div>
          <div class="h-2 rounded-full bg-black/10 dark:bg-white/10">
            <div class="h-2 rounded-full bg-black transition-all duration-300" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
        <div v-if="authStore.user" class="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white sm:size-10 sm:text-sm">
          {{ authStore.user.fullName?.charAt(0).toUpperCase() || 'U' }}
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col justify-center px-4 py-5" tabindex="0" @keydown="handleKeydown">
      <div class="layout-content-container mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-1 flex-col items-center justify-center gap-8">
          <div class="text-center">
            <div class="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p class="text-lg text-text-secondary-light dark:text-text-secondary-dark">Đang tải từ vựng...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-1 flex-col items-center justify-center gap-8">
          <div class="rounded-lg bg-red-100 p-6 text-center text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <p class="mb-4">{{ error }}</p>
            <router-link to="/decks" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90">
              Quay lại danh sách
            </router-link>
          </div>
        </div>

        <!-- Flashcard Content -->
        <div v-else-if="currentWord" class="flex flex-1 flex-col items-center justify-center gap-8">
          <!-- Navigation Buttons & Card -->
          <div class="relative flex w-full items-center justify-center gap-2 sm:gap-4">
            <!-- Previous Button (Desktop) -->
            <button
              @click="previousCard"
              :disabled="currentIndex === 0"
              class="hidden h-12 min-w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-base font-bold leading-normal tracking-[0.015em] text-text-light shadow-md transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 sm:flex dark:bg-text-dark/10 dark:text-text-dark dark:hover:bg-text-dark/20"
              title="Phím mũi tên trái"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>

            <!-- Flashcard Container -->
            <div class="relative w-full max-w-xl perspective-1000">
              <Transition :name="transitionName" mode="out-in">
                <div
                  :key="currentWord.id"
                  @click="toggleFlip"
                  class="flashcard aspect-[3/4] w-full cursor-pointer sm:aspect-[3/2]"
                  :class="{ 'is-flipped': isFlipped }"
                >
                  <div class="flashcard-inner h-full w-full duration-500">
                    <!-- Front Side -->
                    <div class="flashcard-front absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-black/10 bg-white p-6 shadow-lg backface-hidden dark:border-white/10 dark:bg-text-dark/10">
                      <h1 class="text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-7xl">{{ currentWord.word }}</h1>
                      <p class="mt-8 text-sm text-text-secondary-light opacity-50 dark:text-text-secondary-dark">(Nhấn phím Space hoặc chạm để lật)</p>
                    </div>

                    <!-- Back Side -->
                    <div
                      class="flashcard-back absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl border border-black/10 p-6 text-center shadow-lg backface-hidden rotate-y-180"
                      :class="getBackCardColorClass(currentWord.genus)"
                    >
                      <p class="text-center text-3xl font-semibold sm:text-4xl md:text-5xl">{{ currentWord.meaning }}</p>
                      <div class="mt-2 space-y-1 text-base text-text-light/80 md:text-lg dark:text-text-dark/80">
                        <p v-if="currentWord.genus">
                          <span class="font-medium">Giống:</span> {{ currentWord.genus }}
                        </p>
                        <p v-if="currentWord.plural">
                          <span class="font-medium">Số nhiều:</span> {{ currentWord.plural }}
                        </p>
                      </div>
                      <button
                        v-if="currentWord.audioUrl"
                        @click.stop="playAudio"
                        class="mt-4 flex h-12 min-w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-base font-bold leading-normal tracking-[0.015em] text-black transition hover:brightness-90"
                        title="Phím M"
                      >
                        <span class="material-symbols-outlined">volume_up</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Next Button (Desktop) -->
            <button
              @click="nextCard"
              :disabled="currentIndex === totalWords - 1"
              class="hidden h-12 min-w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-base font-bold leading-normal tracking-[0.015em] text-text-light shadow-md transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 sm:flex dark:bg-text-dark/10 dark:text-text-dark dark:hover:bg-text-dark/20"
              title="Phím mũi tên phải"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <!-- Mobile Navigation Controls -->
          <div class="flex w-full items-center justify-between px-4 sm:hidden">
            <button
              @click="previousCard"
              :disabled="currentIndex === 0"
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-30 dark:bg-surface-dark"
            >
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Chạm để lật</span>
            <button
              @click="nextCard"
              :disabled="currentIndex === totalWords - 1"
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-30 dark:bg-surface-dark"
            >
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex w-full max-w-xl flex-wrap justify-center gap-4">
            <button
              @click="markAsNotLearned"
              class="flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-lg border border-red-500 bg-accent-red/10 px-5 py-3.5 text-base font-bold leading-normal tracking-[0.015em] text-red-600 transition hover:bg-accent-red hover:text-white dark:text-red-400 dark:hover:text-white"
            >
              <span class="material-symbols-outlined">close</span>
              <span class="truncate">Chưa thuộc</span>
            </button>
            <button
              @click="markAsLearned"
              class="flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-lg border border-green-500 bg-accent-green/10 px-5 py-3.5 text-base font-bold leading-normal tracking-[0.015em] text-green-600 transition hover:bg-accent-green hover:text-white dark:text-green-400 dark:hover:text-white"
            >
              <span class="material-symbols-outlined">check</span>
              <span class="truncate">Đã thuộc</span>
            </button>
          </div>
        </div>

        <!-- Completion State -->
        <div v-else-if="!loading && totalWords === 0" class="flex flex-1 flex-col items-center justify-center gap-8">
          <div class="text-center">
            <h2 class="mb-4 text-2xl font-bold text-primary-black dark:text-white">Bộ từ vựng trống</h2>
            <p class="mb-6 text-text-secondary-light dark:text-text-secondary-dark">Bộ từ vựng này chưa có từ nào.</p>
            <router-link to="/decks" class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90">
              Quay lại danh sách
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLearnStore } from '@/stores/learn'
import deckService from '@/services/deck.service'
import wordService from '@/services/word.service'
import type { Word } from '@/services/word.service'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const learnStore = useLearnStore()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const deckId = ref<string>('')
const totalWords = ref(0)
const currentIndex = ref(0)
const isFlipped = ref(false)
const transitionName = ref('slide-next')

// Words management
const allWordIds = ref<string[]>([])
const loadedWords = ref<Map<string, Word>>(new Map())
const currentBatchIndex = ref(0)
const useBatchLoading = ref(false)
const BATCH_SIZE = 50
const PREFETCH_THRESHOLD = 10

// Computed
const progressPercentage = computed(() => {
  if (totalWords.value === 0) return 0
  return ((currentIndex.value + 1) / totalWords.value) * 100
})

const currentWord = computed(() => {
  if (allWordIds.value.length === 0) return null
  const wordId = allWordIds.value[currentIndex.value]
  if (!wordId) return null
  return loadedWords.value.get(wordId) || null
})

// Functions
function getBackCardColorClass(genus?: string): string {
  if (!genus) return 'bg-white dark:bg-text-dark/10'
  
  const genusLower = genus.toLowerCase()
  if (genusLower === 'die') return 'bg-red-50 dark:bg-red-900/20'
  if (genusLower === 'der') return 'bg-blue-50 dark:bg-blue-900/20'
  if (genusLower === 'das') return 'bg-green-50 dark:bg-green-900/20'
  
  return 'bg-white dark:bg-text-dark/10'
}

function toggleFlip() {
  isFlipped.value = !isFlipped.value
}

function nextCard() {
  if (currentIndex.value < totalWords.value - 1) {
    transitionName.value = 'slide-next'
    isFlipped.value = false
    setTimeout(() => {
      currentIndex.value++
      learnStore.updateProgress(deckId.value, currentIndex.value)
      checkAndPrefetchNextBatch()
    }, 50)
  }
}

function previousCard() {
  if (currentIndex.value > 0) {
    transitionName.value = 'slide-prev'
    isFlipped.value = false
    setTimeout(() => {
      currentIndex.value--
      learnStore.updateProgress(deckId.value, currentIndex.value)
    }, 50)
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (loading.value || !currentWord.value) return

  switch (event.key) {
    case 'ArrowRight':
      nextCard()
      break
    case 'ArrowLeft':
      previousCard()
      break
    case ' ':
    case 'Space':
      event.preventDefault() // Prevent scrolling
      toggleFlip()
      break
    case 'm':
    case 'M':
      playAudio()
      break
  }
}

async function markAsLearned() {
  if (!currentWord.value) return
  
  try {
    await wordService.updateWord(currentWord.value.id, { isLearned: true })
    const word = loadedWords.value.get(currentWord.value.id)
    if (word) {
      word.isLearned = true
      learnStore.updateWord(deckId.value, word.id, { isLearned: true })
    }
    nextCard()
  } catch (err) {
    console.error('Failed to mark word as learned:', err)
  }
}

async function markAsNotLearned() {
  if (!currentWord.value) return
  
  try {
    await wordService.updateWord(currentWord.value.id, { isLearned: false })
    const word = loadedWords.value.get(currentWord.value.id)
    if (word) {
      word.isLearned = false
      learnStore.updateWord(deckId.value, word.id, { isLearned: false })
    }
    nextCard()
  } catch (err) {
    console.error('Failed to mark word as not learned:', err)
  }
}

function playAudio() {
  if (currentWord.value?.audioUrl) {
    const audio = new Audio(currentWord.value.audioUrl)
    audio.play().catch(err => {
      console.error('Failed to play audio:', err)
    })
  }
}

// Data Loading Functions
async function loadWordCount() {
  try {
    const response = await deckService.getWordCount(deckId.value)
    totalWords.value = response.data.count
  } catch (err) {
    console.error('Failed to load word count:', err)
    throw new Error('Không thể tải số lượng từ vựng')
  }
}

async function loadShuffledIds() {
  try {
    const response = await deckService.getShuffledWordIds(deckId.value)
    useBatchLoading.value = response.data.useBatchLoading
    
    if (useBatchLoading.value && response.data.wordIds) {
      allWordIds.value = response.data.wordIds
    } else {
      await loadAllWords()
    }
  } catch (err) {
    console.error('Failed to load shuffled IDs:', err)
    throw new Error('Không thể tải danh sách từ vựng')
  }
}

async function loadAllWords() {
  try {
    const response = await wordService.getWordsByDeck(deckId.value)
    const words = response.data
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    allWordIds.value = shuffled.map(w => w.id)
    shuffled.forEach(word => loadedWords.value.set(word.id, word))
  } catch (err) {
    console.error('Failed to load all words:', err)
    throw new Error('Không thể tải từ vựng')
  }
}

async function loadBatch(batchIndex: number) {
  const startIdx = batchIndex * BATCH_SIZE
  const endIdx = Math.min(startIdx + BATCH_SIZE, allWordIds.value.length)
  const batchIds = allWordIds.value.slice(startIdx, endIdx)
  
  if (batchIds.length === 0) return
  
  try {
    const response = await wordService.batchLoadWords({ ids: batchIds })
    const words = response.data
    words.forEach(word => loadedWords.value.set(word.id, word))
    learnStore.addWords(deckId.value, words)
  } catch (err) {
    console.error('Failed to load batch:', err)
    throw new Error('Không thể tải từ vựng')
  }
}

function checkAndPrefetchNextBatch() {
  if (!useBatchLoading.value) return
  const nextBatchIndex = Math.floor((currentIndex.value + PREFETCH_THRESHOLD) / BATCH_SIZE)
  if (nextBatchIndex > currentBatchIndex.value) {
    currentBatchIndex.value = nextBatchIndex
    loadBatch(nextBatchIndex).catch(err => console.error('Failed to prefetch batch:', err))
  }
}

async function initialize() {
  loading.value = true
  error.value = null
  
  try {
    deckId.value = route.params.id as string
    if (!deckId.value) throw new Error('Không tìm thấy ID bộ từ vựng')
    
    // Check cache first
    const cache = learnStore.getCache(deckId.value)
    if (cache) {
      allWordIds.value = cache.wordIds
      Object.values(cache.words).forEach(w => loadedWords.value.set(w.id, w))
      totalWords.value = cache.totalWords
      currentIndex.value = cache.currentIndex
      
      // Ensure we have words for current index (in case cache is partial)
      // But cache.words should have what we loaded.
      // If batch loading, we might need to check if we need more.
      // For now assume cache is good enough or we just load next batch if needed.
      checkAndPrefetchNextBatch()
      
      loading.value = false
      return
    }

    await loadWordCount()
    if (totalWords.value === 0) {
      loading.value = false
      return
    }
    
    await loadShuffledIds()
    if (useBatchLoading.value) {
      await loadBatch(0)
      currentBatchIndex.value = 0
    }
    
    // Save to cache
    const wordsRecord: Record<string, Word> = {}
    loadedWords.value.forEach((v, k) => wordsRecord[k] = v)
    
    learnStore.setCache(deckId.value, {
      wordIds: allWordIds.value,
      words: wordsRecord,
      totalWords: totalWords.value,
      currentIndex: 0
    })
    
    loading.value = false
  } catch (err: any) {
    console.error('Initialization error:', err)
    error.value = err.message || 'Đã xảy ra lỗi khi tải dữ liệu'
    loading.value = false
  }
}

onMounted(() => {
  initialize()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.flashcard-inner {
  position: relative;
  transform-style: preserve-3d;
}

.flashcard.is-flipped .flashcard-inner {
  transform: rotateY(180deg);
}

.flashcard-front,
.flashcard-back {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Transitions */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.3s ease;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
