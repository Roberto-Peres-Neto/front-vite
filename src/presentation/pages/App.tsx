import { Route, Routes } from 'react-router-dom'
import { PrivateRoute } from '../components/PrivateRoute'
import { Home } from './Home'
import { Login } from './Login'

export const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={<PrivateRoute><Home /></PrivateRoute>}
      />
    </Routes>
  )
}
