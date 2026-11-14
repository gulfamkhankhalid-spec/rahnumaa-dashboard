import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { centres, classmates, findCentre, findSkill, fmtDate, isoLocal, levelName, sessionsFor, TODAY, type LevelKey } from '../data'
import { useSdc } from '../store'
import { Empty, icsHref, LevelPill, Ring } from '../ui'

export function Calendar() {
  const { s, getCohort } = useSdc()
  const events = s.enrolments.filter((e) => e.status === 'Active').flatMap((e) => {
    const c = getCohort(e.cohortId)!
    const sk = findSkill(c.skillId)!
    return sessionsFor(c, sk).filter((x) => x.date >= TODAY).map((x) => ({ ...x, skill: sk.name, enrolId: e.id, where: c.centreId ? findCentre(c.centreId)!.name : 'Online' }))
  }).concat(s.abc.filter((b) => b.status === 'Booked' && b.date >= TODAY).map((b) => ({ id: b.id, cohortId: '', n: 0, date: b.date, time: '09:00', hours: 3, topic: `ABC assessment — ${levelName[b.level]}`, skill: findSkill(b.skillId)!.name, enrolId: '', where: findCentre(b.centreId)!.name })))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const days = [...new Set(events.map((x) => x.date))].slice(0, 21)

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head"><div><h1>Calendar</h1><p className="muted">Your live classes and assessments. Add any of them to your phone’s calendar.</p></div></header>
      {days.length ? (
        <div className="sd-cal">
          {days.map((d) => (
            <section key={d} className={`card sd-day ${d === TODAY ? 'today' : ''}`}>
              <h2>{d === TODAY ? 'Today · ' : ''}{fmtDate(d)}</h2>
              <ul>{events.filter((x) => x.date === d).map((x) => (
                <li key={x.id}>
                  <span className="sd-time">{x.time}</span>
                  <div><strong>{x.skill}</strong><span className="small">{x.topic}</span><span className="muted small">{x.where} · {x.hours} hrs</span></div>
                  <div className="lc-row-actions">
                    {x.enrolId && <Link to={`/sdc/class/${x.enrolId}?tab=live`} className="small">Open</Link>}
                    <a className="small" href={icsHref(`${x.skill}: ${x.topic}`, x.date, x.time, x.hours, x.where)} download="session.ics">Add to calendar</a>
                  </div>
                </li>
              ))}</ul>
            </section>
          ))}
        </div>
      ) : <Empty title="Nothing scheduled" text="Join a cohort to see its classes here." cta={<Link to="/sdc/skills" className="btn btn-primary">Explore skills</Link>} />}
    </div>
  )
}

export function Assessment() {
  const { s, bookAbc, simulateAbcPass } = useSdc()
  const eligible = s.certificates.filter((c) => findSkill(c.skillId)?.abc)
  const [choice, setChoice] = useState(eligible[0] ? `${eligible[0].skillId}|${eligible[0].level}` : '')
  const [centre, setCentre] = useState(centres[0].id)
  const slots = Array.from({ length: 4 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + 10 + i * 7); return isoLocal(d) })
  const [date, setDate] = useState(slots[0])

  function book(e: FormEvent) {
    e.preventDefault()
    const [skillId, level] = choice.split('|')
    bookAbc(skillId, level as LevelKey, centre, date)
  }

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head"><div><h1>ABC assessment</h1><p className="muted">A supervised, practical assessment for a nationally trusted credential. Theory 30% · practical demonstration 50% · oral 10% · workplace simulation 10%.</p></div><Link to="/abc" className="btn btn-ghost">About ABC</Link></header>
      <div className="app-grid">
        <section className="card ac-form">
          <h2>Book an assessment</h2>
          {eligible.length ? (
            <form className="ac-form" onSubmit={book}>
              <label>Skill and level<select value={choice} onChange={(e) => setChoice(e.target.value)}>{eligible.map((c) => <option key={c.code} value={`${c.skillId}|${c.level}`}>{c.title}</option>)}</select></label>
              <label>Assessment centre<select value={centre} onChange={(e) => setCentre(e.target.value)}>{centres.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
              <fieldset className="ac-methods"><legend>Date</legend>{slots.map((d) => <label key={d} className={date === d ? 'on' : ''}><input type="radio" name="d" checked={date === d} onChange={() => setDate(d)} /> {fmtDate(d)} · 09:00</label>)}</fieldset>
              <p className="muted small">Bring your CNIC or B-Form. Your signed-off logbook evidence is shared with the assessor only with your consent. Results within 7 days.</p>
              <button className="btn btn-primary" type="submit">Book assessment</button>
            </form>
          ) : <p className="muted">Complete a level of a skill that leads to ABC certification to book an assessment. <Link to="/sdc/learn">Go to my learning</Link></p>}
        </section>
        <section className="card">
          <h2>My bookings</h2>
          {s.abc.length ? <ul className="lc-list">{s.abc.map((b) => (
            <li key={b.id}><strong>{findSkill(b.skillId)?.name} — {levelName[b.level]}</strong><span className="muted small">{findCentre(b.centreId)?.name} · {fmtDate(b.date)} · <a href={icsHref(`ABC assessment: ${findSkill(b.skillId)?.name}`, b.date, '09:00', 3, findCentre(b.centreId)!.name)} download="abc-assessment.ics">Add to calendar</a></span>
              {b.status === 'Booked' ? <button className="ac-link-btn" onClick={() => simulateAbcPass(b.id)}>Simulate result: pass</button> : <span className="status status-completed">Passed — ABC certified</span>}</li>
          ))}</ul> : <p className="muted small">No bookings yet.</p>}
        </section>
      </div>
    </div>
  )
}

export function Verify() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  return (
    <div className="ac-wrap ac-verify">
      <div className="card">
        <Icon name="shield" size={28} className="accent" />
        <h1>Verify a certificate</h1>
        <p className="muted">Employers and institutions can check a Skill Development Center certificate by its ID.</p>
        <form className="ac-verify-form" onSubmit={(e) => { e.preventDefault(); if (code.trim()) navigate(`/sdc/certificate/${code.trim().toUpperCase()}`) }}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SDC-AB12-CD34" aria-label="Certificate ID" />
          <button className="btn btn-primary" type="submit">Verify</button>
        </form>
        <p className="muted small">Prototype: verification only works in the browser that earned the certificate.</p>
      </div>
    </div>
  )
}

export function Certificate() {
  const { code = '' } = useParams()
  const { s } = useSdc()
  const cert = s.certificates.find((c) => c.code === code)
  if (!cert) return <div className="ac-wrap ac-verify"><Empty title="Certificate not found" text={`No certificate with ID ${code}.`} cta={<Link to="/sdc/verify" className="btn btn-outline">Try another ID</Link>} /></div>
  const skill = findSkill(cert.skillId)!
  return (
    <div className="ac-wrap ac-cert-page">
      <div className="ac-cert-verified"><Icon name="shield" size={18} /> Verified level certificate · issued {cert.date}</div>
      <div className="ac-certificate">
        <div className="ac-cert-top"><span className="ac-cert-brand">Skill Development Center · Rahnuma</span><span className="small">{levelName[cert.level]} level</span></div>
        <p className="ac-cert-label">This certifies that</p>
        <h1 className="ac-cert-name">{cert.name}</h1>
        <p className="ac-cert-label">has completed guided training, practical logbook tasks and assessment in</p>
        <h2 className="ac-cert-course">{cert.title}</h2>
        <p className="ac-cert-small">{skill.abc ? `Eligible for the supervised ABC assessment in ${skill.abc}.` : 'A Skillsrator level certificate.'}</p>
        <div className="ac-cert-foot">
          <div><span className="ac-sign">Training Director</span><small>Skill Development Center (sample)</small></div>
          <div className="ac-seal" aria-hidden="true"><Icon name="award" size={34} /></div>
          <div><span>{cert.date}</span><small>Verify at rahnumaa.com/sdc/verify · ID {cert.code}</small></div>
        </div>
      </div>
      <div className="ac-cert-actions">
        <button className="btn btn-primary" onClick={() => window.print()}><Icon name="download" size={16} /> Download / print PDF</button>
        {skill.abc && <Link to="/sdc/assessment" className="btn btn-gold">Book ABC assessment</Link>}
        <Link to="/lancer/seller" className="btn btn-ghost">Show it on Skill Lancer</Link>
      </div>
    </div>
  )
}

export function Guardian() {
  const child = { name: 'Sample Learner — Ali', age: 16, skill: 'Mobile Phone Repair', level: 'foundation' as LevelKey, centre: 'Sample Skills Centre — Karachi', progress: 58, attendance: 92, next: 'Saturday · 10:00 · Charging ports and connectors' }
  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head"><div><h1>Guardian view</h1><p className="muted">For parents and guardians of learners under 18. You see attendance, progress and schedule — not private messages, notes or quiz answers.</p></div></header>
      <section className="card sd-guardian">
        <Ring pct={child.progress} size={84} />
        <div>
          <h2>{child.name} <span className="muted small">· age {child.age}</span></h2>
          <p><LevelPill level={child.level} /> {child.skill} · {child.centre}</p>
          <ul className="lc-kv small">
            <li><span>Attendance</span><strong>{child.attendance}%</strong></li>
            <li><span>Next class</span><strong>{child.next}</strong></li>
            <li><span>Logbook tasks signed off</span><strong>1 of 2</strong></li>
            <li><span>Guardian consent</span><strong>Given on 1 Nov 2026</strong></li>
          </ul>
        </div>
      </section>
      <div className="app-grid">
        <section className="card"><h2>Recent activity</h2><ul className="lc-timeline">{[['12 Nov', 'Attended: Opening devices safely'], ['10 Nov', 'Passed quiz: Tools and ESD safety (100%)'], ['8 Nov', 'Logbook task signed off by instructor']].map(([d, t]) => <li key={t}><span className="muted small">{d}</span>{t}</li>)}</ul></section>
        <section className="card"><h2>Contact the centre</h2><p className="small muted">Messages go to the centre coordinator, not to other learners.</p><Link to="/sdc/centre" className="btn btn-ghost btn-sm">Centre details</Link></section>
      </div>
      <p className="note"><Icon name="shield" size={18} /><span>Guardian access follows Rahnuma’s consent rules for minors. It ends automatically when the learner turns 18. Sample data shown — {classmates.length} classmates are not visible to guardians.</span></p>
    </div>
  )
}
