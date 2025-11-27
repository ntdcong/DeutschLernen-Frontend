<template>
    <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
        <!-- Header -->
        <header
            class="sticky top-0 z-10 flex items-center justify-between border-b border-solid border-black/10 bg-background-light/80 px-4 py-3 backdrop-blur-md sm:px-10 dark:border-white/10 dark:bg-background-dark/80">
            <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
                <router-link to="/" class="flex items-center gap-2 transition-colors hover:text-primary">
                    <span class="material-symbols-outlined">home</span>
                    <span class="hidden text-sm font-medium sm:inline">Trang chủ</span>
                </router-link>
            </div>

            <div class="flex flex-1 justify-center px-4">
                <div class="flex w-full max-w-sm flex-col gap-2">
                    <div class="flex items-center justify-between gap-2">
                        <p
                            class="text-xs font-medium leading-normal text-text-light/70 sm:text-sm dark:text-text-dark/70">
                            {{ deck?.name }}
                        </p>
                        <button @click="shuffleWords"
                            class="flex items-center gap-1 rounded-lg bg-black/5 px-2 py-1 text-xs font-medium text-text-light transition hover:bg-black/10 dark:bg-white/5 dark:text-text-dark dark:hover:bg-white/10"
                            title="Trộn từ vựng">
                            <span class="material-symbols-outlined text-sm">shuffle</span>
                            <span class="hidden sm:inline">Trộn</span>
                        </button>
                        <p
                            class="text-xs font-medium leading-normal text-text-light/70 sm:text-sm dark:text-text-dark/70">
                            {{ currentIndex + 1 }}/{{ totalWords }}
                        </p>
                    </div>
                    <div class="h-2 rounded-full bg-black/10 dark:bg-white/10">
                        <div class="h-2 rounded-full bg-primary transition-all duration-300"
                            :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2 text-text-light dark:text-text-dark">
                <router-link to="/register"
                    class="rounded-full bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-primary hover:text-white dark:bg-white dark:text-black dark:hover:bg-primary dark:hover:text-white">
                    Tạo bộ từ vựng
                </router-link>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex flex-1 flex-col justify-center px-4 py-5 outline-none" tabindex="0" @keydown="handleKeydown"
            @touchstart="handleTouchStart" @touchend="handleTouchEnd" @mousedown="handleMouseDown"
            @mouseup="handleMouseUp">
            <div class="layout-content-container mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
                <!-- Loading State -->
                <div v-if="loading" class="flex flex-1 flex-col items-center justify-center gap-8">
                    <div class="text-center">
                        <div
                            class="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-primary border-r-transparent">
                        </div>
                        <p class="text-lg text-text-secondary-light dark:text-text-secondary-dark">Đang tải bộ từ
                            vựng...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="flex flex-1 flex-col items-center justify-center gap-8">
                    <div
                        class="rounded-lg bg-red-100 p-6 text-center text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <p class="mb-4">{{ error }}</p>
                        <router-link to="/"
                            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90">
                            Về trang chủ
                        </router-link>
                    </div>
                </div>

                <!-- Flashcard Content -->
                <div v-else-if="currentWord" class="flex flex-1 flex-col items-center justify-center gap-8">
                    <!-- Deck Info Header -->
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-primary-black dark:text-white">{{ deck?.name }}</h1>
                        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            bởi {{ deck?.owner.username }} · {{ deck?.wordCount }} từ vựng
                        </p>
                    </div>

                    <!-- Navigation Buttons & Card -->
                    <div class="relative flex w-full items-center justify-center gap-2 sm:gap-4">
                        <!-- Previous Button (Desktop) -->
                        <button @click="previousCard" :disabled="currentIndex === 0"
                            class="hidden h-12 min-w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black text-white font-bold leading-normal tracking-[0.015em] shadow-md transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 sm:flex dark:bg-text-dark/10 dark:text-text-dark dark:hover:bg-text-dark/20"
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
                                            class="flashcard-front absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-black bg-white p-6 shadow-lg backface-hidden dark:border-white/10 dark:bg-text-dark/10 overflow-hidden select-none">
                                            <div
                                                class="flex flex-col items-center justify-center w-full h-full gap-4 px-4">
                                                <h1 class="text-center font-semibold w-full wrap-text"
                                                    :style="getFrontTextStyle(currentWord.german)">
                                                    {{ currentWord.german }}
                                                </h1>
                                            </div>
                                        </div>

                                        <!-- Back Side -->
                                        <div class="flashcard-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border border-black p-6 text-center shadow-lg backface-hidden rotate-y-180 overflow-hidden select-none"
                                            :class="getBackCardColorClass(currentWord.german)">
                                            <div
                                                class="flex flex-col items-center justify-center w-full flex-1 gap-2 overflow-y-auto px-4">
                                                <p class="text-center font-semibold w-full wrap-text"
                                                    :style="getBackTextStyle(currentWord.vietnamese)">
                                                    {{ currentWord.vietnamese }}
                                                </p>
                                                <div v-if="currentWord.example"
                                                    class="mt-4 w-full rounded-lg bg-black/5 p-3 text-sm text-text-light dark:bg-white/5 dark:text-text-dark">
                                                    <p class="italic">"{{ currentWord.example }}"</p>
                                                </div>
                                            </div>
                                            <!-- Audio button if we had audio URL in public response, but currently we don't seem to have it in the interface -->
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <!-- Next Button (Desktop) -->
                        <button @click="nextCard" :disabled="currentIndex === totalWords - 1"
                            class="hidden h-12 min-w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black text-white font-bold leading-normal tracking-[0.015em] shadow-md transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 sm:flex dark:bg-text-dark/10 dark:text-text-dark dark:hover:bg-text-dark/20"
                            title="Phím mũi tên phải">
                            <span class="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    <!-- Mobile Navigation Controls -->
                    <div class="flex w-full items-center justify-between px-4 sm:hidden">
                        <button @click="previousCard" :disabled="currentIndex === 0"
                            class="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-md disabled:opacity-30 dark:bg-surface-dark">
                            <span class="material-symbols-outlined">chevron_left</span>
                        </button>
                        <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Chạm để lật</span>
                        <button @click="nextCard" :disabled="currentIndex === totalWords - 1"
                            class="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-md disabled:opacity-30 dark:bg-surface-dark">
                            <span class="material-symbols-outlined">chevron_right</span>
                        </button>
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
                        Bạn đã xem hết bộ từ vựng này.
                    </p>
                </div>
                <div class="flex flex-col gap-3">
                    <button @click="restartLearning"
                        class="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-black transition hover:bg-primary/90">
                        <span class="material-symbols-outlined">replay</span>
                        <span>Học lại</span>
                    </button>
                    <router-link to="/register"
                        class="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                        <span class="material-symbols-outlined">person_add</span>
                        <span>Tạo tài khoản để lưu tiến độ</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { publicSharingService, type PublicDeck } from '@/services/publicSharingService'

const route = useRoute()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const deck = ref<PublicDeck | null>(null)
const words = ref<any[]>([])
const currentIndex = ref(0)
const isFlipped = ref(false)
const transitionName = ref('slide-next')
const isNavigating = ref(false)
const showCompletionModal = ref(false)

// Swipe handling
const touchStartX = ref(0)
const touchStartY = ref(0)
const minSwipeDistance = 50

// Computed
const totalWords = computed(() => words.value.length)

const progressPercentage = computed(() => {
    if (totalWords.value === 0) return 0
    return ((currentIndex.value + 1) / totalWords.value) * 100
})

const currentWord = computed(() => {
    if (words.value.length === 0) return null
    return words.value[currentIndex.value]
})

// Functions
function getBackCardColorClass(text: string): string {
    if (!text) return 'bg-white dark:bg-text-dark/10'
    // Simple heuristic for genus based on first word if it matches der/die/das
    const parts = text.split(' ')
    const firstWord = parts[0]?.toLowerCase() || ''
    if (firstWord === 'die') return 'bg-red-50 dark:bg-red-900/20'
    if (firstWord === 'der') return 'bg-blue-50 dark:bg-blue-900/20'
    if (firstWord === 'das') return 'bg-green-50 dark:bg-green-900/20'
    return 'bg-white dark:bg-text-dark/10'
}

function getFrontTextStyle(text: string): string {
    const length = text.length
    let fontSize: string
    if (length <= 6) fontSize = 'clamp(3rem, 10vw, 6rem)'
    else if (length <= 10) fontSize = 'clamp(2.5rem, 8vw, 4.5rem)'
    else if (length <= 14) fontSize = 'clamp(2rem, 6vw, 3.5rem)'
    else if (length <= 20) fontSize = 'clamp(1.5rem, 5vw, 2.5rem)'
    else if (length <= 25) fontSize = 'clamp(1.25rem, 4vw, 2rem)'
    else if (length <= 30) fontSize = 'clamp(1rem, 3.5vw, 1.75rem)'
    else if (length <= 40) fontSize = 'clamp(0.875rem, 3vw, 1.5rem)'
    else fontSize = 'clamp(0.75rem, 2.5vw, 1.25rem)'
    return `font-size: ${fontSize}; line-height: 1.2;`
}

function getBackTextStyle(text: string): string {
    const length = text.length
    let fontSize: string
    if (length <= 15) fontSize = 'clamp(2rem, 6vw, 3.5rem)'
    else if (length <= 30) fontSize = 'clamp(1.5rem, 5vw, 2.5rem)'
    else if (length <= 50) fontSize = 'clamp(1.25rem, 4vw, 2rem)'
    else if (length <= 80) fontSize = 'clamp(1rem, 3.5vw, 1.5rem)'
    else if (length <= 120) fontSize = 'clamp(0.875rem, 3vw, 1.25rem)'
    else fontSize = 'clamp(0.75rem, 2.5vw, 1rem)'
    return `font-size: ${fontSize}; line-height: 1.4;`
}

function toggleFlip() {
    isFlipped.value = !isFlipped.value
}

function nextCard() {
    if (currentIndex.value === totalWords.value - 1) {
        showCompletionModal.value = true
        return
    }
    if (isNavigating.value) return

    isNavigating.value = true
    transitionName.value = 'slide-next'
    isFlipped.value = false

    setTimeout(() => {
        currentIndex.value++
        setTimeout(() => { isNavigating.value = false }, 100)
    }, 50)
}

function previousCard() {
    if (isNavigating.value || currentIndex.value <= 0) return

    isNavigating.value = true
    transitionName.value = 'slide-prev'
    isFlipped.value = false

    setTimeout(() => {
        currentIndex.value--
        setTimeout(() => { isNavigating.value = false }, 100)
    }, 50)
}

function shuffleWords() {
    const shuffled = [...words.value].sort(() => Math.random() - 0.5)
    words.value = shuffled
    currentIndex.value = 0
    isFlipped.value = false
}

function restartLearning() {
    showCompletionModal.value = false
    currentIndex.value = 0
    isFlipped.value = false
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
        handleSwipe(touchStartX.value, touch.screenX, touchStartY.value, touch.screenY)
    }
}

function handleMouseDown(e: MouseEvent) {
    touchStartX.value = e.screenX
    touchStartY.value = e.screenY
}

function handleMouseUp(e: MouseEvent) {
    handleSwipe(touchStartX.value, e.screenX, touchStartY.value, e.screenY)
}

function handleSwipe(startX: number, endX: number, startY: number, endY: number) {
    const diffX = startX - endX
    const diffY = startY - endY

    if (Math.abs(diffX) > minSwipeDistance && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) nextCard()
        else previousCard()
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (loading.value || !currentWord.value) return

    switch (event.key) {
        case 'ArrowRight': nextCard(); break
        case 'ArrowLeft': previousCard(); break
        case ' ':
        case 'Space':
            event.preventDefault()
            toggleFlip()
            break
        case 'S':
        case 's': shuffleWords(); break
    }
}

async function initialize() {
    loading.value = true
    error.value = null
    const token = route.params.token as string

    try {
        const result = await publicSharingService.getPublicDeck(token)
        deck.value = result
        words.value = result.words
    } catch (err) {
        console.error('Failed to load public deck:', err)
        error.value = 'Không tìm thấy bộ từ vựng hoặc chia sẻ đã bị tắt'
    } finally {
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

.wrap-text {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
}
</style>
