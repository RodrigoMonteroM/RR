import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import HomePage from '@/pages/HomePage'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import SchemaDiagram from '@/pages/SchemaDiagram'
import BoxDetail from '@/pages/BoxDetail'
import { navigationService } from '@/services/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    navigationService.setNavigate(navigate)
  }, [navigate])

  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      <Route path="/boxes/:id"
        element={
          <ProtectedRoute>
            <BoxDetail />
          </ProtectedRoute>
        } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/schema" element={<SchemaDiagram />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  )
}
