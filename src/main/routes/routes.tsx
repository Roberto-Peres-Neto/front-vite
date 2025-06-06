// src/main/routes/routes.tsx
import { authAtom } from '@/presentation/atoms/authAtom'
import { useAtom } from 'jotai'
import { Navigate, Route, Routes } from 'react-router-dom'
import makeLoginForm from '../factories/pages/login/login'

export function AppRoutes() {
  const [auth] = useAtom(authAtom)

  return (
    <Routes>
      <Route path="/login" element={makeLoginForm()} />
      <Route path="/home" element={auth ? <HomePage /> : <Navigate to="/login" />} />
    </Routes>
  )
}


export function HomePage() {
  return (
    <div>
      teste
    </div>
  );
}
