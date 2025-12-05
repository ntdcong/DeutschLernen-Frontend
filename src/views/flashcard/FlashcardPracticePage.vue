<template>
    <div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
        <!-- Header -->
        <header
            class="sticky top-0 z-10 flex items-center justify-between border-b border-solid border-black/10 bg-background-light/80 px-4 py-3 backdrop-blur-md sm:px-10 dark:border-white/10 dark:bg-background-dark/80">
            <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
                <button @click="handleBack" class="flex items-center gap-2 transition-colors hover:text-primary">
                    <span class="material-symbols-outlined">close</span>
                    <span class="hidden text-sm font-medium sm:inline">Thoát</span>
                </button>
            </div>

            <div class="flex flex-1 justify-center px-4">
                <div class="flex w-full max-w-xs flex-col gap-1">
                    <div class="flex items-center justify-between gap-2">
                        <p class="text-xs font-medium text-text-light/70 dark:text-text-dark/70">
                            {{ gameModeName }}
                        </p>
                        <p class="text-xs font-medium text-text-light/70 dark:text-text-dark/70">
                            {{ score }}/{{ totalQuestions }}
                        </p>
                    </div>
                    <div class="h-1.5 rounded-full bg-black/10 dark:bg-white/10">
                        <div class="h-1.5 rounded-full bg-black transition-all duration-300"
                            :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2 text-text-light dark:text-text-dark">
                <button @click="showHelpModal = true"
                    class="flex h-8 w-8 items-center justify-center rounded-full border border-black/20 transition-colors hover:bg-black hover:text-white dark:border-white/20"
                    title="Hướng dẫn">
                    <span class="material-symbols-outlined text-lg">question_mark</span>
                </button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex flex-1 flex-col px-4 py-4">
            <div class="mx-auto flex w-full max-w-4xl flex-1 flex-col">
                <!-- Loading State -->
                <div v-if="loading" class="flex flex-1 items-center justify-center">
                    <div class="text-center">
                        <div
                            class="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-primary border-r-transparent">
                        </div>
                        <p class="text-text-secondary-light dark:text-text-secondary-dark">Đang tải...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="flex flex-1 items-center justify-center">
                    <div
                        class="rounded-lg bg-red-100 p-6 text-center text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <p class="mb-4">{{ error }}</p>
                        <router-link to="/decks"
                            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90">
                            Quay lại
                        </router-link>
                    </div>
                </div>

                <!-- Game Mode Selection -->
                <div v-else-if="!gameMode" class="flex flex-1 flex-col items-center justify-center gap-6">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-primary-black dark:text-white mb-1">Chọn chế độ luyện tập
                        </h1>
                        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {{ deckInfo?.name }} • {{ words.length }} từ
                        </p>
                    </div>

                    <div class="grid w-full max-w-sm grid-cols-1 gap-3">
                        <!-- Match Game -->
                        <button @click="startGame('match')" :disabled="words.length < 4"
                            class="flex items-center gap-4 border border-black rounded-xl bg-white p-4 text-text-light dark:text-text-dark shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100">
                            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                <span class="material-symbols-outlined text-2xl">join</span>
                            </div>
                            <div class="text-left">
                                <h3 class="font-bold">Ghép từ</h3>
                                <p class="text-xs text-black">Ghép từ Tiếng Đức với nghĩa Tiếng Việt</p>
                            </div>
                            <span class="material-symbols-outlined ml-auto">chevron_right</span>
                        </button>

                        <!-- Quiz Mode -->
                        <button @click="startGame('quiz')" :disabled="words.length < 4"
                            class="flex items-center gap-4 border border-black rounded-xl bg-white p-4 text-text-light dark:text-text-dark shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100">
                            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                <span class="material-symbols-outlined text-2xl">quiz</span>
                            </div>
                            <div class="text-left">
                                <h3 class="font-bold">Trắc nghiệm</h3>
                                <p class="text-xs text-black">Chọn 1 trong 4 đáp án</p>
                            </div>
                            <span class="material-symbols-outlined ml-auto">chevron_right</span>
                        </button>

                        <!-- Type Mode -->
                        <button @click="startGame('type')"
                            class="flex items-center gap-4 border border-black rounded-xl bg-white p-4 text-text-light dark:text-text-dark shadow-md transition-all hover:scale-[1.02] hover:shadow-lg">
                            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                <span class="material-symbols-outlined text-2xl">keyboard</span>
                            </div>
                            <div class="text-left">
                                <h3 class="font-bold">Điền từ</h3>
                                <p class="text-xs text-black">Xem nghĩa → gõ từ Đức</p>
                            </div>
                            <span class="material-symbols-outlined ml-auto">chevron_right</span>
                        </button>
                    </div>

                    <router-link :to="`/decks`"
                        class="mt-4 flex items-center gap-2 text-sm text-text-secondary-light transition-colors hover:text-primary dark:text-text-secondary-dark">
                        <span class="material-symbols-outlined text-lg">arrow_back</span>
                        Quay lại trang chính
                    </router-link>
                </div>

                <!-- Match Game Content -->
                <div v-else-if="gameMode === 'match' && !gameCompleted"
                    class="flex flex-1 flex-col items-center justify-center py-4">
                    <div class="w-full max-w-lg">
                        <div
                            class="mb-4 grid grid-cols-2 gap-3 text-center text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">
                            <span>Tiếng Đức</span>
                            <span>Tiếng Việt</span>
                        </div>
                        <div class="space-y-2">
                            <div v-for="index in matchItems.german.length" :key="index" class="grid grid-cols-2 gap-3">
                                <!-- German -->
                                <button @click="selectMatchItem('german', matchItems.german[index - 1]!)"
                                    :disabled="matchItems.german[index - 1]!.matched"
                                    class="min-h-[48px] rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
                                    :class="getMatchItemClass('german', matchItems.german[index - 1]!)">
                                    {{ matchItems.german[index - 1]!.word }}
                                </button>
                                <!-- Vietnamese -->
                                <button @click="selectMatchItem('vietnamese', matchItems.vietnamese[index - 1]!)"
                                    :disabled="matchItems.vietnamese[index - 1]!.matched"
                                    class="min-h-[48px] rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200"
                                    :class="getMatchItemClass('vietnamese', matchItems.vietnamese[index - 1]!)">
                                    {{ matchItems.vietnamese[index - 1]!.meaning }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quiz Mode Content -->
                <div v-else-if="gameMode === 'quiz' && !gameCompleted"
                    class="flex flex-1 flex-col items-center justify-center py-4">
                    <div class="w-full max-w-md">
                        <!-- Question -->
                        <div
                            class="mb-6 border-2 border-black rounded-2xl bg-surface-light p-6 shadow-sm dark:bg-surface-dark">
                            <p class="mb-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                Từ này nghĩa là ?
                            </p>
                            <h2 class="text-2xl font-bold text-primary-black dark:text-white">
                                {{ currentQuizWord?.word }}
                            </h2>
                            <p v-if="currentQuizWord?.genus" class="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                {{ currentQuizWord.genus }}
                            </p>
                        </div>

                        <!-- Options -->
                        <div
                            class="space-y-2 border-2 border-black rounded-2xl bg-surface-light p-6 shadow-sm dark:bg-surface-dark">
                            <button v-for="(option, index) in quizOptions" :key="index"
                                @click="selectQuizAnswer(option)" :disabled="quizAnswered"
                                class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200"
                                :class="getQuizOptionClass(option)">
                                <span
                                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-bold dark:bg-white/10">
                                    {{ ['A', 'B', 'C', 'D'][index] }}
                                </span>
                                <span class="text-sm font-medium">{{ option.meaning }}</span>
                            </button>
                        </div>

                        <!-- Next Button -->
                        <div v-if="quizAnswered" class="mt-6 flex justify-center">
                            <button @click="nextQuizQuestion"
                                class="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 font-bold text-white hover:bg-black/80">
                                {{ currentQuestionIndex < quizQuestions.length - 1 ? 'Tiếp theo' : 'Xem kết quả' }}
                                    <span class="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Type Mode Content -->
                <div v-else-if="gameMode === 'type' && !gameCompleted"
                    class="flex flex-1 flex-col items-center justify-center py-4">
                    <div class="w-full max-w-md">
                        <!-- Question -->
                        <div
                            class="mb-6 border-2 border-black rounded-2xl bg-surface-light p-6 shadow-sm dark:bg-surface-dark">
                            <p class="mb-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                Nhập từ tiếng Đức
                            </p>
                            <h2 class="text-xl font-bold text-primary-black dark:text-white">
                                {{ currentTypeWord?.meaning }}
                            </h2>

                            <!-- Hint Toggle -->
                            <button v-if="!typeAnswered && currentTypeWord" @click="toggleHint"
                                class="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                <span class="material-symbols-outlined text-sm">{{ showHint ? 'visibility_off' :
                                    'lightbulb' }}</span>
                                {{ showHint ? 'Ẩn gợi ý' : 'Xem gợi ý' }}
                            </button>

                            <!-- Hint Display -->
                            <div v-if="showHint && !typeAnswered"
                                class="mt-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                <p class="font-mono text-lg tracking-widest text-blue-700 dark:text-blue-300">
                                    {{ getHintText(currentTypeWord?.word || '') }}
                                </p>
                                <p v-if="currentTypeWord?.genus" class="mt-1 text-xs text-blue-600 dark:text-blue-400">
                                    {{ currentTypeWord.genus }}
                                </p>
                            </div>
                        </div>

                        <!-- Input -->
                        <div class="space-y-3">
                            <div class="relative">
                                <input ref="typeInput" v-model="userTypeAnswer" @keydown.enter="checkTypeAnswer"
                                    :disabled="typeAnswered" type="text" placeholder="Nhập từ tiếng Đức..."
                                    class="w-full rounded-xl border-2 px-4 py-3 text-lg transition-colors focus:outline-none"
                                    :class="typeInputClass" />
                                <button v-if="!typeAnswered && userTypeAnswer" @click="checkTypeAnswer"
                                    class="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white hover:bg-black/80">
                                    <span class="material-symbols-outlined text-lg">send</span>
                                </button>
                            </div>

                            <!-- Feedback -->
                            <div v-if="typeAnswered" class="rounded-xl p-3"
                                :class="typeAnswerCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-xl"
                                        :class="typeAnswerCorrect ? 'text-green-600' : 'text-red-600'">
                                        {{ typeAnswerCorrect ? 'check_circle' : 'cancel' }}
                                    </span>
                                    <p class="text-sm font-medium"
                                        :class="typeAnswerCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                                        {{ typeAnswerCorrect ? 'Chính xác!' : `Đáp án: ${currentTypeWord?.word}` }}
                                    </p>
                                </div>
                            </div>

                            <!-- Next Button -->
                            <div v-if="typeAnswered" class="flex justify-center">
                                <button @click="nextTypeQuestion"
                                    class="flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 font-bold text-white hover:bg-black/80">
                                    {{ currentQuestionIndex < typeQuestions.length - 1 ? 'Tiếp theo' : 'Xem kết quả' }}
                                        <span class="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Game Completed -->
                <div v-else-if="gameCompleted" class="flex flex-1 flex-col items-center justify-center gap-6 py-4">
                    <div class="text-center">
                        <div class="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full"
                            :class="resultClass.bg">
                            <span class="material-symbols-outlined text-5xl" :class="resultClass.icon">{{ resultIcon
                                }}</span>
                        </div>
                        <h2 class="mb-1 text-2xl font-bold text-primary-black dark:text-white">{{ resultMessage }}</h2>
                        <p class="text-lg font-bold" :class="resultClass.text">{{ score }}/{{ totalQuestions }}</p>
                        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">câu đúng</p>
                    </div>

                    <div class="flex w-full max-w-xs flex-col gap-2">
                        <button @click="restartGame"
                            class="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-black/80">
                            <span class="material-symbols-outlined">replay</span>
                            Chơi lại
                        </button>
                        <button @click="changeMode"
                            class="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 px-6 py-2.5 font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                            <span class="material-symbols-outlined">swap_horiz</span>
                            Đổi chế độ
                        </button>
                        <router-link :to="`/decks`"
                            class="flex items-center justify-center gap-2 text-sm text-text-secondary-light transition-colors hover:text-primary dark:text-text-secondary-dark">
                            <span class="material-symbols-outlined text-lg">arrow_back</span>
                            Quay lại trang chính
                        </router-link>
                    </div>
                </div>
            </div>
        </main>

        <!-- Help Modal -->
        <div v-if="showHelpModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            @click.self="showHelpModal = false">
            <div class="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl dark:bg-gray-900">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">Hướng dẫn</h2>
                    <button @click="showHelpModal = false"
                        class="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <span class="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>
                <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div class="flex gap-3">
                        <span class="material-symbols-outlined text-blue-500">join</span>
                        <div>
                            <p class="font-semibold">Ghép từ</p>
                            <p class="text-xs text-gray-500">Chọn cặp từ Đức-Việt đúng</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <span class="material-symbols-outlined text-purple-500">quiz</span>
                        <div>
                            <p class="font-semibold">Trắc nghiệm</p>
                            <p class="text-xs text-gray-500">Chọn nghĩa đúng trong 4 đáp án</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <span class="material-symbols-outlined text-orange-500">keyboard</span>
                        <div>
                            <p class="font-semibold">Điền từ</p>
                            <p class="text-xs text-gray-500">Gõ từ tiếng Đức, có thể xem gợi ý</p>
                        </div>
                    </div>
                </div>
                <button @click="showHelpModal = false"
                    class="mt-4 w-full rounded-lg bg-black py-2 font-semibold text-white">
                    Đóng
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearnStore } from '@/stores/learn'
import wordService from '@/services/word.service'
import deckService from '@/services/deck.service'
import type { Word } from '@/services/word.service'
import type { Deck } from '@/services/deck.service'

interface MatchItem {
    id: string
    word: string
    meaning: string
    matched: boolean
}

const route = useRoute()
const router = useRouter()
const learnStore = useLearnStore()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const deckId = ref('')
const words = ref<Word[]>([])
const deckInfo = ref<Deck | null>(null)
const showHelpModal = ref(false)

// Game State
const gameMode = ref<'match' | 'quiz' | 'type' | null>(null)
const gameCompleted = ref(false)
const score = ref(0)
const totalQuestions = ref(0)
const currentQuestionIndex = ref(0)

// Match Game State
const matchItems = ref<{ german: MatchItem[]; vietnamese: MatchItem[] }>({ german: [], vietnamese: [] })
const selectedGerman = ref<MatchItem | null>(null)
const selectedVietnamese = ref<MatchItem | null>(null)
const matchFeedback = ref<{ correct: boolean; ids: string[] } | null>(null)

// Quiz Game State
const quizQuestions = ref<Word[]>([])
const quizOptions = ref<Word[]>([])
const quizAnswered = ref(false)
const selectedQuizAnswer = ref<Word | null>(null)

// Type Game State
const typeQuestions = ref<Word[]>([])
const userTypeAnswer = ref('')
const typeAnswered = ref(false)
const typeAnswerCorrect = ref(false)
const typeInput = ref<HTMLInputElement | null>(null)
const showHint = ref(false)

// Computed
const gameModeName = computed(() => {
    switch (gameMode.value) {
        case 'match': return 'Ghép từ'
        case 'quiz': return 'Trắc nghiệm'
        case 'type': return 'Điền từ'
        default: return 'Luyện tập'
    }
})

const progressPercentage = computed(() => {
    if (totalQuestions.value === 0) return 0
    if (gameMode.value === 'match') {
        const matched = matchItems.value.german.filter(i => i.matched).length
        return matchItems.value.german.length > 0 ? (matched / matchItems.value.german.length) * 100 : 0
    }
    return ((currentQuestionIndex.value + (quizAnswered.value || typeAnswered.value ? 1 : 0)) / totalQuestions.value) * 100
})

const currentQuizWord = computed(() => quizQuestions.value[currentQuestionIndex.value])
const currentTypeWord = computed(() => typeQuestions.value[currentQuestionIndex.value])

const scorePercentage = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((score.value / totalQuestions.value) * 100)
})

const resultMessage = computed(() => {
    const pct = scorePercentage.value
    if (pct === 100) return 'Xuất sắc! 🎉'
    if (pct >= 80) return 'Tuyệt vời! 🌟'
    if (pct >= 60) return 'Khá tốt! 👍'
    if (pct >= 40) return 'Cố gắng thêm!'
    return 'Thử lại nhé!'
})

const resultIcon = computed(() => {
    const pct = scorePercentage.value
    if (pct >= 80) return 'emoji_events'
    if (pct >= 60) return 'thumb_up'
    if (pct >= 40) return 'trending_up'
    return 'refresh'
})

const resultClass = computed(() => {
    const pct = scorePercentage.value
    if (pct >= 80) return { bg: 'bg-green-100 dark:bg-green-900/30', icon: 'text-green-500', text: 'text-green-600' }
    if (pct >= 60) return { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-500', text: 'text-blue-600' }
    if (pct >= 40) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'text-yellow-500', text: 'text-yellow-600' }
    return { bg: 'bg-red-100 dark:bg-red-900/30', icon: 'text-red-500', text: 'text-red-600' }
})

const typeInputClass = computed(() => {
    if (!typeAnswered.value) {
        return 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-black dark:focus:border-white'
    }
    return typeAnswerCorrect.value
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
        : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
})

// Functions
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = shuffled[i] as T
        shuffled[i] = shuffled[j] as T
        shuffled[j] = temp
    }
    return shuffled
}

function handleBack() {
    if (gameMode.value && !gameCompleted.value) {
        changeMode()
    } else {
        router.push('/decks')
    }
}

function getHintText(word: string): string {
    if (!word) return ''
    const chars = word.split('')
    // Show first letter, last letter, and random 30% of middle letters
    return chars.map((char, index) => {
        if (index === 0 || index === chars.length - 1) return char
        if (char === ' ' || char === '-') return char
        return Math.random() < 0.3 ? char : '_'
    }).join(' ')
}

function toggleHint() {
    showHint.value = !showHint.value
}

function startGame(mode: 'match' | 'quiz' | 'type') {
    gameMode.value = mode
    gameCompleted.value = false
    score.value = 0
    currentQuestionIndex.value = 0
    showHint.value = false

    if (mode === 'match') initMatchGame()
    else if (mode === 'quiz') initQuizGame()
    else if (mode === 'type') initTypeGame()
}

function initMatchGame() {
    const gameWords = shuffleArray(words.value).slice(0, Math.min(6, words.value.length))
    totalQuestions.value = gameWords.length
    matchItems.value = {
        german: shuffleArray(gameWords.map(w => ({ id: w.id, word: w.word, meaning: w.meaning, matched: false }))),
        vietnamese: shuffleArray(gameWords.map(w => ({ id: w.id, word: w.word, meaning: w.meaning, matched: false })))
    }
    selectedGerman.value = null
    selectedVietnamese.value = null
    matchFeedback.value = null
}

function initQuizGame() {
    quizQuestions.value = shuffleArray(words.value).slice(0, Math.min(10, words.value.length))
    totalQuestions.value = quizQuestions.value.length
    quizAnswered.value = false
    selectedQuizAnswer.value = null
    generateQuizOptions()
}

function initTypeGame() {
    typeQuestions.value = shuffleArray(words.value).slice(0, Math.min(10, words.value.length))
    totalQuestions.value = typeQuestions.value.length
    userTypeAnswer.value = ''
    typeAnswered.value = false
    typeAnswerCorrect.value = false
    showHint.value = false
    nextTick(() => typeInput.value?.focus())
}

function generateQuizOptions() {
    const currentWord = quizQuestions.value[currentQuestionIndex.value]
    if (!currentWord) return
    const wrongOptions = shuffleArray(words.value.filter(w => w.id !== currentWord.id)).slice(0, 3)
    quizOptions.value = shuffleArray([currentWord, ...wrongOptions])
}

function selectMatchItem(column: 'german' | 'vietnamese', item: MatchItem) {
    if (item.matched) return
    matchFeedback.value = null

    if (column === 'german') {
        selectedGerman.value = selectedGerman.value?.id === item.id ? null : item
    } else {
        selectedVietnamese.value = selectedVietnamese.value?.id === item.id ? null : item
    }

    if (selectedGerman.value && selectedVietnamese.value) checkMatchPair()
}

function checkMatchPair() {
    if (!selectedGerman.value || !selectedVietnamese.value) return
    const isCorrect = selectedGerman.value.id === selectedVietnamese.value.id

    if (isCorrect) {
        const germanItem = matchItems.value.german.find(i => i.id === selectedGerman.value!.id)
        const vietnameseItem = matchItems.value.vietnamese.find(i => i.id === selectedVietnamese.value!.id)
        if (germanItem) germanItem.matched = true
        if (vietnameseItem) vietnameseItem.matched = true
        score.value++
        matchFeedback.value = { correct: true, ids: [selectedGerman.value.id] }
        if (matchItems.value.german.every(i => i.matched)) {
            setTimeout(() => { gameCompleted.value = true }, 500)
        }
    } else {
        matchFeedback.value = { correct: false, ids: [selectedGerman.value.id, selectedVietnamese.value.id] }
    }

    setTimeout(() => {
        selectedGerman.value = null
        selectedVietnamese.value = null
        matchFeedback.value = null
    }, isCorrect ? 300 : 600)
}

function getMatchItemClass(column: 'german' | 'vietnamese', item: MatchItem): string {
    const base = 'border-2 '
    if (item.matched) return base + 'bg-green-100 border-green-400 text-green-700 dark:bg-green-900/30 dark:text-green-400 opacity-50'

    const isSelected = column === 'german' ? selectedGerman.value?.id === item.id : selectedVietnamese.value?.id === item.id

    if (matchFeedback.value?.ids.includes(item.id)) {
        return base + (matchFeedback.value.correct
            ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-shake')
    }

    if (isSelected) return base + 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'

    return base + 'bg-surface-light border-gray-200 text-gray-700 hover:border-gray-400 dark:bg-surface-dark dark:border-gray-700 dark:text-gray-300'
}

function selectQuizAnswer(option: Word) {
    if (quizAnswered.value) return
    selectedQuizAnswer.value = option
    quizAnswered.value = true
    if (option.id === currentQuizWord.value?.id) score.value++
}

function getQuizOptionClass(option: Word): string {
    const base = 'border-2 '
    if (!quizAnswered.value) return base + 'bg-surface-light border-gray-200 text-gray-700 hover:border-gray-400 dark:bg-surface-dark dark:border-gray-700 dark:text-gray-300'

    const isCorrect = option.id === currentQuizWord.value?.id
    const isSelected = option.id === selectedQuizAnswer.value?.id

    if (isCorrect) return base + 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    if (isSelected && !isCorrect) return base + 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    return base + 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
}

function nextQuizQuestion() {
    if (currentQuestionIndex.value < quizQuestions.value.length - 1) {
        currentQuestionIndex.value++
        quizAnswered.value = false
        selectedQuizAnswer.value = null
        generateQuizOptions()
    } else {
        gameCompleted.value = true
    }
}

function checkTypeAnswer() {
    if (typeAnswered.value || !userTypeAnswer.value.trim()) return
    typeAnswered.value = true
    const correctAnswer = currentTypeWord.value?.word.toLowerCase().trim()
    const userAnswer = userTypeAnswer.value.toLowerCase().trim()
    typeAnswerCorrect.value = correctAnswer === userAnswer
    if (typeAnswerCorrect.value) score.value++
}

function nextTypeQuestion() {
    if (currentQuestionIndex.value < typeQuestions.value.length - 1) {
        currentQuestionIndex.value++
        userTypeAnswer.value = ''
        typeAnswered.value = false
        typeAnswerCorrect.value = false
        showHint.value = false
        nextTick(() => typeInput.value?.focus())
    } else {
        gameCompleted.value = true
    }
}

function restartGame() {
    if (gameMode.value) startGame(gameMode.value)
}

function changeMode() {
    gameMode.value = null
    gameCompleted.value = false
    score.value = 0
    currentQuestionIndex.value = 0
}

async function initialize() {
    loading.value = true
    error.value = null

    try {
        deckId.value = route.params.id as string
        if (!deckId.value) throw new Error('Không tìm thấy ID bộ từ vựng')

        // Try to use cached data from learnStore first
        const cache = learnStore.getCache(deckId.value)
        if (cache && Object.keys(cache.words).length > 0) {
            console.log('Using cached data for deck:', deckId.value)
            words.value = Object.values(cache.words)
            // Use cached deck info if available
            if (cache.deckInfo) {
                deckInfo.value = cache.deckInfo
            } else {
                // Only fetch deck info if not in cache
                const deckResponse = await deckService.getDeck(deckId.value)
                deckInfo.value = deckResponse.data
                // Update cache with deck info
                learnStore.setCache(deckId.value, {
                    wordIds: cache.wordIds,
                    words: cache.words,
                    totalWords: cache.totalWords,
                    currentIndex: cache.currentIndex,
                    deckInfo: deckResponse.data
                })
            }
        } else {
            console.log('Fetching fresh data for deck:', deckId.value)
            // Load fresh data
            const [deckResponse, wordsResponse] = await Promise.all([
                deckService.getDeck(deckId.value),
                wordService.getWordsByDeck(deckId.value)
            ])
            deckInfo.value = deckResponse.data
            words.value = wordsResponse.data

            // Cache the words for future use
            if (words.value.length > 0) {
                const wordsRecord: Record<string, Word> = {}
                words.value.forEach(w => wordsRecord[w.id] = w)
                learnStore.setCache(deckId.value, {
                    wordIds: words.value.map(w => w.id),
                    words: wordsRecord,
                    totalWords: words.value.length,
                    currentIndex: 0,
                    deckInfo: deckResponse.data
                })
            }
        }

        if (words.value.length === 0) {
            error.value = 'Bộ từ vựng này chưa có từ nào'
        }
    } catch (err: any) {
        console.error('Initialization error:', err)
        error.value = err.message || 'Đã xảy ra lỗi khi tải dữ liệu'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    initialize()
})
</script>

<style scoped>
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-4px);
    }

    75% {
        transform: translateX(4px);
    }
}

.animate-shake {
    animation: shake 0.3s ease-in-out;
}
</style>
