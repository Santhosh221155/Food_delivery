import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, onSubmit, placeholder='Search for restaurants or dishes'}) {
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit?.()}} className="flex items-center gap-2 w-full">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"/>
        <input value={value} onChange={(e)=>onChange?.(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder={placeholder}/>
      </div>
      <button className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">Search</button>
    </form>
  )
}
