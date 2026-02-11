import { useState, useEffect } from 'react'
import { AuthContext } from './authContext'


export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)



  async function verifyToken() {
      const savedToken = localStorage.getItem('token')

      if (savedToken) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${savedToken}` },
          })
          const user = await res.json()
          if (res.ok) {
            setToken(savedToken)
            setUser(user)
          } else {
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        } catch {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
  
  useEffect(() => {
    verifyToken()
  }, [token])

  function login(newToken) {
    if (!newToken) return
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  function isAuthenticated() {
    return !!token
  }

  

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}