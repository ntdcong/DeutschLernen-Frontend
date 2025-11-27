<template>
    <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
        <Sidebar />

        <main class="flex-1 p-4 pt-2 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
            <div class="mx-auto max-w-6xl">
                <!-- Header -->
                <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 class="text-2xl font-bold dark:text-text-secondary-dark">
                            Danh sách các câu đã lưu
                        </h1>
                    </div>
                    <div class="flex items-center gap-3">
                        <button @click="fetchFavorites" :disabled="loading"
                            class="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-semibold text-black transition hover:bg-primary/90 disabled:opacity-50">
                            <span class="material-symbols-outlined">refresh</span>
                            <span>Làm mới</span>
                        </button>
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="mb-6">
                    <div class="relative">
                        <input v-model="searchQuery" type="text"
                            placeholder="Tìm kiếm câu... (tiếng Đức, tiếng Việt, hoặc ghi chú)"
                            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-12 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                        <span
                            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <button v-if="searchQuery" @click="searchQuery = ''"
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <span class="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                    <p v-if="searchQuery && filteredFavorites.length === 0" class="mt-2 text-sm text-gray-500">
                        Không tìm thấy kết quả nào cho "{{ searchQuery }}"
                    </p>
                    <p v-else-if="searchQuery" class="mt-2 text-sm text-gray-500">
                        Tìm thấy {{ filteredFavorites.length }} kết quả
                    </p>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center py-12">
                    <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>

                <!-- Error State -->
                <div v-else-if="error"
                    class="rounded-xl bg-red-100 p-6 text-center text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <p class="mb-4">{{ error }}</p>
                    <button @click="fetchFavorites"
                        class="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700">
                        Thử lại
                    </button>
                </div>

                <!-- Empty State -->
                <div v-else-if="favorites.length === 0"
                    class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border-light bg-surface-light py-16 text-center dark:border-border-dark dark:bg-surface-dark">
                    <div class="mb-6 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                        <span class="material-symbols-outlined text-6xl text-gray-400">favorite_border</span>
                    </div>
                    <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Chưa có câu yêu thích</h3>
                    <p class="mb-6 max-w-md text-sm text-gray-500 dark:text-gray-400">
                        Khi học từ vựng, bạn có thể dùng AI Trợ lý để tạo câu ví dụ và lưu vào đây nhé!
                    </p>
                    <router-link to="/decks"
                        class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-black transition-transform hover:scale-105 hover:bg-primary/90">
                        <span class="material-symbols-outlined">school</span>
                        Bắt đầu học
                    </router-link>
                </div>

                <!-- Favorites List -->
                <div v-else class="space-y-4">
                    <div v-for="sentence in filteredFavorites" :key="sentence.id"
                        class="group relative overflow-hidden rounded-2xl border border-border-light bg-surface-light p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-lg dark:border-border-dark dark:bg-surface-dark">

                        <!-- Delete Button -->
                        <button @click="handleDelete(sentence.id)"
                            class="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-yellow-400"
                            title="Xóa câu này">
                            <span class="material-symbols-outlined text-sm">delete</span>
                            <span class="hidden sm:inline">Xóa</span>
                        </button>

                        <div class="mr-10 space-y-4">
                            <!-- German Sentence -->
                            <div class="flex items-start gap-3">
                                <span class="text-2xl flex-shrink-0">🇩🇪</span>
                                <p class="flex-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    {{ sentence.german }}
                                </p>
                            </div>

                            <!-- Vietnamese Translation -->
                            <div class="flex items-start gap-3">
                                <span class="text-2xl flex-shrink-0">🇻🇳</span>
                                <p class="flex-1 text-base text-gray-700 dark:text-gray-300">
                                    {{ sentence.vietnamese }}
                                </p>
                            </div>

                            <!-- Grammar Note -->
                            <div class="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                                <span class="text-xl flex-shrink-0">📝</span>
                                <p class="flex-1 text-sm italic text-gray-600 dark:text-gray-400">
                                    {{ sentence.grammarNote }}
                                </p>
                            </div>

                            <!-- Footer -->
                            <div
                                class="flex items-center justify-between border-t border-border-light pt-4 text-xs text-text-secondary-light dark:border-border-dark dark:text-text-secondary-dark">
                                <span class="flex items-center gap-1">
                                    <span class="material-symbols-outlined text-sm">schedule</span>
                                    {{ formatDate(sentence.createdAt) }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <span class="material-symbols-outlined text-sm text-pink-500">favorite</span>
                                    Đã lưu
                                </span>
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
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import aiAssistantService, { type FavoriteSentence } from '@/services/ai-assistant.service'

const router = useRouter()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const favorites = ref<FavoriteSentence[]>([])
const searchQuery = ref('')

// Computed
const filteredFavorites = computed(() => {
    if (!searchQuery.value.trim()) {
        return favorites.value
    }

    const query = searchQuery.value.toLowerCase().trim()
    return favorites.value.filter(sentence =>
        sentence.german.toLowerCase().includes(query) ||
        sentence.vietnamese.toLowerCase().includes(query) ||
        sentence.grammarNote.toLowerCase().includes(query)
    )
})

// Methods
async function fetchFavorites() {
    loading.value = true
    error.value = null

    try {
        const response = await aiAssistantService.getFavoriteSentences()
        favorites.value = response.data
    } catch (err: any) {
        console.error('Failed to fetch favorites:', err)

        if (err.response?.status === 401) {
            error.value = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
            setTimeout(() => router.push('/login'), 2000)
        } else {
            error.value = 'Không thể tải danh sách câu yêu thích. Vui lòng thử lại.'
        }
    } finally {
        loading.value = false
    }
}

async function handleDelete(sentenceId: string) {
    const confirmed = confirm('Bạn có chắc muốn xóa câu này khỏi danh sách yêu thích?')

    if (!confirmed) return

    try {
        await aiAssistantService.deleteFavoriteSentence(sentenceId)

        // Remove from UI
        favorites.value = favorites.value.filter(s => s.id !== sentenceId)

        // Show success
        alert('✅ Đã xóa khỏi yêu thích!')
    } catch (err: any) {
        console.error('Failed to delete favorite:', err)
        alert('❌ Không thể xóa. Vui lòng thử lại.')
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
        return 'Hôm nay'
    } else if (diffInDays === 1) {
        return 'Hôm qua'
    } else if (diffInDays < 7) {
        return `${diffInDays} ngày trước`
    } else {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }
}

// Lifecycle
onMounted(() => {
    fetchFavorites()
})
</script>
