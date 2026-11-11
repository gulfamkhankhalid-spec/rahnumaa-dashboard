import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { initiatives } from '../../data/site'
import PageHero from './PageHero'

const groups = [
  { key: 'education', title: 'Learn', text: 'Education doors' },
  { key: 'bridge', title: 'Bridge', text: 'From learning to earning' },
  { key: 'employment', title: 'Work', text: 'Employment doors' },
  { key: 'engagement', title: 'Connect', text: 'Engagement doors' },
]

const rules = [
  'One identity and one Life Record',
  'One skills graph across every door',
  'One wallet and payment layer',
  'One trust and safety function',
  'One counseling pathway',
  'Verified badges everywhere',
]

export default function Skillsrator() {
  return (
    <>
      <PageHero eyebrow="The Skillsrator ecosystem" title="One hub. Seven initiatives. One login.">
        Rahnuma guides, Skillsrator provides the places to act, and ABC proves the result. Each initiative is a door
        into the same platform — not seven separate products.
      </PageHero>

      <section className="section">
        <div className="wrap">
          {groups.map((g) => {
            const items = initiatives.filter((i) => i.pillar === g.key)
            return (
              <div key={g.key} className="door-group">
                <div className="door-group-head">
                  <h2>{g.title}</h2>
                  <span className="muted">{g.text}</span>
                </div>
                <div className="grid-3">
                  {items.map((it) => (
                    <Link key={it.slug} to={`/skillsrator/${it.slug}`} className="card initiative-card large">
                      <span className={`tag tag-${it.pillar}`}>{it.pillarLabel}</span>
                      <h3>{it.name}</h3>
                      <p className="initiative-tagline">{it.tagline}</p>
                      <p className="muted">{it.description}</p>
                      <span className="link-arrow">Learn more <Icon name="arrow" size={16} /></span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Built once, shared by all</span>
            <h2>The one-platform design</h2>
            <p className="muted">
              A skill learned in Skill Academy, assessed by ABC, shown in a Skill Lancer project and sought in Skill Wise
              is the same skill everywhere. That is what makes the doors more valuable together.
            </p>
          </div>
          <ul className="check-list">
            {rules.map((r) => (
              <li key={r}><Icon name="check" size={18} /> {r}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
