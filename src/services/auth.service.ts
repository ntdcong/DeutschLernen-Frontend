import apiClient from './api'

export interface RegisterDto {
  email: string
  password: string
  fullName: string
  role: 'learner' | 'teacher' | 'admin'
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  statusCode: number
  message: string
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      email: string
      fullName: string
      role: string
      isActive: boolean
      createdAt: string
      updatedAt: string
    }
  }
}

export interface RefreshTokenDto {
  refreshToken: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  newPassword: string
}

const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  async refreshToken(data: RefreshTokenDto): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh', data)
    return response.data
  },

  async forgotPassword(data: ForgotPasswordDto): Promise<any> {
    const response = await apiClient.post('/auth/login/forgot-password', data)
    return response.data
  },

  async resetPassword(data: ResetPasswordDto): Promise<any> {
    const response = await apiClient.post('/auth/login/reset-password', data)
    return response.data
  }
}

export default authService
