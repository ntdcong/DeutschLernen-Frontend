<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
    <!-- Header -->
    <header
      class="sticky top-0 z-10 flex items-center justify-between border-b border-solid border-black/10 bg-background-light/80 px-4 py-3 backdrop-blur-md sm:px-10 dark:border-white/10 dark:bg-background-dark/80">
      <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
        <router-link to="/decks" class="flex items-center gap-2 transition-colors hover:text-primary">
          <span class="material-symbols-outlined">close</span>
          <span class="hidden text-sm font-medium sm:inline">Thoát</span>
        </router-link>
      </div>

      <div class="flex flex-1 justify-center px-4">
        <div class="flex w-full max-w-sm flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <p class="text-xs font-medium leading-normal text-text-light/70 sm:text-sm dark:text-text-dark/70">Tiến độ
            </p>
            <button @click="shuffleWords"
              class="flex items-center gap-1 rounded-lg bg-black/5 px-2 py-1 text-xs font-medium text-text-light transition hover:bg-black/10 dark:bg-white/5 dark:text-text-dark dark:hover:bg-white/10"
              title="Trộn từ vựng">
              <span class="material-symbols-outlined text-sm">shuffle</span>
              <span class="hidden sm:inline">Trộn</span>
            </button>
            <p class="text-xs font-medium leading-normal text-text-light/70 sm:text-sm dark:text-text-dark/70">
              {{ currentIndex + 1 }}/{{ totalWords }}
            </p>
          </div>
          <div class="h-2 rounded-full bg-black/10 dark:bg-white/10">
            <div class="h-2 rounded-full bg-black transition-all duration-300"
              :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
        <button @click="showHelpModal = true"
          class="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          title="Hướng dẫn sử dụng">
          <span class="material-symbols-outlined text-xl">lightbulb</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex flex-1 flex-col justify-center px-4 py-5 outline-none" tabindex="0" @keydown="handleKeydown"
      @touchstart="handleTouchStart" @touchend="handleTouchEnd" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
      <div class="layout-content-container mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-1 flex-col items-center justify-center gap-8">
          <div class="text-center">
            <div
              class="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-primary border-r-transparent">
            </div>
            <p class="text-lg text-text-secondary-light dark:text-text-secondary-dark">Đang tải từ vựng...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-1 flex-col items-center justify-center gap-8">
          <div class="rounded-lg bg-red-100 p-6 text-center text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <p class="mb-4">{{ error }}</p>
            <router-link to="/decks"
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90">
              Quay lại danh sách
            </router-link>
          </div>
        </div>

        <!-- Flashcard Content -->
        <div v-else-if="currentWord" class="flex flex-1 flex-col items-center justify-center gap-8">
          <!-- Navigation Buttons & Card -->
          <div class="relative flex w-full items-center justify-center gap-2 sm:gap-4">
            <!-- Previous Button (Desktop) -->
            <button @click="previousCard" :disabled="currentIndex === 0"
              class="hidden h-12 min-w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-base font-bold leading-normal tracking-[0.015em] text-text-light shadow-md transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 sm:flex dark:bg-text-dark/10 dark:text-text-dark dark:hover:bg-text-dark/20"
              title="Phím mũi tên trái">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>

            <!-- Flashcard Container -->
            <div class="relative w-full max-w-xl perspective-1000">
              <Transition :name="transitionName" mode="out-in">
                <div :key="currentWord.id" @click="toggleFlip"
                  class="flashcard aspect-[3/4] w-full cursor-pointer sm:aspect-[3/2]"
                  :class="{ 'is-flipped': isFlipped }">
                  <div class="flashcard-inner h-full w-full duration-500">
                    <!-- Front Side -->
                    <div
                      class="flashcard-front absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-black/10 bg-white p-6 shadow-lg backface-hidden dark:border-white/10 dark:bg-text-dark/10 overflow-hidden select-none">
                      <div class="flex flex-col items-center justify-center w-full h-full gap-4 px-4">
                        <h1 class="text-center font-semibold w-full wrap-text"
                          :style="getFrontTextStyle(currentWord.word)">
                          {{ currentWord.word }}
                        </h1>
                      </div>
                    </div>

                    <!-- Back Side -->
                    <div
                      class="flashcard-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border border-black/10 p-6 text-center shadow-lg backface-hidden rotate-y-180 overflow-hidden select-none"
                      :class="getBackCardColorClass(currentWord.genus)">
                      <div class="flex flex-col items-center justify-center w-full flex-1 gap-2 overflow-y-auto px-4">
                        <p class="text-center font-semibold w-full wrap-text"
                          :style="getBackTextStyle(currentWord.meaning)">
                          {{ currentWord.meaning }}
                        </p>
                        <div class="mt-1 space-y-1 text-text-light/80 dark:text-text-dark/80 w-full"
                          :style="getMetaTextStyle()">
                          <p v-if="currentWord.genus" class="wrap-text">
                            <span class="font-medium">Giống:</span> {{ currentWord.genus }}
                          </p>
                          <p v-if="currentWord.plural" class="wrap-text">
                            <span class="font-medium">Số nhiều:</span> {{ currentWord.plural }}
                          </p>
                        </div>
                      </div>
                      <button v-if="currentWord.audioUrl" @click.stop="playAudio"
                        class="mt-2 flex h-10 min-w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-base font-bold leading-normal tracking-[0.015em] text-black transition hover:brightness-90 flex-shrink-0"
                        title="Phím M">
                        <span class="material-symbols-outlined text-xl">volume_up</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Next Button (Desktop) -->
            <button @click="nextCard" :disabled="currentIndex === totalWords - 1"
              class="hidden h-12 min-w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-base font-bold leading-normal tracking-[0.015em] text-text-light shadow-md transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 sm:flex dark:bg-text-dark/10 dark:text-text-dark dark:hover:bg-text-dark/20"
              title="Phím mũi tên phải">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <!-- Mobile Navigation Controls -->
          <div class="flex w-full items-center justify-between px-4 sm:hidden">
            <button @click="previousCard" :disabled="currentIndex === 0"
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-30 dark:bg-surface-dark">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Chạm để lật</span>
            <button @click="nextCard" :disabled="currentIndex === totalWords - 1"
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-30 dark:bg-surface-dark">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex w-full max-w-xl flex-wrap justify-center gap-4">
            <button @click="markAsNotLearned"
              class="flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-lg border border-red-500 bg-accent-red/10 px-5 py-3.5 text-base font-bold leading-normal tracking-[0.015em] text-red-600 transition hover:bg-accent-red hover:text-white dark:text-red-400 dark:hover:text-white">
              <span class="material-symbols-outlined">close</span>
              <span class="truncate">Chưa thuộc</span>
            </button>
            <button @click="markAsLearned"
              class="flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-lg border border-green-500 bg-accent-green/10 px-5 py-3.5 text-base font-bold leading-normal tracking-[0.015em] text-green-600 transition hover:bg-accent-green hover:text-white dark:text-green-400 dark:hover:text-white">
              <span class="material-symbols-outlined">check</span>
              <span class="truncate">Đã thuộc</span>
            </button>
          </div>
        </div>

        <!-- Empty Deck State -->
        <div v-else-if="!loading && totalWords === 0" class="flex flex-1 flex-col items-center justify-center gap-8">
          <div class="text-center">
            <h2 class="mb-4 text-2xl font-bold text-primary-black dark:text-white">Bộ từ vựng trống</h2>
            <p class="mb-6 text-text-secondary-light dark:text-text-secondary-dark">Bộ từ vựng này chưa có từ nào.</p>
            <router-link to="/decks"
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90">
              Quay lại danh sách
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Completion Modal -->
    <div v-if="showCompletionModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showCompletionModal = false">
      <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl dark:bg-gray-900">
        <div class="mb-6 text-center">
          <div class="mb-4 flex justify-center">
            <span class="material-symbols-outlined text-6xl text-green-500">check_circle</span>
          </div>
          <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Hoàn thành!</h2>
          <p class="text-text-secondary-light dark:text-text-secondary-dark">
            Bạn đã hoàn thành bộ từ vựng này.
          </p>
        </div>
        <div class="flex flex-col gap-3">
          <button @click="restartLearning"
            class="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-black transition hover:bg-primary/90">
            <span class="material-symbols-outlined">replay</span>
            <span>Học tiếp</span>
          </button>
          <router-link to="/decks"
            class="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Quay lại</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div v-if="showHelpModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showHelpModal = false">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-3xl text-yellow-500">lightbulb</span>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Hướng dẫn</h2>
          </div>
          <button @click="showHelpModal = false"
            class="rounded-full p-1 transition hover:bg-gray-100 dark:hover:bg-gray-800">
            <span class="material-symbols-outlined text-gray-500">close</span>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Phím tắt:</h3>
            <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div class="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span>Chuyển thẻ tiếp theo</span>
                <kbd class="rounded bg-gray-200 px-2 py-1 font-mono text-xs dark:bg-gray-700">→</kbd>
              </div>
              <div class="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span>Quay lại thẻ trước</span>
                <kbd class="rounded bg-gray-200 px-2 py-1 font-mono text-xs dark:bg-gray-700">←</kbd>
              </div>
              <div class="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span>Lật thẻ</span>
                <kbd class="rounded bg-gray-200 px-2 py-1 font-mono text-xs dark:bg-gray-700">Space</kbd>
              </div>
              <div class="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span>Trộn từ vựng</span>
                <kbd class="rounded bg-gray-200 px-2 py-1 font-mono text-xs dark:bg-gray-700">S</kbd>
              </div>
              <div class="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span>Phát âm thanh</span>
                <kbd class="rounded bg-gray-200 px-2 py-1 font-mono text-xs dark:bg-gray-700">M</kbd>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Thao tác:</h3>
            <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div class="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span class="material-symbols-outlined mr-1 text-sm align-middle">touch_app</span>
                Chạm vào thẻ để lật
              </div>
              <div class="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span class="material-symbols-outlined mr-1 text-sm align-middle">swipe</span>
                Vuốt trái/phải để chuyển thẻ
              </div>
              <div class="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <span class="material-symbols-outlined mr-1 text-sm align-middle">close</span>
                <span class="material-symbols-outlined mr-1 text-sm align-middle">check</span>
                Đánh dấu chưa thuộc / đã thuộc
              </div>
            </div>
          </div>
        </div>

        <button @click="showHelpModal = false"
          class="mt-6 w-full rounded-lg bg-primary px-4 py-2 font-semibold text-black transition hover:bg-primary/90">
          Đóng
        </button>
      </div>
    </div>
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
const isNavigating = ref(false)
const showCompletionModal = ref(false)
const showHelpModal = ref(false)

// Swipe handling
const touchStartX = ref(0)
const touchStartY = ref(0)
const minSwipeDistance = 50

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

function getFrontTextStyle(text: string): string {
  const length = text.length
  let fontSize: string

  // Aggressive font sizing to fit everything on one line
  if (length <= 8) {
    fontSize = 'clamp(3rem, 10vw, 6rem)' // Very large for short words
  } else if (length <= 12) {
    fontSize = 'clamp(2.5rem, 8vw, 4.5rem)' // Large
  } else if (length <= 16) {
    fontSize = 'clamp(2rem, 6vw, 3.5rem)' // Medium-large
  } else if (length <= 20) {
    fontSize = 'clamp(1.5rem, 5vw, 2.5rem)' // Medium
  } else if (length <= 25) {
    fontSize = 'clamp(1.25rem, 4vw, 2rem)' // Small
  } else if (length <= 30) {
    fontSize = 'clamp(1rem, 3.5vw, 1.75rem)' // Smaller
  } else if (length <= 40) {
    fontSize = 'clamp(0.875rem, 3vw, 1.5rem)' // Very small
  } else {
    fontSize = 'clamp(0.75rem, 2.5vw, 1.25rem)' // Tiny for very long words
  }

  return `font-size: ${fontSize}; line-height: 1.2;`
}

function getBackTextStyle(text: string): string {
  const length = text.length
  let fontSize: string

  // Dynamic font sizing for Vietnamese meaning (can wrap)
  if (length <= 15) {
    fontSize = 'clamp(2rem, 6vw, 3.5rem)' // Large
  } else if (length <= 30) {
    fontSize = 'clamp(1.5rem, 5vw, 2.5rem)' // Medium
  } else if (length <= 50) {
    fontSize = 'clamp(1.25rem, 4vw, 2rem)' // Small
  } else if (length <= 80) {
    fontSize = 'clamp(1rem, 3.5vw, 1.5rem)' // Smaller
  } else if (length <= 120) {
    fontSize = 'clamp(0.875rem, 3vw, 1.25rem)' // Very small
  } else {
    fontSize = 'clamp(0.75rem, 2.5vw, 1rem)' // Tiny
  }

  return `font-size: ${fontSize}; line-height: 1.4;`
}

function getMetaTextStyle(): string {
  return 'font-size: clamp(0.75rem, 2vw, 1rem);'
}


function toggleFlip() {
  isFlipped.value = !isFlipped.value
}

function nextCard() {
  // Check if at the last card
  if (currentIndex.value === totalWords.value - 1) {
    // Show completion modal
    showCompletionModal.value = true
    return
  }

  // Prevent navigation if already navigating
  if (isNavigating.value) {
    return
  }

  isNavigating.value = true
  transitionName.value = 'slide-next'
  isFlipped.value = false

  setTimeout(() => {
    currentIndex.value++
    learnStore.updateProgress(deckId.value, currentIndex.value)
    checkAndPrefetchNextBatch()

    // Reset navigation lock after transition
    setTimeout(() => {
      isNavigating.value = false
    }, 100)
  }, 50)
}

function previousCard() {
  // Prevent navigation if already navigating or at the start
  if (isNavigating.value || currentIndex.value <= 0) {
    return
  }

  isNavigating.value = true
  transitionName.value = 'slide-prev'
  isFlipped.value = false

  setTimeout(() => {
    currentIndex.value--
    learnStore.updateProgress(deckId.value, currentIndex.value)

    // Reset navigation lock after transition
    setTimeout(() => {
      isNavigating.value = false
    }, 100)
  }, 50)
}

function shuffleWords() {
  // Shuffle the word IDs array
  const shuffled = [...allWordIds.value].sort(() => Math.random() - 0.5)
  allWordIds.value = shuffled

  // Reset to first card
  currentIndex.value = 0
  isFlipped.value = false
  learnStore.updateProgress(deckId.value, 0)
}

function restartLearning() {
  showCompletionModal.value = false
  currentIndex.value = 0
  isFlipped.value = false
  learnStore.updateProgress(deckId.value, 0)
}

// Swipe Handlers
function handleTouchStart(e: TouchEvent) {
  const touch = e.changedTouches[0]
  if (touch) {
    touchStartX.value = touch.screenX
    touchStartY.value = touch.screenY
  }
}

function handleTouchEnd(e: TouchEvent) {
  const touch = e.changedTouches[0]
  if (touch) {
    const touchEndX = touch.screenX
    const touchEndY = touch.screenY
    handleSwipe(touchStartX.value, touchEndX, touchStartY.value, touchEndY)
  }
}

function handleMouseDown(e: MouseEvent) {
  touchStartX.value = e.screenX
  touchStartY.value = e.screenY
}

function handleMouseUp(e: MouseEvent) {
  const touchEndX = e.screenX
  const touchEndY = e.screenY
  handleSwipe(touchStartX.value, touchEndX, touchStartY.value, touchEndY)
}

function handleSwipe(startX: number, endX: number, startY: number, endY: number) {
  const diffX = startX - endX
  const diffY = startY - endY

  // Check if horizontal swipe distance is significant and dominant over vertical swipe
  if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      // Swipe Left -> Next
      nextCard()
    } else {
      // Swipe Right -> Previous
      previousCard()
    }
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
    case 'S':
    case 's':
      shuffleWords()
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
async function loadDeckInfo() {
  try {
    const response = await deckService.getDeck(deckId.value)
    totalWords.value = response.data.wordCount || 0
  } catch (err) {
    console.error('Failed to load deck info:', err)
    throw new Error('Không thể tải thông tin bộ từ vựng')
  }
}

async function loadWordIds() {
  try {
    const response = await deckService.getShuffledWordIds(deckId.value)
    useBatchLoading.value = response.data.useBatchLoading

    if (useBatchLoading.value && response.data.wordIds) {
      // Use word IDs in original order (not shuffled)
      allWordIds.value = response.data.wordIds
    } else {
      await loadAllWords()
    }
  } catch (err) {
    console.error('Failed to load word IDs:', err)
    throw new Error('Không thể tải danh sách từ vựng')
  }
}

async function loadAllWords() {
  try {
    const response = await wordService.getWordsByDeck(deckId.value)
    const words = response.data
    // Keep original order, no shuffling
    allWordIds.value = words.map(w => w.id)
    words.forEach(word => loadedWords.value.set(word.id, word))
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
      checkAndPrefetchNextBatch()

      loading.value = false
      return
    }

    await loadDeckInfo()
    if (totalWords.value === 0) {
      loading.value = false
      return
    }

    await loadWordIds()
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

/* Text handling */
.no-wrap-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
}

.wrap-text {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}


/* Custom scrollbar for overflow content */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}
</style>
