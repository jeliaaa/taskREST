import type { ReactNode }  from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const {user} = useAuthStore()
  const location = useLocation()

  const isUserValid = !!user && typeof user === 'object' && !Array.isArray(user)

  if (!isUserValid) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
