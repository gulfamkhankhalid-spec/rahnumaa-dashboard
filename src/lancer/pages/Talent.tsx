import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { categories, freelancers, gigs, pkr, sampleReviews, verificationSteps } from '../data'
import { useLancer } from '../store'
import { Avatar, FreelancerCard, GigCard, LevelBadge, Stars } from '../ui'
import { Empty } from '../../academy/ui'
import NotFound from '../../pages/site/NotFound'

export function Talent() {
  const [q, setQ] = useState('')
  const [abc, setAbc] = useState(false)
  const [cat, setCat] = useState('')
  const catSkills = categories.find((c) => c.slug === cat)?.subs.join(' ').toLowerCase() ?? ''
  const list = freelancers.filter((f) =>
    (!q || `${f.name} ${f.title} ${f.skills.join(' ')} ${f.city}`.toLowerCase().includes(q.toLowerCase())) &&
    (!abc || f.abc.length > 0) &&
    (!cat || gigs.some((g) => g.sellerId === f.id && g.category === cat) || f.skills.some((sk) => catSkills.includes(sk.toLowerCase()))))
  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>Find talent</h1><p className="muted">Identity-verified freelancers, many with ABC skill credentials. Invite them to a project or message them directly.</p></div>
        <Link to="/lancer/post" className="btn btn-primary">Post a project</Link>
      </header>
      <div className="toolbar">
        <label className="search"><Icon name="search" size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by skill, title or city" /></label>
        <select className="lc-select" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <label className="lc-check"><input type="checkbox" checked={abc} onChange={(e) => setAbc(e.target.checked)} /> ABC-certified only</label>
      </div>
      {list.length ? <div className="lc-talent-grid">{list.map((f) => <FreelancerCard key={f.id} f={f} />)}</div> : <Empty title="No freelancers found" text="Try a broader search." />}
    </div>
  )
}

export function FreelancerProfile() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { contact } = useLancer()
  const f = freelancers.find((x) => x.id === id)
  if (!f) return <NotFound />
  const theirGigs = gigs.filter((g) => g.sellerId === f.id)

  return (
    <div className="ac-wrap ac-sections">
      <header className="card lc-profile-head">
        <Avatar initials={f.initials} size="xl" />
        <div className="lc-profile-info">
          <h1>{f.name}</h1>
          <p className="lead">{f.title}</p>
          <div className="lc-talent-badges"><LevelBadge level={f.level} /><Stars rating={f.rating} count={f.reviews} /></div>
          <p className="muted small">{f.city}, Pakistan · Speaks {f.languages.join(', ')} · Member since {f.memberSince}</p>
          {f.agency && <p className="small"><Icon name="users" size={14} /> Runs an agency: <strong>{f.agency.name}</strong> ({f.agency.members} members)</p>}
        </div>
        <div className="lc-profile-cta">
          <span className="lc-price">{pkr(f.rate)}<small>/hr</small></span>
          <button className="btn btn-primary" onClick={() => navigate(`/lancer/messages/${contact(f.name, 'Enquiry', f.id)}`)}>Contact</button>
          <Link to={`/lancer/post?invite=${f.id}`} className="btn btn-ghost">Invite to a project</Link>
        </div>
      </header>

      <div className="lc-profile-grid">
        <div className="lc-profile-main">
          <section><h2>About</h2><p>{f.bio}</p></section>
          <section><h2>Skills</h2><div className="ac-chips">{f.skills.map((sk) => <span key={sk} className="ac-chip">{sk}</span>)}</div></section>
          <section>
            <h2>Portfolio</h2>
            <div className="lc-portfolio">{f.portfolio.map((p, i) => <div key={p} className="lc-port" style={{ ['--h' as string]: 180 + i * 50 }}><span>{p}</span></div>)}</div>
          </section>
          {theirGigs.length > 0 && <section><h2>Services</h2><div className="ac-grid three">{theirGigs.map((g) => <GigCard key={g.id} gig={g} />)}</div></section>}
          <section>
            <h2>Work history and reviews</h2>
            <div className="ac-reviews">{sampleReviews.map((r) => <blockquote key={r.from} className="card"><Stars rating={r.rating} /><p>“{r.text}”</p><footer className="muted small">{r.from} · {r.when}</footer></blockquote>)}</div>
          </section>
        </div>
        <aside className="ac-detail-side">
          <div className="card">
            <h3>Verification</h3>
            <ol className="lc-ladder">
              {verificationSteps.map((v, i) => {
                const done = i <= f.verified && (i < 3 || f.abc.length > 0)
                return <li key={v} className={done ? 'done' : ''}><span>{done ? <Icon name="check" size={12} /> : i + 1}</span>{v}</li>
              })}
            </ol>
          </div>
          {f.abc.length > 0 && (
            <div className="card lc-abc-card">
              <h3><Icon name="award" size={18} /> ABC credentials</h3>
              {f.abc.map((a) => <p key={a} className="small">{a}</p>)}
              <Link to="/abc" className="link-arrow small">What is ABC? <Icon name="arrow" size={12} /></Link>
            </div>
          )}
          <div className="card">
            <h3>Track record</h3>
            <ul className="lc-kv">
              <li><span>Jobs completed</span><strong>{f.jobs}</strong></li>
              <li><span>On-time delivery</span><strong>{f.onTime}%</strong></li>
              <li><span>Response time</span><strong>{f.response}</strong></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
