import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { centres, classmates, dayNames, findCentre, findInstructor, findSkill, fmtDate, instructors, isoLocal, levelKeys, levelName, pkr, scheduleText, sessionsFor, skills, TODAY, type Cohort, type LevelKey, type Mode } from '../data'
import { useSdc, type QueueItem } from '../store'
import { Empty, LevelPill } from '../ui'
import NotFound from '../../pages/site/NotFound'

function download(name: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

function ReviewCard({ q }: { q: QueueItem }) {
  const { review, getCohort } = useSdc()
  const [grade, setGrade] = useState(80)
  const [feedback, setFeedback] = useState('')
  const c = getCohort(q.cohortId)
  return (
    <li className="card sd-review">
      <div className="card-head"><div><strong>{q.title}</strong><br /><span className="muted small">{q.learner} · {c ? `${findSkill(c.skillId)?.name} — ${levelName[c.level]}` : ''}</span></div><span className={`ac-badge ${q.kind === 'Logbook' ? 'abc' : ''}`}>{q.kind}</span></div>
      <p className="small">{q.text}</p>
      {q.evidence && <span className="lc-file small"><Icon name="download" size={14} /> {q.evidence}</span>}
      <form className="ac-form" onSubmit={(e) => e.preventDefault()}>
        {q.kind === 'Assignment' && <label>Grade (%)<input type="number" min={0} max={100} value={grade} onChange={(e) => setGrade(Number(e.target.value))} /></label>}
        <label>Feedback to the learner<textarea rows={2} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What went well, and what to improve" /></label>
        <div className="lc-head-actions">
          {q.kind === 'Assignment'
            ? <button className="btn btn-primary btn-sm" disabled={!feedback.trim()} onClick={() => review(q.id, grade, feedback.trim(), false)}>Return grade</button>
            : <><button className="btn btn-primary btn-sm" disabled={!feedback.trim()} onClick={() => review(q.id, undefined, feedback.trim(), true)}>Sign off</button><button className="btn btn-ghost btn-sm" disabled={!feedback.trim()} onClick={() => review(q.id, undefined, feedback.trim(), false)}>Needs rework</button></>}
        </div>
      </form>
    </li>
  )
}

export function Instructor() {
  const { s, allCohorts } = useSdc()
  const [insId, setInsId] = useState('ins1')
  const ins = findInstructor(insId)!
  const mine = allCohorts.filter((c) => c.instructorId === insId)
  const pending = s.queue.filter((q) => q.status === 'Pending' && mine.some((c) => c.id === q.cohortId))
  const doneQ = s.queue.filter((q) => q.status === 'Done' && mine.some((c) => c.id === q.cohortId))
  const upcoming = mine.flatMap((c) => sessionsFor(c, findSkill(c.skillId)!).filter((x) => x.date >= TODAY).slice(0, 2).map((x) => ({ ...x, c }))).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5)
  const atRisk = classmates.filter((m) => m.attendance < 75 || m.progress < 40)

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>Instructor workspace</h1><p className="muted">{ins.name} · {ins.title}</p></div>
        <div className="lc-head-actions">
          <select className="lc-select" value={insId} onChange={(e) => setInsId(e.target.value)} aria-label="Instructor">{instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select>
          <Link to="/sdc/instructor/new" className="btn btn-primary">Schedule a cohort</Link>
        </div>
      </header>
      <section className="stats">
        <div className="card stat"><span className="stat-label">Cohorts</span><span className="stat-value">{mine.length}</span></div>
        <div className="card stat"><span className="stat-label">Learners</span><span className="stat-value">{mine.reduce((t, c) => t + c.enrolled, 0)}</span></div>
        <div className="card stat"><span className="stat-label">Waiting for review</span><span className="stat-value">{pending.length}</span></div>
        <div className="card stat"><span className="stat-label">Reviewed</span><span className="stat-value">{doneQ.length}</span></div>
      </section>

      <div className="sd-class-grid">
        <section>
          <h2>Grading & sign-off queue</h2>
          {pending.length ? <ul className="sd-queue">{pending.map((q) => <ReviewCard key={q.id} q={q} />)}</ul> : <Empty title="All caught up" text="New assignments and logbook evidence appear here." />}
        </section>
        <aside className="sd-class-side">
          <div className="card">
            <h3>Upcoming sessions</h3>
            {upcoming.length ? <ul className="sd-mini-list">{upcoming.map((x) => <li key={x.id}><strong className="small">{fmtDate(x.date)} · {x.time}</strong><span className="muted small">{findSkill(x.c.skillId)?.name} — {x.topic}</span></li>)}</ul> : <p className="muted small">None scheduled.</p>}
          </div>
          <div className="card">
            <h3>Learners at risk</h3>
            <ul className="sd-mini-list">{atRisk.map((m) => <li key={m.id}><strong className="small">{m.name}</strong><span className="muted small">Attendance {m.attendance}% · progress {m.progress}%</span></li>)}</ul>
          </div>
        </aside>
      </div>

      <section className="card">
        <h2>My cohorts</h2>
        {mine.length ? <table className="table"><thead><tr><th>Cohort</th><th>Starts</th><th>Schedule</th><th>Seats</th><th></th></tr></thead>
          <tbody>{mine.map((c) => <tr key={c.id}><td>{findSkill(c.skillId)?.name} <LevelPill level={c.level} /><br /><span className="muted small">{c.mode}{c.centreId ? ` · ${findCentre(c.centreId)?.city}` : ''}</span></td><td>{fmtDate(c.start)}</td><td className="small">{scheduleText(c)}</td><td>{c.enrolled}/{c.seats}</td><td><Link to={`/sdc/instructor/cohort/${c.id}`}>Manage</Link></td></tr>)}</tbody></table>
          : <p className="muted small">No cohorts yet.</p>}
      </section>
    </div>
  )
}

export function CohortAdmin() {
  const { id = '' } = useParams()
  const { s, getCohort, levelStatus, post, markRoster } = useSdc()
  const [text, setText] = useState('')
  const [posted, setPosted] = useState(false)
  const c = getCohort(id)
  if (!c) return <NotFound />
  const skill = findSkill(c.skillId)!
  const sessions = sessionsFor(c, skill)
  const session = sessions.filter((x) => x.date <= TODAY).pop() ?? sessions[0]
  const myEnrol = s.enrolments.find((e) => e.cohortId === c.id && e.status !== 'Withdrawn')
  const me = myEnrol ? (() => { const st = levelStatus(myEnrol.id); return { id: 'me', name: `${s.me.name} (you)`, initials: 'AK', progress: st.progress, attendance: st.attendancePct, avg: 0 } })() : null
  const roster = [...(me ? [me] : []), ...classmates]
  const marks = s.roster[session.id] ?? {}

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><nav className="ac-crumbs"><Link to="/sdc/instructor">Instructor workspace</Link> / Cohort</nav><h1>{skill.name} — {levelName[c.level]}</h1><p className="muted">{c.mode} · {c.centreId ? findCentre(c.centreId)?.name : 'Online'} · {scheduleText(c)} · started {fmtDate(c.start)}</p></div>
        <button className="btn btn-ghost" onClick={() => download(`gradebook-${skill.id}-${c.level}.csv`, [['Learner', 'Progress %', 'Attendance %', 'Average grade %'], ...roster.map((r) => [r.name, r.progress, r.attendance, r.avg || ''])])}><Icon name="download" size={16} /> Export gradebook (CSV)</button>
      </header>

      <div className="app-grid">
        <section className="card">
          <h2>Take attendance</h2>
          <p className="muted small">Session {session.n}: {session.topic} · {fmtDate(session.date)}</p>
          <ul className="sd-attend">{roster.map((r) => (
            <li key={r.id}><label className="lc-check"><input type="checkbox" checked={marks[r.id] ?? r.attendance >= 75} onChange={(e) => markRoster(session.id, r.id, e.target.checked)} /> {r.name}</label></li>
          ))}</ul>
          <p className="muted small">{Object.values({ ...Object.fromEntries(roster.map((r) => [r.id, r.attendance >= 75])), ...marks }).filter(Boolean).length} of {roster.length} present</p>
        </section>
        <section className="card ac-form">
          <h2>Post an announcement</h2>
          <form className="ac-form" onSubmit={(e: FormEvent) => { e.preventDefault(); if (text.trim()) { post(c.id, findInstructor(c.instructorId)!.name, text.trim(), 'announcement'); setText(''); setPosted(true) } }}>
            <textarea rows={4} value={text} onChange={(e) => { setText(e.target.value); setPosted(false) }} placeholder="e.g. Bring your safety gloves to Saturday’s lab." aria-label="Announcement" />
            <button className="btn btn-primary btn-sm" type="submit" disabled={!text.trim()}>Post to class</button>
            {posted && <p className="small accent"><Icon name="check" size={14} /> Posted — learners see it in their Community tab.</p>}
          </form>
        </section>
      </div>

      <section className="card">
        <h2>Roster & gradebook</h2>
        <table className="table"><thead><tr><th>Learner</th><th>Progress</th><th>Attendance</th><th>Average grade</th><th>Status</th></tr></thead>
          <tbody>{roster.map((r) => (
            <tr key={r.id}><td>{r.name}</td><td><div className="ac-mini-prog"><div className="bar"><span style={{ width: `${r.progress}%` }} /></div><span className="small">{r.progress}%</span></div></td><td>{r.attendance}%</td><td>{r.avg ? `${r.avg}%` : '—'}</td>
              <td>{r.attendance < 75 || r.progress < 40 ? <span className="status lc-danger">At risk</span> : <span className="status status-completed">On track</span>}</td></tr>
          ))}</tbody></table>
      </section>
    </div>
  )
}

export function NewCohort() {
  const navigate = useNavigate()
  const { createCohort } = useSdc()
  const [skillId, setSkillId] = useState(skills[0].id)
  const [level, setLevel] = useState<LevelKey>('foundation')
  const [mode, setMode] = useState<Mode>('Online')
  const [centreId, setCentreId] = useState(centres[0].id)
  const [instructorId, setInstructorId] = useState(instructors[0].id)
  const [start, setStart] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 14); return isoLocal(d) })
  const [days, setDays] = useState<number[]>([1, 3])
  const [time, setTime] = useState('18:00')
  const [hours, setHours] = useState(2)
  const [seats, setSeats] = useState(25)
  const [fee, setFee] = useState(10000)
  const [language, setLanguage] = useState('Urdu')

  function save(e: FormEvent) {
    e.preventDefault()
    createCohort({ skillId, level, mode, centreId: mode === 'Online' ? null : centreId, instructorId, start, schedule: { days, time, hours }, seats, fee, language })
    navigate(`/sdc/skill/${skillId}?level=${level}`)
  }

  return (
    <div className="ac-wrap ac-sections ac-builder">
      <header className="ac-row-head"><div><h1>Schedule a cohort</h1><p className="muted">Create a new intake. It appears on the skill page for learners to join.</p></div><Link to="/sdc/instructor" className="btn btn-ghost">Back</Link></header>
      <form className="card ac-form" onSubmit={save}>
        <div className="ac-form-row">
          <label>Skill<select value={skillId} onChange={(e) => setSkillId(e.target.value)}>{skills.map((sk) => <option key={sk.id} value={sk.id}>{sk.name}</option>)}</select></label>
          <label>Level<select value={level} onChange={(e) => setLevel(e.target.value as LevelKey)}>{levelKeys.map((l) => <option key={l} value={l}>{levelName[l]}</option>)}</select></label>
          <label>Delivery<select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>{['Online', 'Hybrid', 'Assisted centre'].map((m) => <option key={m}>{m}</option>)}</select></label>
        </div>
        <div className="ac-form-row">
          {mode !== 'Online' && <label>Centre<select value={centreId} onChange={(e) => setCentreId(e.target.value)}>{centres.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}
          <label>Instructor<select value={instructorId} onChange={(e) => setInstructorId(e.target.value)}>{instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select></label>
          <label>Language<select value={language} onChange={(e) => setLanguage(e.target.value)}>{['Urdu', 'English', 'Punjabi', 'Pashto', 'Sindhi'].map((l) => <option key={l}>{l}</option>)}</select></label>
        </div>
        <fieldset className="ac-inline"><legend>Class days</legend>{dayNames.map((d, i) => <label key={d}><input type="checkbox" checked={days.includes(i)} onChange={(e) => setDays(e.target.checked ? [...days, i].sort() : days.filter((x) => x !== i))} /> {d}</label>)}</fieldset>
        <div className="ac-form-row">
          <label>Start date<input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
          <label>Start time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
          <label>Hours per session<input type="number" min={0.5} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} /></label>
        </div>
        <div className="ac-form-row two">
          <label>Seats<input type="number" min={1} value={seats} onChange={(e) => setSeats(Number(e.target.value))} /></label>
          <label>Fee (PKR, 0 = free)<input type="number" min={0} step="any" value={fee} onChange={(e) => setFee(Number(e.target.value))} /></label>
        </div>
        <p className="muted small">{findSkill(skillId)!.levels[level].weeks} weeks · {findSkill(skillId)!.levels[level].hours} hours of learning · {pkr(fee)}</p>
        <div className="ac-builder-actions"><button className="btn btn-primary" type="submit" disabled={!days.length || !start}>Create cohort</button></div>
      </form>
    </div>
  )
}

export function Centre() {
  const { allCohorts, s } = useSdc()
  const [cid, setCid] = useState(centres[0].id)
  const centre = findCentre(cid)!
  const list = allCohorts.filter((c: Cohort) => c.centreId === cid)
  const learners = list.reduce((t, c) => t + c.enrolled, 0)
  const seats = list.reduce((t, c) => t + c.seats, 0)
  const bySkill = skills.map((sk) => ({ sk, n: list.filter((c) => c.skillId === sk.id).reduce((t, c) => t + c.enrolled, 0) })).filter((x) => x.n > 0)
  const max = Math.max(1, ...bySkill.map((x) => x.n))

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>Training centre admin</h1><p className="muted">{centre.name} · labs: {centre.labs.join(', ')}</p></div>
        <div className="lc-head-actions">
          <select className="lc-select" value={cid} onChange={(e) => setCid(e.target.value)} aria-label="Centre">{centres.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <button className="btn btn-ghost" onClick={() => download(`centre-report-${cid}.csv`, [['Skill', 'Level', 'Mode', 'Start', 'Enrolled', 'Seats', 'Fee PKR'], ...list.map((c) => [findSkill(c.skillId)!.name, levelName[c.level], c.mode, c.start, c.enrolled, c.seats, c.fee])])}><Icon name="download" size={16} /> Export report</button>
        </div>
      </header>
      <section className="stats">
        <div className="card stat"><span className="stat-label">Active cohorts</span><span className="stat-value">{list.length}</span></div>
        <div className="card stat"><span className="stat-label">Learners</span><span className="stat-value">{learners}</span><span className="muted small">capacity {centre.capacity}</span></div>
        <div className="card stat"><span className="stat-label">Seat fill</span><span className="stat-value">{seats ? Math.round((learners / seats) * 100) : 0}<small>%</small></span></div>
        <div className="card stat"><span className="stat-label">ABC pass rate (sample)</span><span className="stat-value">84<small>%</small></span><span className="muted small">{s.abc.filter((b) => b.centreId === cid).length} booked here via app</span></div>
      </section>
      <div className="app-grid">
        <section className="card">
          <h2>Enrolment by skill</h2>
          {bySkill.length ? <ul className="score-bars">{bySkill.map(({ sk, n }) => <li key={sk.id}><span className="score-label">{sk.name}</span><div className="bar"><span style={{ width: `${(n / max) * 100}%` }} /></div><span className="score-num">{n}</span></li>)}</ul> : <p className="muted small">No cohorts at this centre yet.</p>}
        </section>
        <section className="card">
          <h2>Outcomes (sample)</h2>
          <ul className="lc-kv small">
            <li><span>Completion rate</span><strong>71%</strong></li>
            <li><span>Average attendance</span><strong>83%</strong></li>
            <li><span>Learners in work 6 months later (consented)</span><strong>58%</strong></li>
            <li><span>Learner satisfaction</span><strong>4.6 / 5</strong></li>
          </ul>
        </section>
      </div>
      <section className="card">
        <h2>Cohorts at this centre</h2>
        {list.length ? <table className="table"><thead><tr><th>Skill</th><th>Mode</th><th>Starts</th><th>Instructor</th><th>Fill</th></tr></thead>
          <tbody>{list.map((c) => <tr key={c.id}><td>{findSkill(c.skillId)?.name} <LevelPill level={c.level} /></td><td>{c.mode}</td><td>{fmtDate(c.start)}</td><td className="small">{findInstructor(c.instructorId)?.name}</td><td><div className="ac-mini-prog"><div className="bar"><span style={{ width: `${(c.enrolled / c.seats) * 100}%` }} /></div><span className="small">{c.enrolled}/{c.seats}</span></div></td></tr>)}</tbody></table>
          : <Empty title="No cohorts" text="Schedule one from the instructor workspace." cta={<Link to="/sdc/instructor/new" className="btn btn-primary">Schedule a cohort</Link>} />}
      </section>
    </div>
  )
}
