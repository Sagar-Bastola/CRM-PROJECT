import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Truck, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { login } from '../../api/auth.api'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

interface FormData {
  emailOrUsername: string
  password: string
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const authLogin = useAuthStore(s => s.login)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      emailOrUsername: '',
      password: '',
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const res = await login({
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      })
      authLogin(res.data)
      navigate('/app')
    } catch {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-200">
              <Truck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your HeavyTrack account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email or Username"
              placeholder="admin@crm.com"
              error={errors.emailOrUsername?.message}
              {...register('emailOrUsername', { required: 'Required' })}
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border text-sm px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
                  }`}
                  {...register('password', { required: 'Required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full justify-center py-3"
              loading={isSubmitting}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Don't have an account?{' '}
              <Link to="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
                Contact us
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          <Link to="/" className="hover:text-white transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage