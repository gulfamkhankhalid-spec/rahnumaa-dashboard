import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { icons, people, type Privacy } from '../data'
import { resizeImage, useMagnets, type Role } from '../store'
import { Avatar, Breadcrumb, Composer, MagnetTile, Name, Photo, PostCard, StoriesBar } from '../ui'
import { Empty } from '../../academy/ui'
import NotFound from '../../pages/site/NotFound'

export function ChatPanel({ threadId, title }: { threadId: string; title: string }) {
  const { s, person, send, reactChat, markRead, typing } = useMagnets()
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [err, setErr] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const msgs = s.chats[threadId] ?? []
  useEffect(() => { markRead(threadId); end.current?.scrollIntoView({ block: 'nearest' }) }, [msgs.length, threadId]) // eslint-disable-line react-hooks/exhaustive-deps
  const quoted = replyTo ? msgs.find((m) => m.id === replyTo) : undefined

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    send(threadId, text.trim(), undefined, replyTo ?? undefined)
    setText(''); setReplyTo(null)
  }

  return (
    <div className="mg-chat">
      <div className="mg-chat-msgs" aria-live="polite">
        <p className="mg-chat-note small">🔒 Messages in “{title}” are visible to its members. Be kind and on-topic.</p>
        {msgs.map((m) => {
          const mine = m.from === 'me'
          const q = m.replyTo ? msgs.find((x) => x.id === m.replyTo) : undefined
          return (
            <div key={m.id} className={`mg-msg ${mine ? 'me' : ''}`}>
              {!mine && <Avatar p={person(m.from)} size={28} />}
              <div className="mg-msg-bubble">
                {!mine && !threadId.startsWith('dm-') && <strong className="mg-msg-author" style={{ ['--h' as string]: person(m.from).hue }}>{person(m.from).name.replace('Sample Member — ', '')}</strong>}
                {q && <span className="mg-quote">{person(q.from).name.replace('Sample Member — ', '').replace('Ayesha Khan', 'You')}: {q.text.slice(0, 80)}</span>}
                {m.image && <img src={m.image} alt="Shared" className="mg-msg-img" />}
                {m.text && <span>{m.text}</span>}
                <span className="mg-msg-time">{m.time}{mine && ' ✓✓'}</span>
                {m.reactions?.length ? <span className="mg-msg-reacts">{m.reactions.join('')}</span> : null}
                <span className="mg-msg-tools">
                  {['👍', '❤️', '😂'].map((e) => <button key={e} onClick={() => reactChat(threadId, m.id, e)} aria-label={`React ${e}`}>{e}</button>)}
                  <button onClick={() => setReplyTo(m.id)} aria-label="Reply">↩</button>
                </span>
              </div>
            </div>
          )
        })}
        {typing[threadId] && <p className="mg-typing small muted">{person(typing[threadId]!).name.replace('Sample Member — ', '')} is typing…</p>}
        <div ref={end} />
      </div>
      {quoted && <div className="mg-replying small">Replying to {person(quoted.from).name.replace('Sample Member — ', '')}: “{quoted.text.slice(0, 60)}” <button className="ac-link-btn" onClick={() => setReplyTo(null)}>Cancel</button></div>}
      {err && <p className="lc-error small">{err}</p>}
      <form className="mg-chat-compose" onSubmit={submit}>
        <label className="mg-attach" aria-label="Send a photo">📎<input type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { setErr(''); send(threadId, '', await resizeImage(f, 600)) } catch (x) { setErr((x as Error).message) } }} /></label>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" aria-label="Message" />
        <button className="btn btn-primary btn-sm" disabled={!text.trim()}>Send</button>
      </form>
    </div>
  )
}

const tabs = [['discussion', 'Discussion'], ['subgroups', 'Subgroups'], ['chat', 'Chat'], ['media', 'Media'], ['events', 'Events'], ['members', 'Members'], ['about', 'About']] as const

export default function MagnetPage() {
  const { id = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { s, magnet, children, isMember, join, leave, canManage, canSee, visible, person, setRole, updateMagnet, deleteMagnet, openDm } = useMagnets()
  const [editing, setEditing] = useState(false)
  const m = magnet(id)
  const [form, setForm] = useState({ name: '', description: '', privacy: 'Public' as Privacy, rules: '', icon: 'magnet', hue: 175 })
  useEffect(() => { if (m) setForm({ name: m.name, description: m.description, privacy: m.privacy, rules: m.rules.join('\n'), icon: m.icon, hue: m.hue }) }, [m?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!m || (m.privacy === 'Hidden' && !isMember(m.id) && !s.asAdmin)) return <NotFound />

  const tab = params.get('tab') ?? 'discussion'
  const member = isMember(m.id)
  const status = s.membership[m.id]
  const manage = canManage(m.id)
  const allowed = canSee(m.id)
  const subs = children(m.id).filter(visible)
  const posts = s.posts.filter((p) => p.magnetId === m.id).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned))
  const media = posts.filter((p) => p.image)
  const events = posts.filter((p) => p.event)
  const roster = [...new Set([m.ownerId, ...posts.map((p) => p.authorId), ...people.slice(0, 5).map((p) => p.id)])].filter((pid) => pid !== 'admin' && pid !== 'me')
  const roleOf = (pid: string): Role => s.roles[m.id]?.[pid] ?? (pid === m.ownerId ? 'Owner' : 'Member')

  return (
    <div className="mg-magnet">
      <div className="mg-cover" style={{ ['--h' as string]: m.hue }} />
      <div className="ac-wrap">
        <header className="mg-mhead">
          <MagnetTile m={m} size={88} />
          <div className="mg-mhead-info">
            {m.parentId && <Breadcrumb id={m.id} />}
            <h1>{m.name}</h1>
            <p className="muted small">{m.privacy === 'Public' ? '🌐 Public' : m.privacy === 'Private' ? '🔒 Private' : '🙈 Hidden'} magnet · {m.members.toLocaleString()} members · {subs.length} subgroups{m.createdBy === 'member' ? ' · created by a member' : ''}{m.locked ? ' · 🔐 Locked' : ''}{m.status !== 'Active' ? ' · ⏳ Pending approval' : ''}</p>
          </div>
          <div className="mg-mhead-actions">
            {member ? (
              <>
                <span className="mg-joined big">✓ {status}</span>
                <Link to={`/magnets/new?parent=${m.id}`} className="btn btn-outline btn-sm">+ Subgroup</Link>
                {status !== 'Owner' && <button className="btn btn-ghost btn-sm" onClick={() => leave(m.id)}>Leave</button>}
              </>
            ) : status === 'Requested' ? <span className="mg-joined big pending">Request sent</span>
              : <button className="btn btn-primary" onClick={() => join(m.id)}>{m.privacy === 'Public' ? 'Join magnet' : 'Request to join'}</button>}
          </div>
        </header>

        <div className="tabs mg-mtabs" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setParams({ tab: k }, { replace: true })}>{l}{k === 'subgroups' && subs.length ? ` (${subs.length})` : ''}</button>)}</div>

        {!allowed && tab !== 'about' && tab !== 'subgroups' ? (
          <Empty title="This is a private magnet" text="Only members can see posts, chat and media. Request to join — an admin will review it." cta={status === 'Requested' ? <span className="muted">Request sent — we’ll notify you.</span> : <button className="btn btn-primary" onClick={() => join(m.id)}>Request to join</button>} />
        ) : (
          <div className="mg-mbody">
            <div className="mg-center">
              {tab === 'discussion' && (<>
                <StoriesBar magnetId={m.id} />
                {member ? <Composer magnetId={m.id} /> : <div className="card mg-joinbar"><span>Join to post, comment and chat.</span><button className="btn btn-primary btn-sm" onClick={() => join(m.id)}>Join</button></div>}
                {posts.length ? posts.map((p) => <PostCard key={p.id} post={p} compact />) : <Empty title="No posts yet" text="Start the first discussion." />}
              </>)}

              {tab === 'subgroups' && (
                <section className="card">
                  <div className="card-head"><h2>Subgroups of {m.name}</h2>{member && <Link to={`/magnets/new?parent=${m.id}`} className="btn btn-primary btn-sm">+ Create subgroup</Link>}</div>
                  <p className="muted small">Go deeper for very specific discussion. Any member can create a subgroup{s.settings.approval ? ' (reviewed by admins before it goes live)' : ''}.</p>
                  {subs.length ? <ul className="mg-subs">{subs.map((c) => (
                    <li key={c.id}><Link to={`/magnets/m/${c.id}`} className="mg-sub"><MagnetTile m={c} size={40} /><div><strong>{c.name}</strong><span className="muted small">{c.description}</span><span className="small">{c.members.toLocaleString()} members · {children(c.id).filter(visible).length} subgroups{c.privacy !== 'Public' ? ` · ${c.privacy}` : ''}{c.status !== 'Active' ? ' · Pending approval' : ''}</span></div>{isMember(c.id) && <span className="mg-joined">Joined</span>}</Link></li>
                  ))}</ul> : <Empty title="No subgroups yet" text={`Create the first niche inside ${m.name}.`} />}
                </section>
              )}

              {tab === 'chat' && (member ? <section className="card mg-chat-card"><h2>{m.name} group chat</h2><ChatPanel threadId={m.id} title={m.name} /></section> : <Empty title="Members-only chat" text="Join to chat with members in real time." cta={<button className="btn btn-primary" onClick={() => join(m.id)}>Join</button>} />)}

              {tab === 'media' && (media.length ? <div className="mg-grid">{media.map((p) => <Link key={p.id} to={`/magnets/p/${p.id}`} className="mg-grid-item" aria-label={p.text.slice(0, 60)}><Photo src={p.image!} alt={p.text.slice(0, 60)} /></Link>)}</div> : <Empty title="No photos yet" text="Photos posted here show up as a grid." />)}

              {tab === 'events' && (events.length ? events.map((p) => <PostCard key={p.id} post={p} compact />) : <Empty title="No events yet" text="Create an event from the post composer." />)}

              {tab === 'members' && (
                <section className="card">
                  <h2>Members</h2>
                  <ul className="mg-members">
                    {member && <li><Avatar p={s.me} size={40} /><div><Name p={s.me} /><span className="muted small">{s.me.headline}</span></div><span className="mg-role">{status}</span></li>}
                    {roster.map((pid) => {
                      const p = person(pid)
                      const r = roleOf(pid)
                      return (
                        <li key={pid}><Avatar p={p} size={40} /><div><Name p={p} /><span className="muted small">{p.headline}</span></div>
                          {manage && r !== 'Owner' ? (
                            <select value={r} onChange={(e) => setRole(m.id, pid, e.target.value as Role)} aria-label={`Role for ${p.name}`}><option>Member</option><option>Moderator</option><option>Admin</option></select>
                          ) : <span className="mg-role">{r}</span>}
                          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/magnets/chats/${openDm(pid)}`)}>Message</button>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}

              {tab === 'about' && (
                <section className="card">
                  {editing ? (
                    <form className="ac-form" onSubmit={(e) => { e.preventDefault(); updateMagnet(m.id, { name: form.name.trim(), description: form.description.trim(), privacy: form.privacy, rules: form.rules.split('\n').map((r) => r.trim()).filter(Boolean), icon: form.icon, hue: form.hue }); setEditing(false) }}>
                      <h2>Edit magnet</h2>
                      <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                      <label>Description<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                      <label>Privacy<select value={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.value as Privacy })}><option>Public</option><option>Private</option><option>Hidden</option></select></label>
                      <label>Rules (one per line)<textarea rows={4} value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} /></label>
                      <fieldset className="ac-inline"><legend>Icon</legend>{icons.map((ic) => <label key={ic}><input type="radio" name="icon" checked={form.icon === ic} onChange={() => setForm({ ...form, icon: ic })} /> {ic}</label>)}</fieldset>
                      <div className="mg-swatches">{[175, 20, 45, 120, 205, 260, 300, 330].map((h) => <button type="button" key={h} className={form.hue === h ? 'on' : ''} style={{ ['--h' as string]: h }} onClick={() => setForm({ ...form, hue: h })} aria-label={`Colour ${h}`} />)}</div>
                      <div className="lc-head-actions"><button className="btn btn-primary" type="submit" disabled={!form.name.trim()}>Save</button><button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button></div>
                    </form>
                  ) : (
                    <>
                      <div className="card-head"><h2>About</h2>{manage && <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit</button>}</div>
                      <p>{m.description}</p>
                      {m.tags.length > 0 && <div className="ac-chips">{m.tags.map((t) => <Link key={t} to={`/magnets/discover?tag=${t}`} className="ac-chip">#{t}</Link>)}</div>}
                      <h3>Rules</h3>
                      <ol className="mg-rules">{m.rules.map((r) => <li key={r}>{r}</li>)}</ol>
                      <p className="muted small">Created {m.created} by {m.ownerId === 'admin' ? 'Skill Magnets admins' : m.ownerId === 'me' ? 'you' : person(m.ownerId).name}.</p>
                      {manage && (
                        <div className="mg-admin-tools">
                          <h3>Admin tools</h3>
                          <div className="lc-head-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => updateMagnet(m.id, { locked: !m.locked })}>{m.locked ? 'Unlock posting' : 'Lock posting'}</button>
                            <button className="btn btn-ghost btn-sm danger-text" onClick={() => { if (window.confirm(`Delete ${m.name} and all its subgroups? This cannot be undone.`)) { deleteMagnet(m.id); navigate('/magnets/discover') } }}>Delete magnet</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}
            </div>
            <aside className="mg-right">
              <section className="card mg-side"><h3>About</h3><p className="small">{m.description}</p><Link to={`?tab=about`} className="small">Rules & details</Link></section>
              {subs.length > 0 && <section className="card mg-side"><h3>Subgroups</h3><ul className="mg-list">{subs.slice(0, 6).map((c) => <li key={c.id}><Link to={`/magnets/m/${c.id}`}><MagnetTile m={c} size={28} /><span>{c.name}</span></Link></li>)}</ul></section>}
              <section className="card mg-side"><h3>Active members</h3><ul className="mg-list">{roster.slice(0, 4).map((pid) => <li key={pid}><Link to={`/magnets/u/${pid}`}><Avatar p={person(pid)} size={28} /><span>{person(pid).name.replace('Sample Member — ', '')}</span></Link></li>)}</ul></section>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
