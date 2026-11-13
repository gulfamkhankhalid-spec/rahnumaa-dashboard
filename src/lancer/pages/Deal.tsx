import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { FEES, pkr } from '../data'
import { useLancer } from '../store'
import { Modal, StatusPill } from '../ui'
import NotFound from '../../pages/site/NotFound'

function DisputeDialog({ onSubmit, onClose }: { onSubmit: (reason: string, detail: string) => void; onClose: () => void }) {
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')
  return (
    <Modal title="Open a dispute" onClose={onClose}>
      <form className="ac-form" onSubmit={(e) => { e.preventDefault(); onSubmit(reason, detail) }}>
        <p className="muted small">Try messaging the other party first. If you can’t agree, a neutral mediator reviews the messages and deliveries, then decides how the escrowed funds are split.</p>
        <label>What went wrong?
          <select required value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="" disabled>Choose a reason</option>
            <option>Work not delivered on time</option>
            <option>Delivery does not match the agreed scope</option>
            <option>Communication stopped</option>
            <option>Request to cancel by mutual agreement</option>
            <option>Other</option>
          </select>
        </label>
        <label>Explain what happened and what outcome you want<textarea required rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} /></label>
        <button className="btn btn-primary btn-block" type="submit">Submit to resolution centre</button>
      </form>
    </Modal>
  )
}

function ReviewForm({ onSubmit, label }: { onSubmit: (rating: number, text: string) => void; label: string }) {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  return (
    <form className="card ac-form" onSubmit={(e) => { e.preventDefault(); onSubmit(rating, text.trim()) }}>
      <h3>{label}</h3>
      <div className="lc-rate" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRating(n)} className={n <= rating ? 'on' : ''}>
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg>
          </button>
        ))}
      </div>
      <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience (public)" required />
      <button className="btn btn-primary" type="submit">Submit review</button>
    </form>
  )
}

export function OrderPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { s, simulateDelivery, requestRevision, acceptOrder, reviewOrder, deliver, simulateBuyerAccept, openOrderDispute, simulateOrderResolution, contact } = useLancer()
  const [revision, setRevision] = useState('')
  const [delivery, setDelivery] = useState('')
  const [dispute, setDispute] = useState(false)
  const o = s.orders.find((x) => x.id === id)
  if (!o) return <NotFound />
  const buyer = o.role === 'buyer'
  const open = !['Completed', 'Cancelled'].includes(o.status)

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div>
          <nav className="ac-crumbs"><Link to={buyer ? '/lancer/client' : '/lancer/seller?tab=orders'}>{buyer ? 'My hiring' : 'Seller dashboard'}</Link> / Order</nav>
          <h1>{o.gigTitle}</h1>
          <p className="muted">{buyer ? 'Seller' : 'Buyer'}: {o.other} · {o.pkg} package{o.addons.length ? ` + ${o.addons.join(', ')}` : ''} · placed {o.placed} · due {o.due}</p>
        </div>
        <StatusPill status={o.status} />
      </header>

      <div className="lc-deal-grid">
        <div className="lc-deal-main">
          {o.status === 'In dispute' && (
            <div className="card lc-alert">
              <strong>Dispute under review</strong>
              <p className="small">{o.dispute?.reason}: {o.dispute?.detail}</p>
              <button className="btn btn-ghost btn-sm" onClick={() => simulateOrderResolution(o.id)}>Simulate mediator decision</button>
            </div>
          )}
          {o.dispute?.outcome && <div className="card lc-alert"><strong>Dispute resolved</strong><p className="small">{o.dispute.outcome}</p></div>}

          {/* Buyer actions */}
          {buyer && o.status === 'In progress' && (
            <div className="card lc-next"><Icon name="calendar" size={20} /><div><strong>The seller is working on your order</strong><span className="muted small">Delivery due {o.due}. Your payment is safe in escrow.</span></div><button className="btn btn-ghost btn-sm" onClick={() => simulateDelivery(o.id)}>Simulate seller delivery</button></div>
          )}
          {buyer && o.status === 'Revision requested' && (
            <div className="card lc-next"><Icon name="route" size={20} /><div><strong>Revision requested</strong><span className="muted small">The seller is updating the work.</span></div><button className="btn btn-ghost btn-sm" onClick={() => simulateDelivery(o.id)}>Simulate new delivery</button></div>
          )}
          {buyer && o.status === 'Delivered' && (
            <div className="card ac-form">
              <h2>Delivery received</h2>
              <p>{o.delivery}</p>
              <div className="lc-file"><Icon name="download" size={16} /> delivery-files.zip <span className="muted small">(prototype)</span></div>
              <div className="lc-head-actions">
                <button className="btn btn-primary" onClick={() => acceptOrder(o.id)}>Approve and release {pkr(o.price)}</button>
              </div>
              {o.revisions > 0 ? (
                <form className="lc-inline-form" onSubmit={(e) => { e.preventDefault(); if (revision.trim()) { requestRevision(o.id, revision.trim()); setRevision('') } }}>
                  <input value={revision} onChange={(e) => setRevision(e.target.value)} placeholder="What should be changed?" aria-label="Revision request" />
                  <button className="btn btn-ghost" type="submit">Request revision ({o.revisions} left)</button>
                </form>
              ) : <p className="muted small">No revisions left in this package.</p>}
              <p className="muted small">If you don’t respond, the order auto-completes 3 days after delivery.</p>
            </div>
          )}
          {buyer && o.status === 'Completed' && !o.review && <ReviewForm label={`Review ${o.other}`} onSubmit={(r, t) => reviewOrder(o.id, r, t)} />}

          {/* Seller actions */}
          {!buyer && (o.status === 'In progress' || o.status === 'Revision requested') && (
            <form className="card ac-form" onSubmit={(e: FormEvent) => { e.preventDefault(); if (delivery.trim()) { deliver(o.id, delivery.trim()); setDelivery('') } }}>
              <h2>Deliver your work</h2>
              <label>Message to the buyer<textarea rows={4} value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="Describe what you delivered and how to use it." /></label>
              <button type="button" className="btn btn-ghost btn-sm lc-attach"><Icon name="download" size={14} /> Attach files (prototype)</button>
              <button className="btn btn-primary" type="submit" disabled={!delivery.trim()}>Deliver now</button>
            </form>
          )}
          {!buyer && o.status === 'Delivered' && (
            <div className="card lc-next"><Icon name="check" size={20} /><div><strong>Delivered — waiting for the buyer</strong><span className="muted small">You’ll be paid {pkr(o.price - o.fee)} after the {FEES.seller * 100}% fee once approved.</span></div><button className="btn btn-ghost btn-sm" onClick={() => simulateBuyerAccept(o.id)}>Simulate buyer approval</button></div>
          )}

          {o.review && <div className="card"><h3>{buyer ? 'Your review' : 'Buyer’s review'}</h3><p>{'★'.repeat(o.review.rating)}{'☆'.repeat(5 - o.review.rating)}</p><p className="small">“{o.review.text}”</p></div>}

          <section className="card">
            <h2>Requirements</h2>
            <p className="small">{o.requirements || <span className="muted">No requirements given.</span>}</p>
          </section>
          <section className="card">
            <h2>Activity</h2>
            <ol className="lc-timeline">{[...o.events].reverse().map((e, i) => <li key={i}><span className="muted small">{e.date}</span>{e.text}</li>)}</ol>
          </section>
        </div>

        <aside className="lc-deal-side">
          <div className="card">
            <h3>Order summary</h3>
            <ul className="lc-kv small">
              <li><span>Price</span><strong>{pkr(o.price)}</strong></li>
              <li><span>{buyer ? 'Service fee' : 'Skill Lancer fee'}</span><strong>{pkr(o.fee)}</strong></li>
              <li><span>{buyer ? 'You paid' : 'You receive'}</span><strong>{pkr(buyer ? o.price + o.fee : o.price - o.fee)}</strong></li>
              <li><span>Delivery</span><strong>{o.days} days</strong></li>
              <li><span>Revisions left</span><strong>{o.revisions >= 99 ? 'Unlimited' : o.revisions}</strong></li>
            </ul>
            <p className="lc-protect"><Icon name="lock" size={14} /> {o.status === 'Completed' ? 'Payment released.' : 'Funds held in escrow.'}</p>
          </div>
          <button className="btn btn-ghost btn-block" onClick={() => navigate(`/lancer/messages/${contact(o.other, `Order: ${o.gigTitle}`, o.otherId)}`)}><Icon name="users" size={16} /> Message {o.other.replace('Sample Freelancer — ', '')}</button>
          {open && o.status !== 'In dispute' && <button className="ac-link-btn danger" onClick={() => setDispute(true)}>Open a dispute</button>}
        </aside>
      </div>
      {dispute && <DisputeDialog onClose={() => setDispute(false)} onSubmit={(r, d) => { openOrderDispute(o.id, r, d); setDispute(false) }} />}
    </div>
  )
}

export function ContractPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { s, fundMilestone, submitMilestone, releaseMilestone, addMilestone, logHours, payHours, endContract, openContractDispute, simulateContractResolution, contact } = useLancer()
  const [msTitle, setMsTitle] = useState('')
  const [msAmount, setMsAmount] = useState(10000)
  const [hours, setHours] = useState(2)
  const [memo, setMemo] = useState('')
  const [error, setError] = useState('')
  const [ending, setEnding] = useState(false)
  const [dispute, setDispute] = useState(false)
  const c = s.contracts.find((x) => x.id === id)
  if (!c) return <NotFound />
  const client = c.role === 'client'
  const total = c.milestones.reduce((t, m) => t + m.amount, 0)
  const released = c.milestones.filter((m) => m.status === 'Released').reduce((t, m) => t + m.amount, 0)
  const inEscrow = c.milestones.filter((m) => m.status === 'Funded' || m.status === 'Submitted').reduce((t, m) => t + m.amount, 0)
  const loggedHours = c.hours.filter((h) => h.status === 'Logged').reduce((t, h) => t + h.hours, 0)
  const active = c.status === 'Active'

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div>
          <nav className="ac-crumbs"><Link to={client ? '/lancer/client' : '/lancer/seller?tab=contracts'}>{client ? 'My hiring' : 'Seller dashboard'}</Link> / Contract</nav>
          <h1>{c.title}</h1>
          <p className="muted">{client ? 'Freelancer' : 'Client'}: {c.other} · {c.type === 'Fixed' ? 'Fixed price' : `Hourly · ${pkr(c.rate)}/hr · up to ${c.weeklyLimit} hrs/week`} · started {c.started}</p>
        </div>
        <StatusPill status={c.status} />
      </header>

      <div className="lc-deal-grid">
        <div className="lc-deal-main">
          {c.status === 'In dispute' && <div className="card lc-alert"><strong>Dispute under review</strong><p className="small">{c.dispute?.reason}: {c.dispute?.detail}</p><button className="btn btn-ghost btn-sm" onClick={() => simulateContractResolution(c.id)}>Simulate mediator decision</button></div>}
          {c.dispute?.outcome && <div className="card lc-alert"><strong>Dispute resolved</strong><p className="small">{c.dispute.outcome}</p></div>}
          {error && <p className="lc-error">{error} <Link to="/lancer/wallet">Wallet</Link></p>}

          {c.type === 'Fixed' ? (
            <section className="card">
              <h2>Milestones</h2>
              <ol className="lc-milestones">
                {c.milestones.map((m, i) => (
                  <li key={m.id}>
                    <span className="lc-ms-num">{i + 1}</span>
                    <div className="lc-ms-info"><strong>{m.title}</strong><span className="muted small">{pkr(m.amount)}</span></div>
                    <StatusPill status={m.status} />
                    <div className="lc-ms-act">
                      {client && m.status === 'Not funded' && active && <button className="btn btn-outline btn-sm" onClick={() => { setError(''); if (!fundMilestone(c.id, m.id)) setError('Not enough wallet balance to fund this milestone.') }}>Fund</button>}
                      {client && m.status === 'Funded' && active && <button className="ac-link-btn" onClick={() => submitMilestone(c.id, m.id)}>Simulate freelancer submitting</button>}
                      {client && m.status === 'Submitted' && <button className="btn btn-primary btn-sm" onClick={() => releaseMilestone(c.id, m.id)}>Approve &amp; release</button>}
                      {!client && m.status === 'Funded' && active && <button className="btn btn-primary btn-sm" onClick={() => submitMilestone(c.id, m.id)}>Submit work</button>}
                      {!client && m.status === 'Not funded' && <span className="muted small">Waiting for client to fund</span>}
                      {!client && m.status === 'Submitted' && <button className="ac-link-btn" onClick={() => releaseMilestone(c.id, m.id)}>Simulate client approval</button>}
                    </div>
                  </li>
                ))}
              </ol>
              {client && active && (
                <form className="lc-inline-form" onSubmit={(e) => { e.preventDefault(); if (msTitle.trim()) { addMilestone(c.id, msTitle.trim(), msAmount); setMsTitle('') } }}>
                  <input value={msTitle} onChange={(e) => setMsTitle(e.target.value)} placeholder="New milestone title" aria-label="New milestone title" />
                  <input type="number" min={500} step="any" value={msAmount} onChange={(e) => setMsAmount(Number(e.target.value))} aria-label="Amount" className="lc-amount" />
                  <button className="btn btn-ghost" type="submit">Add milestone</button>
                </form>
              )}
            </section>
          ) : (
            <section className="card">
              <h2>Work diary</h2>
              <p className="muted small">Hours are logged by the freelancer and reviewed weekly. Privacy-respecting: memos only, no screenshots.</p>
              {active && (
                <form className="lc-inline-form" onSubmit={(e) => { e.preventDefault(); if (hours > 0 && memo.trim()) { logHours(c.id, hours, memo.trim()); setMemo('') } }}>
                  <input type="number" min={0.5} step={0.5} max={c.weeklyLimit} value={hours} onChange={(e) => setHours(Number(e.target.value))} aria-label="Hours" className="lc-amount" />
                  <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder={client ? 'Simulate freelancer logging hours: what was done?' : 'What did you work on?'} aria-label="Work memo" />
                  <button className="btn btn-ghost" type="submit">{client ? 'Simulate log' : 'Log hours'}</button>
                </form>
              )}
              <table className="table"><thead><tr><th>Date</th><th>Hours</th><th>Memo</th><th>Status</th></tr></thead>
                <tbody>{c.hours.length ? c.hours.map((h) => <tr key={h.id}><td>{h.date}</td><td>{h.hours}</td><td>{h.memo}</td><td><StatusPill status={h.status} /></td></tr>) : <tr><td colSpan={4} className="muted">No hours logged yet.</td></tr>}</tbody></table>
              {loggedHours > 0 && (
                <div className="lc-next">
                  <div><strong>This week: {loggedHours} hrs · {pkr(loggedHours * c.rate)}</strong><span className="muted small">{client ? 'Review and pay for logged hours.' : 'Paid when the client approves the week.'}</span></div>
                  <button className="btn btn-primary btn-sm" onClick={() => { setError(''); if (!payHours(c.id)) setError('Not enough wallet balance to pay these hours.') }}>{client ? 'Approve & pay week' : 'Simulate client approval'}</button>
                </div>
              )}
            </section>
          )}

          {active && !ending && <div className="lc-head-actions"><button className="btn btn-ghost" onClick={() => setEnding(true)}>End contract</button><button className="ac-link-btn danger" onClick={() => setDispute(true)}>Open a dispute</button></div>}
          {ending && active && <ReviewForm label={`End contract and review ${c.other}`} onSubmit={(r, t) => { endContract(c.id, r, t); setEnding(false) }} />}
          {c.review && <div className="card"><h3>Your review</h3><p>{'★'.repeat(c.review.rating)}{'☆'.repeat(5 - c.review.rating)}</p><p className="small">“{c.review.text}”</p></div>}
        </div>

        <aside className="lc-deal-side">
          <div className="card">
            <h3>Payments</h3>
            <ul className="lc-kv small">
              {c.type === 'Fixed' ? (
                <>
                  <li><span>Contract total</span><strong>{pkr(total)}</strong></li>
                  <li><span>In escrow</span><strong>{pkr(inEscrow)}</strong></li>
                  <li><span>Released</span><strong>{pkr(released)}</strong></li>
                  {!client && <li><span>Fee ({FEES.seller * 100}%, sample)</span><strong>{pkr(released * FEES.seller)}</strong></li>}
                </>
              ) : (
                <>
                  <li><span>Rate</span><strong>{pkr(c.rate)}/hr</strong></li>
                  <li><span>Weekly limit</span><strong>{c.weeklyLimit} hrs</strong></li>
                  <li><span>Hours paid</span><strong>{c.hours.filter((h) => h.status === 'Paid').reduce((t, h) => t + h.hours, 0)}</strong></li>
                </>
              )}
            </ul>
            <p className="lc-protect"><Icon name="lock" size={14} /> Escrow protects both sides.</p>
          </div>
          <button className="btn btn-ghost btn-block" onClick={() => navigate(`/lancer/messages/${contact(c.other, `Contract: ${c.title}`, c.otherId)}`)}><Icon name="users" size={16} /> Message {c.other.replace('Sample Freelancer — ', '')}</button>
        </aside>
      </div>
      {dispute && <DisputeDialog onClose={() => setDispute(false)} onSubmit={(r, d) => { openContractDispute(c.id, r, d); setDispute(false) }} />}
    </div>
  )
}
