import { Link, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { initiatives } from '../../data/site'
import NotFound from './NotFound'

const live: Record<string, string> = { 'skill-academy': '/academy', 'skill-lancer': '/lancer', 'skill-development-center': '/sdc' }

export default function Initiative() {
  const { slug } = useParams()
  const index = initiatives.findIndex((i) => i.slug === slug)
  if (index === -1) return <NotFound />
  const it = initiatives[index]
  const next = initiatives[(index + 1) % initiatives.length]

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Link to="/skillsrator" className="back-link">← All initiatives</Link>
          <span className={`tag tag-${it.pillar}`}>{it.pillarLabel}</span>
          <h1>{it.name}</h1>
          <p className="initiative-tagline big">{it.tagline}</p>
          <p className="lead">{it.description}</p>
          {live[it.slug] && (
            <Link to={live[it.slug]} className="btn btn-primary btn-lg initiative-cta">Open {it.name} <Icon name="arrow" size={18} /></Link>
          )}
          <div className="meta-row">
            <span><Icon name="users" size={16} /> {it.forWhom}</span>
            <span><Icon name="calendar" size={16} /> {it.release}</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            {it.features.map((f) => (
              <div key={f.title} className="card">
                <Icon name="check" size={22} className="accent" />
                <h3>{f.title}</h3>
                <p className="muted">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="note">
            <Icon name="info" size={18} />
            <p>
              {it.name} uses the same verified identity, Life Record and skills graph as every other Skillsrator door. Your
              counselor can send you here from your plan, and anything you achieve here flows back into it — with your consent.
            </p>
          </div>
          <div className="next-door">
            <span className="muted">Next door</span>
            <Link to={`/skillsrator/${next.slug}`}>{next.name} <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
