import { Link, useSearchParams } from 'react-router-dom'
import { people } from '../data'
import { useMagnets } from '../store'
import { Avatar, Breadcrumb, MagnetTile, Name, PostCard, Tree } from '../ui'
import { Empty } from '../../academy/ui'

export default function Discover() {
  const [params, setParams] = useSearchParams()
  const { s, visible, isMember, join, canSee } = useMagnets()
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const tag = (params.get('tag') ?? '').toLowerCase()

  if (tag) {
    const posts = s.posts.filter((p) => canSee(p.magnetId) && p.text.toLowerCase().includes(`#${tag}`))
    const mags = s.magnets.filter((m) => visible(m) && m.tags.includes(tag))
    return (
      <div className="ac-wrap mg-page">
        <header className="ac-row-head"><div><h1>#{tag}</h1><p className="muted">{posts.length} posts · {mags.length} magnets</p></div><button className="btn btn-ghost" onClick={() => setParams({})}>Clear</button></header>
        {mags.length > 0 && <div className="mg-mag-grid">{mags.map((m) => <MagCard key={m.id} id={m.id} />)}</div>}
        <div className="mg-center narrow">{posts.length ? posts.map((p) => <PostCard key={p.id} post={p} compact />) : <Empty title="No posts with this tag yet" text="Be the first to post about it." />}</div>
      </div>
    )
  }

  if (q) {
    const mags = s.magnets.filter((m) => visible(m) && `${m.name} ${m.description} ${m.tags.join(' ')}`.toLowerCase().includes(q))
    const ppl = [s.me, ...people].filter((p) => `${p.name} ${p.headline} ${p.skills.map((x) => x.name).join(' ')}`.toLowerCase().includes(q))
    const posts = s.posts.filter((p) => canSee(p.magnetId) && p.text.toLowerCase().includes(q))
    return (
      <div className="ac-wrap mg-page">
        <header className="ac-row-head"><div><h1>Results for “{params.get('q')}”</h1><p className="muted">{mags.length} magnets · {ppl.length} people · {posts.length} posts</p></div><button className="btn btn-ghost" onClick={() => setParams({})}>Clear</button></header>
        {mags.length > 0 && <section><h2>Magnets</h2><div className="mg-mag-grid">{mags.map((m) => <MagCard key={m.id} id={m.id} />)}</div></section>}
        {ppl.length > 0 && <section><h2>People</h2><div className="mg-people">{ppl.map((p) => <Link key={p.id} to={p.id === 'me' ? '/magnets/me' : `/magnets/u/${p.id}`} className="card mg-person"><Avatar p={p} size={48} /><div><Name p={p} link={false} /><span className="muted small">{p.headline}</span></div></Link>)}</div></section>}
        {posts.length > 0 && <section><h2>Posts</h2><div className="mg-center narrow">{posts.map((p) => <PostCard key={p.id} post={p} compact />)}</div></section>}
        {!mags.length && !ppl.length && !posts.length && <Empty title="Nothing found" text="Try a broader word, or create a magnet for it." cta={<Link to="/magnets/new" className="btn btn-primary">Create a magnet</Link>} />}
      </div>
    )
  }

  const featured = s.magnets.filter((m) => visible(m) && m.featured)
  return (
    <div className="ac-wrap mg-page">
      <header className="ac-row-head"><div><h1>Discover magnets</h1><p className="muted">Communities go from broad domains down to very specific niches — open any magnet to see its subgroups.</p></div><Link to="/magnets/new" className="btn btn-primary">Create a magnet</Link></header>
      <section><h2>Featured domains</h2><div className="mg-mag-grid">{featured.map((m) => <MagCard key={m.id} id={m.id} />)}</div></section>
      <section className="card"><h2>Browse every magnet</h2><p className="muted small">Expand a domain to see its groups and subgroups.</p><Tree /></section>
    </div>
  )

  function MagCard({ id }: { id: string }) {
    const m = s.magnets.find((x) => x.id === id)!
    return (
      <div className="card mg-mag-card" style={{ ['--h' as string]: m.hue }}>
        <div className="mg-mag-cover" />
        <MagnetTile m={m} size={52} />
        <Link to={`/magnets/m/${m.id}`}><strong>{m.name}</strong></Link>
        {m.parentId && <span className="small muted"><Breadcrumb id={m.id} /></span>}
        <span className="muted small mg-clamp">{m.description}</span>
        <span className="small">{m.members.toLocaleString()} members · {m.privacy}</span>
        {isMember(m.id) ? <Link to={`/magnets/m/${m.id}`} className="btn btn-ghost btn-sm">Open</Link> : <button className="btn btn-primary btn-sm" onClick={() => join(m.id)}>{m.privacy === 'Public' ? 'Join' : 'Request to join'}</button>}
      </div>
    )
  }
}
