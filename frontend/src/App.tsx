import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import HomePage from '@/pages/HomePage'
import { navigationService } from '@/services/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    navigationService.setNavigate(navigate)
  }, [navigate])

  return (
    <Routes>
      <Route path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
