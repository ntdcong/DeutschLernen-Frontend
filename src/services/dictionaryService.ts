import apiClient from './api'

export interface Pronounce {
  de?: string
  vi?: string
}

export interface Conjugation {
  gt: {
    w: string  // gender (der, die, das)
    p: string  // pronunciation
  }
  si: {
    w: string  // singular
    p: string  // pronunciation
  }
  sn: {
    w: string  // plural
    p: string  // pronunciation
  }
}

export interface Example {
  id?: number
  language?: string
  e: string  // Example in German
  m: string  // Meaning/Translation
  p?: string | null
  type?: string
  _id?: string
}

export interface Mean {
  mean: string
  examples: Example[]
}

export interface Content {
  kind: string  // Part of speech (e.g., "động từ", "danh từ", "Interjection")
  means: Mean[]
}

export interface DictionaryResult {
  word: string
  id?: number
  language?: string
  type?: string
  content: Content[]
  pronounce?: Pronounce
  conjugation?: Conjugation | null
  freq?: number | string
  topic?: string
  word_grammar?: {
    conj?: number
    phr?: number
  }
  keyword?: string
  word_family?: Array<{
    field: string
    content: string[]
  }>
  snym?: any
  _id?: string
}

export interface DictionaryResponse {
  found: boolean
  found_related?: boolean  // For conjugated forms (ging -> gehen)
  key: string
  type?: 'devi' | 'faztaa_related' | 'google_translate'  // Response type
  result: DictionaryResult[]
}

export interface DictionarySearchParams {
  word: string
  source_lang?: 'de' | 'vi'
}

class DictionaryService {
  async search(params: DictionarySearchParams): Promise<DictionaryResponse> {
    const response = await apiClient.get('/dictionary/search', { params })
    return response.data.data
  }
}

export default new DictionaryService()
