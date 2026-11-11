import Icon from '../../components/Icon'
import { roadmap } from '../../data/site'
import PageHero from './PageHero'

export default function Roadmap() {
  return (
    <>
      <PageHero eyebrow="Roadmap" title="Vision-complete, delivered in stages">
        The foundations for all three pillars are designed from day one. Features open release by release, and no module
        ships until its data, quality and safeguards are ready.
      </PageHero>
      <section className="section">
        <div className="wrap roadmap">
          {roadmap.map((r, i) => (
            <div key={r.release} className={`card roadmap-card ${i === 0 ? 'current' : ''}`}>
              <span className="pill">{r.release}{i === 0 ? ' · In progress' : ''}</span>
              <h3>{r.title}</h3>
              <ul className="check-list">
                {r.items.map((x) => <li key={x}><Icon name="check" size={16} /> {x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
