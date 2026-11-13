import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { catName, FEES, pkr, sampleReviews } from '../data'
import { useLancer } from '../store'
import { Avatar, GigCover, LevelBadge, Modal, sellerOf, Stars, TrustBadges } from '../ui'
import NotFound from '../../pages/site/NotFound'

export default function GigDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { s, getGig, placeOrder, contact, toggleSaved } = useLancer()
  const gig = getGig(id)
  const [pkgName, setPkg] = useState('Standard')
  const [checkout, setCheckout] = useState(false)
  const [addons, setAddons] = useState<string[]>([])
  const [req, setReq] = useState('')
  const [error, setError] = useState('')
  if (!gig) return <NotFound />

  const seller = sellerOf(gig, s.me)
  const own = gig.sellerId === 'me'
  const pkg = gig.packages.find((p) => p.name === pkgName) ?? gig.packages[0]
  const addonTotal = gig.addons.filter((a) => addons.includes(a.id)).reduce((t, a) => t + a.price, 0)
  const subtotal = pkg.price + addonTotal
  const fee = Math.round(subtotal * FEES.buyer)
  const saved = s.saved.includes(gig.id)

  function order(e: FormEvent) {
    e.preventDefault()
    const oid = placeOrder(gig!, pkg.name, addons, req.trim())
    if (!oid) { setError(`Your wallet balance (${pkr(s.wallet.balance)}) is too low. Add funds in your wallet first.`); return }
    navigate(`/lancer/order/${oid}`)
  }

  return (
    <div className="ac-wrap lc-gig">
      <nav className="ac-crumbs"><Link to="/lancer">Skill Lancer</Link> / <Link to={`/lancer/gigs?cat=${gig.category}`}>{catName(gig.category)}</Link> / <Link to={`/lancer/gigs?cat=${gig.category}&sub=${encodeURIComponent(gig.sub)}`}>{gig.sub}</Link></nav>
      <div className="lc-gig-grid">
        <div className="lc-gig-main">
          <h1>{gig.title}</h1>
          <div className="lc-seller-row big">
            <Avatar initials={seller.initials} />
            {own ? <strong>{seller.name} (you)</strong> : <Link to={`/lancer/u/${seller.id}`}><strong>{seller.name}</strong></Link>}
            <LevelBadge level={seller.level} />
            <Stars rating={gig.rating} count={gig.reviews} />
          </div>
          <TrustBadges f={seller} />
          <GigCover gig={gig} large />

          <section>
            <h2>About this service</h2>
            <p>{gig.description}</p>
            <div className="ac-chips">{gig.tags.map((t) => <span key={t} className="ac-chip">{t}</span>)}</div>
          </section>

          <section>
            <h2>Compare packages</h2>
            <div className="lc-compare-wrap">
              <table className="table lc-compare">
                <thead><tr><th>Package</th>{gig.packages.map((p) => <th key={p.name}>{p.name}<br /><span className="muted small">{p.title}</span></th>)}</tr></thead>
                <tbody>
                  <tr><td>Price</td>{gig.packages.map((p) => <td key={p.name}><strong>{pkr(p.price)}</strong></td>)}</tr>
                  <tr><td>Delivery</td>{gig.packages.map((p) => <td key={p.name}>{p.days} day{p.days > 1 ? 's' : ''}</td>)}</tr>
                  <tr><td>Revisions</td>{gig.packages.map((p) => <td key={p.name}>{p.revisions >= 99 ? 'Unlimited' : p.revisions}</td>)}</tr>
                  {[...new Set(gig.packages.flatMap((p) => p.features))].map((f) => (
                    <tr key={f}><td>{f}</td>{gig.packages.map((p) => <td key={p.name}>{p.features.includes(f) ? <Icon name="check" size={16} className="accent" /> : <span className="muted">—</span>}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {gig.faqs.length > 0 && (
            <section>
              <h2>FAQ</h2>
              {gig.faqs.map(([q, a]) => <details key={q} className="ac-faq"><summary>{q}</summary><p className="muted">{a}</p></details>)}
            </section>
          )}

          {!own && (
            <section>
              <h2>About the seller</h2>
              <Link to={`/lancer/u/${seller.id}`} className="card lc-about-seller">
                <Avatar initials={seller.initials} size="lg" />
                <div>
                  <strong>{seller.name}</strong>
                  <span className="muted small">{seller.title} · {seller.city} · {seller.languages.join(', ')}</span>
                  <p className="small">{seller.bio}</p>
                  <span className="small muted">Responds in about {seller.response} · {seller.onTime}% on-time delivery · Member since {seller.memberSince}</span>
                </div>
              </Link>
            </section>
          )}

          <section>
            <h2>Reviews</h2>
            <div className="ac-reviews">
              {sampleReviews.map((r) => (
                <blockquote key={r.from} className="card"><Stars rating={r.rating} /><p>“{r.text}”</p><footer className="muted small">{r.from} · {r.when}</footer></blockquote>
              ))}
            </div>
          </section>
        </div>

        <aside className="lc-pkg-box card">
          <div className="tabs lc-pkg-tabs" role="tablist">
            {gig.packages.map((p) => <button key={p.name} role="tab" aria-selected={pkg.name === p.name} className={pkg.name === p.name ? 'active' : ''} onClick={() => setPkg(p.name)}>{p.name}</button>)}
          </div>
          <div className="lc-pkg-head"><strong>{pkg.title}</strong><span className="lc-price">{pkr(pkg.price)}</span></div>
          <p className="muted small"><Icon name="calendar" size={14} /> {pkg.days}-day delivery · {pkg.revisions >= 99 ? 'Unlimited' : pkg.revisions} revision{pkg.revisions === 1 ? '' : 's'}</p>
          <ul className="check-list small">{pkg.features.map((f) => <li key={f}><Icon name="check" size={14} /> {f}</li>)}</ul>
          {own ? (
            <Link to={`/lancer/seller/gig/${gig.id}`} className="btn btn-outline btn-block">Edit your gig</Link>
          ) : (
            <>
              <button className="btn btn-primary btn-block" onClick={() => setCheckout(true)}>Continue ({pkr(pkg.price)})</button>
              <button className="btn btn-ghost btn-block" onClick={() => navigate(`/lancer/messages/${contact(seller.name, `Question about: ${gig.title}`, seller.id)}`)}>Contact seller</button>
            </>
          )}
          <button className={`ac-link-btn ${saved ? 'saved' : ''}`} onClick={() => toggleSaved(gig.id)}><Icon name="heart" size={14} /> {saved ? 'Saved' : 'Save for later'}</button>
          <p className="lc-protect"><Icon name="lock" size={14} /> Payment held in escrow until you approve the work.</p>
        </aside>
      </div>

      {checkout && (
        <Modal title="Order details" onClose={() => setCheckout(false)}>
          <form onSubmit={order} className="ac-form">
            <p><strong>{gig.title}</strong><br /><span className="muted small">{pkg.name} package · {pkg.days}-day delivery</span></p>
            {gig.addons.length > 0 && (
              <fieldset className="lc-addons">
                <legend>Add extras</legend>
                {gig.addons.map((a) => (
                  <label key={a.id}><input type="checkbox" checked={addons.includes(a.id)} onChange={(e) => setAddons(e.target.checked ? [...addons, a.id] : addons.filter((x) => x !== a.id))} /> <span>{a.title}</span> <strong>+{pkr(a.price)}</strong></label>
                ))}
              </fieldset>
            )}
            <label>Requirements for the seller<textarea required rows={4} value={req} onChange={(e) => setReq(e.target.value)} placeholder="Describe what you need, and share any links, colours, examples or text." /></label>
            <div className="lc-summary">
              <div><span>Package</span><span>{pkr(pkg.price)}</span></div>
              {addonTotal > 0 && <div><span>Extras</span><span>{pkr(addonTotal)}</span></div>}
              <div><span>Service fee ({FEES.buyer * 100}%, sample)</span><span>{pkr(fee)}</span></div>
              <div className="total"><span>Total</span><span>{pkr(subtotal + fee)}</span></div>
            </div>
            <p className="muted small">Paid from your Skill Lancer wallet ({pkr(s.wallet.balance)} available). {pkr(subtotal)} is held in escrow until you approve the delivery.</p>
            {error && <p className="lc-error">{error} <Link to="/lancer/wallet">Go to wallet</Link></p>}
            <button className="btn btn-primary btn-block" type="submit">Pay {pkr(subtotal + fee)} and place order</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
