import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchRestaurant } from '../services/api.js'
import MenuItemCard from '../components/MenuItemCard.jsx'
import { Star, Clock, MapPin, Image as ImageIcon } from 'lucide-react'

export default function Restaurant() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    fetchRestaurant(id).then(r=> { if(mounted){ setRestaurant(r); setLoading(false) } })
    return ()=>{ mounted=false }
  }, [id])

  if (loading) return (
    <div className="space-y-4">
      <div className="aspect-[16/6] bg-neutral-300 dark:bg-neutral-800 rounded-xl animate-pulse"/>
      <div className="space-y-2">
        <div className="h-6 bg-neutral-300 dark:bg-neutral-800 rounded w-1/3 animate-pulse"/>
        <div className="h-4 bg-neutral-300 dark:bg-neutral-800 rounded w-1/2 animate-pulse"/>
      </div>
    </div>
  )
  if (!restaurant) return <div className="text-center py-8">Restaurant not found.</div>

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
        <div className="aspect-[16/6] bg-neutral-300 dark:bg-neutral-800 overflow-hidden">
          {restaurant.image ? (
            <img src={restaurant.image} alt="" className="w-full h-full object-cover"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 to-primary-300">
              <ImageIcon className="w-16 h-16 text-primary-600"/>
            </div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{restaurant.name}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">{restaurant.cuisines.join(' • ')}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 rounded-lg">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500"/> {restaurant.rating}
            </div>
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4"/> {restaurant.eta} mins
            </div>
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 rounded-lg">
              <MapPin className="w-4 h-4"/> ₹{restaurant.fee} delivery
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Menu</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {restaurant.menu.map(item=> <MenuItemCard key={item.id} item={item} restaurant={restaurant}/>) }
        </div>
      </div>
    </div>
  )
}
