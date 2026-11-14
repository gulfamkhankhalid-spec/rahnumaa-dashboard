import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { icons, people, type Privacy } from '../data'
import { useMagnets } from '../store'
import { Avatar, Breadcrumb, MagnetTile, Name, Photo, PostCard, Tree } from '../ui'
import { ChatPanel } from './MagnetPage'
import { Empty } from '../../academy/ui'
import NotFound from '../../pages/site/NotFound'

export function NewMagnet() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { s, magnet, createMagnet, isMember } = useMagnets()
  const [parentId, setParentId] = useState<string | null>(params.get('parent'))
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState<Privacy>('Public')
  const [tags, setTags] = useState('')
  const [rules, setRules] = useState('Be respectful and helpful\nNo spam or unsolicited selling')
  const [icon, setIcon] = useState('magnet')
  const [hue, setHue] = useState(parentId ? magnet(parentId)?.hue ?? 175 : 175)
  const [picking, setPicking] = useState(false)
  const [done, setDone] = useState<{ id: string; pending: boolean } | null>(null)
  const parent = parentId ? magnet(parentId) : null
  const topBlocked = !parentId && s.settings.topLevel === 'admins' && !s.asAdmin
  const needsMember = parent && !isMember(parent.id) && !s.asAdmin

  function submit(e: FormEvent) {
    e.preventDefault()
    setDone(createMagnet({ name: name.trim(), parentId, description: description.trim(), privacy, hue, icon, tags: tags.split(/[,\s]+/).map((t) => t.replace('#', '').toLowerCase()).filter(Boolean), rules: rules.split('\n').map((r) => r.trim()).filter(Boolean) }))
  }

  if (done) return (
    <div className="ac-wrap mg-page narrow">
      <div className="card mg-done">
        <Icon name={done.pending ? 'calendar' : 'check'} size={32} className="accent" />
        <h1>{done.pending ? 'Sent for approval' : 'Your magnet is live!'}</h1>
        <p className="muted">{done.pending ? 'A platform admin will review it. You can see it in your list meanwhile; others will see it once approved.' : 'You are the owner. Invite people, set rules and start the first discussion.'}</p>
        <div className="lc-head-actions"><button className="btn btn-primary" onClick={() => navigate(`/magnets/m/${done.id}`)}>Open magnet</button><button className="btn btn-ghost" onClick={() => navigate(`/magnets/new?parent=${done.id}`)}>Add a subgroup inside it</button></div>
      </div>
    </div>
  )

  return (
    <div className="ac-wrap mg-page narrow">
      <header><h1>Create a magnet</h1><p className="muted">Start a new community — a broad domain, a group inside one, or a very specific subgroup.</p></header>
      <form className="card ac-form" onSubmit={submit}>
        <div className="mg-parent">
          <span className="small"><strong>Where does it belong?</strong></span>
          {parent ? <span className="mg-parent-path"><Breadcrumb id={parent.id} /> › <strong>{name || 'New magnet'}</strong></span> : <span className="mg-parent-path"><strong>{name || 'New magnet'}</strong> <span className="muted small">(top-level domain)</span></span>}
          <div className="lc-head-actions"><button type="button" className="btn btn-ghost btn-sm" onClick={() => setPicking(!picking)}>{picking ? 'Close' : 'Choose parent'}</button>{parent && <button type="button" className="ac-link-btn" onClick={() => setParentId(null)}>Make it top-level</button>}</div>
          {picking && <div className="mg-picker-tree"><Tree onPick={(id) => { setParentId(id); setHue(magnet(id)?.hue ?? 175); setPicking(false) }} /></div>}
        </div>
        {topBlocked && <p className="note"><Icon name="info" size={18} /> Only platform admins can create new top-level domains on this platform. Your request will be sent to admins for approval — or choose a parent to create a group instantly.</p>}
        {needsMember && <p className="note"><Icon name="info" size={18} /> Join {parent!.name} first to create a subgroup inside it.</p>}
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder={parent ? `e.g. a niche inside ${parent.name}` : 'e.g. E-commerce'} maxLength={60} /></label>
        <label>Description<textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will members discuss here?" /></label>
        <fieldset className="lc-radio-cards"><legend>Privacy</legend>
          {([['Public', 'Anyone can see posts and join'], ['Private', 'Anyone can find it; members are approved'], ['Hidden', 'Only members can find it; invite only']] as const).map(([v, d]) => (
            <label key={v} className={privacy === v ? 'on' : ''}><input type="radio" name="privacy" checked={privacy === v} onChange={() => setPrivacy(v)} /><strong>{v}</strong><span className="muted small">{d}</span></label>
          ))}
        </fieldset>
        <label>Tags (comma-separated)<input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ppc, amazon, ads" /></label>
        <label>Rules (one per line)<textarea rows={3} value={rules} onChange={(e) => setRules(e.target.value)} /></label>
        <fieldset className="ac-inline"><legend>Icon</legend>{icons.map((ic) => <label key={ic}><input type="radio" name="icon" checked={icon === ic} onChange={() => setIcon(ic)} /> {ic}</label>)}</fieldset>
        <div className="mg-swatches" role="group" aria-label="Colour">{[175, 20, 45, 120, 205, 260, 300, 330].map((h) => <button type="button" key={h} className={hue === h ? 'on' : ''} style={{ ['--h' as string]: h }} onClick={() => setHue(h)} aria-label={`Colour ${h}`} />)}</div>
        <button className="btn btn-primary" type="submit" disabled={name.trim().length < 2 || description.trim().length < 5 || !!needsMember}>{topBlocked || (s.settings.approval && !s.asAdmin) ? 'Submit for approval' : 'Create magnet'}</button>
      </form>
    </div>
  )
}

export function PostPage() {
  const { id = '' } = useParams()
  const { s, canSee } = useMagnets()
  const post = s.posts.find((p) => p.id === id)
  if (!post || !canSee(post.magnetId)) return <NotFound />
  return <div className="ac-wrap mg-page narrow"><Link to={`/magnets/m/${post.magnetId}`} className="back-link">← Back to magnet</Link><PostCard post={post} /></div>
}

export function Chats() {
  const { threadId } = useParams()
  const navigate = useNavigate()
  const { s, magnet, person, unread, isMember, openDm } = useMagnets()
  const [q, setQ] = useState('')
  const [newChat, setNewChat] = useState(false)
  const threads = Object.keys(s.chats).filter((k) => k.startsWith('dm-') || isMember(k)).map((k) => {
    const msgs = s.chats[k]
    const last = msgs[msgs.length - 1]
    const dm = k.startsWith('dm-')
    return { id: k, dm, title: dm ? person(k.slice(3)).name : magnet(k)?.name ?? k, last, unread: unread(k) }
  }).filter((t) => t.title.toLowerCase().includes(q.toLowerCase()))
  // Joined magnets without messages yet still appear as group chats.
  s.magnets.filter((mg) => isMember(mg.id) && !s.chats[mg.id] && mg.name.toLowerCase().includes(q.toLowerCase())).forEach((mg) => threads.push({ id: mg.id, dm: false, title: mg.name, last: undefined as never, unread: 0 }))
  const current = threadId ? threads.find((t) => t.id === threadId) : undefined

  return (
    <div className="ac-wrap mg-chats">
      <aside className={`mg-chat-list ${threadId ? 'has-open' : ''}`}>
        <div className="mg-chat-list-head"><h1>Chats</h1><button className="btn btn-ghost btn-sm" onClick={() => setNewChat(!newChat)}>{newChat ? 'Close' : 'New message'}</button></div>
        {newChat && <ul className="mg-list">{people.map((p) => <li key={p.id}><button className="mg-thread" onClick={() => { setNewChat(false); navigate(`/magnets/chats/${openDm(p.id)}`) }}><Avatar p={p} size={36} /><span>{p.name}</span></button></li>)}</ul>}
        <label className="search"><Icon name="search" size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats" aria-label="Search chats" /></label>
        {threads.map((t) => (
          <button key={t.id} className={`mg-thread ${threadId === t.id ? 'active' : ''}`} onClick={() => navigate(`/magnets/chats/${t.id}`)}>
            {t.dm ? <Avatar p={person(t.id.slice(3))} size={44} /> : magnet(t.id) && <MagnetTile m={magnet(t.id)!} size={44} />}
            <div><strong>{t.title}</strong><span className="muted small">{t.last ? `${t.last.from === 'me' ? 'You: ' : t.dm ? '' : person(t.last.from).name.replace('Sample Member — ', '') + ': '}${t.last.image ? '📷 Photo' : t.last.text}` : t.dm ? 'Say hello' : 'Group chat'}</span></div>
            <span className="mg-thread-meta">{t.last && <span className="small muted">{t.last.time}</span>}{t.unread > 0 && <span className="mg-badge static">{t.unread}</span>}</span>
          </button>
        ))}
      </aside>
      {current ? (
        <section className="card mg-chat-window">
          <header className="mg-chat-head">
            <button className="ac-link-btn mg-back" onClick={() => navigate('/magnets/chats')}>←</button>
            {current.dm ? <Avatar p={person(current.id.slice(3))} size={38} /> : <MagnetTile m={magnet(current.id)!} size={38} />}
            <div><strong>{current.title}</strong><span className="muted small">{current.dm ? person(current.id.slice(3)).headline : `${magnet(current.id)?.members.toLocaleString()} members`}</span></div>
            <Link to={current.dm ? `/magnets/u/${current.id.slice(3)}` : `/magnets/m/${current.id}`} className="small">{current.dm ? 'Profile' : 'Magnet'}</Link>
          </header>
          <ChatPanel threadId={current.id} title={current.title} />
        </section>
      ) : <section className="card mg-chat-window empty"><Icon name="users" size={36} /><p className="muted">Choose a chat — group chats for each magnet you’ve joined, or direct messages.</p></section>}
    </div>
  )
}

export function Profile({ self }: { self?: boolean }) {
  const { id = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { s, person, follow, connect, endorse, openDm, isMember, magnet, updateMe, canSee } = useMagnets()
  const [editing, setEditing] = useState(false)
  const p = self ? s.me : people.find((x) => x.id === id)
  const [headline, setHeadline] = useState(s.me.headline)
  const [about, setAbout] = useState(s.me.about)
  if (!p) return <NotFound />
  const tab = params.get('tab') ?? 'posts'
  const posts = s.posts.filter((x) => x.authorId === p.id && canSee(x.magnetId))
  const mags = self ? s.magnets.filter((m) => isMember(m.id)) : [...new Set(s.posts.filter((x) => x.authorId === p.id).map((x) => x.magnetId))].map((mid) => magnet(mid)).filter((m): m is NonNullable<typeof m> => !!m)
  const connected = s.connections.includes(p.id)
  const pending = s.requested.includes(p.id)
  const tabs: [string, string][] = [['posts', 'Posts'], ['media', 'Media'], ['magnets', 'Magnets'], ...(self ? [['saved', 'Saved'] as [string, string]] : [])]

  return (
    <div className="mg-profile">
      <div className="mg-cover" style={{ ['--h' as string]: p.hue }} />
      <div className="ac-wrap">
        <header className="card mg-phead">
          <Avatar p={p} size={120} ring />
          <div className="mg-phead-info">
            <h1><Name p={p} link={false} /></h1>
            {editing ? <input className="sd-input" value={headline} onChange={(e) => setHeadline(e.target.value)} aria-label="Headline" /> : <p className="lead">{p.headline}</p>}
            <p className="muted small">{p.city}, Pakistan · {self ? s.connections.length : 120 + p.hue} connections · {self ? s.following.length : 300 + p.hue * 2} followers</p>
            {p.abc.length > 0 && <div className="ac-chips">{p.abc.map((a) => <Link key={a} to="/abc" className="ac-chip mg-abc"><Icon name="award" size={13} /> ABC: {a}</Link>)}</div>}
          </div>
          <div className="mg-phead-actions">
            {self ? (editing
              ? <><button className="btn btn-primary btn-sm" onClick={() => { updateMe({ headline: headline.trim(), about: about.trim() }); setEditing(false) }}>Save</button><button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button></>
              : <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit profile</button>) : (
              <>
                {connected ? <span className="mg-joined big">✓ Connected</span> : <button className="btn btn-primary btn-sm" disabled={pending} onClick={() => connect(p.id)}>{pending ? 'Request sent' : 'Connect'}</button>}
                <button className="btn btn-ghost btn-sm" onClick={() => follow(p.id)}>{s.following.includes(p.id) ? 'Following' : 'Follow'}</button>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/magnets/chats/${openDm(p.id)}`)}>Message</button>
              </>
            )}
          </div>
        </header>

        <div className="mg-pbody">
          <div className="mg-center">
            <section className="card"><h2>About</h2>{editing ? <textarea className="sd-input" rows={4} value={about} onChange={(e) => setAbout(e.target.value)} aria-label="About" /> : <p>{p.about}</p>}</section>
            <section className="card">
              <h2>Skills</h2>
              <ul className="mg-skills">{p.skills.map((sk) => {
                const key = `${p.id}|${sk.name}`
                const mine = s.endorsed.includes(key)
                return <li key={sk.name}><div><strong>{sk.name}</strong><span className="muted small">{sk.endorsements + (mine ? 1 : 0)} endorsements</span></div>{!self && <button className={`btn btn-sm ${mine ? 'btn-primary' : 'btn-ghost'}`} onClick={() => endorse(p.id, sk.name)}>{mine ? '✓ Endorsed' : 'Endorse'}</button>}</li>
              })}</ul>
            </section>
            <section className="card"><h2>Experience</h2><ul className="mg-exp">{p.experience.map((x) => <li key={x.role}><span className="mg-exp-icon"><Icon name="briefcase" size={18} /></span><div><strong>{x.role}</strong><span className="small">{x.org}</span><span className="muted small">{x.years}</span></div></li>)}</ul></section>

            <div className="tabs" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setParams({ tab: k }, { replace: true })}>{l}</button>)}</div>
            {tab === 'posts' && (posts.length ? posts.map((x) => <PostCard key={x.id} post={x} compact />) : <Empty title="No posts yet" text={self ? 'Share something with your magnets.' : 'Nothing posted yet.'} />)}
            {tab === 'media' && (posts.filter((x) => x.image).length ? <div className="mg-grid">{posts.filter((x) => x.image).map((x) => <Link key={x.id} to={`/magnets/p/${x.id}`} className="mg-grid-item"><Photo src={x.image!} /></Link>)}</div> : <Empty title="No photos" text="Photos from posts appear here." />)}
            {tab === 'magnets' && <ul className="mg-subs">{mags.map((m) => <li key={m.id}><Link to={`/magnets/m/${m.id}`} className="mg-sub"><MagnetTile m={m} size={40} /><div><strong>{m.name}</strong>{m.parentId && <span className="small muted"><Breadcrumb id={m.id} /></span>}</div></Link></li>)}</ul>}
            {tab === 'saved' && (s.saved.length ? s.posts.filter((x) => s.saved.includes(x.id)).map((x) => <PostCard key={x.id} post={x} compact />) : <Empty title="Nothing saved" text="Save posts to read later." />)}
          </div>
          <aside className="mg-right">
            <section className="card mg-side"><h3>Verification</h3><p className="small">{p.verified ? '✓ Identity verified with CNIC' : 'Identity not verified yet'}</p>{p.abc.length > 0 && <p className="small">✓ {p.abc.length} ABC credential{p.abc.length > 1 ? 's' : ''}</p>}</section>
            {!self && <section className="card mg-side"><h3>Work with {p.name.replace('Sample Member — ', '')}</h3><Link to="/lancer/talent" className="link-arrow small">Find them on Skill Lancer <Icon name="arrow" size={12} /></Link></section>}
            {!self && <section className="card mg-side"><h3>Mutual magnets</h3><ul className="mg-list">{mags.filter((m) => isMember(m.id)).map((m) => <li key={m.id}><Link to={`/magnets/m/${m.id}`}><MagnetTile m={m} size={26} /><span>{m.name}</span></Link></li>)}</ul></section>}
            {self && <section className="card mg-side"><h3>People</h3><p className="small">{s.connections.length} connections · following {s.following.length}</p><ul className="mg-list">{s.connections.map((cid) => <li key={cid}><Link to={`/magnets/u/${cid}`}><Avatar p={person(cid)} size={26} /><span>{person(cid).name.replace('Sample Member — ', '')}</span></Link></li>)}</ul></section>}
          </aside>
        </div>
      </div>
    </div>
  )
}

export function Notifications() {
  const { s, readAll } = useMagnets()
  return (
    <div className="ac-wrap mg-page narrow">
      <header className="ac-row-head"><h1>Notifications</h1><button className="btn btn-ghost btn-sm" onClick={readAll}>Mark all as read</button></header>
      {s.notices.length ? <ul className="mg-notices">{s.notices.map((n) => <li key={n.id} className={n.read ? '' : 'unread'}><Link to={n.link}><span className="mg-dot" aria-hidden="true" />{n.text}<span className="muted small">{n.time}</span></Link></li>)}</ul> : <Empty title="No notifications" text="You’re all caught up." />}
    </div>
  )
}

export function Admin() {
  const { s, setAsAdmin, setSettings, approveMagnet, deleteMagnet, updateMagnet, resolveReport, person, magnet } = useMagnets()
  const pending = s.magnets.filter((m) => m.status === 'Pending approval')
  const open = s.reports.filter((r) => r.status === 'Open')
  const tops = s.magnets.filter((m) => m.parentId === null)
  const depth = (id: string): number => { const m = magnet(id); return m?.parentId ? 1 + depth(m.parentId) : 1 }

  return (
    <div className="ac-wrap mg-page">
      <header className="ac-row-head">
        <div><h1>Platform admin</h1><p className="muted">Control how communities are created, approve new magnets and handle reports.</p></div>
        <label className="lc-check mg-admin-toggle"><input type="checkbox" checked={s.asAdmin} onChange={(e) => setAsAdmin(e.target.checked)} /> Act as platform admin (prototype)</label>
      </header>
      {!s.asAdmin && <p className="note"><Icon name="lock" size={18} /> You are viewing as a regular member. Tick “Act as platform admin” to use the controls below.</p>}
      <section className="stats">
        <div className="card stat"><span className="stat-label">Magnets</span><span className="stat-value">{s.magnets.length}</span><span className="muted small">{tops.length} domains · up to {Math.max(...s.magnets.map((m) => depth(m.id)))} levels deep</span></div>
        <div className="card stat"><span className="stat-label">Created by members</span><span className="stat-value">{s.magnets.filter((m) => m.createdBy === 'member').length}</span></div>
        <div className="card stat"><span className="stat-label">Waiting for approval</span><span className="stat-value">{pending.length}</span></div>
        <div className="card stat"><span className="stat-label">Open reports</span><span className="stat-value">{open.length}</span></div>
      </section>
      <fieldset className="mg-fieldset" disabled={!s.asAdmin}>
        <div className="app-grid">
          <section className="card ac-form">
            <h2>Community creation rules</h2>
            <fieldset className="ac-methods"><legend>Who can create top-level domains?</legend>
              <label className={s.settings.topLevel === 'admins' ? 'on' : ''}><input type="radio" name="tl" checked={s.settings.topLevel === 'admins'} onChange={() => setSettings({ topLevel: 'admins' })} /> Platform admins only (members can request one)</label>
              <label className={s.settings.topLevel === 'anyone' ? 'on' : ''}><input type="radio" name="tl" checked={s.settings.topLevel === 'anyone'} onChange={() => setSettings({ topLevel: 'anyone' })} /> Any verified member</label>
            </fieldset>
            <label className="lc-check"><input type="checkbox" checked={s.settings.approval} onChange={(e) => setSettings({ approval: e.target.checked })} /> Review every member-created group and subgroup before it goes live</label>
            <p className="muted small">Groups and subgroups inside an existing magnet can always be created by its members{s.settings.approval ? ', after review' : ', instantly'}.</p>
          </section>
          <section className="card">
            <h2>Waiting for approval</h2>
            {pending.length ? <ul className="mg-admin-list">{pending.map((m) => (
              <li key={m.id}><MagnetTile m={m} size={36} /><div><strong>{m.name}</strong><span className="muted small">{m.parentId ? <>in <Breadcrumb id={m.parentId} /></> : 'New top-level domain'} · by {m.ownerId === 'me' ? 'you' : person(m.ownerId).name}</span><span className="small">{m.description}</span></div>
                <div className="lc-row-actions"><button className="btn btn-primary btn-sm" onClick={() => approveMagnet(m.id)}>Approve</button><button className="ac-link-btn danger" onClick={() => deleteMagnet(m.id)}>Reject</button></div></li>
            ))}</ul> : <p className="muted small">Nothing to review.</p>}
          </section>
        </div>
        <section className="card">
          <h2>Reports</h2>
          {s.reports.length ? <table className="table"><thead><tr><th>Post</th><th>Reason</th><th>Status</th><th></th></tr></thead>
            <tbody>{s.reports.map((r) => {
              const post = s.posts.find((p) => p.id === r.postId)
              return <tr key={r.id}><td>{post ? <Link to={`/magnets/p/${post.id}`}>{post.text.slice(0, 70)}…</Link> : <span className="muted">Removed post</span>}</td><td>{r.reason}</td><td>{r.status}</td>
                <td className="lc-row-actions">{r.status === 'Open' && <><button className="ac-link-btn danger" onClick={() => resolveReport(r.id, 'Removed')}>Remove post</button><button className="ac-link-btn" onClick={() => resolveReport(r.id, 'Dismissed')}>Dismiss</button></>}</td></tr>
            })}</tbody></table> : <p className="muted small">No reports.</p>}
        </section>
        <section className="card">
          <h2>All magnets</h2>
          <table className="table"><thead><tr><th>Magnet</th><th>Level</th><th>Members</th><th>Created by</th><th></th></tr></thead>
            <tbody>{s.magnets.map((m) => (
              <tr key={m.id}><td><Link to={`/magnets/m/${m.id}`}>{m.name}</Link>{m.parentId && <><br /><span className="muted small"><Breadcrumb id={m.parentId} /></span></>}</td><td>{depth(m.id)}</td><td>{m.members.toLocaleString()}</td><td className="small">{m.createdBy === 'admin' ? 'Admin' : 'Member'}{m.status !== 'Active' ? ' · pending' : ''}</td>
                <td className="lc-row-actions"><button className="ac-link-btn" onClick={() => updateMagnet(m.id, { featured: !m.featured })}>{m.featured ? 'Unfeature' : 'Feature'}</button><button className="ac-link-btn" onClick={() => updateMagnet(m.id, { locked: !m.locked })}>{m.locked ? 'Unlock' : 'Lock'}</button><button className="ac-link-btn danger" onClick={() => { if (window.confirm(`Delete ${m.name} and its subgroups?`)) deleteMagnet(m.id) }}>Delete</button></td></tr>
            ))}</tbody></table>
        </section>
      </fieldset>
    </div>
  )
}
