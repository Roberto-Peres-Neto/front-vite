import jwtDecode from 'jwt-decode'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface User {
  email: string
  userCode: string
  roles: Array<{ action: string; subject: string }>
  permissions: Array<{ permissaoSigla: string; permissionDesciption: string }>
  profile: Array<{ name: string; desc: string }>
  accessToken: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode<any>(token)
      setUser({
        ...decoded,
        accessToken: token
      })
    }
  }, [])

  const logout = () => {
    sessionStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)