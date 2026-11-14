import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { familyName, findCentre, findInstructor, findSkill, fmtDate, levelKeys, levelName, pkr, quizBank, scheduleText, type Cohort, type LevelKey } from '../data'
import { useSdc } from '../store'
import { LevelPill, Modal, Speak } from '../ui'
import NotFound from '../../pages/site/NotFound'

function EnrolDialog({ cohort, onClose }: { cohort: Cohort; onClose: () => void }) {
  const navigate = useNavigate()
  const { enrol } = useSdc()
  const skill = findSkill(cohort.skillId)!
  const [step, setStep] = useState<'details' | 'placement' | 'done'>(cohort.level === 'foundation' ? 'details' : 'placement')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [scholarship, setScholarship] = useState(false)
  const qs = quizBank[skill.family]
  const placementScore = Math.round((qs.filter((q, i) => answers[i] === q.answer).length / qs.length) * 100)

  return (
    <Modal title={`Join: ${skill.name} — ${levelName[cohort.level]}`} onClose={onClose}>
      {step === 'placement' && (
        <div className="ac-form">
          <p className="muted small">This level has a prerequisite: {skill.prerequisites[cohort.level] ?? 'the previous level'}. Take a short placement check so we can be sure it is the right level for you.</p>
          {qs.map((q, i) => (
            <fieldset key={q.q} className="ac-q"><legend>{i + 1}. {q.q}</legend>
              {q.options.map((o, j) => <label key={o} className={`ac-opt ${answers[i] === j ? 'sel' : ''}`}><input type="radio" name={`pq${i}`} checked={answers[i] === j} onChange={() => setAnswers({ ...answers, [i]: j })} /> {o}</label>)}
            </fieldset>
          ))}
          <button className="btn btn-primary" disabled={Object.keys(answers).length < qs.length} onClick={() => setStep('details')}>See my result</button>
        </div>
      )}
      {step === 'details' && (
        <div className="ac-form">
          {cohort.level !== 'foundation' && (
            <p className={`sd-placement ${placementScore >= 67 ? 'ok' : ''}`}>{placementScore >= 67 ? <>Placement check: {placementScore}% — you’re ready for this level.</> : <>Placement check: {placementScore}%. We recommend starting at Foundation, but you can still join.</>}</p>
          )}
          <ul className="lc-kv small">
            <li><span>Starts</span><strong>{fmtDate(cohort.start)}</strong></li>
            <li><span>Schedule</span><strong>{scheduleText(cohort)}</strong></li>
            <li><span>How</span><strong>{cohort.mode}{cohort.centreId ? ` · ${findCentre(cohort.centreId)?.name}` : ''}</strong></li>
            <li><span>Language</span><strong>{cohort.language}</strong></li>
            <li><span>Fee</span><strong>{pkr(cohort.fee)}</strong></li>
          </ul>
          {cohort.fee > 0 && <label className="lc-check"><input type="checkbox" checked={scholarship} onChange={(e) => setScholarship(e.target.checked)} /> Apply for a scholarship or sponsor funding</label>}
          <p className="muted small">Prototype: you’re accepted straight away and no payment is taken.</p>
          <button className="btn btn-primary btn-block" onClick={() => { const id = enrol(cohort.id, scholarship); onClose(); navigate(`/sdc/class/${id}`) }}>{cohort.fee ? (scholarship ? 'Apply and join' : `Join for ${pkr(cohort.fee)}`) : 'Join for free'}</button>
        </div>
      )}
    </Modal>
  )
}

export default function SkillDetail() {
  const { id = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const { allCohorts, s } = useSdc()
  const [joining, setJoining] = useState<Cohort | null>(null)
  const skill = findSkill(id)
  if (!skill) return <NotFound />
  const level = (params.get('level') as LevelKey) || 'foundation'
  const lvl = skill.levels[level]
  const cohorts = allCohorts.filter((c) => c.skillId === skill.id && c.level === level)
  const mine = (cid: string) => s.enrolments.find((e) => e.cohortId === cid && e.status !== 'Withdrawn')

  return (
    <>
      <section className="ac-detail-hero">
        <div className="ac-wrap">
          <nav className="ac-crumbs"><Link to="/sdc/skills">Skills</Link> / <Link to={`/sdc/skills?family=${skill.family}`}>{familyName(skill.family)}</Link></nav>
          <h1>{skill.name}</h1>
          <p className="lead">{skill.summary}</p>
          <div className="meta-row">
            <span><Icon name="briefcase" size={16} /> Leads to: {skill.roles.join(', ')}</span>
            <span><Icon name="layers" size={16} /> {skill.modes.join(' · ')}</span>
            <span><Icon name="book" size={16} /> {skill.languages.join(' & ')}</span>
            {skill.abc && <span><Icon name="award" size={16} /> ABC: {skill.abc}</span>}
          </div>
          <div className="sd-hero-speak"><Speak text={`${skill.name}. ${skill.summary}`} /></div>
        </div>
      </section>

      <div className="ac-wrap ac-sections">
        <div className="tabs sd-level-tabs" role="tablist" aria-label="Levels">
          {levelKeys.map((l) => <button key={l} role="tab" aria-selected={level === l} className={level === l ? 'active' : ''} onClick={() => setParams({ level: l }, { replace: true })}>{levelName[l]}<small>{skill.levels[l].hours} hrs · {skill.levels[l].weeks} weeks</small></button>)}
        </div>

        <div className="lc-gig-grid">
          <div className="lc-profile-main">
            <section>
              <h2>What you’ll be able to do</h2>
              <ul className="ac-outcomes">{lvl.outcomes.map((o) => <li key={o}><Icon name="check" size={16} /> {o}</li>)}</ul>
              {skill.prerequisites[level] && <p className="note"><Icon name="info" size={18} /> Prerequisite: {skill.prerequisites[level]}. A short placement check is offered when you join.</p>}
            </section>
            <section>
              <h2>Syllabus</h2>
              <div className="ac-syllabus">
                {lvl.units.map((u, i) => (
                  <div key={u.title} className="ac-mod">
                    <div className="ac-mod-head static"><span>Unit {i + 1}: {u.title}</span><span className="muted small">{u.items.length} items</span></div>
                    <ul>{u.items.map((it) => <li key={it.id}><Icon name={({ video: 'eye', reading: 'book', practice: 'grid', quiz: 'clipboard', assignment: 'award' } as const)[it.kind]} size={15} /> {it.title} <span className="muted small">{it.minutes} min</span></li>)}</ul>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2>Practical logbook tasks</h2>
              <p className="muted small">You record evidence for each task; your instructor reviews and signs it off. Signed-off tasks count towards ABC.</p>
              <ul className="sd-tasks">{lvl.tasks.map((t) => <li key={t.id} className="card"><strong>{t.title}</strong><span className="muted small">Evidence: {t.evidence}</span></li>)}</ul>
            </section>
            <section>
              <h2>How you’re assessed</h2>
              <ul className="lc-kv">
                <li><span>Lessons and quizzes (pass mark 70%)</span><strong>Required</strong></li>
                <li><span>Instructor-graded assignment</span><strong>Required</strong></li>
                <li><span>Logbook tasks signed off</span><strong>{lvl.tasks.length} tasks</strong></li>
                <li><span>Attendance at live sessions</span><strong>75% or more</strong></li>
              </ul>
            </section>
          </div>

          <aside className="sd-cohorts">
            <h2>Upcoming cohorts</h2>
            {cohorts.length ? cohorts.map((c) => {
              const e = mine(c.id)
              const full = c.enrolled >= c.seats
              return (
                <div key={c.id} className="card sd-cohort">
                  <div className="sd-cohort-top"><LevelPill level={c.level} /><span className="tag tag-employment">{c.mode}</span></div>
                  <strong>Starts {fmtDate(c.start)}</strong>
                  <span className="small">{scheduleText(c)}</span>
                  <span className="muted small">{c.centreId ? findCentre(c.centreId)?.name : 'Online'} · {c.language} · {findInstructor(c.instructorId)?.name}</span>
                  <div className="sd-seats"><div className="bar"><span style={{ width: `${(c.enrolled / c.seats) * 100}%` }} /></div><span className="small muted">{c.seats - c.enrolled} of {c.seats} seats left</span></div>
                  <div className="sd-cohort-foot"><strong>{pkr(c.fee)}</strong>
                    {e ? <Link to={`/sdc/class/${e.id}`} className="btn btn-outline btn-sm">Go to class</Link> : <button className="btn btn-primary btn-sm" disabled={full} onClick={() => setJoining(c)}>{full ? 'Full' : 'Join'}</button>}
                  </div>
                </div>
              )
            }) : <p className="muted small">No cohort is scheduled for this level yet. Training centres can schedule one from the instructor workspace.</p>}
          </aside>
        </div>
      </div>
      {joining && <EnrolDialog cohort={joining} onClose={() => setJoining(null)} />}
    </>
  )
}
