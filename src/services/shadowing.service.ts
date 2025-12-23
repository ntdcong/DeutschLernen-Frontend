import apiClient from './api'

export interface ShadowingText {
  id: string
  title: string
  content: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  category: string
  description?: string
  practiceCount: number
  audioUrl?: string
  useCustomAudio: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserShadowingProgress {
  id: string
  userId: string
  shadowingTextId: string
  completionCount: number
  lastPracticedAt?: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  shadowingText?: ShadowingText
}

export interface TextsResponse {
  success: boolean
  data: ShadowingText[]
  count: number
}

export interface SingleTextResponse {
  success: boolean
  data: ShadowingText
}

export interface TextWithProgressResponse {
  success: boolean
  data: {
    text: ShadowingText
    progress: UserShadowingProgress | null
  }
}

export interface SaveProgressDto {
  shadowingTextId: string
  isFavorite?: boolean
}

export interface ProgressResponse {
  success: boolean
  data: UserShadowingProgress
  message?: string
}

export interface MyProgressResponse {
  success: boolean
  data: UserShadowingProgress[]
}

export interface CategoriesResponse {
  success: boolean
  data: string[]
}

class ShadowingService {
  /**
   * Get all shadowing texts, optionally filtered by level and category
   */
  async getTexts(level?: string, category?: string): Promise<TextsResponse> {
    const params: any = {}
    if (level) params.level = level
    if (category) params.category = category

    const response = await apiClient.get('/shadowing/texts', { params })
    return response.data
  }

  /**
   * Get single text by ID
   */
  async getText(id: string): Promise<SingleTextResponse> {
    const response = await apiClient.get(`/shadowing/texts/${id}`)
    return response.data
  }

  /**
   * Get text with user progress (requires auth)
   */
  async getTextWithProgress(id: string): Promise<TextWithProgressResponse> {
    const response = await apiClient.get(`/shadowing/texts/${id}/with-progress`)
    return response.data
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoriesResponse> {
    const response = await apiClient.get('/shadowing/categories')
    return response.data
  }

  /**
   * Save progress after completing a text (requires auth)
   */
  async saveProgress(dto: SaveProgressDto): Promise<ProgressResponse> {
    const response = await apiClient.post('/shadowing/progress', dto)
    return response.data
  }

  /**
   * Get user's practice history (requires auth)
   */
  async getMyProgress(): Promise<MyProgressResponse> {
    const response = await apiClient.get('/shadowing/progress/my')
    return response.data
  }

  /**
   * Toggle favorite status for a text (requires auth)
   */
  async toggleFavorite(id: string): Promise<ProgressResponse> {
    const response = await apiClient.post(`/shadowing/texts/${id}/favorite`)
    return response.data
  }
}

export default new ShadowingService()
