import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOrdersStore = create(persist((set)=>({
  orders: [], // {id, items, total, status, restaurantName, eta, placedAt}
  placeOrder: (payload)=> set((s)=> ({ orders: [{ id: Date.now().toString(), status: 'PLACED', placedAt: new Date().toISOString(), ...payload }, ...s.orders] })),
  updateStatus: (id, status)=> set((s)=> ({ orders: s.orders.map(o=> o.id===id? { ...o, status }: o) }))
}), { name: 'fooddash-orders' }))
