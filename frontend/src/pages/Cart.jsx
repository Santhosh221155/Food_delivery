import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cart.js'
import { Trash2, ShoppingBag } from 'lucide-react'

export default function Cart() {
  const items = useCartStore(s=> s.items)
  const clear = useCartStore(s=> s.clear)
  const { subtotal, discount, delivery, grand } = useCartStore.getState().total()
  const applyCoupon = useCartStore(s=> s.applyCoupon)
  let couponCode = ''

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          {items.length > 0 && (
            <button onClick={clear} className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
              <Trash2 className="w-4 h-4"/> Clear
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center bg-white dark:bg-neutral-900">
            <ShoppingBag className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3"/>
            <p className="text-neutral-600 dark:text-neutral-300 mb-3">Your cart is empty</p>
            <Link to="/" className="text-primary-600 hover:underline font-semibold">Browse restaurants</Link>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {items.map(i=> (
              <li key={i.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{i.name}</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Qty: {i.qty}</p>
                </div>
                <div className="font-bold text-primary-600">₹{i.price * i.qty}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Order Summary</h3>
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
          <div className="flex gap-2 mb-4">
            <input onChange={(e)=>{couponCode = e.target.value}} placeholder="Coupon code" className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            <button type="button" onClick={()=> applyCoupon(couponCode)} className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-semibold">Apply</button>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
            <span className="font-semibold">₹{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Discount (SAVE10)</span>
              <span className="font-semibold">- ₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Delivery Fee</span>
            <span className="font-semibold">{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 flex justify-between">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">Total</span>
            <span className="font-bold text-lg text-primary-600">₹{grand}</span>
          </div>
          {items.length > 0 ? (
            <Link to="/checkout" className="block w-full text-center px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition font-bold mt-4">Proceed to Checkout</Link>
          ) : (
            <Link to="/" className="block w-full text-center px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition font-bold mt-4">Continue Shopping</Link>
          )}
        </div>
      </div>
    </div>
  )
}
