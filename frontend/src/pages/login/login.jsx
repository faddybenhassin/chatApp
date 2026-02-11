import { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../util/authContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async () => {
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.token)
        navigate('/', { replace: true })
      } else {
        console.warn(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Error logging in:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="loginContainer">
      <div className="username">
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="pwd">
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="forgetPwd">
          <a href="#">forgot password?</a>
        </div>
      </div>
      <div className="btnContainer">
        <button className="primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In Now'}
        </button>
        <button className="register" onClick={() => navigate('/register')}>
          sign up
        </button>
      </div>
    </div>
  )
}

export default Login