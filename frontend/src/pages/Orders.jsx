import { Link } from 'react-router-dom'
import { useOrdersStore } from '../store/orders.js'
import { useEffect } from 'react'

export default function Orders() {
  const orders = useOrdersStore(s=> s.orders)

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Your Orders</h2>
      {orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <ul className="space-y-2">
          {orders.map(o=> (
            <li key={o.id} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between">
              <div>
                <div className="font-medium">{o.restaurantName}</div>
                <div className="text-sm text-neutral-500">{new Date(o.placedAt).toLocaleString()} • ₹{o.total}</div>
                <div className="text-sm">Status: <span className="font-medium">{o.status}</span></div>
              </div>
              <Link to={`/orders/${o.id}`} className="text-primary-600">Track</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
