import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { findCentre, findSkill, fmtDate, levelKeys, levelName, roles, sessionsFor, skills, TODAY, type LevelKey } from '../data'
import { useSdc } from '../store'
import { Empty, LevelPill, Ring, Speak } from '../ui'

const rank: Record<LevelKey, number> = { foundation: 1, practitioner: 2, advanced: 3 }

export default function Learn() {
  const { s, getCohort, levelStatus, reached, setTargetRole } = useSdc()
  const active = s.enrolments.filter((e) => e.status === 'Active')
  const upcoming = active.flatMap((e) => {
    const c = getCohort(e.cohortId)!
    return sessionsFor(c, findSkill(c.skillId)!).filter((x) => x.date >= TODAY).slice(0, 3).map((x) => ({ ...x, enrolId: e.id, skill: findSkill(c.skillId)!.name, cohort: c }))
  }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 4)
  const todo = active.flatMap((e) => {
    const st = levelStatus(e.id)
    const next = st.lvl.units.flatMap((u) => u.items).find((i) => !s.done[i.id])
    const pendingTask = st.lvl.tasks.find((t) => !s.logbook.some((l) => l.enrolId === e.id && l.taskId === t.id && l.status !== 'Needs rework'))
    return [
      next && { key: `n-${e.id}`, text: `${st.skill.name}: ${next.title}`, to: `/sdc/class/${e.id}/item/${next.id}` },
      pendingTask && { key: `t-${e.id}`, text: `Logbook: ${pendingTask.title}`, to: `/sdc/class/${e.id}?tab=logbook` },
    ].filter(Boolean) as { key: string; text: string; to: string }[]
  })
  const role = roles.find((r) => r.id === s.me.targetRole) ?? roles[0]
  const greeting = `Assalam-o-Alaikum, ${s.me.name.split(' ')[0]}. You have ${upcoming.length} upcoming classes and ${todo.length} things to do.`

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>My learning</h1><p className="muted">{greeting}</p></div>
        <div className="lc-head-actions"><Speak text={greeting} /><Link to="/sdc/skills" className="btn btn-primary">Find a skill</Link></div>
      </header>

      <div className="app-grid">
        <section className="card">
          <div className="card-head"><h2>Coming up</h2><Link to="/sdc/calendar" className="link-arrow small">Calendar <Icon name="arrow" size={12} /></Link></div>
          {upcoming.length ? <ul className="sd-agenda">{upcoming.map((x) => (
            <li key={x.id}><span className="sd-date"><strong>{new Date(x.date + 'T00:00:00').getDate()}</strong>{new Date(x.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}</span>
              <div><strong>{x.skill}: {x.topic}</strong><span className="muted small">{fmtDate(x.date)} · {x.time} · {x.cohort.mode === 'Online' ? 'Online' : findCentre(x.cohort.centreId)?.city ?? 'Online'}</span></div>
              <Link to={`/sdc/class/${x.enrolId}?tab=live`} className="btn btn-ghost btn-sm">Details</Link></li>
          ))}</ul> : <p className="muted small">No classes scheduled.</p>}
        </section>
        <section className="card">
          <h2>To do</h2>
          {todo.length ? <ul className="sd-todo">{todo.map((t) => <li key={t.key}><Link to={t.to}><Icon name="arrow" size={14} /> {t.text}</Link></li>)}</ul> : <p className="muted small">You’re all caught up.</p>}
        </section>
      </div>

      <section>
        <h2>My cohorts</h2>
        {active.length ? (
          <div className="sd-my-cohorts">
            {active.map((e) => {
              const st = levelStatus(e.id)
              return (
                <Link key={e.id} to={`/sdc/class/${e.id}`} className="card sd-my-cohort">
                  <Ring pct={st.progress} />
                  <div>
                    <strong>{st.skill.name}</strong>
                    <span className="muted small"><LevelPill level={st.cohort.level} /> {st.cohort.mode} · {st.cohort.start > TODAY ? 'starts' : 'started'} {fmtDate(st.cohort.start)}</span>
                    <span className="small">{st.itemsDone}/{st.itemsTotal} lessons · {st.tasksSigned}/{st.tasksTotal} logbook tasks · attendance {st.attendancePct}%</span>
                  </div>
                  {st.complete && <span className="ac-badge free">Ready for certificate</span>}
                </Link>
              )
            })}
          </div>
        ) : <Empty title="No active cohorts" text="Join a cohort to start learning." cta={<Link to="/sdc/skills" className="btn btn-primary">Explore skills</Link>} />}
      </section>

      <div className="app-grid">
        <section className="card">
          <h2>Skills map</h2>
          <p className="muted small">Your certified level in each skill. Grey means not started.</p>
          <table className="table sd-map">
            <thead><tr><th>Skill</th>{levelKeys.map((l) => <th key={l}>{levelName[l]}</th>)}</tr></thead>
            <tbody>{skills.filter((sk) => reached(sk.id) || s.enrolments.some((e) => getCohort(e.cohortId)?.skillId === sk.id) || role.needs.some((n) => n.skillId === sk.id)).map((sk) => {
              const r = reached(sk.id)
              const inProgress = s.enrolments.filter((e) => e.status === 'Active').map((e) => getCohort(e.cohortId)!).find((c) => c.skillId === sk.id)
              return (
                <tr key={sk.id}><td><Link to={`/sdc/skill/${sk.id}`}>{sk.name}</Link></td>{levelKeys.map((l) => (
                  <td key={l}><span className={`sd-cell ${r && rank[r] >= rank[l] ? 'done' : inProgress?.level === l ? 'prog' : ''}`} aria-label={r && rank[r] >= rank[l] ? 'Certified' : inProgress?.level === l ? 'In progress' : 'Not started'} /></td>
                ))}</tr>
              )
            })}</tbody>
          </table>
          <p className="sd-legend small"><span className="sd-cell done" /> Certified <span className="sd-cell prog" /> In progress <span className="sd-cell" /> Not started</p>
        </section>
        <section className="card">
          <div className="card-head"><h2>Gap analysis</h2>
            <select className="lc-select" value={role.id} onChange={(e) => setTargetRole(e.target.value)} aria-label="Target role">{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
          </div>
          <p className="muted small">What you need for <strong>{role.name}</strong>, and the next step for each gap.</p>
          <ul className="sd-gaps">{role.needs.map((n) => {
            const sk = findSkill(n.skillId)!
            const r = reached(n.skillId)
            const met = !!r && rank[r] >= rank[n.level]
            return (
              <li key={n.skillId} className={met ? 'met' : ''}>
                <span className="sd-gap-icon">{met ? <Icon name="check" size={14} /> : '!'}</span>
                <div><strong>{sk.name}</strong><span className="muted small">Needs {levelName[n.level]} · you have {r ? levelName[r] : 'none yet'}</span></div>
                {!met && <Link to={`/sdc/skill/${sk.id}?level=${r === 'foundation' ? 'practitioner' : r === 'practitioner' ? 'advanced' : 'foundation'}`} className="btn btn-ghost btn-sm">Close gap</Link>}
              </li>
            )
          })}</ul>
          <p className="muted small">Want advice on your path? <Link to="/app/counselors">Talk to a Rahnuma counselor</Link>.</p>
        </section>
      </div>

      <div className="app-grid">
        <section className="card">
          <h2>Certificates</h2>
          {s.certificates.length ? <ul className="lc-list">{s.certificates.map((c) => <li key={c.code}><Link to={`/sdc/certificate/${c.code}`}><strong>{c.title}</strong></Link><span className="muted small">Issued {c.date} · {c.code}</span><span className="status status-completed">Verified</span></li>)}</ul> : <p className="muted small">Complete a level to earn your first certificate.</p>}
        </section>
        <section className="card">
          <div className="card-head"><h2>ABC assessments</h2><Link to="/sdc/assessment" className="link-arrow small">Book <Icon name="arrow" size={12} /></Link></div>
          {s.abc.length ? <ul className="lc-list">{s.abc.map((b) => <li key={b.id}><strong>{findSkill(b.skillId)?.name} — {levelName[b.level]}</strong><span className="muted small">{findCentre(b.centreId)?.name} · {fmtDate(b.date)}</span><span className={`status ${b.status === 'Passed' ? 'status-completed' : 'status-in-progress'}`}>{b.status}</span></li>)}</ul> : <p className="muted small">Once you complete a level you can book a supervised ABC assessment.</p>}
        </section>
      </div>
    </div>
  )
}
