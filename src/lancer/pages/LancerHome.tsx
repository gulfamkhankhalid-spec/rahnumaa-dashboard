import { Link } from 'react-router-dom'
import Icon, { type IconName } from '../../components/Icon'
import { categories, freelancers } from '../data'
import { useLancer } from '../store'
import { FreelancerCard, GigCard } from '../ui'

export default function LancerHome() {
  const { allGigs } = useLancer()
  const popular = [...allGigs].sort((a, b) => b.reviews - a.reviews).slice(0, 8)
  const top = freelancers.filter((f) => f.rating >= 4.8).slice(0, 4)

  return (
    <>
      <section className="ac-hero lc-hero">
        <div className="ac-wrap ac-hero-grid">
          <div>
            <span className="eyebrow">Skillsrator · Skill Lancer</span>
            <h1>Hire verified freelancers. Get paid safely.</h1>
            <p className="lead">Buy ready-made services with fixed packages, or post a project and compare proposals. Every freelancer is identity-verified, many hold ABC skill credentials, and payments are protected by escrow.</p>
            <div className="ac-hero-actions">
              <Link to="/lancer/gigs" className="btn btn-primary btn-lg">Browse services <Icon name="arrow" size={18} /></Link>
              <Link to="/lancer/post" className="btn btn-outline btn-lg">Post a project</Link>
            </div>
            <ul className="hero-points">
              <li><Icon name="shield" size={16} /> CNIC-verified identities</li>
              <li><Icon name="lock" size={16} /> Escrow on every order</li>
              <li><Icon name="award" size={16} /> ABC-backed skills</li>
              <li><Icon name="check" size={16} /> PKR payouts</li>
            </ul>
          </div>
          <div className="card ac-hero-panel">
            <h2>Two ways to get work done</h2>
            <Link to="/lancer/gigs" className="lc-way">
              <Icon name="grid" size={22} />
              <div><strong>Buy a service</strong><span className="muted small">Pick a package with a fixed price and delivery date. Order in minutes.</span></div>
              <Icon name="arrow" size={16} />
            </Link>
            <Link to="/lancer/post" className="lc-way">
              <Icon name="clipboard" size={22} />
              <div><strong>Post a project</strong><span className="muted small">Describe the job, get proposals, interview and hire on a fixed or hourly contract.</span></div>
              <Icon name="arrow" size={16} />
            </Link>
            <Link to="/lancer/seller" className="lc-way">
              <Icon name="briefcase" size={22} />
              <div><strong>Start selling</strong><span className="muted small">Create gigs, send proposals and get paid to your bank or mobile wallet.</span></div>
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <div className="ac-wrap ac-sections">
        <section>
          <div className="ac-row-head"><h2>Browse by category</h2></div>
          <div className="ac-cats">
            {categories.map((c) => (
              <Link key={c.slug} to={`/lancer/gigs?cat=${c.slug}`} className="ac-cat"><Icon name={c.icon as IconName} size={22} /><span>{c.name}</span></Link>
            ))}
          </div>
        </section>

        <section>
          <div className="ac-row-head"><h2>Popular services</h2><Link to="/lancer/gigs?sort=reviews">View all <Icon name="arrow" size={14} /></Link></div>
          <div className="ac-grid">{popular.map((g) => <GigCard key={g.id} gig={g} />)}</div>
        </section>

        <section className="lc-how">
          <h2>How escrow protects you</h2>
          <ol className="steps">
            {[
              ['Agree', 'Choose a package or accept a proposal. Price, scope and delivery date are clear before you pay.'],
              ['Pay into escrow', 'Your money is held safely — the freelancer can see it is there, but cannot touch it yet.'],
              ['Review the work', 'Approve the delivery, or ask for a revision. Payment is released only when you approve.'],
              ['Resolve fairly', 'If something goes wrong, a structured dispute process and a neutral mediator step in.'],
            ].map(([t, d], i) => <li key={t} className="step"><span className="step-num">{i + 1}</span><h3>{t}</h3><p className="muted">{d}</p></li>)}
          </ol>
          <Link to="/lancer/how-it-works" className="link-arrow">Learn more about protection and fees <Icon name="arrow" size={14} /></Link>
        </section>

        <section>
          <div className="ac-row-head"><h2>Top-rated verified freelancers</h2><Link to="/lancer/talent">Find talent <Icon name="arrow" size={14} /></Link></div>
          <div className="lc-talent-grid">{top.map((f) => <FreelancerCard key={f.id} f={f} />)}</div>
        </section>

        <section className="ac-split-cards">
          <Link to="/academy/course/freelancing-launchpad" className="card ac-promo">
            <Icon name="book" size={26} />
            <h3>New to freelancing?</h3>
            <p className="muted">Take the free-to-audit Freelancing Launchpad course on Skill Academy: choose a niche, build a portfolio and win your first client.</p>
            <span className="link-arrow">Start learning <Icon name="arrow" size={14} /></span>
          </Link>
          <Link to="/skillsrator/skill-accelerator" className="card ac-promo">
            <Icon name="rocket" size={26} />
            <h3>Freelance launch cohort</h3>
            <p className="muted">A 4–8 week Skill Accelerator program that ends with a live Skill Lancer profile and your first client.</p>
            <span className="link-arrow">About the Accelerator <Icon name="arrow" size={14} /></span>
          </Link>
          <Link to="/abc" className="card ac-promo">
            <Icon name="award" size={26} />
            <h3>Prove your skills with ABC</h3>
            <p className="muted">ABC credentials appear on your profile and help clients trust you faster.</p>
            <span className="link-arrow">About ABC <Icon name="arrow" size={14} /></span>
          </Link>
        </section>
      </div>
    </>
  )
}
