import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOrdersStore } from '../store/orders.js'

const flow = ['PLACED','CONFIRMED','PREPARING','PICKED_UP','DELIVERED']

export default function OrderDetails() {
  const { id } = useParams()
  const orders = useOrdersStore(s=> s.orders)
  const updateStatus = useOrdersStore(s=> s.updateStatus)
  const [started, setStarted] = useState(false)
  const order = orders.find(o=> o.id === id)

  useEffect(()=>{
    if (!order || started) return
    setStarted(true)
    let idx = flow.indexOf(order.status)
    const timer = setInterval(()=>{
      idx = Math.min(flow.length-1, idx+1)
      updateStatus(order.id, flow[idx])
      if (idx === flow.length-1) clearInterval(timer)
    }, 3000)
    return ()=> clearInterval(timer)
  }, [order, started, updateStatus])

  if (!order) return <div>Order not found</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Tracking</h2>
      <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="font-medium">{order.restaurantName}</div>
        <div className="text-sm text-neutral-500">₹{order.total} • ETA ~ {order.eta} mins</div>
      </div>
      <ol className="space-y-2">
        {flow.map(s=> (
          <li key={s} className={`p-3 rounded-md border ${s===order.status? 'border-primary-500 bg-primary-50 dark:bg-neutral-800': 'border-neutral-200 dark:border-neutral-800'}`}>{s}</li>
        ))}
      </ol>
    </div>
  )
}
