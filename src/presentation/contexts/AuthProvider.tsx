import { useAtom, type WritableAtom } from 'jotai'
import { createContext, useEffect } from 'react'
import { authAtom, type AuthModel } from '../atoms/authAtom'

type AuthProviderProps = {
  children: React.ReactNode
}

const AuthContext = createContext({})

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useAtom(authAtom as WritableAtom<AuthModel | null, [AuthModel | null], void>)

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth')
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth))
    }
  }, [setAuth])

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth))
    }
  }, [auth])

  useEffect(() => {
    const syncAuthAcrossTabs = (e: StorageEvent) => {
      if (e.key === 'auth') {
        const newAuth = e.newValue ? JSON.parse(e.newValue) : null
        setAuth(newAuth)
      }
    }

    window.addEventListener('storage', syncAuthAcrossTabs)
    return () => window.removeEventListener('storage', syncAuthAcrossTabs)
  }, [])


  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}
