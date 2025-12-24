import { Link } from 'react-router-dom'
import { Star, Clock, Zap } from 'lucide-react'

export default function RestaurantCard({ r }) {
  return (
    <Link to={`/restaurant/${r.id}`} className="card-hover group bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
      <div className="relative aspect-[16/9] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        {r.image ? (
          <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300">
            <span className="text-primary-700 font-bold">🍽️</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white dark:bg-neutral-800 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500"/>
          <span className="text-sm font-semibold">{r.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-lg line-clamp-1">{r.name}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-1">{r.cuisines?.join(' • ')}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {r.eta}m</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5"/> ₹{r.fee}</span>
        </div>
      </div>
    </Link>
  )
}
