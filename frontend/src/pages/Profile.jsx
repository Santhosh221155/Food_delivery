import { useUserStore } from '../store/user.js'

export default function Profile() {
  const user = useUserStore(s=> s.user)
  const addresses = useUserStore(s=> s.addressBook)
  if (!user) return <div>Please sign in to view profile.</div>

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Profile</h2>
      <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-neutral-600 dark:text-neutral-300">{user.email}</div>
      </div>
      <div>
        <h3 className="font-medium mb-2">Addresses</h3>
        {addresses.length===0? <div className="text-sm text-neutral-500">No saved addresses.</div> : (
          <ul className="space-y-2">
            {addresses.map(a=> <li key={a.id} className="text-sm">{a.line1}, {a.city} - {a.pincode}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}
