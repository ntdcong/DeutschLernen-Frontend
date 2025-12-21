<template>
    <div class="relative flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
        <Sidebar />

        <main class="flex-1 w-full transition-all duration-300">
            <div class="mx-auto max-w-4xl p-4 pt-16 sm:p-6 lg:p-8">

                <header class="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1
                            class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                            <span
                                class="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                                <span class="material-symbols-outlined text-2xl">edit_square</span>
                            </span>
                            Luyện viết tiếng Đức
                        </h1>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">
                            {{ selectedLevel ? `Trình độ đang chọn: ${selectedLevel}` : 'Chọn trình độ để bắt đầu' }}
                        </p>
                    </div>

                    <button v-if="selectedLevel" @click="resetLevel"
                        class="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                        <span
                            class="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
                        Chọn lại cấp độ
                    </button>
                </header>

                <div v-if="!selectedLevel" class="animate-fade-in">
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        <button v-for="level in levels" :key="level.value" @click="selectLevel(level.value)"
                            :disabled="loadingTopics"
                            class="group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white border-2 border-transparent shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 dark:bg-gray-800 dark:hover:border-primary/50">
                            <div
                                class="mb-3 flex size-14 items-center justify-center rounded-full bg-gray-50 group-hover:bg-primary/10 transition-colors dark:bg-gray-700">
                                <span class="text-2xl font-black" :class="level.colorClass">{{ level.value }}</span>
                            </div>
                            <span class="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary">{{
                                level.label }}</span>

                            <div v-if="loadingTopics && selectedLevel === level.value"
                                class="absolute inset-0 rounded-2xl bg-white/80 dark:bg-gray-800/80 flex items-center justify-center backdrop-blur-sm">
                                <div
                                    class="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent">
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <div v-else class="space-y-6 animate-slide-up">

                    <div class="sticky top-16 z-20 -mx-4 px-4 sm:static sm:mx-0 sm:px-0 sm:top-auto">
                        <div
                            class="rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 p-2 shadow-sm dark:bg-gray-800/90 dark:border-gray-700">
                            <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth">
                                <button @click="refreshTopics"
                                    class="flex-shrink-0 flex items-center justify-center size-10 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors dark:bg-gray-700 dark:text-gray-400"
                                    title="Đổi bộ đề khác">
                                    <span class="material-symbols-outlined text-xl"
                                        :class="{ 'animate-spin': loadingTopics }">sync</span>
                                </button>
                                <div class="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1"></div>

                                <button v-for="(topic, index) in topics" :key="topic.id" @click="selectTopic(topic)"
                                    class="flex-shrink-0 size-10 text-black rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 border-2"
                                    :class="getTopicButtonClass(topic.id)">
                                    {{ index + 1 }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedTopic" class="grid lg:grid-cols-5 gap-6">

                        <div class="lg:col-span-3 space-y-6">
                            <div
                                class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <span
                                        class="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                                        Câu {{topics.findIndex(t => t.id === selectedTopic?.id) + 1}} | Ngữ pháp: {{
                                            selectedTopic?.keyGrammar }}
                                    </span>
                                </div>

                                <h3
                                    class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
                                    {{ selectedTopic.sentence }}
                                </h3>

                                <div class="space-y-3">
                                    <p
                                        class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        <span class="material-symbols-outlined text-sm">lightbulb</span>
                                        Gợi ý từ vựng
                                    </p>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="hint in selectedTopic.hints" :key="hint"
                                            class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-primary/30 hover:text-primary transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                                            {{ hint }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="relative">
                                <textarea v-model="userText" rows="6" :disabled="evaluating"
                                    class="w-full rounded-3xl border-2 border-transparent bg-white p-6 shadow-sm ring-1 ring-gray-200 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:ring-gray-700 dark:text-white transition-all resize-none"
                                    placeholder="Viết câu trả lời của bạn vào đây..."></textarea>

                                <div class="absolute bottom-4 right-4 flex items-center gap-3">
                                    <span
                                        class="text-xs font-medium text-gray-400 bg-white/50 px-2 py-1 rounded-md dark:bg-gray-800/50">
                                        {{ userText.length }} ký tự
                                    </span>
                                    <button @click="submitWriting" :disabled="!userText.trim() || evaluating"
                                        class="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:shadow-none disabled:transform-none transition-all">
                                        <div v-if="evaluating"
                                            class="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin">
                                        </div>
                                        <span v-else>Kiểm tra</span>
                                        <span v-if="!evaluating" class="material-symbols-outlined text-lg">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="lg:col-span-2">
                            <div v-if="!evaluation"
                                class="h-full min-h-[200px] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6 text-gray-400 dark:border-gray-700">
                                <span class="material-symbols-outlined text-4xl mb-2 opacity-50">analytics</span>
                                <p class="text-sm font-medium">Kết quả phân tích sẽ hiển thị ở đây</p>
                            </div>

                            <div v-else class="space-y-4 animate-fade-in-up">
                                <div
                                    class="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 overflow-hidden relative">
                                    <div class="absolute top-0 right-0 p-4 opacity-10">
                                        <span class="material-symbols-outlined text-8xl"
                                            :class="evaluation.isLevelMet ? 'text-green-500' : 'text-orange-500'">verified</span>
                                    </div>

                                    <div class="relative z-10">
                                        <div class="flex items-end gap-2 mb-1">
                                            <span class="text-5xl font-black tracking-tighter"
                                                :class="getScoreColor(evaluation.score)">
                                                {{ evaluation.score }}
                                            </span>
                                            <span class="text-lg font-bold text-gray-400 mb-2">/100</span>
                                        </div>
                                        <p class="font-bold text-lg"
                                            :class="evaluation.isLevelMet ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">
                                            {{ evaluation.isLevelMet ? 'Rất tốt! Đạt yêu cầu.' : 'Cần cải thiện thêm.'
                                            }}
                                        </p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Đánh giá theo chuẩn {{ selectedLevel }}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    class="bg-white rounded-3xl shadow-sm ring-1 ring-gray-100 overflow-hidden dark:bg-gray-800 dark:ring-gray-700">
                                    <div v-if="evaluation.corrections?.length"
                                        class="p-5 border-b border-gray-100 dark:border-gray-700 bg-red-50/50 dark:bg-red-900/10">
                                        <h4
                                            class="text-xs font-bold uppercase tracking-wider text-red-600 mb-3 flex items-center gap-1">
                                            <span class="material-symbols-outlined text-sm">build</span>
                                            Lỗi cần sửa
                                        </h4>
                                        <ul class="space-y-3">
                                            <li v-for="(correction, idx) in evaluation.corrections" :key="idx"
                                                class="text-sm flex gap-3 items-start">
                                                <span
                                                    class="mt-1 size-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
                                                <span class="text-gray-700 dark:text-gray-300">
                                                    {{ renderCorrection(correction) }}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="p-5 space-y-4">
                                        <div>
                                            <h4 class="text-xs font-bold uppercase text-gray-400 mb-2">Ngữ pháp</h4>
                                            <p
                                                class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 p-3 rounded-xl dark:bg-gray-700/50">
                                                {{ evaluation.analysis?.grammar || 'Chưa có dữ liệu' }}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 class="text-xs font-bold uppercase text-gray-400 mb-2">Từ vựng & Diễn
                                                đạt</h4>
                                            <p
                                                class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 p-3 rounded-xl dark:bg-gray-700/50">
                                                {{ evaluation.analysis?.vocabulary }}
                                            </p>
                                        </div>
                                    </div>

                                    <div v-if="evaluation.upgrades?.length"
                                        class="bg-gradient-to-r from-primary/5 to-transparent p-5">
                                        <h4
                                            class="text-xs font-bold uppercase text-primary mb-2 flex items-center gap-1">
                                            <span class="material-symbols-outlined text-sm">auto_fix</span>
                                            Cách viết hay hơn
                                        </h4>
                                        <div class="text-sm">
                                            <p class="font-medium text-gray-800 dark:text-white italic mb-1">"{{
                                                evaluation.upgrades[0]?.text }}"</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">{{
                                                evaluation.upgrades[0]?.explanation }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                    <button @click="tryAgain"
                                        class="py-3 rounded-xl font-bold text-sm text-gray-600 bg-white ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all dark:bg-gray-800 dark:ring-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                                        Làm lại
                                    </button>
                                    <button @click="nextTopic"
                                        class="py-3 rounded-xl font-bold text-sm text-white bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-200 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group">
                                        Câu tiếp theo
                                        <span
                                            class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
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
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import writingPracticeService, {
    type WritingTopic,
    type EvaluationResponse
} from '@/services/writing-practice.service'

// --- CONSTANTS ---
const levels = [
    { value: 'A1', label: 'Sơ cấp 1', colorClass: 'text-emerald-500' },
    { value: 'A2', label: 'Sơ cấp 2', colorClass: 'text-teal-500' },
    { value: 'B1', label: 'Trung cấp 1', colorClass: 'text-indigo-500' },
    { value: 'B2', label: 'Trung cấp 2', colorClass: 'text-violet-500' },
    { value: 'C1', label: 'Cao cấp', colorClass: 'text-rose-500' }
] as const

// --- STATE ---
const selectedLevel = ref<string>('')
const topics = ref<WritingTopic[]>([])
const selectedTopic = ref<WritingTopic | null>(null)
const userText = ref<string>('')
const evaluation = ref<EvaluationResponse | null>(null)
const loadingTopics = ref(false)
const evaluating = ref(false)

// Helper to parse potential JSON string corrections
const renderCorrection = (correction: any): string => {
    if (typeof correction === 'string') {
        try {
            // Check if it's a JSON string
            if (correction.trim().startsWith('{')) {
                const parsed = JSON.parse(correction)
                return parsed.reason || parsed.fix || correction
            }
        } catch (e) {
            // Not JSON, return as is
        }
        return correction
    }
    return correction?.reason || correction?.fix || String(correction)
}

// --- ACTIONS ---

// Level Handling
const selectLevel = async (level: string) => {
    selectedLevel.value = level
    await fetchTopics()
}

const resetLevel = () => {
    selectedLevel.value = ''
    topics.value = []
    selectedTopic.value = null
    userText.value = ''
    evaluation.value = null
}

// Data Fetching
const fetchTopics = async () => {
    if (!selectedLevel.value) return

    loadingTopics.value = true
    try {
        const response = await writingPracticeService.getTopics(selectedLevel.value)
        if (response && response.topics && Array.isArray(response.topics)) {
            topics.value = response.topics
            // Select first topic automatically if available
            if (topics.value.length > 0) {
                selectedTopic.value = topics.value[0] || null
            }
        }
    } catch (error) {
        console.error('Failed to fetch topics:', error)
    } finally {
        loadingTopics.value = false
    }
}

const refreshTopics = async () => {
    evaluation.value = null
    userText.value = ''
    await fetchTopics()
}

// Topic Selection
const selectTopic = (topic: WritingTopic) => {
    selectedTopic.value = topic
    userText.value = ''
    evaluation.value = null
}

// Submission
const submitWriting = async () => {
    if (!userText.value.trim() || !selectedTopic.value || !selectedLevel.value) return

    evaluating.value = true
    try {
        const response = await writingPracticeService.evaluateWriting({
            text: userText.value.trim(),
            targetLevel: selectedLevel.value,
            intent: selectedTopic.value.sentence
        })
        evaluation.value = response
    } catch (error) {
        console.error('Failed to evaluate:', error)
    } finally {
        evaluating.value = false
    }
}

// Navigation Controls
const tryAgain = () => {
    // Keep the text so they can edit it, just clear evaluation
    evaluation.value = null
}

const nextTopic = () => {
    const currentIndex = topics.value.findIndex(t => t.id === selectedTopic.value?.id)
    if (currentIndex < topics.value.length - 1) {
        selectedTopic.value = topics.value[currentIndex + 1] || null
    } else {
        // Loop back to start or show completion (here loop)
        selectedTopic.value = topics.value[0] || null
    }
    userText.value = ''
    evaluation.value = null
}

// --- HELPERS ---
const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 dark:text-emerald-400'
    if (score >= 75) return 'text-blue-500 dark:text-blue-400'
    if (score >= 60) return 'text-orange-500 dark:text-orange-400'
    return 'text-red-500 dark:text-red-400'
}

const getTopicButtonClass = (topicId: string) => {
    const isSelected = selectedTopic.value?.id === topicId
    return isSelected
        ? 'bg-primary text-black border-black shadow-lg shadow-primary/30 scale-110 z-10'
        : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50 hover:text-primary dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
}
</script>

<style scoped>
/* Utility for hiding scrollbar but allowing scroll */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Custom Animations */
.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}

.animate-slide-up {
    animation: slideUp 0.5s ease-out;
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
