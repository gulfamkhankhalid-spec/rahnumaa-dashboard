import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { institutionPlans } from '../data'
import { useAcademy } from '../store'

export function InstitutionsLanding() {
  return (
    <>
      <section className="ac-hero">
        <div className="ac-wrap ac-hero-grid">
          <div>
            <span className="eyebrow">Skill Academy for Institutions</span>
            <h1>Build job-ready skills across your campus or team.</h1>
            <p className="lead">Give students, staff or programme participants access to the catalogue, assign learning paths, upload your own content and track progress and skills in one dashboard.</p>
            <div className="ac-hero-actions">
              <Link to="/academy/institutions/admin" className="btn btn-primary btn-lg">Open admin demo <Icon name="arrow" size={18} /></Link>
              <a href="#plans" className="btn btn-outline btn-lg">Compare plans</a>
            </div>
          </div>
          <div className="card ac-hero-panel">
            <h2>Built for</h2>
            {['Universities and colleges', 'TVET institutes and training centres', 'Employers and NGOs', 'Government skills programmes'].map((x) => (
              <p key={x} className="ac-goal static"><Icon name="check" size={18} /> {x}</p>
            ))}
          </div>
        </div>
      </section>
      <div className="ac-wrap ac-sections">
        <section className="ac-split-cards">
          {[
            ['Assign and track', 'Assign courses with deadlines; see enrolment, progress and completion for every learner.', 'clipboard'],
            ['Skills analytics', 'Benchmark skills, find gaps against target roles and measure improvement over time.', 'grid'],
            ['Your own content', 'Upload private courses and blend them with the catalogue into curated learning paths.', 'layers'],
            ['ABC certification', 'Run ABC-aligned assessments and become an assessment centre for your learners.', 'award'],
            ['Single sign-on & LMS', 'Connect your student information system and existing LMS (planned).', 'lock'],
            ['Consent built in', 'Learners decide what progress data their institution can see, in line with Rahnuma’s privacy rules.', 'shield'],
          ].map(([t, d, ic]) => (
            <div key={t} className="card ac-promo"><Icon name={ic as 'grid'} size={26} /><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </section>
        <section id="plans">
          <h2>Plans</h2>
          <p className="muted">Sample pricing for the prototype.</p>
          <div className="ac-plans">
            {institutionPlans.map((p, i) => (
              <div key={p.name} className={`card ac-plan ${i === 1 ? 'featured' : ''}`}>
                <h3>{p.name}</h3>
                <p className="muted small">{p.for}</p>
                <p className="ac-plan-price">{p.price}</p>
                <ul className="check-list small">{p.features.map((f) => <li key={f}><Icon name="check" size={14} /> {f}</li>)}</ul>
                <Link to="/signup?role=partner" className={`btn ${i === 1 ? 'btn-primary' : 'btn-outline'} btn-block`}>Contact us</Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export function InstitutionAdmin() {
  const { s, getCourse, addMember, removeMember, assign, allCourses } = useAcademy()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [course, setCourse] = useState(allCourses[0]?.slug ?? '')
  const { org } = s

  // Sample progress per member (deterministic, illustrative).
  const memberProgress = (memberId: string, slug: string) => {
    const c = getCourse(slug)
    if (!c) return 0
    const seed = [...(memberId + slug)].reduce((a, ch) => a + ch.charCodeAt(0), 0)
    return (seed * 7) % 101
  }

  const assignments = org.members.reduce((a, m) => a + m.assigned.length, 0)
  const avg = assignments ? Math.round(org.members.reduce((a, m) => a + m.assigned.reduce((b, sl) => b + memberProgress(m.id, sl), 0), 0) / assignments) : 0
  const completed = org.members.reduce((a, m) => a + m.assigned.filter((sl) => memberProgress(m.id, sl) === 100).length, 0)

  function invite(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    addMember(name.trim(), email.trim())
    setName('')
    setEmail('')
  }

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>{org.name}</h1><p className="muted">Institution admin dashboard (sample)</p></div>
        <Link to="/academy/institutions" className="btn btn-ghost">About plans</Link>
      </header>

      <section className="stats">
        <div className="card stat"><span className="stat-label">Seats used</span><span className="stat-value">{org.members.length}<small>/{org.seats}</small></span></div>
        <div className="card stat"><span className="stat-label">Courses assigned</span><span className="stat-value">{assignments}</span></div>
        <div className="card stat"><span className="stat-label">Average progress</span><span className="stat-value">{avg}<small>%</small></span></div>
        <div className="card stat"><span className="stat-label">Completions</span><span className="stat-value">{completed}</span></div>
      </section>

      <div className="app-grid">
        <section className="card ac-form">
          <h2>Invite learners</h2>
          <form onSubmit={invite} className="ac-form">
            <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <button className="btn btn-primary" type="submit" disabled={org.members.length >= org.seats}>Send invitation</button>
          </form>
          <p className="muted small">Bulk upload by CSV is planned. Prototype: no email is sent.</p>
        </section>
        <section className="card ac-form">
          <h2>Assign learning</h2>
          <label>Course<select value={course} onChange={(e) => setCourse(e.target.value)}>{allCourses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}</select></label>
          <p className="small">{selected.length ? `${selected.length} learner(s) selected below` : 'Select learners in the table below.'}</p>
          <button className="btn btn-primary" disabled={!selected.length} onClick={() => { assign(selected, course); setSelected([]) }}>Assign to selected</button>
        </section>
      </div>

      <section className="card">
        <h2>Learners and progress</h2>
        <table className="table">
          <thead><tr><th><span className="sr-only">Select</span></th><th>Learner</th><th>Assigned courses</th><th>Progress</th><th></th></tr></thead>
          <tbody>
            {org.members.map((m) => (
              <tr key={m.id}>
                <td><input type="checkbox" aria-label={`Select ${m.name}`} checked={selected.includes(m.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, m.id] : selected.filter((x) => x !== m.id))} /></td>
                <td><strong>{m.name}</strong><br /><span className="muted small">{m.email}</span></td>
                <td>{m.assigned.length ? m.assigned.map((sl) => <div key={sl} className="small">{getCourse(sl)?.title}</div>) : <span className="muted small">None</span>}</td>
                <td>{m.assigned.map((sl) => <div key={sl} className="ac-mini-prog"><div className="bar"><span style={{ width: `${memberProgress(m.id, sl)}%` }} /></div><span className="small">{memberProgress(m.id, sl)}%</span></div>)}</td>
                <td><button className="ac-link-btn danger" onClick={() => removeMember(m.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Skills overview</h2>
        <p className="muted small">Share of learners at practitioner level or above in each skill (sample).</p>
        <ul className="score-bars">
          {[['Electrical safety', 72], ['Solar PV', 48], ['Workplace English', 61], ['Customer service', 55]].map(([k, v]) => (
            <li key={k}><span className="score-label">{k}</span><div className="bar"><span style={{ width: `${v}%` }} /></div><span className="score-num">{v}%</span></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
