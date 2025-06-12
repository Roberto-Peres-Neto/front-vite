import { useAtom, type WritableAtom } from 'jotai'
import { createContext, useEffect, useState } from 'react'
import { authAtom, type AuthModel } from '../atoms/authAtom'

type AuthProviderProps = {
  children: React.ReactNode
}

const AuthContext = createContext({})

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useAtom(authAtom as WritableAtom<AuthModel | null, [AuthModel | null], void>)
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth')
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth))
    }
    setLoading(false); // Set loading to false after attempting to load auth
  }, [setAuth])

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth))
    } else {
      localStorage.removeItem('auth'); // Clear localStorage if auth becomes null
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

  // If still loading, you might render a loading spinner or null
  if (loading) {
    return <div>Loading authentication...</div>; // Or null, or a spinner component
  }

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}