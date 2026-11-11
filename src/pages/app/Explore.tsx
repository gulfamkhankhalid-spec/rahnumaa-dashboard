import { useMemo, useState } from 'react'
import Icon from '../../components/Icon'
import { programs, type Program } from '../../data/app'

const tabs = ['All', 'University', 'Online', 'TVET'] as const

export default function Explore() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('All')
  const [q, setQ] = useState('')
  const [saved, setSaved] = useState<string[]>(['p1', 'p2', 'p4'])

  const list = useMemo(
    () =>
      programs
        .filter((p) => tab === 'All' || p.type === tab)
        .filter((p) => `${p.name} ${p.institution} ${p.city}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.fit - a.fit),
    [tab, q],
  )

  const toggle = (p: Program) => setSaved((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]))

  return (
    <>
      <header className="app-head">
        <div>
          <h1>Explore programs</h1>
          <p className="muted">Universities, online programs, TVET institutes and independent trainers — sorted by fit with your profile.</p>
        </div>
      </header>

      <div className="toolbar">
        <div className="tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <label className="search">
          <Icon name="search" size={16} />
          <input placeholder="Search programs, institutions, cities" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      <p className="muted small">{saved.length} saved to your shortlist</p>

      <section className="program-list">
        {list.map((p) => (
          <article key={p.id} className="card program">
            <div className="program-main">
              <div className="program-tags">
                <span className={`tag ${p.type === 'TVET' ? 'tag-gold' : 'tag-education'}`}>{p.type}</span>
                {p.verified && <span className="verified"><Icon name="shield" size={14} /> Verified</span>}
              </div>
              <h3>{p.name}</h3>
              <p className="muted small">{p.institution} · {p.city} · {p.duration}</p>
            </div>
            <div className="program-side">
              <span className="fit-score">{p.fit}% fit</span>
              <button className={`btn btn-sm ${saved.includes(p.id) ? 'btn-primary' : 'btn-ghost'}`} onClick={() => toggle(p)}>
                {saved.includes(p.id) ? <><Icon name="check" size={14} /> Shortlisted</> : 'Shortlist'}
              </button>
            </div>
          </article>
        ))}
        {list.length === 0 && <p className="muted">No programs match your search.</p>}
      </section>
    </>
  )
}
