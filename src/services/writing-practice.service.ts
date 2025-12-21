import apiClient from './api'

export interface WritingTopic {
    id: string
    sentence: string
    hints: string[]
    keyGrammar: string
}

export interface TopicsResponse {
    topics: WritingTopic[]
}

export interface EvaluationRequest {
    text: string
    targetLevel: string
    intent: string
}

export interface EvaluationResponse {
    score: number
    detectedLevel: string
    isLevelMet: boolean
    analysis: {
        grammar: string
        vocabulary: string
        style: string
    }
    corrections: string[]
    upgrades: {
        level: string
        text: string
        explanation: string
    }[]
}

class WritingPracticeService {
    /**
     * Get 10 writing topics for a specific CEFR level
     */
    async getTopics(level: string): Promise<TopicsResponse> {
        const response = await apiClient.get('/writing-practice/topics', {
            params: { level }
        })
        // Handle both response.data and response.data.data structures
        return response.data.data || response.data
    }

    /**
     * Evaluate a written sentence
     */
    async evaluateWriting(request: EvaluationRequest): Promise<EvaluationResponse> {
        const response = await apiClient.post(
            '/writing-practice/evaluate',
            request
        )
        // Handle both response.data and response.data.data structures
        return response.data.data || response.data
    }
}

export default new WritingPracticeService()
