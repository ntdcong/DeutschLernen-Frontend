<template>
    <div class="relative flex min-h-screen w-full bg-white dark:bg-gray-900 transition-colors duration-300">
        <Sidebar />

        <main class="flex-1 w-full transition-all duration-300">
            <div class="mx-auto max-w-6xl p-4 pt-16 sm:p-6 lg:p-8">

                <!-- Header -->
                <header class="mb-8">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1
                                class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                                <span
                                    class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                                    <span class="material-symbols-outlined text-2xl">record_voice_over</span>
                                </span>
                                Luyện phát âm - Shadowing
                            </h1>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">
                                Nghe và đọc theo để cải thiện khả năng nói
                            </p>
                        </div>
                    </div>
                </header>

                <!-- Filters -->
                <div class="mb-6 flex flex-wrap gap-3">
                    <!-- Level Filter -->
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Cấp độ:</span>
                        <button v-for="level in levels" :key="level"
                            @click="selectedLevel = selectedLevel === level ? null : level"
                            class="px-4 py-2 rounded-xl text-sm font-bold transition-all border-2"
                            :class="selectedLevel === level
                                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/30'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-red-600/50 hover:text-red-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'">
                            {{ level }}
                        </button>
                    </div>

                    <!-- Category Filter -->
                    <div v-if="categories.length > 0" class="flex items-center gap-2">
                        <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Chủ đề:</span>
                        <select v-model="selectedCategory"
                            class="px-4 py-2 rounded-xl text-sm font-bold bg-white border-2 border-gray-200 text-gray-600 hover:border-primary/50 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                            <option :value="null">Tất cả</option>
                            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                        </select>
                    </div>

                    <!-- Refresh Button -->
                    <button @click="fetchTexts"
                        class="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-primary/50 hover:text-primary transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                        <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': loading }">sync</span>
                        Làm mới
                    </button>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center py-12">
                    <div
                        class="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 dark:border-white border-t-transparent">
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="filteredTexts.length === 0"
                    class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white/50 py-16 text-center dark:border-gray-700 dark:bg-gray-800/50">
                    <div class="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                        <span class="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Không tìm thấy bài tập</h3>
                    <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        Thử thay đổi bộ lọc để xem thêm nội dung
                    </p>
                </div>

                <!-- Texts Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="text in filteredTexts" :key="text.id" @click="selectText(text)"
                        class="group cursor-pointer bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-red-600/50 hover:shadow-lg transition-all dark:bg-gray-800 dark:border-gray-700">
                        <div class="flex items-start justify-between mb-3">
                            <span
                                class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase dark:bg-blue-900/30 dark:text-blue-300">
                                {{ text.level }}
                            </span>
                            <span v-if="text.category" class="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {{ text.category }}
                            </span>
                        </div>

                        <h3
                            class="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                            {{ text.title }}
                        </h3>

                        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            {{ text.content }}
                        </p>

                        <div class="flex items-center gap-3 text-xs text-gray-400">
                            <span class="flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">play_circle</span>
                                {{ text.practiceCount }} lượt
                            </span>
                            <span class="flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">schedule</span>
                                {{ text.content.split(' ').length }} từ
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Practice Modal -->
                <div v-if="selectedText"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    @click.self="closeModal">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
                        <!-- Modal Header -->
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span
                                            class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase dark:bg-blue-900/30 dark:text-blue-300">
                                            {{ selectedText.level }}
                                        </span>
                                        <span v-if="selectedText.category"
                                            class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ selectedText.category }}
                                        </span>
                                    </div>
                                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                        {{ selectedText.title }}
                                    </h2>
                                </div>
                                <button @click="closeModal"
                                    class="size-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <span class="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        <!-- Modal Content -->
                        <div class="flex-1 overflow-y-auto p-6">
                            <!-- Browser Warning -->
                            <div
                                class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
                                <p class="font-medium">💡 Lưu ý: Tính năng đánh dấu từ hoạt động tốt nhất trên
                                    <strong>Chrome</strong> hoặc <strong>Edge</strong>.
                                </p>
                                <p class="text-xs mt-1">Firefox có thể không hỗ trợ. Nếu không thấy từ được đánh dấu,
                                    hãy thử Chrome.</p>
                            </div>

                            <!-- Text Display with Highlighting -->
                            <div class="mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                <p class="text-2xl leading-relaxed tracking-wide">
                                    <span v-for="(word, index) in words" :key="index"
                                        class="inline-block mx-1.5 my-1 px-2 py-1 rounded-lg transition-all duration-200"
                                        :class="{
                                            'bg-yellow-300 text-gray-900 font-bold scale-110 shadow-lg': currentWordIndex === index,
                                            'text-gray-400 dark:text-gray-600': currentWordIndex > index,
                                            'text-gray-900 dark:text-white': currentWordIndex < index
                                        }">
                                        {{ word }}
                                    </span>
                                </p>
                            </div>

                            <!-- Controls -->
                            <div class="space-y-4">
                                <!-- Play/Pause & Progress -->
                                <div class="flex items-center gap-4">
                                    <button @click="togglePlay"
                                        class="size-16 flex items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:bg-gray-800 transition-all dark:bg-white dark:text-gray-900">
                                        <span class="material-symbols-outlined text-3xl">
                                            {{ isSpeaking ? 'pause' : 'play_arrow' }}
                                        </span>
                                    </button>

                                    <div class="flex-1">
                                        <div
                                            class="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                            <span>Tiến độ: {{ Math.round(progress) }}%</span>
                                            <span>{{ currentWordIndex + 1 }} / {{ words.length }} từ</span>
                                        </div>
                                        <!-- Debug Info -->
                                        <div class="text-xs text-gray-400 mb-1">
                                            Current index: {{ currentWordIndex }} | Speaking: {{ isSpeaking }}
                                        </div>
                                        <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                                                :style="{ width: `${progress}%` }"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Speed & Voice Controls -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Tốc
                                            độ</label>
                                        <select v-model="speechRate" @change="onSpeedChange"
                                            class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-sm font-medium hover:border-gray-400 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <option value="0.75">0.75x (Chậm)</option>
                                            <option value="1">1x (Bình thường)</option>
                                            <option value="1.25">1.25x (Nhanh)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Giọng
                                            đọc</label>
                                        <select v-model="selectedVoice"
                                            class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-sm font-medium hover:border-gray-400 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <option v-for="voice in germanVoices" :key="voice.name" :value="voice">
                                                {{ voice.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="grid grid-cols-2 gap-3 pt-4">
                                    <button @click="resetPractice"
                                        class="py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                        Làm lại
                                    </button>
                                    <button @click="completePractice"
                                        class="py-3 rounded-xl font-bold text-sm text-white bg-gray-900 hover:bg-gray-800 shadow-lg transition-all flex items-center justify-center gap-2 dark:bg-white dark:text-gray-900">
                                        Hoàn thành
                                        <span class="material-symbols-outlined text-lg">check_circle</span>
                                    </button>
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
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import shadowingService, { type ShadowingText } from '@/services/shadowing.service'

// --- STATE ---
const levels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const
const selectedLevel = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)
const categories = ref<string[]>([])
const texts = ref<ShadowingText[]>([])
const loading = ref(false)

// Practice Modal State
const selectedText = ref<ShadowingText | null>(null)
const currentWordIndex = ref(-1)
const isSpeaking = ref(false)
const speechRate = ref(1)
const selectedVoice = ref<SpeechSynthesisVoice | null>(null)
const germanVoices = ref<SpeechSynthesisVoice[]>([])

// Word-by-word TTS state
const pausedAtWordIndex = ref(-1)

// --- COMPUTED ---
const filteredTexts = computed(() => {
    let result = texts.value
    if (selectedLevel.value) {
        result = result.filter(t => t.level === selectedLevel.value)
    }
    if (selectedCategory.value) {
        result = result.filter(t => t.category === selectedCategory.value)
    }
    return result
})

const words = computed(() => {
    if (!selectedText.value) return []
    return selectedText.value.content.split(/\s+/)
})

const progress = computed(() => {
    if (words.value.length === 0) return 0
    return ((currentWordIndex.value + 1) / words.value.length) * 100
})

// --- METHODS ---
async function fetchTexts() {
    loading.value = true
    try {
        const response = await shadowingService.getTexts(
            selectedLevel.value || undefined,
            selectedCategory.value || undefined
        )
        texts.value = response.data
    } catch (error) {
        console.error('Failed to fetch texts:', error)
    } finally {
        loading.value = false
    }
}

async function fetchCategories() {
    try {
        const response = await shadowingService.getCategories()
        categories.value = response.data
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

function selectText(text: ShadowingText) {
    selectedText.value = text
    resetPractice()
}

function closeModal() {
    if (isSpeaking.value) {
        stopSpeaking()
    }
    selectedText.value = null
    resetPractice()
}

function loadGermanVoices() {
    const voices = speechSynthesis.getVoices()
    germanVoices.value = voices.filter(v => v.lang.startsWith('de'))

    if (germanVoices.value.length > 0 && !selectedVoice.value) {
        const preferredVoice = germanVoices.value.find(
            v => v.name.includes('Google') || v.name.includes('Female')
        )
        selectedVoice.value = preferredVoice ?? germanVoices.value[0] ?? null
    }
}

// Calculate pause between words based on speech rate and punctuation
function calculatePauseDuration(currentWord: string, nextWord: string | undefined, rate: number): number {
    // Base pause decreases with faster speech rate
    // 0.75x → 200ms, 1x → 150ms, 1.25x → 120ms
    const basePause = Math.round(180 / rate)

    // Check if current word ends with punctuation
    const hasPunctuation = /[.,!?;:]$/.test(currentWord)

    if (hasPunctuation) {
        // Longer pause after punctuation for natural flow
        return basePause * 2
    }

    return basePause
}

// Word-by-word TTS - speaks each word individually for perfect highlighting
function speakWordByWord(wordIndex: number) {
    if (!selectedText.value || wordIndex >= words.value.length) {
        // Finished all words
        isSpeaking.value = false
        currentWordIndex.value = words.value.length - 1
        console.log('✅ Finished all words!')
        return
    }

    const word = words.value[wordIndex]
    console.log(`🗣️ Speaking [${wordIndex}]: "${word}"`)

    // Highlight this word NOW
    currentWordIndex.value = wordIndex

    // Create utterance for just this one word
    const wordUtterance = new SpeechSynthesisUtterance(word)

    if (selectedVoice.value) {
        wordUtterance.voice = selectedVoice.value
    }

    wordUtterance.rate = speechRate.value
    wordUtterance.pitch = 1
    wordUtterance.volume = 1

    wordUtterance.onend = () => {
        // Move to next word after calculated pause
        if (isSpeaking.value) {
            const nextWord = words.value[wordIndex + 1]
            const pauseMs = calculatePauseDuration(word, nextWord, speechRate.value)

            setTimeout(() => {
                if (isSpeaking.value) {
                    speakWordByWord(wordIndex + 1)
                }
            }, pauseMs)
        }
    }

    wordUtterance.onerror = (event) => {
        // Ignore interrupted errors when pausing
        if (event.error === 'interrupted') {
            console.log('⏸️ Interrupted (normal for pause)')
            return
        }
        console.error('❌ Error:', event.error)
        isSpeaking.value = false
    }

    // Speak this word
    speechSynthesis.speak(wordUtterance)
}

function startSpeaking() {
    console.log('🎬 Starting word-by-word speech')

    // Cancel any existing
    speechSynthesis.cancel()

    // Start from beginning
    currentWordIndex.value = 0
    pausedAtWordIndex.value = -1
    isSpeaking.value = true

    // Small delay then start
    setTimeout(() => {
        if (isSpeaking.value) {
            speakWordByWord(0)
        }
    }, 100)
}

function pauseSpeaking() {
    console.log('⏸️ Pausing at word', currentWordIndex.value)

    pausedAtWordIndex.value = currentWordIndex.value
    isSpeaking.value = false
    speechSynthesis.cancel()
}

function resumeSpeaking() {
    console.log('▶️ Resuming from word', pausedAtWordIndex.value)

    // Resume from paused position
    const resumeFrom = pausedAtWordIndex.value >= 0 ? pausedAtWordIndex.value : currentWordIndex.value
    isSpeaking.value = true

    setTimeout(() => {
        if (isSpeaking.value) {
            speakWordByWord(Math.max(0, resumeFrom))
        }
    }, 80)
}

function stopSpeaking() {
    console.log('⏹️ Stopping speech')

    isSpeaking.value = false
    speechSynthesis.cancel()
    pausedAtWordIndex.value = -1
}

function togglePlay() {
    console.log('🎬 Toggle, isSpeaking:', isSpeaking.value)

    if (isSpeaking.value) {
        pauseSpeaking()
    } else {
        // Check if resuming or starting fresh
        if (pausedAtWordIndex.value >= 0 || currentWordIndex.value > 0) {
            resumeSpeaking()
        } else {
            startSpeaking()
        }
    }
}

function onSpeedChange() {
    console.log('🎚️ Speed changed to', speechRate.value)

    if (isSpeaking.value) {
        // Pause, save position, then resume with new speed
        const currentWord = currentWordIndex.value
        pauseSpeaking()

        setTimeout(() => {
            pausedAtWordIndex.value = currentWord
            resumeSpeaking()
        }, 100)
    }
}

function resetPractice() {
    stopSpeaking()
    currentWordIndex.value = -1
    pausedAtWordIndex.value = -1
}

async function completePractice() {
    if (!selectedText.value) return

    try {
        await shadowingService.saveProgress({
            shadowingTextId: selectedText.value.id
        })

        console.log('Progress saved!')
        await fetchTexts()
        closeModal()
    } catch (error) {
        console.error('Failed to save progress:', error)
    }
}

// --- LIFECYCLE ---
onMounted(async () => {
    await fetchTexts()
    await fetchCategories()

    loadGermanVoices()
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadGermanVoices
    }
})

watch([selectedLevel, selectedCategory], () => {
    fetchTexts()
})
</script>

<style scoped>
@keyframes scale-up {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-scale-up {
    animation: scale-up 0.2s ease-out;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
}
</style>
