import apiClient from './api'
import type { ApiResponse } from './deck.service'

export interface Word {
  id: string
  deckId: string
  word: string
  meaning: string
  genus?: string
  plural?: string
  audioUrl?: string
  isLearned: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateWordDto {
  deckId: string
  word: string
  meaning: string
  genus?: string
  plural?: string
  audioUrl?: string
  isLearned?: boolean
}

export interface UpdateWordDto {
  word?: string
  meaning?: string
  genus?: string
  plural?: string
  audioUrl?: string
  isLearned?: boolean
}

export interface BatchLoadDto {
  ids: string[]
}

const wordService = {
  async getWordsByDeck(deckId: string): Promise<ApiResponse<Word[]>> {
    const response = await apiClient.get(`/words/deck/${deckId}`)
    return response.data
  },

  async getWord(id: string): Promise<ApiResponse<Word>> {
    const response = await apiClient.get(`/words/${id}`)
    return response.data
  },

  async createWord(data: CreateWordDto): Promise<ApiResponse<Word>> {
    const response = await apiClient.post('/words', data)
    return response.data
  },

  async batchLoadWords(data: BatchLoadDto): Promise<ApiResponse<Word[]>> {
    const response = await apiClient.post('/words/batch', data)
    return response.data
  },

  async updateWord(id: string, data: UpdateWordDto): Promise<ApiResponse<Word>> {
    const response = await apiClient.patch(`/words/${id}`, data)
    return response.data
  },

  async toggleLearned(id: string): Promise<ApiResponse<Word>> {
    const response = await apiClient.patch(`/words/${id}/toggle-learned`)
    return response.data
  },

  async deleteWord(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/words/${id}`)
    return response.data
  }
}

export default wordService
