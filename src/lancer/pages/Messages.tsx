import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { useLancer } from '../store'
import { Avatar } from '../ui'
import { Empty } from '../../academy/ui'

const initials = (n: string) => n.replace(/^Sample (Freelancer|Buyer|Client) — /, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

export default function Messages() {
  const { threadId } = useParams()
  const navigate = useNavigate()
  const { s, send } = useLancer()
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const thread = s.threads.find((t) => t.id === threadId) ?? (threadId ? undefined : s.threads[0])

  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }) }, [thread?.messages.length])

  if (!s.threads.length) return <div className="ac-wrap ac-sections"><Empty title="No messages yet" text="Contact a seller or freelancer to start a conversation." cta={<Link to="/lancer/gigs" className="btn btn-primary">Browse services</Link>} /></div>

  return (
    <div className="ac-wrap lc-inbox">
      <aside className={`lc-threads ${threadId ? 'has-open' : ''}`}>
        <h1>Messages</h1>
        {s.threads.map((t) => {
          const last = t.messages[t.messages.length - 1]
          return (
            <button key={t.id} className={`lc-thread ${thread?.id === t.id ? 'active' : ''}`} onClick={() => navigate(`/lancer/messages/${t.id}`)}>
              <Avatar initials={initials(t.with)} />
              <div><strong>{t.with}</strong><span className="muted small">{last ? last.text : t.about}</span></div>
              {last?.from === 'them' && <span className="lc-dot" aria-label="Unread" />}
            </button>
          )
        })}
      </aside>
      {thread ? (
        <section className={`lc-chat card ${threadId ? 'open' : ''}`}>
          <header className="lc-chat-head">
            <button className="ac-link-btn lc-back" onClick={() => navigate('/lancer/messages')}>← All</button>
            <Avatar initials={initials(thread.with)} />
            <div><strong>{thread.with}</strong><span className="muted small">{thread.about}</span></div>
            {thread.withId && <Link to={`/lancer/u/${thread.withId}`} className="small">View profile</Link>}
          </header>
          <div className="lc-msgs">
            <p className="lc-safety"><Icon name="shield" size={14} /> Keep payments and communication on Skill Lancer — escrow and dispute protection only cover work arranged here.</p>
            {thread.messages.map((m, i) => <div key={i} className={`lc-msg ${m.from}`}><p>{m.text}</p><span>{m.date}</span></div>)}
            <div ref={end} />
          </div>
          <form className="lc-compose" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { send(thread.id, text.trim()); setText('') } }}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message (Urdu or English)" aria-label="Message" />
            <button className="btn btn-primary" type="submit" disabled={!text.trim()}>Send</button>
          </form>
        </section>
      ) : <Empty title="Conversation not found" text="Choose a conversation on the left." />}
    </div>
  )
}
