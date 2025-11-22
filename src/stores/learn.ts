import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Word } from '@/services/word.service'

interface DeckCache {
  wordIds: string[]
  words: Record<string, Word>
  totalWords: number
  lastFetched: number
  currentIndex: number // To resume progress
}

export const useLearnStore = defineStore('learn', () => {
  // Cache by deck ID
  const deckCaches = ref<Record<string, DeckCache>>({})
  const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

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

  return {
    deckCaches,
    getCache,
    setCache,
    updateProgress,
    updateWord,
    addWords,
    clearCache
  }
})
