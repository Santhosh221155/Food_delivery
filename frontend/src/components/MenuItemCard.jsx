import { Plus, Minus, Image as ImageIcon } from 'lucide-react'
import { useCartStore } from '../store/cart.js'

export default function MenuItemCard({ item, restaurant }) {
  const add = useCartStore(s=>s.add)
  const dec = useCartStore(s=>s.decrement)
  const qty = useCartStore(s=> s.items.find(it=> it.id===item.id)?.qty || 0)

  return (
    <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl flex gap-4 hover:shadow-md transition bg-white dark:bg-neutral-900">
      <div className="w-32 h-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
            <ImageIcon className="w-8 h-8 text-primary-400"/>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">{item.desc}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary-600 text-lg">₹{item.price}</span>
          <div className="flex items-center gap-2">
            {qty>0 && <button onClick={()=>dec(item.id)} className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"><Minus className="w-4 h-4"/></button>}
            {qty>0 && <span className="w-6 text-center font-semibold">{qty}</span>}
            <button onClick={()=>add(item, restaurant)} className="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition flex items-center gap-1 font-semibold"><Plus className="w-4 h-4"/> Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}
