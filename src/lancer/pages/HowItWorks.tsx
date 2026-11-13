import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { FEES } from '../data'

export default function HowItWorks() {
  return (
    <div className="ac-wrap ac-sections lc-how-page">
      <header><span className="eyebrow">Trust & fees</span><h1>How Skill Lancer keeps both sides safe</h1><p className="lead">Protection comes from real value — escrow, fair dispute handling and reputation you can trust — not from punishing users.</p></header>
      <section className="ac-split-cards">
        {[
          ['shield', 'Verified identities', 'Every freelancer and client climbs the verification ladder: phone, CNIC identity check, and ABC skill credentials where available.'],
          ['lock', 'Escrow on every payment', 'Money for an order or milestone is held safely until the buyer approves the work. Unapproved deliveries auto-release after 3 days so freelancers are never left waiting.'],
          ['clipboard', 'Clear contracts', 'Fixed-price milestones, hourly contracts with weekly limits, and service packages with fixed scope, price and delivery date.'],
          ['users', 'Fair disputes', 'A structured process: talk first, then a neutral mediator reviews messages and deliveries and decides how escrowed funds are split.'],
          ['star', 'Honest reviews', 'Two-way reviews after every job. Seller levels weigh verified outcomes — on-time delivery, repeat clients — not only volume.'],
          ['briefcase', 'Local payouts', 'Withdraw earnings in PKR to a bank account or mobile wallet; receive payments from clients abroad.'],
        ].map(([ic, t, d]) => <div key={t} className="card ac-promo"><Icon name={ic as 'shield'} size={26} /><h3>{t}</h3><p className="muted">{d}</p></div>)}
      </section>
      <section className="card">
        <h2>Fees (sample)</h2>
        <ul className="lc-kv">
          <li><span>Buyers: service fee on each order</span><strong>{FEES.buyer * 100}%</strong></li>
          <li><span>Freelancers: fee on earnings</span><strong>{FEES.seller * 100}%</strong></li>
          <li><span>Posting a project</span><strong>Free</strong></li>
          <li><span>Sending a proposal</span><strong>2 proposal credits</strong></li>
          <li><span>Withdrawals to bank or mobile wallet</span><strong>Free</strong></li>
        </ul>
        <p className="muted small">Fees are shown before every payment. Final fees will be set after market testing and regulatory confirmation.</p>
      </section>
      <section className="note"><Icon name="info" size={18} /><p>Never pay or communicate outside Skill Lancer for work found here. Escrow and dispute protection only cover payments made on the platform.</p></section>
      <div className="lc-head-actions"><Link to="/lancer/gigs" className="btn btn-primary">Browse services</Link><Link to="/lancer/seller" className="btn btn-outline">Start selling</Link></div>
    </div>
  )
}
