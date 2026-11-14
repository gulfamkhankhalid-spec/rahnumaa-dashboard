import { Link } from 'react-router-dom'
import Icon, { type IconName } from '../../components/Icon'
import { initiatives } from '../../data/site'

const icons: Record<string, IconName> = {
  'skill-education': 'book',
  'skill-academy': 'layers',
  'skill-development-center': 'clipboard',
  'skill-accelerator': 'rocket',
  'skill-wise': 'briefcase',
  'skill-lancer': 'compass',
  'skill-magnets': 'magnet',
}

const recommended: Record<string, string> = {
  'skill-education': 'Compare your Plan A and B programs',
  'skill-academy': 'Entry-test preparation: mathematics',
  'skill-magnets': 'Join the Web Development community',
}

const live: Record<string, string> = { 'skill-academy': '/academy', 'skill-lancer': '/lancer', 'skill-development-center': '/sdc', 'skill-magnets': '/magnets' }

export default function Launcher() {
  return (
    <>
      <header className="app-head">
        <div>
          <h1>Skillsrator</h1>
          <p className="muted">Seven doors, one identity. Doors your plan recommends are highlighted.</p>
        </div>
      </header>
      <section className="launcher">
        {initiatives.map((it) => {
          const rec = recommended[it.slug]
          return (
            <article key={it.slug} className={`card door ${rec ? 'recommended' : ''}`}>
              <span className="door-icon"><Icon name={icons[it.slug]} size={24} /></span>
              <h3>{it.name}</h3>
              <p className="muted small">{it.tagline}</p>
              {rec ? (
                <p className="door-rec"><Icon name="route" size={14} /> From your plan: {rec}</p>
              ) : (
                <p className="muted small">{it.release}</p>
              )}
              {live[it.slug] ? (
                <Link to={live[it.slug]} className="link-arrow small">Open {it.name} <Icon name="arrow" size={14} /></Link>
              ) : (
                <Link to={`/skillsrator/${it.slug}`} className="link-arrow small">About {it.name} <Icon name="arrow" size={14} /></Link>
              )}
            </article>
          )
        })}
      </section>
    </>
  )
}
