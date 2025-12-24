import { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import Filters from '../components/Filters.jsx'
import RestaurantCard from '../components/RestaurantCard.jsx'
import { fetchRestaurants } from '../services/api.js'
import { Zap } from 'lucide-react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('relevance')
  const [cuisine, setCuisine] = useState('All')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    fetchRestaurants().then(data=>{ if(mounted){ setRestaurants(data); setLoading(false) } })
    return ()=>{ mounted = false }
  },[])

  const filtered = useMemo(()=>{
    let list = restaurants
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(r=> r.name.toLowerCase().includes(q) || r.cuisines.join(',').toLowerCase().includes(q))
    }
    if (cuisine !== 'All') {
      list = list.filter(r=> r.cuisines.includes(cuisine))
    }
    switch (sort) {
      case 'rating': list = [...list].sort((a,b)=> b.rating - a.rating); break
      case 'eta': list = [...list].sort((a,b)=> a.eta - b.eta); break
      case 'fee': list = [...list].sort((a,b)=> a.fee - b.fee); break
      default: break
    }
    return list
  }, [restaurants, query, cuisine, sort])

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">FoodDash</h1>
        <p className="text-primary-100">Order your favorite food, delivered to your doorstep</p>
      </div>
      
      <div className="space-y-3">
        <SearchBar value={query} onChange={setQuery} onSubmit={()=>{}}/>
        <Filters sort={sort} setSort={setSort} cuisine={cuisine} setCuisine={setCuisine}/>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i)=> (
            <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 animate-pulse">
              <div className="aspect-[16/9] bg-neutral-300 dark:bg-neutral-700"/>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4"/>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"/>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Zap className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3"/>
          <p className="text-neutral-600 dark:text-neutral-300">No restaurants match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r=> <RestaurantCard key={r.id} r={r}/>) }
        </div>
      )}
    </div>
  )
}
