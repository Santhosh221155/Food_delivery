import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useUserStore } from '../store/user.js'
import { authAPI } from '../services/api.js'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const login = useUserStore(s=> s.login)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Email and password are required')
      return
    }
    
    setIsLoading(true)
    try {
      await login({ email, password })
      toast.success('Signed in')
      navigate('/profile')
    } catch (err) {
      console.error('Login error:', err)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">Use the email you registered with to continue.</p>
      <input required type="email" value={email} onChange={e=> setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
      <input required type="password" value={password} onChange={e=> setPassword(e.target.value)} placeholder="Your password" className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
      <button className="w-full px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        New here? <Link to="/signup" className="text-primary-600 font-semibold">Create an account</Link>
      </p>
    </form>
  )
}
