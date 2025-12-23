import apiClient from './api'

export interface Deck {
  id: string
  name: string
  userId: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  wordCount?: number
}

export interface CreateDeckDto {
  name: string
  isPublic?: boolean
}

export interface UpdateDeckDto {
  name?: string
  isPublic?: boolean
}

export interface ApiResponse<T> {
  statusCode: number
  message: string
  data: T
}

const deckService = {
  async getDecks(): Promise<ApiResponse<Deck[]>> {
    const response = await apiClient.get('/decks')
    return response.data
  },

  async getDeck(id: string): Promise<ApiResponse<Deck>> {
    const response = await apiClient.get(`/decks/${id}`)
    return response.data
  },

  async createDeck(data: CreateDeckDto): Promise<ApiResponse<Deck>> {
    const response = await apiClient.post('/decks', data)
    return response.data
  },

  async updateDeck(id: string, data: UpdateDeckDto): Promise<ApiResponse<Deck>> {
    const response = await apiClient.patch(`/decks/${id}`, data)
    return response.data
  },

  async deleteDeck(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/decks/${id}`)
    return response.data
  },

  async getShuffledWordIds(id: string): Promise<ApiResponse<{ useBatchLoading: boolean; wordIds?: string[] }>> {
    const response = await apiClient.get(`/decks/${id}/shuffled-ids`)
    return response.data
  },

  async getWordCount(id: string): Promise<ApiResponse<{ count: number }>> {
    const response = await apiClient.get(`/decks/${id}/word-count`)
    return response.data
  },

  async enablePublicShare(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post(`/decks/${id}/public-share/enable`)
    return response.data
  },

  async disablePublicShare(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/decks/${id}/public-share/disable`)
    return response.data
  }
}

export default deckService
