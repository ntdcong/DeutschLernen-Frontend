<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="handleClose">
        <Transition name="modal-scale" mode="out-in">
            <div v-if="isOpen"
                class="modal-content w-full max-w-2xl max-h-[100vh] overflow-y-auto rounded-2xl border border-border-light bg-white p-6 shadow-2xl sm:p-8 dark:border-border-dark dark:bg-surface-dark">

                <!-- Header -->
                <div class="mb-6 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full text-black">
                            <span class="material-symbols-outlined text-xl">psychology</span>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-black dark:text-white">Trợ lý AI</h3>
                        </div>
                    </div>
                    <button @click="handleClose"
                        class="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                        <span class="material-symbols-outlined text-gray-500">close</span>
                    </button>
                </div>

                <!-- Word Display -->
                <div v-if="word"
                    class="mb-6 rounded-xl border border-border-light bg-gradient-to-br from-primary/10 to-primary/5 p-4 dark:border-border-dark dark:from-primary/20 dark:to-primary/10">
                    <p class="text-center text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        Từ vựng
                    </p>
                    <p class="text-center text-2xl font-bold text-red-600">{{ word }}</p>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex flex-col items-center justify-center py-12">
                    <div class="spinner mb-4"></div>
                    <p class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">
                        {{ loadingMessage }}
                    </p>
                </div>

                <!-- AI Options -->
                <div v-else-if="!result" class="ai-options space-y-3">
                    <button @click="handleGenerateSentence" class="option-btn">
                        <div class="flex flex-1 items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full dark:bg-green-900/30">
                                <span
                                    class="material-symbols-outlined text-black dark:text-green-400">auto_awesome</span>
                            </div>
                            <div class="text-left">
                                <p class="font-semibold text-gray-900 dark:text-white">Tạo câu ví dụ</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Tạo câu ví dụ với ngữ pháp chi tiết
                                </p>
                            </div>
                        </div>
                    </button>

                    <button @click="handleGetFunFacts" class="option-btn">
                        <div class="flex flex-1 items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full dark:bg-blue-900/30">
                                <span class="material-symbols-outlined text-black dark:text-blue-400">celebration</span>
                            </div>
                            <div class="text-left">
                                <p class="font-semibold text-gray-900 dark:text-white">Sự thật thú vị</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Những điều thú vị về từ này</p>
                            </div>
                        </div>
                    </button>

                    <button @click="handleGetEtymology" class="option-btn">
                        <div class="flex flex-1 items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full dark:bg-purple-900/30">
                                <span
                                    class="material-symbols-outlined text-black dark:text-purple-400">history_edu</span>
                            </div>
                            <div class="text-left">
                                <p class="font-semibold text-gray-900 dark:text-white">Nguồn gốc từ</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Lịch sử và nguồn gốc của từ</p>
                            </div>
                        </div>
                    </button>

                    <button @click="handleGetPhrases" class="option-btn">
                        <div class="flex flex-1 items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full dark:bg-yellow-900/30">
                                <span
                                    class="material-symbols-outlined text-black dark:text-yellow-400">format_quote</span>
                            </div>
                            <div class="text-left">
                                <p class="font-semibold text-gray-900 dark:text-white">Cụm từ thông dụng</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Các cụm từ sử dụng từ này
                                </p>
                            </div>
                        </div>
                    </button>

                    <button @click="handleGetCommonMistakes" class="option-btn">
                        <div class="flex flex-1 items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full dark:bg-pink-900/30">
                                <span class="material-symbols-outlined text-black dark:text-pink-400">warning</span>
                            </div>
                            <div class="text-left">
                                <p class="font-semibold text-gray-900 dark:text-white">Lỗi thường gặp</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Những sai lầm cần tránh</p>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Result - Sentence -->
                <div v-else-if="result && result.type === 'sentence'" class="result-sentence space-y-4">
                    <div class="text-center">
                        <h4 class="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-primary">
                            <span class="material-symbols-outlined">check_circle</span>
                            Câu ví dụ đã được tạo
                        </h4>
                    </div>

                    <div class="space-y-3 border border-black rounded-xl bg-yellow-50 p-6 shadow-md dark:bg-gray-800">
                        <div class="flex items-start gap-2">
                            <p class="flex-1 text-lg font-semibold text-gray-900 dark:text-white">
                                {{ result.data.sentence }}
                            </p>
                        </div>

                        <div class="flex items-start gap-2">
                            <p class="flex-1 text-base text-gray-700 dark:text-gray-300">
                                {{ result.data.translation }}
                            </p>
                        </div>

                        <div class="flex items-start gap-2 rounded-lg bg-yellow-200 p-3 dark:bg-gray-900">
                            <span class="text-lg">📝</span>
                            <p class="flex-1 text-sm italic text-gray-600 dark:text-gray-400">
                                {{ result.data.grammarNote }}
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <button @click="handleSaveSentence"
                            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black text-white transition-transform hover:scale-105 active:scale-95">
                            <span class="material-symbols-outlined">favorite</span>
                            Lưu
                        </button>
                        <button @click="resetResult"
                            class="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                            Thoát
                        </button>
                    </div>
                </div>

                <!-- Result - Markdown -->
                <div v-else-if="result && result.type === 'markdown'" class="result-markdown space-y-4">
                    <div class="markdown-content" v-html="renderedMarkdown"></div>

                    <button @click="resetResult"
                        class="w-full border border-black rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-black/90">
                        Thoát
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import aiAssistantService from '@/services/ai-assistant.service'
import { marked } from 'marked'

interface Props {
    isOpen: boolean
    wordId: string
    word: string
}

interface Emits {
    (e: 'close'): void
    (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const loading = ref(false)
const loadingMessage = ref('Đang xử lý...')
const result = ref<any>(null)

// Computed
const renderedMarkdown = computed(() => {
    if (!result.value || result.value.type !== 'markdown') return ''
    return marked(result.value.data || '')
})

// Methods
function handleClose() {
    if (!loading.value) {
        emit('close')
        resetResult()
    }
}

function resetResult() {
    result.value = null
}

async function handleGenerateSentence() {
    loading.value = true
    loadingMessage.value = 'Đang tạo câu ví dụ... ⚡'

    try {
        const response = await aiAssistantService.generateSentence(props.wordId)
        result.value = {
            type: 'sentence',
            data: response.data
        }
    } catch (error: any) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

async function handleGetFunFacts() {
    loading.value = true
    loadingMessage.value = 'Đang tìm sự thật thú vị... 🧠'

    try {
        const response = await aiAssistantService.getFunFacts(props.wordId)
        result.value = {
            type: 'markdown',
            data: response.data
        }
    } catch (error: any) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

async function handleGetEtymology() {
    loading.value = true
    loadingMessage.value = 'Đang tra cứu nguồn gốc... 🧠'

    try {
        const response = await aiAssistantService.getEtymology(props.wordId)
        result.value = {
            type: 'markdown',
            data: response.data
        }
    } catch (error: any) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

async function handleGetPhrases() {
    loading.value = true
    loadingMessage.value = 'Đang tìm cụm từ... ⚡'

    try {
        const response = await aiAssistantService.getPhrases(props.wordId)
        result.value = {
            type: 'markdown',
            data: response.data
        }
    } catch (error: any) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

async function handleGetCommonMistakes() {
    loading.value = true
    loadingMessage.value = 'Đang phân tích lỗi thường gặp... 🧠'

    try {
        const response = await aiAssistantService.getCommonMistakes(props.wordId)
        result.value = {
            type: 'markdown',
            data: response.data
        }
    } catch (error: any) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

async function handleSaveSentence() {
    if (!result.value || result.value.type !== 'sentence') return

    loading.value = true
    loadingMessage.value = 'Đang lưu...'

    try {
        // Step 1: Create the sentence
        const createResponse = await aiAssistantService.saveFavoriteSentence({
            wordId: props.wordId,
            german: result.value.data.sentence,
            vietnamese: result.value.data.translation,
            grammarNote: result.value.data.grammarNote
        })

        // Step 2: Toggle favorite to true
        const sentenceId = createResponse.data.id
        await aiAssistantService.toggleFavorite(sentenceId)

        alert('✅ Đã lưu vào yêu thích!')
        emit('saved')
        handleClose()
    } catch (error: any) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

function handleError(error: any) {
    const status = error.response?.status
    let message = 'Đã có lỗi xảy ra'

    if (status === 401) {
        message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    } else if (status === 404) {
        message = 'Không tìm thấy từ vựng này.'
    } else if (status === 500) {
        message = 'Lỗi server. Vui lòng thử lại sau.'
    } else if (!navigator.onLine) {
        message = 'Không có kết nối internet.'
    }

    alert('❌ ' + message)
    console.error('AI Assistant Error:', error)
}
</script>

<style scoped>
/* Modal Animation */
.modal-scale-enter-active,
.modal-scale-leave-active {
    transition: all 0.3s ease;
}

.modal-scale-enter-from {
    opacity: 0;
    transform: scale(0.9);
}

.modal-scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

/* Option Button */
.option-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-radius: 0.75rem;
    border: 2px solid #e5e7eb;
    background: white;
    padding: 1rem;
    text-align: left;
    transition: all 0.3s ease;
    cursor: pointer;
}

.option-btn:hover {
    border-color: #667eea;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-0.25rem);
}

.dark .option-btn {
    border-color: #374151;
    background: #1f2937;
}

/* Spinner */
.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(102, 126, 234, 0.1);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Markdown Styles */
.markdown-content {
    color: #1f2937;
}

.dark .markdown-content {
    color: #f3f4f6;
}

.markdown-content :deep(h2),
.markdown-content :deep(h3) {
    color: #667eea;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
    font-size: 1.25rem;
}

.markdown-content :deep(h3) {
    font-size: 1.125rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
    padding-left: 1.25rem;
    margin: 0.5rem 0;
}

.markdown-content :deep(li) {
    font-size: 0.875rem;
    line-height: 1.625;
    margin-bottom: 0.25rem;
}

.markdown-content :deep(strong) {
    font-weight: 600;
    color: #111827;
}

.dark markdown-content :deep(strong) {
    color: #ffffff;
}

.markdown-content :deep(p) {
    margin-bottom: 0.75rem;
    line-height: 1.625;
}

.markdown-content :deep(code) {
    background: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
}

.dark .markdown-content :deep(code) {
    background: #1f2937;
}

/* Scrollbar */
.modal-content::-webkit-scrollbar {
    width: 6px;
}

.modal-content::-webkit-scrollbar-track {
    background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 9999px;
}

.dark .modal-content::-webkit-scrollbar-thumb {
    background: #4b5563;
}

.modal-content::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

.dark .modal-content::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
}
</style>
