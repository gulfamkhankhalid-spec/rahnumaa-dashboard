import { Fragment, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon, { type IconName } from '../components/Icon'
import { Modal } from '../academy/ui'
import { reactionEmoji, reactionLabel, type Magnet, type Person, type Post, type PostKind, type Reaction } from './data'
import { resizeImage, useMagnets } from './store'

export { Modal }

export function Avatar({ p, size = 40, ring }: { p: Person; size?: number; ring?: boolean }) {
  return (
    <span className={`mg-avatar ${ring ? 'ring' : ''}`} style={{ width: size, height: size, fontSize: size * 0.36, ['--h' as string]: p.hue }} aria-hidden="true">
      {p.initials}
    </span>
  )
}

export function MagnetTile({ m, size = 44 }: { m: Magnet; size?: number }) {
  return (
    <span className="mg-tile" style={{ width: size, height: size, ['--h' as string]: m.hue }} aria-hidden="true">
      <Icon name={(m.icon as IconName) ?? 'magnet'} size={Math.round(size * 0.48)} />
    </span>
  )
}

export function Name({ p, link = true }: { p: Person; link?: boolean }) {
  const inner = <>{p.name}{p.verified && <span className="mg-verified" title="Identity verified" aria-label="Identity verified"><Icon name="check" size={10} /></span>}</>
  return link ? <Link to={p.id === 'me' ? '/magnets/me' : `/magnets/u/${p.id}`} className="mg-name">{inner}</Link> : <span className="mg-name">{inner}</span>
}

export function Breadcrumb({ id }: { id: string }) {
  const { path } = useMagnets()
  return (
    <span className="mg-crumb">
      {path(id).map((m, i) => (
        <Fragment key={m.id}>{i > 0 && <span aria-hidden="true">›</span>}<Link to={`/magnets/m/${m.id}`}>{m.name}</Link></Fragment>
      ))}
    </span>
  )
}

/** Turns #tags in text into links to discovery. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(#[\p{L}\p{N}_]+)/u)
  return <p className="mg-text">{parts.map((part, i) => (part.startsWith('#') ? <Link key={i} to={`/magnets/discover?tag=${encodeURIComponent(part.slice(1).toLowerCase())}`}>{part}</Link> : <Fragment key={i}>{part}</Fragment>))}</p>
}

export function Photo({ src, alt = '' }: { src: string; alt?: string }) {
  if (src.startsWith('g:')) return <div className="mg-photo gradient" style={{ ['--h' as string]: Number(src.slice(2)) }} role="img" aria-label={alt || 'Photo'}><Icon name="eye" size={34} /></div>
  return <img className="mg-photo" src={src} alt={alt} loading="lazy" />
}

const reactions: Reaction[] = ['like', 'insightful', 'celebrate', 'support']

export function PostCard({ post, compact }: { post: Post; compact?: boolean }) {
  const navigate = useNavigate()
  const { s, person, magnet, react, comment, reply, likeComment, vote, addIdea, voteIdea, rsvp, toggleSave, pin, markAnswered, removePost, canModerate, isMember } = useMagnets()
  const [picker, setPicker] = useState(false)
  const [showComments, setShowComments] = useState(!compact)
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [idea, setIdea] = useState('')
  const [sharing, setSharing] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [menu, setMenu] = useState(false)
  const author = person(post.authorId)
  const mg = magnet(post.magnetId)
  const total = Object.values(post.reactions).reduce((a, b) => a + b, 0)
  const top = reactions.filter((r) => post.reactions[r] > 0).sort((a, b) => post.reactions[b] - post.reactions[a]).slice(0, 3)
  const shared = post.sharedFrom ? s.posts.find((p) => p.id === post.sharedFrom) : undefined
  const mod = canModerate(post.magnetId)
  const member = isMember(post.magnetId)
  const pollTotal = post.poll?.options.reduce((a, o) => a + o.votes, 0) ?? 0
  const saved = s.saved.includes(post.id)

  return (
    <article className={`card mg-post ${post.pinned ? 'pinned' : ''}`}>
      <header className="mg-post-head">
        <Link to={post.authorId === 'me' ? '/magnets/me' : `/magnets/u/${post.authorId}`}><Avatar p={author} size={44} /></Link>
        <div className="mg-post-meta">
          <Name p={author} />
          <span className="muted small">{author.headline}</span>
          <span className="muted small">{post.time}{mg && <> · <Breadcrumb id={mg.id} /></>}{post.pinned && <> · <strong className="accent">Pinned</strong></>}</span>
        </div>
        <div className="mg-menu-wrap">
          <button className="mg-icon-btn" onClick={() => setMenu(!menu)} aria-label="Post options" aria-expanded={menu}>⋯</button>
          {menu && (
            <div className="mg-menu" role="menu" onMouseLeave={() => setMenu(false)}>
              <button role="menuitem" onClick={() => { toggleSave(post.id); setMenu(false) }}>{saved ? 'Unsave' : 'Save post'}</button>
              <button role="menuitem" onClick={() => { navigate(`/magnets/p/${post.id}`); setMenu(false) }}>Open post</button>
              {mod && <button role="menuitem" onClick={() => { pin(post.id); setMenu(false) }}>{post.pinned ? 'Unpin' : 'Pin to top'}</button>}
              {(mod || post.authorId === 'me') && <button role="menuitem" className="danger" onClick={() => { removePost(post.id); setMenu(false) }}>Remove post</button>}
              {post.authorId !== 'me' && <button role="menuitem" onClick={() => { setReporting(true); setMenu(false) }}>Report</button>}
            </div>
          )}
        </div>
      </header>

      {post.kind === 'question' && <span className={`mg-kind ${post.answered ? 'ok' : ''}`}>{post.answered ? '✓ Answered question' : 'Question'}</span>}
      {post.kind === 'brainstorm' && <span className="mg-kind idea">Brainstorm</span>}
      <RichText text={post.text} />

      {post.image && <Photo src={post.image} alt={post.text.slice(0, 80)} />}

      {shared && (
        <Link to={`/magnets/p/${shared.id}`} className="mg-shared">
          <span className="small"><strong>{person(shared.authorId).name}</strong> · {magnet(shared.magnetId)?.name}</span>
          <span className="small mg-clamp">{shared.text}</span>
        </Link>
      )}

      {post.poll && (
        <div className="mg-poll">
          {post.poll.options.map((o, i) => {
            const pct = pollTotal ? Math.round((o.votes / pollTotal) * 100) : 0
            return post.poll!.voted === undefined ? (
              <button key={o.text} className="mg-poll-opt" onClick={() => vote(post.id, i)} disabled={!member}>{o.text}</button>
            ) : (
              <div key={o.text} className={`mg-poll-res ${post.poll!.voted === i ? 'mine' : ''}`}><span className="mg-poll-bar" style={{ width: `${pct}%` }} /><span>{o.text}{post.poll!.voted === i && ' ✓'}</span><strong>{pct}%</strong></div>
            )
          })}
          <span className="muted small">{pollTotal} vote{pollTotal === 1 ? '' : 's'}{!member && ' · join to vote'}</span>
        </div>
      )}

      {post.ideas && (
        <div className="mg-ideas">
          {post.ideas.map((i) => (
            <div key={i.id} className="mg-idea">
              <button className={`mg-upvote ${i.voted ? 'on' : ''}`} onClick={() => voteIdea(post.id, i.id)} aria-pressed={!!i.voted} aria-label={`Upvote: ${i.text}`} disabled={!member}>▲<span>{i.votes}</span></button>
              <div><span>{i.text}</span><span className="muted small">— {person(i.by).name}</span></div>
            </div>
          ))}
          {member && (
            <form className="mg-inline" onSubmit={(e) => { e.preventDefault(); if (idea.trim()) { addIdea(post.id, idea.trim()); setIdea('') } }}>
              <input value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Add your idea…" aria-label="Add an idea" />
              <button className="btn btn-ghost btn-sm" disabled={!idea.trim()}>Add</button>
            </form>
          )}
        </div>
      )}

      {post.event && (
        <div className="mg-event">
          <div className="mg-event-date"><strong>{new Date(post.event.date + 'T00:00:00').getDate()}</strong>{new Date(post.event.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}</div>
          <div><strong>{post.event.title}</strong><span className="muted small">{new Date(post.event.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · {post.event.time} · {post.event.where}</span><span className="small">{post.event.going} going</span></div>
          <button className={`btn btn-sm ${post.event.rsvp ? 'btn-primary' : 'btn-outline'}`} onClick={() => rsvp(post.id)}>{post.event.rsvp ? '✓ Going' : 'RSVP'}</button>
        </div>
      )}

      {post.opportunity && (
        <Link to={post.opportunity.link} className="mg-opp">
          <Icon name="briefcase" size={20} />
          <div><strong>{post.opportunity.role}</strong><span className="muted small">{post.opportunity.type === 'Job' ? 'Job on Skill Wise' : 'Gig on Skill Lancer'}</span></div>
          <span className="link-arrow small">View <Icon name="arrow" size={12} /></span>
        </Link>
      )}

      <div className="mg-counts small muted">
        {total > 0 && <span>{top.map((r) => reactionEmoji[r]).join('')} {total}</span>}
        <button className="mg-link" onClick={() => setShowComments(!showComments)}>{post.comments.length} comment{post.comments.length === 1 ? "" : "s"}</button>
        <span>{post.shares} share{post.shares === 1 ? "" : "s"}</span>
      </div>

      <div className="mg-actions">
        <div className="mg-react-wrap" onMouseLeave={() => setPicker(false)}>
          <button className={`mg-action ${post.myReaction ? 'on' : ''}`} onClick={() => react(post.id, post.myReaction ?? 'like')} onMouseEnter={() => setPicker(true)} onFocus={() => setPicker(true)} aria-label={post.myReaction ? `Remove ${reactionLabel[post.myReaction]}` : 'Like'}>
            <span aria-hidden="true">{post.myReaction ? reactionEmoji[post.myReaction] : '👍'}</span> {post.myReaction ? reactionLabel[post.myReaction] : 'Like'}
          </button>
          {picker && (
            <div className="mg-picker" role="group" aria-label="Reactions">
              {reactions.map((r) => <button key={r} onClick={() => { react(post.id, r); setPicker(false) }} aria-label={reactionLabel[r]} title={reactionLabel[r]}>{reactionEmoji[r]}</button>)}
            </div>
          )}
        </div>
        <button className="mg-action" onClick={() => setShowComments(true)}><Icon name="users" size={16} /> Comment</button>
        <button className="mg-action" onClick={() => setSharing(true)}><Icon name="arrow" size={16} /> Share</button>
        <button className={`mg-action ${saved ? 'on' : ''}`} onClick={() => toggleSave(post.id)} aria-pressed={saved}><Icon name="heart" size={16} /> {saved ? 'Saved' : 'Save'}</button>
      </div>

      {showComments && (
        <div className="mg-comments">
          {post.comments.map((c) => (
            <div key={c.id} className="mg-comment">
              <Avatar p={person(c.authorId)} size={32} />
              <div className="mg-comment-body">
                <div className="mg-bubble"><Name p={person(c.authorId)} /><RichText text={c.text} /></div>
                <div className="mg-comment-actions small muted">
                  <span>{c.time}</span>
                  <button className="mg-link" onClick={() => likeComment(post.id, c.id)}>Like{c.likes ? ` · ${c.likes}` : ''}</button>
                  <button className="mg-link" onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}>Reply</button>
                  {post.kind === 'question' && post.authorId === 'me' && !post.answered && <button className="mg-link" onClick={() => markAnswered(post.id)}>Mark as answer</button>}
                </div>
                {c.replies.map((r) => (
                  <div key={r.id} className="mg-comment reply"><Avatar p={person(r.authorId)} size={26} /><div className="mg-bubble"><Name p={person(r.authorId)} /><RichText text={r.text} /></div></div>
                ))}
                {replyTo === c.id && (
                  <form className="mg-inline" onSubmit={(e) => { e.preventDefault(); if (replyText.trim()) { reply(post.id, c.id, replyText.trim()); setReplyText(''); setReplyTo(null) } }}>
                    <input autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply…" aria-label="Reply" />
                    <button className="btn btn-ghost btn-sm" disabled={!replyText.trim()}>Reply</button>
                  </form>
                )}
              </div>
            </div>
          ))}
          {member ? (
            <form className="mg-inline" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { comment(post.id, text.trim()); setText('') } }}>
              <Avatar p={s.me} size={32} />
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment…" aria-label="Add a comment" />
              <button className="btn btn-primary btn-sm" disabled={!text.trim()}>Post</button>
            </form>
          ) : <p className="muted small">Join {mg?.name} to comment.</p>}
        </div>
      )}
      {sharing && <ShareDialog post={post} onClose={() => setSharing(false)} />}
      {reporting && <ReportDialog postId={post.id} onClose={() => setReporting(false)} />}
    </article>
  )
}

function ShareDialog({ post, onClose }: { post: Post; onClose: () => void }) {
  const { myMagnets, share } = useMagnets()
  const [target, setTarget] = useState(myMagnets[0]?.id ?? '')
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  return (
    <Modal title="Share post" onClose={onClose}>
      <form className="ac-form" onSubmit={(e) => { e.preventDefault(); share(post.id, target, text.trim() || 'Worth reading 👇'); onClose() }}>
        <label>Share to a magnet<select value={target} onChange={(e) => setTarget(e.target.value)}>{myMagnets.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
        <label>Add a note<textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Why are you sharing this?" /></label>
        <button className="btn btn-primary btn-block" type="submit" disabled={!target}>Share</button>
        <button type="button" className="btn btn-ghost btn-block" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/magnets/p/${post.id}`).then(() => setCopied(true)).catch(() => setCopied(false)) }}>{copied ? 'Link copied' : 'Copy link'}</button>
      </form>
    </Modal>
  )
}

function ReportDialog({ postId, onClose }: { postId: string; onClose: () => void }) {
  const { report } = useMagnets()
  const [reason, setReason] = useState('')
  const [done, setDone] = useState(false)
  return (
    <Modal title="Report post" onClose={onClose}>
      {done ? <div className="ac-form"><p>Thanks — moderators will review it. You won’t be told who handled it.</p><button className="btn btn-primary" onClick={onClose}>Close</button></div> : (
        <form className="ac-form" onSubmit={(e) => { e.preventDefault(); report(postId, reason); setDone(true) }}>
          <fieldset className="ac-methods"><legend>Why are you reporting this?</legend>
            {['Spam or self-promotion', 'Harassment or hate', 'Scam or fraud', 'False information', 'Off-topic for this magnet'].map((r) => <label key={r} className={reason === r ? 'on' : ''}><input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} /> {r}</label>)}
          </fieldset>
          <button className="btn btn-primary btn-block" type="submit" disabled={!reason}>Submit report</button>
        </form>
      )}
    </Modal>
  )
}

const kinds: { k: PostKind; label: string; icon: IconName }[] = [
  { k: 'text', label: 'Text', icon: 'book' },
  { k: 'photo', label: 'Photo', icon: 'eye' },
  { k: 'question', label: 'Question', icon: 'info' },
  { k: 'poll', label: 'Poll', icon: 'grid' },
  { k: 'brainstorm', label: 'Brainstorm', icon: 'rocket' },
  { k: 'event', label: 'Event', icon: 'calendar' },
  { k: 'opportunity', label: 'Job / gig', icon: 'briefcase' },
]

export function Composer({ magnetId }: { magnetId?: string }) {
  const { s, myMagnets, addPost, magnet } = useMagnets()
  const [kind, setKind] = useState<PostKind>('text')
  const [target, setTarget] = useState(magnetId ?? myMagnets[0]?.id ?? '')
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [err, setErr] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [ideas, setIdeas] = useState('')
  const [ev, setEv] = useState({ title: '', date: '', time: '19:00', where: 'Online — Skill Magnets live room' })
  const [opp, setOpp] = useState<{ role: string; type: 'Job' | 'Gig' }>({ role: '', type: 'Job' })
  const [open, setOpen] = useState(false)
  useEffect(() => { if (magnetId) setTarget(magnetId) }, [magnetId])
  const locked = magnet(target)?.locked

  const valid = text.trim().length > 2 && !!target && !locked &&
    (kind !== 'photo' || !!image) && (kind !== 'poll' || options.filter((o) => o.trim()).length >= 2) &&
    (kind !== 'event' || (ev.title.trim() && ev.date)) && (kind !== 'opportunity' || opp.role.trim())

  async function pick(file?: File) {
    if (!file) return
    setErr('')
    try { setImage(await resizeImage(file)) } catch (e) { setErr((e as Error).message) }
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    addPost({
      magnetId: target, kind, text: text.trim(),
      image: kind === 'photo' ? image : undefined,
      poll: kind === 'poll' ? { options: options.filter((o) => o.trim()).map((o) => ({ text: o.trim(), votes: 0 })) } : undefined,
      ideas: kind === 'brainstorm' ? ideas.split('\n').map((i) => i.trim()).filter(Boolean).map((t, i) => ({ id: `i${i}`, text: t, by: 'me', votes: 0 })) : undefined,
      event: kind === 'event' ? { ...ev, going: 1, rsvp: true } : undefined,
      opportunity: kind === 'opportunity' ? { ...opp, link: opp.type === 'Job' ? '/skillsrator/skill-wise' : '/lancer/projects' } : undefined,
    })
    setText(''); setImage(''); setOptions(['', '']); setIdeas(''); setEv({ ...ev, title: '', date: '' }); setOpp({ role: '', type: 'Job' }); setKind('text'); setOpen(false)
  }

  if (!myMagnets.length) return <div className="card mg-composer"><p className="muted">Join a magnet to start posting.</p></div>

  return (
    <form className="card mg-composer" onSubmit={submit}>
      <div className="mg-composer-top">
        <Avatar p={s.me} size={44} />
        <textarea rows={open ? 3 : 1} value={text} onFocus={() => setOpen(true)} onChange={(e) => setText(e.target.value)} aria-label="Write a post"
          placeholder={kind === 'question' ? 'Ask the community a question…' : kind === 'brainstorm' ? 'What should we brainstorm about?' : kind === 'poll' ? 'Ask a question for your poll…' : 'Share an idea, tip or update… use #tags'} />
      </div>
      {open && (
        <>
          {kind === 'photo' && (
            <div className="mg-upload">
              {image ? <><img src={image} alt="Selected" /><button type="button" className="ac-link-btn danger" onClick={() => setImage('')}>Remove photo</button></> : <label className="btn btn-ghost btn-sm">Choose a photo<input type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} /></label>}
              {err && <p className="lc-error">{err}</p>}
            </div>
          )}
          {kind === 'poll' && (
            <div className="mg-sub-form">
              {options.map((o, i) => <input key={i} value={o} onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Option ${i + 1}`} aria-label={`Poll option ${i + 1}`} />)}
              {options.length < 5 && <button type="button" className="ac-link-btn" onClick={() => setOptions([...options, ''])}>+ Add option</button>}
            </div>
          )}
          {kind === 'brainstorm' && <div className="mg-sub-form"><textarea rows={3} value={ideas} onChange={(e) => setIdeas(e.target.value)} placeholder="Starter ideas, one per line (optional)" aria-label="Starter ideas" /></div>}
          {kind === 'event' && (
            <div className="mg-sub-form grid">
              <input value={ev.title} onChange={(e) => setEv({ ...ev, title: e.target.value })} placeholder="Event title" aria-label="Event title" />
              <input type="date" value={ev.date} onChange={(e) => setEv({ ...ev, date: e.target.value })} aria-label="Event date" />
              <input type="time" value={ev.time} onChange={(e) => setEv({ ...ev, time: e.target.value })} aria-label="Event time" />
              <input value={ev.where} onChange={(e) => setEv({ ...ev, where: e.target.value })} placeholder="Where" aria-label="Event location" />
            </div>
          )}
          {kind === 'opportunity' && (
            <div className="mg-sub-form grid">
              <input value={opp.role} onChange={(e) => setOpp({ ...opp, role: e.target.value })} placeholder="Role or gig title" aria-label="Role" />
              <select value={opp.type} onChange={(e) => setOpp({ ...opp, type: e.target.value as 'Job' | 'Gig' })} aria-label="Type"><option value="Job">Job (Skill Wise)</option><option value="Gig">Gig (Skill Lancer)</option></select>
            </div>
          )}
          {locked && <p className="lc-error">This magnet is locked by its admins — new posts are paused.</p>}
        </>
      )}
      <div className="mg-composer-bar">
        <div className="mg-kinds" role="group" aria-label="Post type">
          {kinds.map((k) => <button type="button" key={k.k} className={kind === k.k ? 'on' : ''} onClick={() => { setKind(k.k); setOpen(true) }} aria-pressed={kind === k.k}><Icon name={k.icon} size={15} /> <span>{k.label}</span></button>)}
        </div>
        <div className="mg-composer-send">
          {!magnetId && <select value={target} onChange={(e) => setTarget(e.target.value)} aria-label="Post to magnet">{myMagnets.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>}
          <button className="btn btn-primary btn-sm" type="submit" disabled={!valid}>Post</button>
        </div>
      </div>
    </form>
  )
}

export function StoriesBar({ magnetId }: { magnetId?: string }) {
  const { s, person } = useMagnets()
  const [viewing, setViewing] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const list = s.stories.filter((st) => !magnetId || st.magnetId === magnetId)
  return (
    <div className="mg-stories" aria-label="Stories">
      <button className="mg-story add" onClick={() => setCreating(true)}>
        <span className="mg-story-ring add"><Avatar p={s.me} size={58} /><span className="mg-plus">+</span></span>
        <span className="small">Your story</span>
      </button>
      {list.map((st, i) => (
        <button key={st.id} className="mg-story" onClick={() => setViewing(i)}>
          <span className={`mg-story-ring ${s.seenStories.includes(st.id) ? 'seen' : ''}`}><Avatar p={person(st.authorId)} size={58} /></span>
          <span className="small">{person(st.authorId).name.replace('Sample Member — ', '').replace('Ayesha Khan', 'You')}</span>
        </button>
      ))}
      {viewing !== null && list[viewing] && <StoryViewer stories={list} start={viewing} onClose={() => setViewing(null)} />}
      {creating && <StoryCreator magnetId={magnetId} onClose={() => setCreating(false)} />}
    </div>
  )
}

function StoryViewer({ stories, start, onClose }: { stories: { id: string; authorId: string; bg: string; text: string; image?: string; time: string; magnetId?: string }[]; start: number; onClose: () => void }) {
  const { person, seeStory, magnet } = useMagnets()
  const [i, setI] = useState(start)
  const [t, setT] = useState(0)
  const st = stories[i]
  useEffect(() => { seeStory(st.id); setT(0) }, [st.id]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const iv = setInterval(() => setT((x) => x + 2), 100)
    return () => clearInterval(iv)
  }, [i])
  useEffect(() => { if (t >= 100) { if (i < stories.length - 1) setI(i + 1); else onClose() } }, [t, i, stories.length, onClose])
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight' && i < stories.length - 1) setI(i + 1); if (e.key === 'ArrowLeft' && i > 0) setI(i - 1) }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [i, stories.length, onClose])
  const author = person(st.authorId)
  return (
    <div className="mg-story-view" role="dialog" aria-modal="true" aria-label={`Story by ${author.name}`}>
      <div className="mg-story-card" style={{ ['--h' as string]: Number(st.bg) || 175 }}>
        <div className="mg-story-bars">{stories.map((x, j) => <span key={x.id}><span style={{ width: `${j < i ? 100 : j === i ? t : 0}%` }} /></span>)}</div>
        <div className="mg-story-head"><Avatar p={author} size={34} /><div><strong className="small">{author.name}</strong><span className="small">{st.time}{st.magnetId && ` · ${magnet(st.magnetId)?.name}`}</span></div><button className="mg-icon-btn light" onClick={onClose} aria-label="Close story">✕</button></div>
        {st.image ? <img src={st.image} alt="" className="mg-story-img" /> : null}
        <p className="mg-story-text">{st.text}</p>
        <button className="mg-story-nav prev" onClick={() => i > 0 && setI(i - 1)} aria-label="Previous story" />
        <button className="mg-story-nav next" onClick={() => (i < stories.length - 1 ? setI(i + 1) : onClose())} aria-label="Next story" />
      </div>
    </div>
  )
}

function StoryCreator({ magnetId, onClose }: { magnetId?: string; onClose: () => void }) {
  const { addStory } = useMagnets()
  const [text, setText] = useState('')
  const [bg, setBg] = useState('175')
  const [image, setImage] = useState('')
  const [err, setErr] = useState('')
  return (
    <Modal title="Create a story" onClose={onClose}>
      <form className="ac-form" onSubmit={(e) => { e.preventDefault(); addStory({ bg, text: text.trim(), image: image || undefined, magnetId }); onClose() }}>
        <div className="mg-story-preview" style={{ ['--h' as string]: Number(bg) }}>{image && <img src={image} alt="" />}<span>{text || 'Your story text'}</span></div>
        <label>Text<textarea rows={2} maxLength={140} value={text} onChange={(e) => setText(e.target.value)} placeholder="Share a quick tip or update (disappears in 24 hours)" /></label>
        <div className="mg-swatches" role="group" aria-label="Background colour">{['175', '20', '205', '280', '330', '45'].map((h) => <button type="button" key={h} className={bg === h ? 'on' : ''} style={{ ['--h' as string]: Number(h) }} onClick={() => setBg(h)} aria-label={`Colour ${h}`} />)}</div>
        <label className="btn btn-ghost btn-sm mg-file">Add a photo<input type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { setImage(await resizeImage(f, 700)) } catch (x) { setErr((x as Error).message) } } }} /></label>
        {err && <p className="lc-error">{err}</p>}
        <button className="btn btn-primary btn-block" type="submit" disabled={!text.trim() && !image}>Share story</button>
      </form>
    </Modal>
  )
}

export function Tree({ parentId = null, depth = 0, onPick }: { parentId?: string | null; depth?: number; onPick?: (id: string) => void }) {
  const { children, isMember, visible } = useMagnets()
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const kids = children(parentId).filter(visible)
  if (!kids.length) return null
  return (
    <ul className={`mg-tree ${depth ? 'nested' : ''}`}>
      {kids.map((m) => {
        const sub = children(m.id).filter(visible).length
        return (
          <li key={m.id}>
            <div className="mg-tree-row">
              {sub ? <button className="mg-tree-toggle" onClick={() => setOpen({ ...open, [m.id]: !open[m.id] })} aria-expanded={!!open[m.id]} aria-label={`${open[m.id] ? 'Collapse' : 'Expand'} ${m.name}`}>{open[m.id] ? '▾' : '▸'}</button> : <span className="mg-tree-toggle" />}
              <MagnetTile m={m} size={28} />
              {onPick ? <button className="mg-link" onClick={() => onPick(m.id)}>{m.name}</button> : <Link to={`/magnets/m/${m.id}`}>{m.name}</Link>}
              <span className="muted small">{m.members.toLocaleString()} · {sub ? `${sub} sub` : 'no sub'}groups</span>
              {isMember(m.id) && <span className="mg-joined">Joined</span>}
              {m.privacy !== 'Public' && <span className="mg-priv"><Icon name="lock" size={11} /> {m.privacy}</span>}
            </div>
            {open[m.id] && <Tree parentId={m.id} depth={depth + 1} onPick={onPick} />}
          </li>
        )
      })}
    </ul>
  )
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="card mg-side"><div className="card-head"><h3>{title}</h3>{action}</div>{children}</section>
}
