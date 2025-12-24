import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cart.js'
import { useUserStore } from '../store/user.js'
import { useOrdersStore } from '../store/orders.js'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, clear } = useCartStore()
  const totals = useCartStore.getState().total()
  const user = useUserStore(s=> s.user)
  const addAddress = useUserStore(s=> s.addAddress)
  const placeOrder = useOrdersStore(s=> s.placeOrder)
  const navigate = useNavigate()

  if (!items.length) return <div>Your cart is empty.</div>

  const handlePlace = async (e)=>{
    e.preventDefault()
    if (!user) { toast.error('Please sign in to place order'); navigate('/auth'); return }
    const form = new FormData(e.currentTarget)
    const address = { line1: form.get('line1'), city: form.get('city'), pincode: form.get('pincode') }
    addAddress(address)
    const order = {
      userEmail: user.email,
      items,
      total: totals.grand,
      restaurantId: items[0]?.restaurantId || 'r1',
      restaurantName: items[0]?.restaurantName || 'Restaurant',
      eta: 35,
      deliveryAddress: { address: address.line1, city: address.city, pincode: address.pincode }
    }
    await placeOrder(order)
    clear()
    toast.success('Order placed!')
    navigate('/orders')
  }

  return (
    <form onSubmit={handlePlace} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input required name="line1" placeholder="Address line" className="px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
          <input required name="city" placeholder="City" className="px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
          <input required name="pincode" placeholder="Pincode" className="px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"/>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Payment</h3>
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-2">
          <label className="flex items-center gap-2 text-sm"><input type="radio" name="pay" defaultChecked/> Cash on Delivery</label>
          <button type="submit" className="w-full mt-2 px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">Place Order</button>
        </div>
      </div>
    </form>
  )
}
