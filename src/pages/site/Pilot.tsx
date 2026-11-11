import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import PageHero from './PageHero'

const domains = [
  {
    name: 'Business & IT',
    icon: 'briefcase' as const,
    text: 'Together, business and IT cover the majority of job opportunities across industries — from software and data to accounting, marketing and e-commerce.',
    examples: ['Software and web development', 'Data analysis', 'Digital marketing and e-commerce', 'Accounting and finance', 'Business administration'],
  },
  {
    name: 'TVET — Technical & Vocational',
    icon: 'layers' as const,
    text: 'A large labour market with no comparable guidance platform today — including independent trainers and learning providers, not just institutes.',
    examples: ['Electrical and solar installation', 'Welding and fabrication', 'Automotive repair', 'Plumbing, HVAC and refrigeration', 'Mobile and electronics repair'],
  },
]

const tvetDesign = [
  { title: 'Urdu and voice-first', text: 'Simplified onboarding with voice and icon options.' },
  { title: 'Low-literacy mode', text: 'Large touch targets, plain language and visual guidance.' },
  { title: 'Low bandwidth', text: 'Works on low-end phones and weak connections.' },
  { title: 'Assisted centres', text: 'Supported access for people without a smartphone or connection.' },
]

export default function Pilot() {
  return (
    <>
      <PageHero eyebrow="The pilot" title="Starting in Pakistan, in two domains">
        A narrow first build on a vision-complete foundation: everything needed for all three pillars is designed in
        from day one, while the pilot proves the model where it matters most.
      </PageHero>

      <section className="section">
        <div className="wrap grid-2">
          {domains.map((d) => (
            <article key={d.name} className="card domain">
              <span className="pillar-icon"><Icon name={d.icon} size={24} /></span>
              <h2>{d.name}</h2>
              <p className="muted">{d.text}</p>
              <ul className="check-list">
                {d.examples.map((e) => (
                  <li key={e}><Icon name="check" size={16} /> {e}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-head">
            <h2>Designed for TVET learners</h2>
          </div>
          <div className="grid-4">
            {tvetDesign.map((t) => (
              <div key={t.title} className="card">
                <h3>{t.title}</h3>
                <p className="muted">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap cta-band">
          <div>
            <h2>Pakistan is the pilot, not the ceiling</h2>
            <p className="muted">The platform is built to host other countries, languages, currencies and identity systems once the model is proven.</p>
          </div>
          <Link to="/roadmap" className="btn btn-primary">See the roadmap</Link>
        </div>
      </section>
    </>
  )
}
