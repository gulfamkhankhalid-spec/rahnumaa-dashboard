import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, fromPrice } from '../data'
import { useLancer } from '../store'
import { Empty } from '../../academy/ui'
import { GigCard, sellerOf } from '../ui'

const levels = ['New seller', 'Level 1', 'Level 2', 'Top rated']

export default function Gigs() {
  const [params, setParams] = useSearchParams()
  const { allGigs, s } = useLancer()
  const q = (params.get('q') ?? '').toLowerCase()
  const cat = params.get('cat') ?? ''
  const sub = params.get('sub') ?? ''
  const budget = params.get('budget') ?? ''
  const days = params.get('days') ?? ''
  const level = params.get('level') ?? ''
  const abc = params.get('abc') === '1'
  const urdu = params.get('urdu') === '1'
  const sort = params.get('sort') ?? ''
  const set = (k: string, v: string) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); if (k === 'cat') n.delete('sub'); setParams(n, { replace: true }) }

  const list = useMemo(() => {
    const r = allGigs.filter((g) => {
      const seller = sellerOf(g, s.me)
      const price = fromPrice(g)
      const minDays = Math.min(...g.packages.map((p) => p.days))
      return (!q || `${g.title} ${g.tags.join(' ')} ${g.sub}`.toLowerCase().includes(q)) &&
        (!cat || g.category === cat) && (!sub || g.sub === sub) &&
        (!budget || (budget === 'low' ? price < 5000 : budget === 'mid' ? price >= 5000 && price <= 20000 : price > 20000)) &&
        (!days || minDays <= Number(days)) &&
        (!level || seller.level === level) && (!abc || seller.abc.length > 0) &&
        (!urdu || (seller.languages ?? ['Urdu']).includes('Urdu'))
    })
    if (sort === 'reviews') r.sort((a, b) => b.reviews - a.reviews)
    if (sort === 'rating') r.sort((a, b) => b.rating - a.rating)
    if (sort === 'price') r.sort((a, b) => fromPrice(a) - fromPrice(b))
    return r
  }, [allGigs, q, cat, sub, budget, days, level, abc, urdu, sort, s.me])

  const catObj = categories.find((c) => c.slug === cat)

  return (
    <div className="ac-wrap ac-browse">
      <aside className="ac-filters" aria-label="Filters">
        <div className="ac-filter-head"><h2>Filter</h2>{[...params.keys()].length > 0 && <button className="ac-clear" onClick={() => setParams({})}>Clear all</button>}</div>
        <fieldset><legend>Category</legend>
          <select value={cat} onChange={(e) => set('cat', e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
          {catObj && <select value={sub} onChange={(e) => set('sub', e.target.value)} aria-label="Subcategory"><option value="">All {catObj.name}</option>{catObj.subs.map((x) => <option key={x}>{x}</option>)}</select>}
        </fieldset>
        <fieldset><legend>Budget (starting price)</legend>
          {[['', 'Any'], ['low', 'Under PKR 5,000'], ['mid', 'PKR 5,000–20,000'], ['high', 'Over PKR 20,000']].map(([v, l]) => <label key={l}><input type="radio" name="budget" checked={budget === v} onChange={() => set('budget', v)} /> {l}</label>)}
        </fieldset>
        <fieldset><legend>Delivery time</legend>
          {[['', 'Anytime'], ['1', 'Up to 24 hours'], ['3', 'Up to 3 days'], ['7', 'Up to 7 days']].map(([v, l]) => <label key={l}><input type="radio" name="days" checked={days === v} onChange={() => set('days', v)} /> {l}</label>)}
        </fieldset>
        <fieldset><legend>Seller level</legend>
          <select value={level} onChange={(e) => set('level', e.target.value)}><option value="">Any level</option>{levels.map((l) => <option key={l}>{l}</option>)}</select>
        </fieldset>
        <fieldset><legend>Trust & language</legend>
          <label><input type="checkbox" checked={abc} onChange={(e) => set('abc', e.target.checked ? '1' : '')} /> ABC-certified seller</label>
          <label><input type="checkbox" checked={urdu} onChange={(e) => set('urdu', e.target.checked ? '1' : '')} /> Speaks Urdu</label>
        </fieldset>
      </aside>
      <section className="ac-results">
        <div className="ac-results-head">
          <div><h1>{q ? `Results for “${params.get('q')}”` : sub || catObj?.name || 'All services'}</h1><p className="muted">{list.length} service{list.length === 1 ? '' : 's'} available</p></div>
          <label className="ac-sort">Sort by
            <select value={sort} onChange={(e) => set('sort', e.target.value)}><option value="">Recommended</option><option value="reviews">Most reviewed</option><option value="rating">Highest rated</option><option value="price">Lowest price</option></select>
          </label>
        </div>
        {list.length ? <div className="ac-grid three">{list.map((g) => <GigCard key={g.id} gig={g} />)}</div> : <Empty title="No services found" text="Try a different search or remove a filter." cta={<button className="btn btn-outline" onClick={() => setParams({})}>Clear filters</button>} />}
      </section>
    </div>
  )
}
