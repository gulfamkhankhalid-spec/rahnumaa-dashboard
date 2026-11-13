import { useState, type FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { catName, categories, FEES, findProject, pkr, projects } from '../data'
import { useLancer } from '../store'
import { Stars, StatusPill } from '../ui'
import { Empty } from '../../academy/ui'
import NotFound from '../../pages/site/NotFound'

export function FindWork() {
  const [params, setParams] = useSearchParams()
  const { s } = useLancer()
  const q = (params.get('q') ?? '').toLowerCase()
  const cat = params.get('cat') ?? ''
  const type = params.get('type') ?? ''
  const exp = params.get('exp') ?? ''
  const verified = params.get('verified') === '1'
  const set = (k: string, v: string) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); setParams(n, { replace: true }) }
  const list = projects.filter((p) => (!q || `${p.title} ${p.description} ${p.skills.join(' ')}`.toLowerCase().includes(q)) && (!cat || p.category === cat) && (!type || p.budgetType === type) && (!exp || p.experience === exp) && (!verified || p.client.paymentVerified))

  return (
    <div className="ac-wrap ac-browse">
      <aside className="ac-filters" aria-label="Filters">
        <div className="ac-filter-head"><h2>Filter</h2>{[...params.keys()].length > 0 && <button className="ac-clear" onClick={() => setParams({})}>Clear all</button>}</div>
        <fieldset><legend>Category</legend><select value={cat} onChange={(e) => set('cat', e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></fieldset>
        <fieldset><legend>Project type</legend>{[['', 'Any'], ['Fixed', 'Fixed price'], ['Hourly', 'Hourly']].map(([v, l]) => <label key={l}><input type="radio" name="type" checked={type === v} onChange={() => set('type', v)} /> {l}</label>)}</fieldset>
        <fieldset><legend>Experience level</legend>{[['', 'Any'], ['Entry', 'Entry'], ['Intermediate', 'Intermediate'], ['Expert', 'Expert']].map(([v, l]) => <label key={l}><input type="radio" name="exp" checked={exp === v} onChange={() => set('exp', v)} /> {l}</label>)}</fieldset>
        <fieldset><legend>Client</legend><label><input type="checkbox" checked={verified} onChange={(e) => set('verified', e.target.checked ? '1' : '')} /> Payment verified</label></fieldset>
      </aside>
      <section className="ac-results">
        <div className="ac-results-head">
          <div><h1>{q ? `Projects matching “${params.get('q')}”` : 'Find work'}</h1><p className="muted">{list.length} open project{list.length === 1 ? '' : 's'} · You have <strong>{s.credits}</strong> proposal credits</p></div>
          <Link to="/lancer/seller?tab=proposals" className="btn btn-ghost btn-sm">My proposals ({s.sent.length})</Link>
        </div>
        {list.length ? (
          <div className="lc-projects">
            {list.map((p) => {
              const applied = s.sent.some((x) => x.projectId === p.id)
              return (
                <Link key={p.id} to={`/lancer/project/${p.id}`} className="card lc-project">
                  <div className="lc-project-top"><span className="muted small">Posted {p.posted}</span>{applied && <StatusPill status="Applied" />}</div>
                  <h3>{p.title}</h3>
                  <p className="small muted">{p.budgetType === 'Fixed' ? `Fixed price: ${pkr(p.budget[0])}–${pkr(p.budget[1])}` : `Hourly: ${pkr(p.budget[0])}–${pkr(p.budget[1])}/hr`} · {p.experience} · {p.duration}</p>
                  <p className="small lc-clamp">{p.description}</p>
                  <div className="ac-chips">{p.skills.map((sk) => <span key={sk} className="ac-chip">{sk}</span>)}</div>
                  <div className="lc-project-foot small muted">
                    {p.client.paymentVerified ? <span className="verified"><Icon name="shield" size={13} /> Payment verified</span> : <span>Payment not verified</span>}
                    {p.client.rating > 0 && <Stars rating={p.client.rating} />}
                    <span>{p.client.city}</span><span>Proposals: {p.proposals}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : <Empty title="No projects match" text="Try other filters." />}
      </section>
    </div>
  )
}

export function ProjectDetail() {
  const { id = '' } = useParams()
  const { s, sendProposal } = useLancer()
  const project = findProject(id)
  const [bid, setBid] = useState(() => project ? (project.budgetType === 'Fixed' ? Math.round((project.budget[0] + project.budget[1]) / 2) : s.me.rate) : 0)
  const [days, setDays] = useState(7)
  const [cover, setCover] = useState('')
  if (!project) return <NotFound />
  const existing = s.sent.find((x) => x.projectId === project.id)

  function submit(e: FormEvent) {
    e.preventDefault()
    sendProposal(project!.id, bid, days, cover.trim())
  }

  return (
    <div className="ac-wrap lc-gig">
      <nav className="ac-crumbs"><Link to="/lancer/projects">Find work</Link> / {catName(project.category)}</nav>
      <div className="lc-gig-grid">
        <div className="lc-gig-main">
          <h1>{project.title}</h1>
          <p className="muted">Posted {project.posted} · {project.client.city}</p>
          <div className="lc-facts">
            <div><strong>{project.budgetType === 'Fixed' ? `${pkr(project.budget[0])}–${pkr(project.budget[1])}` : `${pkr(project.budget[0])}–${pkr(project.budget[1])}/hr`}</strong><span className="muted small">{project.budgetType === 'Fixed' ? 'Fixed price' : 'Hourly'}</span></div>
            <div><strong>{project.experience}</strong><span className="muted small">Experience level</span></div>
            <div><strong>{project.duration}</strong><span className="muted small">Project length</span></div>
          </div>
          <section><h2>Project details</h2><p>{project.description}</p></section>
          <section><h2>Skills and expertise</h2><div className="ac-chips">{project.skills.map((sk) => <span key={sk} className="ac-chip">{sk}</span>)}</div></section>
          <section>
            <h2>{existing ? 'Your proposal' : 'Submit a proposal'}</h2>
            {existing ? (
              <div className="card">
                <div className="lc-proposal-head"><div><strong>{pkr(existing.bid)}{project.budgetType === 'Hourly' ? '/hr' : ''}</strong><span className="muted small"> · {existing.days} days · sent {existing.date}</span></div><StatusPill status={existing.status} /></div>
                <p className="small">{existing.cover}</p>
                <Link to="/lancer/seller?tab=proposals" className="link-arrow small">Manage proposals <Icon name="arrow" size={12} /></Link>
              </div>
            ) : (
              <form className="card ac-form" onSubmit={submit}>
                <div className="ac-form-row two">
                  <label>{project.budgetType === 'Fixed' ? 'Your bid (PKR, total)' : 'Your hourly rate (PKR)'}<input type="number" min={500} step="any" value={bid} onChange={(e) => setBid(Number(e.target.value))} /></label>
                  <label>Delivery time (days)<input type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value))} /></label>
                </div>
                <p className="muted small">You’ll receive {pkr(bid * (1 - FEES.seller))}{project.budgetType === 'Hourly' ? '/hr' : ''} after the {FEES.seller * 100}% fee (sample).</p>
                <label>Cover letter<textarea rows={6} required value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Introduce yourself, explain how you would approach this project, and link to relevant work." /></label>
                <p className="muted small">This proposal uses 2 of your {s.credits} proposal credits.</p>
                <button className="btn btn-primary" type="submit" disabled={cover.trim().length < 30 || s.credits < 2}>Send proposal</button>
              </form>
            )}
          </section>
        </div>
        <aside className="lc-pkg-box card">
          <h3>About the client</h3>
          {project.client.paymentVerified ? <p className="verified"><Icon name="shield" size={14} /> Payment method verified</p> : <p className="muted small">Payment method not yet verified</p>}
          {project.client.rating > 0 && <Stars rating={project.client.rating} />}
          <ul className="lc-kv small">
            <li><span>Location</span><strong>{project.client.city}</strong></li>
            <li><span>Hires</span><strong>{project.client.hires}</strong></li>
            <li><span>Total spent</span><strong>{pkr(project.client.spent)}</strong></li>
            <li><span>Proposals</span><strong>{project.proposals}</strong></li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
