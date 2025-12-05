import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Word } from '@/services/word.service'
import type { Deck } from '@/services/deck.service'

interface DeckCache {
  wordIds: string[]
  words: Record<string, Word>
  totalWords: number
  lastFetched: number
  currentIndex: number // To resume progress
  deckInfo?: Deck // Store deck info too
}

const STORAGE_KEY = 'germanly_learn_cache'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Load from sessionStorage on startup
function loadFromStorage(): Record<string, DeckCache> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load learn cache from storage:', e)
  }
  return {}
}

// Save to sessionStorage
function saveToStorage(data: Record<string, DeckCache>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save learn cache to storage:', e)
  }
}

export const useLearnStore = defineStore('learn', () => {
  // Cache by deck ID - load from storage on init
  const deckCaches = ref<Record<string, DeckCache>>(loadFromStorage())

  // Watch for changes and persist
  watch(deckCaches, (newVal) => {
    saveToStorage(newVal)
  }, { deep: true })

  function getCache(deckId: string): DeckCache | null {
    const cache = deckCaches.value[deckId]
    if (cache && Date.now() - cache.lastFetched < CACHE_DURATION) {
      return cache
    }
    return null
  }

  function setCache(deckId: string, data: Omit<DeckCache, 'lastFetched'>) {
    deckCaches.value[deckId] = {
      ...data,
      lastFetched: Date.now()
    }
  }

  function updateProgress(deckId: string, index: number) {
    if (deckCaches.value[deckId]) {
      deckCaches.value[deckId].currentIndex = index
    }
  }

  function updateWord(deckId: string, wordId: string, updates: Partial<Word>) {
    const cache = deckCaches.value[deckId]
    if (cache && cache.words[wordId]) {
      cache.words[wordId] = { ...cache.words[wordId], ...updates }
    }
  }

  function addWords(deckId: string, newWords: Word[]) {
    const cache = deckCaches.value[deckId]
    if (cache) {
      newWords.forEach(word => {
        cache.words[word.id] = word
      })
    }
  }

  function clearCache(deckId: string) {
    delete deckCaches.value[deckId]
  }

  function clearAllCaches() {
    deckCaches.value = {}
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return {
    deckCaches,
    getCache,
    setCache,
    updateProgress,
    updateWord,
    addWords,
    clearCache,
    clearAllCaches
  }
})

