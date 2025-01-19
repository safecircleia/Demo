'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface RegisterFormData {
  name: string
  email: string
  password: string
}

export interface RegisterError {
  email?: string[]
  password?: string[]
  name?: string[]
  general?: string[]
}

export interface ParentSignupProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  errors: RegisterError
  isLoading: boolean
}

const ParentSignup = ({ onSubmit, errors, isLoading }: ParentSignupProps) => {
  const { register, handleSubmit } = useForm<RegisterFormData>()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name', { required: true })}
          disabled={isLoading}
          className="glass-input"
        />
        {errors.name?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email', { required: true })}
          disabled={isLoading}
          className="glass-input"
        />
        {errors.email?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register('password', { required: true })}
          disabled={isLoading}
          className="glass-input"
        />
        {errors.password?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign Up'}
      </Button>
      {errors.general?.map((error) => (
        <p key={error} className="text-sm text-red-500">{error}</p>
      ))}
    </form>
  )
}

export default ParentSignup