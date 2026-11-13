import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { catName, findFreelancer, pkr } from '../data'
import { useLancer, type MyProject, type Proposal } from '../store'
import { Avatar, LevelBadge, Modal, Stars, StatusPill, TrustBadges } from '../ui'
import { Empty } from '../../academy/ui'
import NotFound from '../../pages/site/NotFound'

export function ClientDashboard() {
  const { s } = useLancer()
  const buying = s.orders.filter((o) => o.role === 'buyer')
  const contracts = s.contracts.filter((c) => c.role === 'client')
  const active = buying.filter((o) => !['Completed', 'Cancelled'].includes(o.status)).length + contracts.filter((c) => c.status === 'Active').length

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>My hiring</h1><p className="muted">Your projects, orders and contracts in one place.</p></div>
        <div className="lc-head-actions"><Link to="/lancer/gigs" className="btn btn-ghost">Browse services</Link><Link to="/lancer/post" className="btn btn-primary">Post a project</Link></div>
      </header>
      <section className="stats">
        <div className="card stat"><span className="stat-label">Active work</span><span className="stat-value">{active}</span></div>
        <div className="card stat"><span className="stat-label">Open projects</span><span className="stat-value">{s.myProjects.filter((p) => p.status === 'Open').length}</span></div>
        <div className="card stat"><span className="stat-label">In escrow</span><span className="stat-value small-value">{pkr(s.wallet.escrow)}</span></div>
        <div className="card stat"><span className="stat-label">Wallet</span><span className="stat-value small-value">{pkr(s.wallet.balance)}</span><Link to="/lancer/wallet" className="small">Add funds</Link></div>
      </section>

      <section className="card">
        <h2>My projects</h2>
        {s.myProjects.length ? (
          <table className="table"><thead><tr><th>Project</th><th>Posted</th><th>Proposals</th><th>Status</th><th></th></tr></thead>
            <tbody>{s.myProjects.map((p) => (
              <tr key={p.id}><td><Link to={`/lancer/client/project/${p.id}`}>{p.title}</Link></td><td>{p.posted}</td><td>{p.proposals.length} ({p.proposals.filter((r) => r.status === 'New').length} new)</td><td><StatusPill status={p.status} /></td><td><Link to={`/lancer/client/project/${p.id}`}>Review</Link></td></tr>
            ))}</tbody></table>
        ) : <Empty title="No projects yet" text="Post a project to receive proposals from verified freelancers." cta={<Link to="/lancer/post" className="btn btn-primary">Post a project</Link>} />}
      </section>

      <div className="app-grid">
        <section className="card">
          <h2>Service orders</h2>
          {buying.length ? <ul className="lc-list">{buying.map((o) => (
            <li key={o.id}><Link to={`/lancer/order/${o.id}`}><strong>{o.gigTitle}</strong></Link><span className="muted small">{o.other} · {o.pkg} · due {o.due}</span><StatusPill status={o.status} /></li>
          ))}</ul> : <p className="muted small">No orders yet. <Link to="/lancer/gigs">Browse services</Link></p>}
        </section>
        <section className="card">
          <h2>Contracts</h2>
          {contracts.length ? <ul className="lc-list">{contracts.map((c) => (
            <li key={c.id}><Link to={`/lancer/contract/${c.id}`}><strong>{c.title}</strong></Link><span className="muted small">{c.other} · {c.type === 'Hourly' ? `${pkr(c.rate)}/hr` : pkr(c.milestones.reduce((t, m) => t + m.amount, 0))}</span><StatusPill status={c.status} /></li>
          ))}</ul> : <p className="muted small">Hire from a project's proposals to start a contract.</p>}
        </section>
      </div>
    </div>
  )
}

function HireDialog({ project, proposal, onClose }: { project: MyProject; proposal: Proposal; onClose: () => void }) {
  const { s, hire } = useLancer()
  const navigate = useNavigate()
  const f = findFreelancer(proposal.freelancerId)!
  const [ms, setMs] = useState(project.budgetType === 'Fixed' ? [{ title: 'First draft', amount: Math.round(proposal.bid * 0.5) }, { title: 'Final delivery', amount: proposal.bid - Math.round(proposal.bid * 0.5) }] : [])
  const [limit, setLimit] = useState(15)
  const [error, setError] = useState('')
  const total = ms.reduce((t, m) => t + m.amount, 0)

  function submit(e: FormEvent) {
    e.preventDefault()
    const id = hire(project.id, proposal.id, ms, limit)
    if (!id) { setError('Not enough balance to fund the first milestone. Add funds in your wallet.'); return }
    navigate(`/lancer/contract/${id}`)
  }

  return (
    <Modal title={`Hire ${f.name}`} onClose={onClose}>
      <form className="ac-form" onSubmit={submit}>
        <p className="muted small">Contract: {project.title} · {project.budgetType === 'Fixed' ? 'Fixed price' : `Hourly at ${pkr(proposal.bid)}/hr`}</p>
        {project.budgetType === 'Fixed' ? (
          <>
            <h3>Milestones</h3>
            {ms.map((m, i) => (
              <div key={i} className="lc-ms-row">
                <input value={m.title} onChange={(e) => setMs(ms.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} aria-label={`Milestone ${i + 1} title`} />
                <input type="number" min={0} step="any" value={m.amount} onChange={(e) => setMs(ms.map((x, j) => (j === i ? { ...x, amount: Number(e.target.value) } : x)))} aria-label={`Milestone ${i + 1} amount`} />
                {ms.length > 1 && <button type="button" className="ac-link-btn danger" onClick={() => setMs(ms.filter((_, j) => j !== i))} aria-label="Remove milestone">✕</button>}
              </div>
            ))}
            <button type="button" className="ac-link-btn" onClick={() => setMs([...ms, { title: `Milestone ${ms.length + 1}`, amount: 5000 }])}>+ Add milestone</button>
            <div className="lc-summary"><div className="total"><span>Contract total</span><span>{pkr(total)}</span></div><div><span>Funded into escrow now (milestone 1)</span><span>{pkr(ms[0]?.amount ?? 0)}</span></div></div>
          </>
        ) : (
          <label>Weekly hour limit<input type="number" min={1} max={60} value={limit} onChange={(e) => setLimit(Number(e.target.value))} /><span className="muted small">You pay at most {pkr(limit * proposal.bid)} a week. Hours are reviewed weekly before payment.</span></label>
        )}
        <p className="muted small">Wallet balance: {pkr(s.wallet.balance)}. Funds are released only when you approve each milestone.</p>
        {error && <p className="lc-error">{error} <Link to="/lancer/wallet">Wallet</Link></p>}
        <button className="btn btn-primary btn-block" type="submit" disabled={project.budgetType === 'Fixed' && (!ms.length || ms.some((m) => !m.title.trim() || m.amount <= 0))}>{project.budgetType === 'Fixed' ? `Fund milestone 1 and hire` : 'Hire and start contract'}</button>
      </form>
    </Modal>
  )
}

export function ClientProject() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { s, setProposalStatus, contact, closeProject } = useLancer()
  const [filter, setFilter] = useState<'All' | 'Shortlisted'>('All')
  const [hiring, setHiring] = useState<Proposal | null>(null)
  const project = s.myProjects.find((p) => p.id === id)
  if (!project) return <NotFound />
  const list = project.proposals.filter((p) => filter === 'All' ? p.status !== 'Declined' : p.status === 'Shortlisted')

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div>
          <nav className="ac-crumbs"><Link to="/lancer/client">My hiring</Link> / Project</nav>
          <h1>{project.title}</h1>
          <p className="muted">{catName(project.category)} · {project.budgetType === 'Fixed' ? `${pkr(project.budget[0])}–${pkr(project.budget[1])}` : `${pkr(project.budget[0])}–${pkr(project.budget[1])}/hr`} · {project.duration} · {project.experience} · Posted {project.posted}</p>
        </div>
        <div className="lc-head-actions"><StatusPill status={project.status} />{project.status === 'Open' && <button className="btn btn-ghost btn-sm" onClick={() => closeProject(project.id)}>Close project</button>}</div>
      </header>
      <section className="card"><h2>Description</h2><p>{project.description}</p><div className="ac-chips">{project.skills.map((sk) => <span key={sk} className="ac-chip">{sk}</span>)}</div></section>

      <section>
        <div className="ac-row-head">
          <h2>Proposals ({project.proposals.length})</h2>
          <div className="tabs">{(['All', 'Shortlisted'] as const).map((t) => <button key={t} className={filter === t ? 'active' : ''} onClick={() => setFilter(t)}>{t}</button>)}</div>
        </div>
        {list.length ? (
          <div className="lc-proposals">
            {list.map((r) => {
              const f = findFreelancer(r.freelancerId)!
              return (
                <article key={r.id} className="card lc-proposal">
                  <div className="lc-proposal-head">
                    <Avatar initials={f.initials} size="lg" />
                    <div>
                      <Link to={`/lancer/u/${f.id}`}><strong>{f.name}</strong></Link>
                      <span className="muted small">{f.title} · {f.city}</span>
                      <div className="lc-talent-badges"><LevelBadge level={f.level} /><TrustBadges f={f} /><Stars rating={f.rating} count={f.reviews} /></div>
                    </div>
                    <div className="lc-bid"><strong>{pkr(r.bid)}{project.budgetType === 'Hourly' ? '/hr' : ''}</strong><span className="muted small">{r.days} days</span><StatusPill status={r.status} /></div>
                  </div>
                  <p className="small">{r.cover}</p>
                  {r.status !== 'Hired' && project.status === 'Open' && (
                    <div className="lc-proposal-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => setHiring(r)}>Hire</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/lancer/messages/${contact(f.name, `Proposal: ${project.title}`, f.id)}`)}>Message / interview</button>
                      {r.status !== 'Shortlisted' ? <button className="btn btn-ghost btn-sm" onClick={() => setProposalStatus(project.id, r.id, 'Shortlisted')}><Icon name="star" size={14} /> Shortlist</button> : <button className="btn btn-ghost btn-sm" onClick={() => setProposalStatus(project.id, r.id, 'New')}>Remove from shortlist</button>}
                      <button className="ac-link-btn danger" onClick={() => setProposalStatus(project.id, r.id, 'Declined')}>Decline</button>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        ) : <Empty title="No proposals here" text={filter === 'Shortlisted' ? 'Shortlist proposals to compare them side by side.' : 'Proposals will appear here.'} />}
      </section>
      {hiring && <HireDialog project={project} proposal={hiring} onClose={() => setHiring(null)} />}
    </div>
  )
}
