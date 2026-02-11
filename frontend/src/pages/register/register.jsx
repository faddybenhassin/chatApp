import React, { useState } from 'react'
import './register.css'
import { useAuth } from '../../util/authContext'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, email, password }),
      })
      const data = await response.json()

      if (response.ok) {
        if (data.token) {
          login(data.token)
          navigate('/', { replace: true })
        } else {
          const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const loginData = await loginRes.json()
          if (loginRes.ok && loginData.token) {
            login(loginData.token)
            navigate('/', { replace: true })
          } else {
            console.warn('Registration succeeded but automatic login failed.', loginData.message || loginData)
          }
        }
      } else {
        console.warn(data.err || 'sign up failed')
      }
    } catch (error) {
      console.error('Error signing up:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="registerContainer">
      <div className="username">
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <div className="email">
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="pwd">
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="btnContainer">
        <button className="primary" onClick={handleRegister} disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    </div>
  )
}

export default Register