import { Link } from 'react-router-dom'
import Icon, { type IconName } from '../../components/Icon'
import { initiatives, pillars, principles } from '../../data/site'

const pillarIcon: Record<string, IconName> = { education: 'book', employment: 'briefcase', engagement: 'heart' }

const steps = [
  { title: 'Sign up once', text: 'Create one account, verified step by step with your CNIC or B-Form.' },
  { title: 'Discover yourself', text: 'Take structured assessments of your interests, aptitude, personality and constraints.' },
  { title: 'Get a plan', text: 'Receive a personal pathway with a clear next step and Plan B and C — explained, not just ranked.' },
  { title: 'Act and grow', text: 'Learn, certify, earn and connect through Skillsrator — with a counselor whenever you need one.' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Rahnuma · Skillsrator · ABC</span>
            <h1>One platform for Education, Employment and Engagement.</h1>
            <p className="lead">
              The three biggest decisions of your life — what to study, how to earn and whom to build with — shape each
              other. Rahnuma is the trusted guide that connects them, and keeps guiding you as life changes.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start your journey <Icon name="arrow" size={18} />
              </Link>
              <Link to="/app" className="btn btn-outline btn-lg">Preview the app</Link>
            </div>
            <ul className="hero-points">
              <li><Icon name="check" size={16} /> Verified identity</li>
              <li><Icon name="check" size={16} /> You control your data</li>
              <li><Icon name="check" size={16} /> Urdu and English</li>
            </ul>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="orbit">
              <div className="orbit-core">
                <strong>You</strong>
                <small>One identity · One Life Record</small>
              </div>
              {pillars.map((p, i) => (
                <div key={p.key} className={`orbit-node n${i}`}>
                  <Icon name={pillarIcon[p.key]} size={22} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Three pillars</span>
            <h2>Three views of the same life</h2>
            <p>Most platforms address only one. Rahnuma makes all three speak to each other through one identity and one Life Record.</p>
          </div>
          <div className="grid-3">
            {pillars.map((p) => (
              <article key={p.key} className={`card pillar pillar-${p.key}`}>
                <span className="pillar-icon"><Icon name={pillarIcon[p.key]} size={24} /></span>
                <h3>{p.name}</h3>
                <p className="pillar-summary">{p.summary}</p>
                <p className="muted">{p.detail}</p>
                <p className="small"><strong>Connects you with:</strong> {p.connects}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>One life, one journey</h2>
          </div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step-num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head row-head">
            <div>
              <span className="eyebrow">The Skillsrator ecosystem</span>
              <h2>One hub, seven doors</h2>
              <p>Learn a skill, prove it, earn from it and stay connected — without leaving the platform.</p>
            </div>
            <Link to="/skillsrator" className="btn btn-outline">Explore Skillsrator <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="grid-4">
            {initiatives.map((it) => (
              <Link key={it.slug} to={`/skillsrator/${it.slug}`} className="card initiative-card">
                <span className={`tag tag-${it.pillar}`}>{it.pillarLabel}</span>
                <h3>{it.name}</h3>
                <p className="muted">{it.tagline}</p>
              </Link>
            ))}
            <Link to="/abc" className="card initiative-card abc-card">
              <span className="tag tag-gold">Verification</span>
              <h3>ABC Certification</h3>
              <p>Skills that every door — and every employer — can trust.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Our principles</span>
            <h2>Trust is the product</h2>
          </div>
          <div className="grid-3">
            {principles.map((p) => (
              <div key={p.title} className="principle">
                <Icon name="shield" size={22} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap cta-band">
          <div>
            <h2>Pakistan first. Global by design.</h2>
            <p className="muted">The pilot starts in two domains — Business &amp; IT, and TVET — where guidance can make the biggest difference.</p>
          </div>
          <div className="cta-actions">
            <Link to="/pilot" className="btn btn-outline">See the pilot</Link>
            <Link to="/signup" className="btn btn-primary">Join the waitlist</Link>
          </div>
        </div>
      </section>
    </>
  )
}
