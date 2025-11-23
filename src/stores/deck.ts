import { ref } from 'vue'
import { defineStore } from 'pinia'
import deckService, { type Deck, type CreateDeckDto, type UpdateDeckDto } from '@/services/deck.service'

export const useDeckStore = defineStore('deck', () => {
  const decks = ref<Deck[]>([])
  const currentDeck = ref<Deck | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const lastFetched = ref<number | null>(null)
  const CACHE_DURATION = 20 * 60 * 1000 // 5 minutes

  // Fetch all decks
  async function fetchDecks(forceRefresh = false) {
    // Return cached data if valid and not forced
    if (!forceRefresh && lastFetched.value && Date.now() - lastFetched.value < CACHE_DURATION && decks.value.length > 0) {
      return { data: decks.value }
    }

    try {
      loading.value = true
      error.value = null
      const response = await deckService.getDecks()
      decks.value = response.data
      lastFetched.value = Date.now()
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch decks'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch single deck
  async function fetchDeck(id: string) {
    try {
      loading.value = true
      error.value = null
      const response = await deckService.getDeck(id)
      currentDeck.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch deck'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create deck
  async function createDeck(data: CreateDeckDto) {
    try {
      loading.value = true
      error.value = null
      const response = await deckService.createDeck(data)
      decks.value.unshift(response.data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create deck'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update deck
  async function updateDeck(id: string, data: UpdateDeckDto) {
    try {
      loading.value = true
      error.value = null
      const response = await deckService.updateDeck(id, data)
      
      const index = decks.value.findIndex(d => d.id === id)
      if (index !== -1) {
        decks.value[index] = response.data
      }
      
      if (currentDeck.value?.id === id) {
        currentDeck.value = response.data
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update deck'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete deck
  async function deleteDeck(id: string) {
    try {
      loading.value = true
      error.value = null
      await deckService.deleteDeck(id)
      
      decks.value = decks.value.filter(d => d.id !== id)
      
      if (currentDeck.value?.id === id) {
        currentDeck.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete deck'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Legacy fallback: Fetch word counts for decks if missing
  // Note: wordCount is now included in the API response by default,
  // so this method should rarely be needed
  async function fetchWordCounts() {
    const decksToFetch = decks.value.filter(d => d.wordCount == null)
    if (decksToFetch.length === 0) return

    // We don't set global loading here to avoid blocking UI, 
    // but we could track individual loading states if needed.
    
    await Promise.all(decksToFetch.map(async (deck) => {
      try {
        const response = await deckService.getWordCount(deck.id)
        const index = decks.value.findIndex(d => d.id === deck.id)
        if (index !== -1 && decks.value[index]) {
          // Update the deck in the array with the new word count
          decks.value[index].wordCount = response.data.count
        }
      } catch (err) {
        console.error(`Failed to fetch word count for deck ${deck.id}`, err)
      }
    }))
  }

  // Clear current deck
  function clearCurrentDeck() {
    currentDeck.value = null
  }

  return {
    decks,
    currentDeck,
    loading,
    error,
    fetchDecks,
    fetchDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    fetchWordCounts,
    clearCurrentDeck
  }
})
