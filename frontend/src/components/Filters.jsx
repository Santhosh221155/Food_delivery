export default function Filters({ sort, setSort, cuisine, setCuisine }) {
  const sorts = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'rating', label: 'Rating' },
    { id: 'eta', label: 'Delivery Time' },
    { id: 'fee', label: 'Delivery Fee' }
  ]

  const cuisines = ['All','Indian','Chinese','Italian','Bakery','Healthy']

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select value={sort} onChange={e=>setSort(e.target.value)} className="px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        {sorts.map(s=> <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <select value={cuisine} onChange={e=>setCuisine(e.target.value)} className="px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        {cuisines.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  )
}
