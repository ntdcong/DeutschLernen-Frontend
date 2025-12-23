import apiClient from './api'

export interface User {
  id: string
  fullName: string
  email: string
  isActive: boolean
  createdAt: string
}

export interface UserResponse {
  statusCode: number
  message: string
  data: User
}

class UserService {
  async getUserById(userId: string): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`/users/${userId}`)
    return response.data
  }

  async getAllUsers(): Promise<{ statusCode: number, data: User[] }> {
    const response = await apiClient.get< { statusCode: number, data: User[] }>('/users')
    return response.data
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/users/me')
    return response.data
  }
}

export default new UserService()
