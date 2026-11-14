import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { people } from '../data'
import { useMagnets } from '../store'
import { Avatar, Composer, MagnetTile, Name, PostCard, Section, StoriesBar } from '../ui'

export default function Home() {
  const { s, myMagnets, magnet, isMember, join, connect, visible, canSee } = useMagnets()
  const [tab, setTab] = useState<'foryou' | 'following' | 'trending'>('foryou')
  const visiblePosts = s.posts.filter((p) => canSee(p.magnetId))
  const feed = (tab === 'following' ? visiblePosts.filter((p) => s.following.includes(p.authorId) || p.authorId === 'me')
    : tab === 'trending' ? [...visiblePosts].sort((a, b) => Object.values(b.reactions).reduce((x, y) => x + y, 0) + b.comments.length * 5 - (Object.values(a.reactions).reduce((x, y) => x + y, 0) + a.comments.length * 5))
    : visiblePosts.filter((p) => isMember(p.magnetId) || p.authorId === 'me'))
  const suggestions = s.magnets.filter((m) => visible(m) && !isMember(m.id) && m.privacy === 'Public').sort((a, b) => b.members - a.members).slice(0, 4)
  const tagCounts: Record<string, number> = {}
  s.posts.forEach((p) => (p.text.match(/#[\p{L}\p{N}_]+/gu) ?? []).forEach((t) => (tagCounts[t.slice(1).toLowerCase()] = (tagCounts[t.slice(1).toLowerCase()] ?? 0) + 1)))
  const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const peopleToMeet = people.filter((p) => !s.connections.includes(p.id)).slice(0, 3)

  return (
    <div className="ac-wrap mg-layout">
      <aside className="mg-left">
        <Section title="My magnets" action={<Link to="/magnets/new" className="small">+ New</Link>}>
          <ul className="mg-list">{myMagnets.slice(0, 8).map((m) => (
            <li key={m.id}><Link to={`/magnets/m/${m.id}`}><MagnetTile m={m} size={30} /><span>{m.name}{m.parentId && <small className="muted"> in {magnet(m.parentId)?.name}</small>}</span></Link></li>
          ))}</ul>
          <Link to="/magnets/discover" className="link-arrow small">Discover more <Icon name="arrow" size={12} /></Link>
        </Section>
        <Section title="Shortcuts">
          <ul className="mg-list plain">
            <li><Link to="/magnets/me?tab=saved">Saved posts ({s.saved.length})</Link></li>
            <li><Link to="/magnets/chats">Chats</Link></li>
            <li><Link to="/lancer">Skill Lancer</Link></li>
            <li><Link to="/academy">Skill Academy</Link></li>
          </ul>
        </Section>
      </aside>

      <div className="mg-center">
        <StoriesBar />
        <Composer />
        <div className="tabs mg-feed-tabs" role="tablist">
          {([['foryou', 'My magnets'], ['following', 'Following'], ['trending', 'Trending']] as const).map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{l}</button>)}
        </div>
        {feed.length ? feed.map((p) => <PostCard key={p.id} post={p} compact />) : <p className="muted card">Nothing here yet. Join more magnets or follow people.</p>}
      </div>

      <aside className="mg-right">
        <Section title="Magnets for you">
          <ul className="mg-list">{suggestions.map((m) => (
            <li key={m.id} className="mg-suggest"><Link to={`/magnets/m/${m.id}`}><MagnetTile m={m} size={34} /><span>{m.name}<small className="muted">{m.members.toLocaleString()} members</small></span></Link><button className="btn btn-outline btn-sm" onClick={() => join(m.id)}>Join</button></li>
          ))}</ul>
        </Section>
        <Section title="Trending tags">
          <div className="ac-chips">{tags.map(([t, n]) => <Link key={t} to={`/magnets/discover?tag=${t}`} className="ac-chip">#{t} <span className="muted">{n}</span></Link>)}</div>
        </Section>
        <Section title="People to connect with">
          <ul className="mg-list">{peopleToMeet.map((p) => (
            <li key={p.id} className="mg-suggest"><Link to={`/magnets/u/${p.id}`}><Avatar p={p} size={34} /><span><Name p={p} link={false} /><small className="muted mg-clamp1">{p.headline}</small></span></Link>
              <button className="btn btn-ghost btn-sm" disabled={s.requested.includes(p.id)} onClick={() => connect(p.id)}>{s.requested.includes(p.id) ? 'Pending' : 'Connect'}</button></li>
          ))}</ul>
        </Section>
      </aside>
    </div>
  )
}
