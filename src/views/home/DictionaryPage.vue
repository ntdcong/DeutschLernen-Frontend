<template>
  <div class="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
    <Sidebar />

    <main class="flex-1 p-4 pt-16 text-text-primary-light sm:p-6 lg:p-8 lg:pt-8 dark:text-text-primary-dark">
      <div class="mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-8">
          <h1
            class="text-3xl font-black leading-tight tracking-[-0.033em] text-primary-black md:text-4xl dark:text-white">
            Từ Điển
          </h1>
        </div>

        <!-- Search Box -->
        <div class="mb-8 border border-black rounded-2xl bg-surface-light p-6 shadow-sm dark:bg-surface-dark">
          <div class="flex flex-col gap-4 md:flex-row md:items-stretch">
            <!-- Language Switcher -->
            <div class="flex gap-2 rounded-xl bg-background-light p-1 dark:bg-background-dark">
              <button
                :class="['flex-1 rounded-lg border border-black px-4 py-2.5 font-bold text-sm transition-all',
                  sourceLang === 'de'
                    ? 'bg-black text-white shadow-md'
                    : 'text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-gray-800']"
                @click="sourceLang = 'de'">
                Đức
              </button>
              <button
                :class="['flex-1 rounded-lg border border-black px-4 py-2.5 font-bold text-sm transition-all',
                  sourceLang === 'vi'
                    ? 'bg-black text-white shadow-md'
                    : 'text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-gray-800']"
                @click="sourceLang = 'vi'">
                Việt
              </button>
            </div>

            <!-- Search Input -->
            <div class="relative flex-1">
              <input v-model="searchTerm" type="text"
                :placeholder="sourceLang === 'de' ? 'Nhập từ tiếng Đức...' : 'Nhập từ tiếng Việt...'"
                class="w-full rounded-xl border border-black bg-background-light py-3 pl-4 pr-12 font-medium placeholder-text-secondary-light focus:ring-2 focus:ring-primary/50 dark:bg-background-dark dark:placeholder-text-secondary-dark"
                @keyup.enter="handleSearch" @input="handleInputChange" />
              <button v-if="searchTerm"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                @click="clearSearch">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <!-- Search Button -->
            <button
              class="flex items-center justify-center gap-2 border border-black rounded-xl bg-primary px-6 py-3 font-bold text-black shadow-lg shadow-primary/30 transition-all hover:bg-yellow-400"
              @click="handleSearch" :disabled="isLoading || !searchTerm.trim()">
              <span v-if="isLoading" class="material-symbols-outlined animate-spin">refresh</span>
              <span v-else class="material-symbols-outlined">search</span>
              Tìm kiếm
            </button>
          </div>

          <!-- Recent Searches -->
          <div v-if="showSuggestions && recentSearches.length > 0"
            class="mt-4 border-t border-border-light pt-4 dark:border-border-dark">
            <p class="mb-2 text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark">Tìm kiếm gần đây
            </p>
            <div class="flex flex-wrap gap-2">
              <button v-for="(term, index) in recentSearches.slice(0, 5)" :key="index"
                class="flex items-center gap-2 rounded-lg bg-background-light px-3 py-1.5 text-sm font-medium text-text-primary-light transition-colors hover:bg-gray-200 dark:bg-background-dark dark:text-text-primary-dark dark:hover:bg-gray-700"
                @click="selectSuggestion(term)">
                <span class="material-symbols-outlined text-base opacity-50">history</span>
                {{ term }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="hasSearched">
          <!-- Loading -->
          <div v-if="isLoading" class="flex justify-center py-20">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>

          <!-- No Results -->
          <div v-else-if="!searchResult?.found"
            class="flex flex-col items-center justify-center rounded-2xl bg-surface-light py-16 text-center dark:bg-surface-dark">
            <div class="mb-4 rounded-full bg-gray-50 p-6 dark:bg-gray-800">
              <span class="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">search_off</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Không tìm thấy kết quả</h3>
            <p class="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Không có kết quả nào cho từ "{{ searchedTerm }}"
            </p>
          </div>

          <!-- Results -->
          <div v-else class="space-y-6">
            <div v-for="(result, index) in searchResult.result" :key="result._id || index"
              class="overflow-hidden rounded-2xl border border-black bg-surface-light shadow-md dark:bg-surface-dark">
              <!-- Word Header -->
              <div class="border-b-2 border-gray-50 p-6 dark:border-gray-800">
                <div class="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div class="flex-1">
                    <h2 class="mb-2 text-3xl font-bold text-primary-black dark:text-white">{{ result.word }}</h2>
                    <div v-if="result.pronounce?.de"
                      class="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark">
                      <span class="material-symbols-outlined text-xl">volume_up</span>
                      <span class="font-mono italic">{{ result.pronounce.de }}</span>
                    </div>
                  </div>

                  <!-- Conjugation (for nouns) with color coding -->
                  <div v-if="result.conjugation" class="flex flex-wrap gap-2">
                    <div :class="[
                      'rounded-lg border-2 px-3 py-2',
                      result.conjugation.gt?.w === 'die' ? 'border-red-500 bg-red-50 dark:bg-red-950/30' :
                        result.conjugation.gt?.w === 'das' ? 'border-green-500 bg-green-50 dark:bg-green-950/30' :
                          result.conjugation.gt?.w === 'der' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' :
                            'border-gray-300 bg-gray-50 dark:bg-gray-800'
                    ]">
                      <p class="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">Giống</p>
                      <p :class="[
                        'text-xl font-black',
                        result.conjugation.gt?.w === 'die' ? 'text-red-600 dark:text-red-400' :
                          result.conjugation.gt?.w === 'das' ? 'text-green-600 dark:text-green-400' :
                            result.conjugation.gt?.w === 'der' ? 'text-blue-600 dark:text-blue-400' :
                              'text-gray-600 dark:text-gray-400'
                      ]">
                        {{ result.conjugation.gt?.w }}
                      </p>
                    </div>
                    <div v-if="result.conjugation.si?.w"
                      class="rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2 dark:bg-gray-800">
                      <p class="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">Số ít</p>
                      <p class="font-bold text-gray-700 dark:text-gray-300">{{ result.conjugation.si.w }}</p>
                    </div>
                    <div v-if="result.conjugation.sn?.w"
                      class="rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2 dark:bg-gray-800">
                      <p class="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400">Số nhiều</p>
                      <p class="font-bold text-gray-700 dark:text-gray-300">{{ result.conjugation.sn.w }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Word Content -->
              <div class="p-6">
                <div v-for="(content, cIndex) in result.content" :key="cIndex" class="mb-6 last:mb-0">
                  <!-- Part of Speech -->
                  <div v-if="content.kind"
                    class="mb-4 inline-block rounded-lg bg-primary px-3 py-1 text-sm font-bold text-black">
                    {{ content.kind }}
                  </div>

                  <!-- Meanings -->
                  <div class="space-y-4">
                    <div v-for="(meaning, mIndex) in content.means" :key="mIndex" class="pl-4">
                      <div class="mb-2 flex gap-3">
                        <span class="text-xl font-black text-primary">{{ mIndex + 1 }}.</span>
                        <span class="flex-1 text-xl font-black text-primary-black dark:text-white">
                          {{ meaning.mean }}
                        </span>
                      </div>

                      <!-- Examples -->
                      <div v-if="meaning.examples.length > 0" class="ml-6 mt-2">
                        <button
                          class="mb-2 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                          @click="toggleExamples(index, cIndex, mIndex)">
                          <span class="material-symbols-outlined text-base">
                            {{ isExamplesExpanded(index, cIndex, mIndex) ? 'expand_less' : 'expand_more' }}
                          </span>
                          {{ meaning.examples.length }} ví dụ
                        </button>

                        <transition name="expand">
                          <div v-show="isExamplesExpanded(index, cIndex, mIndex)" class="space-y-2">
                            <div
                              v-for="(example, eIndex) in meaning.examples.slice(0, showAllExamples(index, cIndex, mIndex) ? undefined : 3)"
                              :key="example._id || eIndex"
                              class="rounded-lg border-l-4 border-primary bg-gray-50 p-3 dark:bg-gray-800">
                              <p class="mb-1 font-semibold text-primary-black dark:text-white">{{ example.e }}</p>
                              <p class="text-sm italic text-text-secondary-light dark:text-text-secondary-dark">
                                {{ example.m }}
                              </p>
                            </div>

                            <button v-if="meaning.examples.length > 3 && isExamplesExpanded(index, cIndex, mIndex)"
                              class="w-full rounded-lg border-2 border-dashed border-gray-300 bg-white py-2 text-sm font-semibold text-primary hover:border-primary hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                              @click="toggleShowAll(index, cIndex, mIndex)">
                              {{ showAllExamples(index, cIndex, mIndex)
                                ? 'Thu gọn'
                                : `Xem thêm ${meaning.examples.length - 3} ví dụ`
                              }}
                            </button>
                          </div>
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Additional Info -->
                <div v-if="result.word_family || result.keyword"
                  class="mt-6 border-t-2 border-gray-50 pt-6 dark:border-gray-800">
                  <div v-if="result.keyword" class="mb-3">
                    <p class="mb-2 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark">Từ liên
                      quan:</p>
                    <p class="text-text-primary-light dark:text-text-primary-dark">{{ result.keyword }}</p>
                  </div>
                  <div v-if="result.word_family">
                    <p class="mb-2 text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark">Họ từ:</p>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(family, fIndex) in result.word_family" :key="fIndex"
                        class="rounded-lg bg-gray-100 px-3 py-1 text-sm text-text-primary-light dark:bg-gray-800 dark:text-text-primary-dark">
                        {{ family.content.join(', ') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Welcome State -->
        <div v-else class="text-center">
          <div class="mx-auto mb-8 inline-block rounded-full bg-primary/10 p-8">
            <span class="material-symbols-outlined text-7xl text-primary">menu_book</span>
          </div>
          <h2 class="mb-2 text-2xl font-bold text-primary-black dark:text-white">Bắt đầu tra từ</h2>
          <p class="mb-8 text-text-secondary-light dark:text-text-secondary-dark">
            Nhập từ hoặc cụm từ bạn muốn tra cứu vào ô tìm kiếm phía trên
          </p>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import dictionaryService, { type DictionaryResponse } from '@/services/dictionaryService'

// State
const searchTerm = ref('')
const sourceLang = ref<'de' | 'vi'>('de')
const isLoading = ref(false)
const hasSearched = ref(false)
const searchResult = ref<DictionaryResponse | null>(null)
const searchedTerm = ref('')
const showSuggestions = ref(false)
const recentSearches = ref<string[]>([])
const expandedExamples = ref<Set<string>>(new Set())
const showAllExamplesSet = ref<Set<string>>(new Set())

// Load recent searches from localStorage
const loadRecentSearches = () => {
  const saved = localStorage.getItem('dictionaryRecentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }
}

// Save to recent searches
const saveToRecentSearches = (term: string) => {
  const searches = recentSearches.value.filter(s => s !== term)
  searches.unshift(term)
  recentSearches.value = searches.slice(0, 10)
  localStorage.setItem('dictionaryRecentSearches', JSON.stringify(recentSearches.value))
}

// Initialize
loadRecentSearches()

// Methods
const handleSearch = async () => {
  if (!searchTerm.value.trim() || isLoading.value) return

  isLoading.value = true
  hasSearched.value = true
  searchedTerm.value = searchTerm.value.trim()
  showSuggestions.value = false

  try {
    searchResult.value = await dictionaryService.search({
      word: searchedTerm.value,
      source_lang: sourceLang.value
    })

    if (searchResult.value.found) {
      saveToRecentSearches(searchedTerm.value)
    }
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  showSuggestions.value = false
}

const handleInputChange = () => {
  showSuggestions.value = searchTerm.value.length > 0 && recentSearches.value.length > 0
}

const selectSuggestion = (term: string) => {
  searchTerm.value = term
  showSuggestions.value = false
  handleSearch()
}

const getExampleKey = (resultIndex: number, contentIndex: number, meaningIndex: number) => {
  return `${resultIndex}-${contentIndex}-${meaningIndex}`
}

const toggleExamples = (resultIndex: number, contentIndex: number, meaningIndex: number) => {
  const key = getExampleKey(resultIndex, contentIndex, meaningIndex)
  if (expandedExamples.value.has(key)) {
    expandedExamples.value.delete(key)
  } else {
    expandedExamples.value.add(key)
  }
}

const isExamplesExpanded = (resultIndex: number, contentIndex: number, meaningIndex: number) => {
  return expandedExamples.value.has(getExampleKey(resultIndex, contentIndex, meaningIndex))
}

const toggleShowAll = (resultIndex: number, contentIndex: number, meaningIndex: number) => {
  const key = getExampleKey(resultIndex, contentIndex, meaningIndex)
  if (showAllExamplesSet.value.has(key)) {
    showAllExamplesSet.value.delete(key)
  } else {
    showAllExamplesSet.value.add(key)
  }
}

const showAllExamples = (resultIndex: number, contentIndex: number, meaningIndex: number) => {
  return showAllExamplesSet.value.has(getExampleKey(resultIndex, contentIndex, meaningIndex))
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
