import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, MapPin, Flame } from 'lucide-react'
import { useCartStore } from '../store/cart.js'
import { useUserStore } from '../store/user.js'

export default function Header() {
  const itemsCount = useCartStore((s) => s.totalItems)
  const user = useUserStore((s) => s.user)
  const logout = useUserStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-950/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-bold text-2xl flex items-center gap-2 group">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:bg-primary-700 transition">
              <Flame className="w-5 h-5"/>
            </div>
            <span className="hidden sm:inline"><span className="text-primary-600">Food</span>Dash</span>
          </Link>
          <button className="hidden md:flex items-center text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Location</span>
          </button>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive})=>isActive? 'text-primary-600 font-semibold':'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition'}>Home</NavLink>
          <NavLink to="/orders" className={({isActive})=>isActive? 'text-primary-600 font-semibold':'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition'}>Orders</NavLink>
          <NavLink to="/profile" className={({isActive})=>isActive? 'text-primary-600 font-semibold':'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition'}>Profile</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={()=>{logout(); navigate('/')}} className="text-sm px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition font-medium">Logout</button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth" className="text-sm px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition flex items-center gap-2 font-medium"><User className="w-4 h-4"/> Sign in</Link>
              <Link to="/signup" className="text-sm px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition font-semibold">Sign up</Link>
            </div>
          )}
          <Link to="/cart" className="relative inline-flex items-center px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition font-semibold gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white dark:bg-red-600 text-xs rounded-full px-2 py-0.5 font-bold">{itemsCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
