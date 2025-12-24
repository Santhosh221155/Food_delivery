import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useUserStore } from '../store/user.js'
import { authAPI } from '../services/api.js'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const signup = useUserStore(s=> s.signup)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setIsLoading(true)
    try {
      await signup({ name, email, password })
      toast.success('Account created')
      navigate('/profile')
    } catch (err) {
      console.error('Signup error:', err)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
      <h2 className="text-xl font-semibold">Sign up</h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">Create your account to start ordering.</p>
      <input required value={name} onChange={e=> setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
      <input required type="email" value={email} onChange={e=> setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
      <input required type="password" value={password} onChange={e=> setPassword(e.target.value)} placeholder="Password (min 6 characters)" className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
      <input required type="password" value={confirmPassword} onChange={e=> setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
      <button className="w-full px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        Already registered? <Link to="/auth" className="text-primary-600 font-semibold">Sign in</Link>
      </p>
    </form>
  )
}
