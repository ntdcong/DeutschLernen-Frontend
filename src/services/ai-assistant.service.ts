import apiClient from './api'

// ==================== DTOs ====================

export interface GenerateSentenceResponseDto {
  statusCode: number
  message: string
  data: {
    sentence: string
    translation: string
    grammarNote: string
  }
}

export interface AIResponseDto {
  statusCode: number
  message: string
  data: string // Markdown content
}

export interface CreateFavoriteSentenceDto {
  wordId: string
  german: string
  vietnamese: string
  grammarNote: string
}

export interface FavoriteSentence {
  id: string
  wordId: string
  german: string
  vietnamese: string
  grammarNote: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface GetFavoriteSentencesResponseDto {
  statusCode: number
  message: string
  data: FavoriteSentence[]
}

export interface ToggleFavoriteResponseDto {
  statusCode: number
  message: string
  data: {
    id: string
    isFavorite: boolean
  }
}

// ==================== Service ====================

const aiAssistantService = {
  /**
   * 🚀 Fast AI - Generate example sentence
   * POST /api/flashcard/ai/generate-sentence
   */
  async generateSentence(wordId: string): Promise<GenerateSentenceResponseDto> {
    const response = await apiClient.post('/flashcard/ai/generate-sentence', {
      wordId,
      difficulty: 'B1'
    })
    return response.data
  },

  /**
   * 🎉 Fun Facts about the word
   * POST /api/flashcard/ai/fun-facts
   */
  async getFunFacts(wordId: string): Promise<AIResponseDto> {
    const response = await apiClient.post('/flashcard/ai/fun-facts', {
      wordId,
      difficulty: 'B1'
    })
    // Extract from wrapper: {data: {facts: "..."}}
    return {
      statusCode: response.data.statusCode,
      message: response.data.message,
      data: response.data.data.facts || response.data.data
    }
  },

  /**
   * 📚 Etymology - Word origin and history
   * POST /api/flashcard/ai/etymology
   */
  async getEtymology(wordId: string): Promise<AIResponseDto> {
    const response = await apiClient.post('/flashcard/ai/etymology', {
      wordId,
      difficulty: 'B1'
    })
    // Extract from wrapper: {data: {etymology: "..."}}
    return {
      statusCode: response.data.statusCode,
      message: response.data.message,
      data: response.data.data.etymology || response.data.data
    }
  },

  /**
   * 💬 Common phrases using this word
   * POST /api/flashcard/ai/phrases
   */
  async getPhrases(wordId: string): Promise<AIResponseDto> {
    const response = await apiClient.post('/flashcard/ai/phrases', {
      wordId,
      difficulty: 'B1'
    })
    // Extract from wrapper: {data: {phrases: "..."}}
    return {
      statusCode: response.data.statusCode,
      message: response.data.message,
      data: response.data.data.phrases || response.data.data
    }
  },

  /**
   * ⚠️ Common mistakes when using this word
   * POST /api/flashcard/ai/common-mistakes
   */
  async getCommonMistakes(wordId: string): Promise<AIResponseDto> {
    const response = await apiClient.post('/flashcard/ai/common-mistakes', {
      wordId,
      difficulty: 'B1'
    })
    // Extract from wrapper: {data: {mistakes: "..."}}
    return {
      statusCode: response.data.statusCode,
      message: response.data.message,
      data: response.data.data.mistakes || response.data.data
    }
  },

  /**
   * 💾 Save sentence to database
   * POST /api/flashcard/sentences
   */
  async saveFavoriteSentence(data: CreateFavoriteSentenceDto): Promise<{ statusCode: number; message: string; data: FavoriteSentence }> {
    const response = await apiClient.post('/flashcard/sentences', data)
    return response.data
  },

  /**
   * 📋 Get all favorite sentences (current user)
   * GET /api/flashcard/sentences/favorites
   */
  async getFavoriteSentences(): Promise<GetFavoriteSentencesResponseDto> {
    const response = await apiClient.get('/flashcard/sentences/favorites')
    return response.data
  },

  /**
   * ❌ Delete a sentence
   * DELETE /api/flashcard/sentences/:sentenceId
   */
  async deleteFavoriteSentence(sentenceId: string): Promise<{ statusCode: number; message: string }> {
    const response = await apiClient.delete(`/flashcard/sentences/${sentenceId}`)
    return response.data
  },

  /**
   * ⭐ Toggle favorite status
   * PATCH /api/flashcard/sentences/:sentenceId/favorite
   */
  async toggleFavorite(sentenceId: string): Promise<ToggleFavoriteResponseDto> {
    const response = await apiClient.patch(`/flashcard/sentences/${sentenceId}/favorite`)
    return response.data
  }
}

export default aiAssistantService
