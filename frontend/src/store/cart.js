import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(persist((set, get) => ({
  items: [], // {id, name, price, qty, restaurantId, restaurantName}
  restaurantId: null,
  totalItems: 0,
  subtotal: 0,
  coupon: null,

  add: (item, restaurant) => set((state)=>{
    if (state.restaurantId && state.restaurantId !== restaurant.id) {
      // reset cart if adding from different restaurant
      state = { ...state, items: [], restaurantId: null, subtotal: 0, totalItems: 0, coupon: null }
    }
    const existing = state.items.find(i=> i.id === item.id)
    let items
    if (existing) {
      items = state.items.map(i=> i.id===item.id? {...i, qty: i.qty+1}: i)
    } else {
      items = [...state.items, { id: item.id, name: item.name, price: item.price, qty: 1, restaurantId: restaurant.id, restaurantName: restaurant.name }]
    }
    const subtotal = items.reduce((s,i)=> s + i.price * i.qty, 0)
    const totalItems = items.reduce((s,i)=> s + i.qty, 0)
    return { items, restaurantId: restaurant.id, subtotal, totalItems }
  }),

  decrement: (id) => set((state)=>{
    let items = state.items.map(i=> i.id===id? {...i, qty: i.qty-1}: i).filter(i=> i.qty>0)
    const subtotal = items.reduce((s,i)=> s + i.price * i.qty, 0)
    const totalItems = items.reduce((s,i)=> s + i.qty, 0)
    return { items, subtotal, totalItems, restaurantId: items[0]?.restaurantId || null }
  }),

  clear: ()=> set({ items: [], subtotal: 0, totalItems: 0, restaurantId: null, coupon: null }),
  applyCoupon: (code)=> set((state)=>{
    // very simple mock coupon: 10% off for SAVE10
    if (code?.toUpperCase() === 'SAVE10') {
      return { coupon: { code: 'SAVE10', discount: 0.1 } }
    }
    return { coupon: null }
  }),
  total: ()=>{
    const { subtotal, coupon } = get()
    const discount = coupon? subtotal * coupon.discount : 0
    const delivery = subtotal > 300 ? 0 : 49
    return {
      subtotal,
      discount,
      delivery,
      grand: Math.max(0, subtotal - discount + delivery)
    }
  }
}), { name: 'fooddash-cart' }))
