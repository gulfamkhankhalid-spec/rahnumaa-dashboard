import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { findProject, fromPrice, pkr } from '../data'
import { useLancer } from '../store'
import { GigCover, StatusPill } from '../ui'
import { Empty } from '../../academy/ui'

const tabs = [['overview', 'Overview'], ['orders', 'Orders'], ['gigs', 'My gigs'], ['proposals', 'Proposals'], ['contracts', 'Contracts']] as const

export default function SellerDashboard() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = params.get('tab') ?? 'overview'
  const { s, setGigStatus, deleteGig, withdrawProposal, simulateHired } = useLancer()
  const orders = s.orders.filter((o) => o.role === 'seller')
  const contracts = s.contracts.filter((c) => c.role === 'freelancer')
  const activeOrders = orders.filter((o) => !['Completed', 'Cancelled'].includes(o.status))
  const checklist = [
    { done: true, text: 'Verify your identity (CNIC)', to: '/app/record' },
    { done: true, text: 'Complete a Skill Academy course', to: '/academy/my-learning' },
    { done: s.myGigs.some((g) => g.status === 'Active'), text: 'Publish your first gig', to: '/lancer/seller/gig/new' },
    { done: s.sent.length > 0, text: 'Send your first proposal', to: '/lancer/projects' },
    { done: false, text: 'Earn an ABC credential', to: '/abc' },
  ]
  const completedOrders = orders.filter((o) => o.status === 'Completed').length + 3

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>Seller dashboard</h1><p className="muted">{s.me.name} · {s.me.title}</p></div>
        <div className="lc-head-actions"><Link to="/lancer/projects" className="btn btn-ghost">Find work</Link><Link to="/lancer/seller/gig/new" className="btn btn-primary">Create a gig</Link></div>
      </header>

      <div className="tabs ac-my-tabs" role="tablist">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setParams({ tab: k })}>{l}</button>)}
      </div>

      {tab === 'overview' && (
        <>
          <section className="stats">
            <div className="card stat"><span className="stat-label">Available to withdraw</span><span className="stat-value small-value">{pkr(s.wallet.balance)}</span><Link to="/lancer/wallet" className="small">Withdraw</Link></div>
            <div className="card stat"><span className="stat-label">Earned (all time)</span><span className="stat-value small-value">{pkr(s.wallet.earned)}</span></div>
            <div className="card stat"><span className="stat-label">Active orders</span><span className="stat-value">{activeOrders.length}</span></div>
            <div className="card stat"><span className="stat-label">Proposal credits</span><span className="stat-value">{s.credits}</span></div>
          </section>
          <div className="app-grid">
            <section className="card">
              <h2>Ready to sell</h2>
              <p className="muted small">Your path from learning to first client, linked to Skill Academy and Skill Accelerator.</p>
              <ul className="lc-checklist">{checklist.map((c) => <li key={c.text} className={c.done ? 'done' : ''}><span>{c.done ? <Icon name="check" size={12} /> : ''}</span><Link to={c.to}>{c.text}</Link></li>)}</ul>
            </section>
            <section className="card">
              <h2>Seller level: Level 1</h2>
              <p className="muted small">Levels weigh verified outcomes, not just volume.</p>
              <ul className="score-bars">
                {[['Completed orders (10 for Level 2)', Math.min(100, completedOrders * 10)], ['On-time delivery (90%+)', 100], ['Rating (4.7+)', 100], ['Repeat clients (2+)', 50]].map(([k, v]) => (
                  <li key={k as string}><span className="score-label">{k}</span><div className="bar"><span style={{ width: `${v}%` }} /></div><span className="score-num">{v}%</span></li>
                ))}
              </ul>
            </section>
          </div>
          <section className="card">
            <h2>Active orders</h2>
            {activeOrders.length ? <ul className="lc-list">{activeOrders.map((o) => <li key={o.id}><Link to={`/lancer/order/${o.id}`}><strong>{o.gigTitle}</strong></Link><span className="muted small">{o.other} · {pkr(o.price)} · due {o.due}</span><StatusPill status={o.status} /></li>)}</ul> : <p className="muted small">No active orders.</p>}
          </section>
        </>
      )}

      {tab === 'orders' && (orders.length ? (
        <section className="card"><table className="table"><thead><tr><th>Order</th><th>Buyer</th><th>Price</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>{orders.map((o) => <tr key={o.id}><td><Link to={`/lancer/order/${o.id}`}>{o.gigTitle}</Link><br /><span className="muted small">{o.pkg}</span></td><td>{o.other}</td><td>{pkr(o.price)}</td><td>{o.due}</td><td><StatusPill status={o.status} /></td></tr>)}</tbody></table></section>
      ) : <Empty title="No orders yet" text="Orders from buyers appear here." />)}

      {tab === 'gigs' && (
        <section className="lc-mygigs">
          {s.myGigs.map((g) => (
            <article key={g.id} className="card lc-mygig">
              <GigCover gig={g} />
              <div className="lc-mygig-body">
                <Link to={`/lancer/gig/${g.id}`}><strong>{g.title}</strong></Link>
                <span className="muted small">From {pkr(fromPrice(g))} · {g.impressions} impressions · {g.clicks} clicks</span>
                <StatusPill status={g.status} />
                <div className="lc-row-actions">
                  <Link to={`/lancer/seller/gig/${g.id}`}>Edit</Link>
                  {g.status === 'Active' ? <button className="ac-link-btn" onClick={() => setGigStatus(g.id, 'Paused')}>Pause</button> : <button className="ac-link-btn" onClick={() => setGigStatus(g.id, 'Active')}>Activate</button>}
                  <button className="ac-link-btn danger" onClick={() => deleteGig(g.id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
          <Link to="/lancer/seller/gig/new" className="card lc-newgig"><Icon name="grid" size={26} /><strong>Create a new gig</strong></Link>
        </section>
      )}

      {tab === 'proposals' && (s.sent.length ? (
        <section className="card"><table className="table"><thead><tr><th>Project</th><th>Bid</th><th>Sent</th><th>Status</th><th></th></tr></thead>
          <tbody>{s.sent.map((p) => {
            const proj = findProject(p.projectId)
            return (
              <tr key={p.id}>
                <td><Link to={`/lancer/project/${p.projectId}`}>{proj?.title}</Link></td><td>{pkr(p.bid)}{proj?.budgetType === 'Hourly' ? '/hr' : ''}</td><td>{p.date}</td><td><StatusPill status={p.status} /></td>
                <td className="lc-row-actions">{p.status === 'Submitted' && <><button className="ac-link-btn" onClick={() => navigate(`/lancer/contract/${simulateHired(p.id)}`)}>Simulate client hiring you</button><button className="ac-link-btn danger" onClick={() => withdrawProposal(p.id)}>Withdraw</button></>}</td>
              </tr>
            )
          })}</tbody></table></section>
      ) : <Empty title="No proposals sent" text="Find a project and send your first proposal." cta={<Link to="/lancer/projects" className="btn btn-primary">Find work</Link>} />)}

      {tab === 'contracts' && (contracts.length ? (
        <section className="card"><ul className="lc-list">{contracts.map((c) => <li key={c.id}><Link to={`/lancer/contract/${c.id}`}><strong>{c.title}</strong></Link><span className="muted small">{c.other} · {c.type}</span><StatusPill status={c.status} /></li>)}</ul></section>
      ) : <Empty title="No contracts yet" text="When a client hires you from a proposal, the contract appears here." />)}
    </div>
  )
}
