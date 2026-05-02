import api from './axios'
import { AuthResponse, LoginDto, RegisterDto } from '../types'

export const login = (data: LoginDto) =>
  api.post<AuthResponse>('/auth/login', data)

export const register = (data: RegisterDto) =>
  api.post<AuthResponse>('/auth/register', data)