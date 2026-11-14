import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { classmates, families, findCentre, findInstructor, fmtDate, levelName, quizBank, sessionsFor, TODAY, type Item } from '../data'
import { useSdc } from '../store'
import { Check, icsHref, LevelPill, Modal, Ring, Speak } from '../ui'
import NotFound from '../../pages/site/NotFound'

const kindIcon = { video: 'eye', reading: 'book', practice: 'grid', quiz: 'clipboard', assignment: 'award' } as const
const kindLabel = { video: 'Video lesson', reading: 'Guide', practice: 'Practice', quiz: 'Quiz', assignment: 'Assignment' }
const tabs = [['units', 'Lessons'], ['live', 'Live classes'], ['logbook', 'Logbook'], ['grades', 'Progress & grades'], ['community', 'Community'], ['notes', 'Notes']] as const

function useClass() {
  const { enrolId = '' } = useParams()
  const ctx = useSdc()
  const e = ctx.s.enrolments.find((x) => x.id === enrolId)
  return { enrolId, e, ...ctx }
}

/** A unit is unlocked once the previous unit's quiz is passed (mastery gating). */
function unlocked(unitIndex: number, units: { items: Item[] }[], quiz: Record<string, number>) {
  if (unitIndex === 0) return true
  const q = units[unitIndex - 1].items.find((i) => i.kind === 'quiz')
  return !q || (quiz[q.id] ?? 0) >= 70
}

function LiveRoom({ title, onLeave }: { title: string; onLeave: () => void }) {
  const [hand, setHand] = useState(false)
  const [msgs, setMsgs] = useState<string[]>(['Instructor: Welcome everyone, we’ll start in a minute.'])
  const [text, setText] = useState('')
  return (
    <Modal title={`Live class: ${title}`} onClose={onLeave}>
      <div className="sd-live">
        <div className="sd-tiles">{['Instructor', 'You', ...classmates.slice(0, 4).map((c) => c.name.replace('Sample Learner — ', ''))].map((n, i) => <div key={n} className={`sd-tile ${i === 0 ? 'main' : ''}`}><span>{n}</span></div>)}</div>
        <div className="sd-live-chat">
          {msgs.map((m, i) => <p key={i} className="small">{m}</p>)}
          <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { setMsgs([...msgs, `You: ${text.trim()}`]); setText('') } }} className="lc-inline-form"><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message the class" aria-label="Chat message" /><button className="btn btn-ghost btn-sm">Send</button></form>
        </div>
        <div className="lc-head-actions"><button className={`btn btn-sm ${hand ? 'btn-gold' : 'btn-ghost'}`} onClick={() => setHand(!hand)}>{hand ? 'Hand raised' : 'Raise hand'}</button><button className="btn btn-primary btn-sm" onClick={onLeave}>Leave class</button></div>
        <p className="muted small">Prototype: no audio or video. Your attendance has been recorded.</p>
      </div>
    </Modal>
  )
}

export default function Classroom() {
  const { enrolId, e, levelStatus, s, attend, addLog, post, reply, saveNote, claimCertificate, withdraw } = useClass()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = params.get('tab') ?? 'units'
  const [live, setLive] = useState<string | null>(null)
  const [logTask, setLogTask] = useState<string | null>(null)
  const [logNote, setLogNote] = useState('')
  const [logFile, setLogFile] = useState('')
  const [postText, setPostText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [note, setNote] = useState(s.notes[enrolId] ?? '')
  const [saved, setSaved] = useState(false)
  if (!e) return <NotFound />
  const st = levelStatus(enrolId)
  const c = st.cohort
  const skill = st.skill
  const sessions = sessionsFor(c, skill)
  const instructor = findInstructor(c.instructorId)!
  const cert = s.certificates.find((x) => x.skillId === skill.id && x.level === c.level)
  const where = c.centreId ? findCentre(c.centreId)!.name : 'Online'

  function submitLog(ev: FormEvent) {
    ev.preventDefault()
    const task = st.lvl.tasks.find((t) => t.id === logTask)!
    addLog(enrolId, task.id, task.title, logNote.trim(), logFile || 'evidence-note.txt', c.id)
    setLogTask(null); setLogNote(''); setLogFile('')
  }

  return (
    <div className="ac-wrap ac-sections sd-class">
      <header className="sd-class-head">
        <div>
          <nav className="ac-crumbs"><Link to="/sdc/learn">My learning</Link> / Class</nav>
          <h1>{skill.name}</h1>
          <p className="muted"><LevelPill level={c.level} /> {c.start > TODAY ? `Starts ${fmtDate(c.start)} · ` : ''}{c.mode} · {where} · {c.language} · Instructor: {instructor.name}</p>
        </div>
        <Ring pct={st.progress} size={72} />
      </header>

      {cert ? (
        <div className="ac-cert-banner"><Icon name="award" size={22} /><div><strong>Level certificate earned</strong><span className="small">Next: book your supervised ABC assessment.</span></div><Link to={`/sdc/certificate/${cert.code}`} className="btn btn-gold btn-sm">View certificate</Link><Link to="/sdc/assessment" className="btn btn-ghost btn-sm">Book ABC</Link></div>
      ) : st.complete && (
        <div className="ac-cert-banner"><Icon name="award" size={22} /><div><strong>You’ve completed every requirement for this level!</strong><span className="small">Claim your level certificate.</span></div><button className="btn btn-gold btn-sm" onClick={() => navigate(`/sdc/certificate/${claimCertificate(enrolId).code}`)}>Claim certificate</button></div>
      )}

      <div className="tabs sd-class-tabs" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setParams({ tab: k }, { replace: true })}>{l}</button>)}</div>

      <div className="sd-class-grid">
        <div className="sd-class-main">
          {tab === 'units' && st.lvl.units.map((u, ui) => {
            const open = unlocked(ui, st.lvl.units, s.quiz)
            return (
              <section key={u.title} className={`card sd-unit ${open ? '' : 'locked'}`}>
                <div className="card-head"><h2>Unit {ui + 1}: {u.title}</h2>{open ? <span className="small muted">{u.items.filter((i) => s.done[i.id]).length}/{u.items.length} done</span> : <span className="small muted"><Icon name="lock" size={13} /> Pass the Unit {ui} quiz to unlock</span>}</div>
                <ul className="sd-items">{u.items.map((it) => (
                  <li key={it.id}>
                    {open ? <Link to={`/sdc/class/${enrolId}/item/${it.id}`} className={s.done[it.id] ? 'done' : ''}>
                      <span className="ac-tick">{s.done[it.id] ? <Icon name="check" size={12} /> : <Icon name={kindIcon[it.kind]} size={13} />}</span>
                      <span>{it.title}</span><span className="muted small">{kindLabel[it.kind]} · {it.minutes} min{it.kind === 'quiz' && s.quiz[it.id] !== undefined ? ` · best ${s.quiz[it.id]}%` : ''}{it.kind === 'assignment' && s.submissions[it.id] ? (s.submissions[it.id].grade !== undefined ? ` · graded ${s.submissions[it.id].grade}%` : ' · awaiting grade') : ''}</span>
                    </Link> : <span className="sd-locked-item"><Icon name="lock" size={13} /> {it.title}</span>}
                  </li>
                ))}</ul>
              </section>
            )
          })}

          {tab === 'live' && (
            <section className="card">
              <h2>Live classes</h2>
              <p className="muted small">{sessions.length} sessions · {c.mode === 'Online' ? 'online' : c.mode === 'Hybrid' ? 'online theory with lab days at ' + where : 'at ' + where}. Attendance of 75% or more is required; watching a recording counts.</p>
              <table className="table sd-sessions">
                <thead><tr><th>#</th><th>Date</th><th>Topic</th><th>Attendance</th><th></th></tr></thead>
                <tbody>{sessions.map((x) => {
                  const past = x.date < TODAY
                  const a = s.attendance[x.id]
                  return (
                    <tr key={x.id} className={x.date === TODAY ? 'today' : ''}>
                      <td>{x.n}</td><td>{fmtDate(x.date)}<br /><span className="muted small">{x.time}</span></td><td>{x.topic}</td>
                      <td>{a ? <span className="status status-completed">{a}</span> : past ? <span className="status lc-danger">Missed</span> : <span className="muted small">Upcoming</span>}</td>
                      <td className="lc-row-actions">
                        {past ? (!a && <button className="ac-link-btn" onClick={() => attend(x.id, 'Watched recording')}>Watch recording</button>) : (
                          <><button className="btn btn-primary btn-sm" onClick={() => { attend(x.id, 'Present'); setLive(x.topic) }}>Join</button><a href={icsHref(`${skill.name}: ${x.topic}`, x.date, x.time, x.hours, where)} download={`class-${x.n}.ics`} className="small">Add to calendar</a></>
                        )}
                      </td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </section>
          )}

          {tab === 'logbook' && (
            <section className="card">
              <h2>Practical skill logbook</h2>
              <p className="muted small">Record evidence of each practical task — a video, photos or a document. Your instructor reviews it and signs it off. Signed-off evidence supports your ABC assessment.</p>
              <ul className="sd-log">{st.lvl.tasks.map((t) => {
                const entry = s.logbook.find((l) => l.enrolId === enrolId && l.taskId === t.id)
                return (
                  <li key={t.id} className="card">
                    <div className="card-head"><strong>{t.title}</strong>{entry ? <span className={`status ${entry.status === 'Signed off' ? 'status-completed' : entry.status === 'Needs rework' ? 'lc-danger' : 'status-in-progress'}`}>{entry.status}</span> : <span className="status status-not-started">Not started</span>}</div>
                    <p className="muted small">Evidence needed: {t.evidence}</p>
                    {entry && <div className="sd-entry"><p className="small">{entry.note}</p><span className="lc-file small"><Icon name="download" size={14} /> {entry.evidence}</span><span className="muted small">Submitted {entry.date}</span>{entry.feedback && <p className="sd-feedback small"><strong>Instructor:</strong> {entry.feedback}</p>}</div>}
                    {(!entry || entry.status === 'Needs rework') && (logTask === t.id ? (
                      <form className="ac-form" onSubmit={submitLog}>
                        <label>What did you do?<textarea required rows={3} value={logNote} onChange={(ev) => setLogNote(ev.target.value)} /></label>
                        <label>Evidence file (video, photo or document)<input type="file" accept="video/*,image/*,.pdf,.doc,.docx" onChange={(ev) => setLogFile(ev.target.files?.[0]?.name ?? '')} /><span className="muted small">Prototype: only the file name is kept. On a phone you can record video directly.</span></label>
                        <div className="lc-head-actions"><button className="btn btn-primary btn-sm" type="submit" disabled={logNote.trim().length < 10}>Submit for sign-off</button><button type="button" className="btn btn-ghost btn-sm" onClick={() => setLogTask(null)}>Cancel</button></div>
                      </form>
                    ) : <button className="btn btn-outline btn-sm" onClick={() => setLogTask(t.id)}>{entry ? 'Resubmit evidence' : 'Add evidence'}</button>)}
                  </li>
                )
              })}</ul>
            </section>
          )}

          {tab === 'grades' && (
            <section className="card">
              <h2>Progress & grades</h2>
              <ul className="sd-reqs">
                <Check ok={st.itemsDone === st.itemsTotal}>Lessons completed: {st.itemsDone}/{st.itemsTotal}</Check>
                <Check ok={st.quizzesPassed === st.quizzesTotal}>Quizzes passed (70%+): {st.quizzesPassed}/{st.quizzesTotal}</Check>
                <Check ok={st.assignmentsPassed === st.assignmentsTotal}>Assignment graded and passed: {st.assignmentsPassed}/{st.assignmentsTotal}</Check>
                <Check ok={st.tasksSigned === st.tasksTotal}>Logbook tasks signed off: {st.tasksSigned}/{st.tasksTotal}</Check>
                <Check ok={st.attendancePct >= 75}>Attendance: {st.attendancePct}% of {st.sessionsPast} past sessions (75% needed)</Check>
              </ul>
              <table className="table">
                <thead><tr><th>Graded item</th><th>Result</th></tr></thead>
                <tbody>{st.lvl.units.flatMap((u) => u.items).filter((i) => i.kind === 'quiz' || i.kind === 'assignment').map((i) => {
                  const g = i.kind === 'quiz' ? s.quiz[i.id] : s.submissions[i.id]?.grade
                  return <tr key={i.id}><td>{i.title}</td><td>{g === undefined ? (i.kind === 'assignment' && s.submissions[i.id] ? 'Awaiting instructor' : '—') : `${g}%`}</td></tr>
                })}</tbody>
              </table>
              {st.complete && !cert && <button className="btn btn-gold" onClick={() => navigate(`/sdc/certificate/${claimCertificate(enrolId).code}`)}><Icon name="award" size={16} /> Claim level certificate</button>}
            </section>
          )}

          {tab === 'community' && (
            <section className="card">
              <h2>Announcements & discussion</h2>
              <form className="ac-post-form" onSubmit={(ev) => { ev.preventDefault(); if (postText.trim()) { post(c.id, s.me.name, postText.trim(), 'discussion'); setPostText('') } }}>
                <textarea rows={2} value={postText} onChange={(ev) => setPostText(ev.target.value)} placeholder="Ask your class a question…" aria-label="New post" />
                <button className="btn btn-primary btn-sm" disabled={!postText.trim()}>Post</button>
              </form>
              {(s.posts[c.id] ?? []).map((p) => (
                <div key={p.id} className={`ac-post ${p.kind === 'announcement' ? 'sd-announce' : ''}`}>
                  <div className="ac-post-head">{p.kind === 'announcement' && <span className="ac-badge abc">Announcement</span>}<strong>{p.author}</strong><span className="muted small">{p.date}</span></div>
                  <p>{p.text}</p>
                  {p.replies.map((r, i) => <div key={i} className="ac-reply"><strong className="small">{r.author}</strong> <span className="small">{r.text}</span></div>)}
                  {replyTo === p.id ? (
                    <form className="ac-post-form" onSubmit={(ev) => { ev.preventDefault(); if (replyText.trim()) { reply(c.id, p.id, s.me.name, replyText.trim()); setReplyText(''); setReplyTo(null) } }}><input value={replyText} onChange={(ev) => setReplyText(ev.target.value)} placeholder="Write a reply" aria-label="Reply" /><button className="btn btn-ghost btn-sm">Reply</button></form>
                  ) : <button className="ac-link-btn" onClick={() => setReplyTo(p.id)}>Reply</button>}
                </div>
              ))}
            </section>
          )}

          {tab === 'notes' && (
            <section className="card ac-panel">
              <h2>My notes</h2>
              <textarea rows={10} value={note} onChange={(ev) => { setNote(ev.target.value); setSaved(false) }} placeholder="Private notes for this class" aria-label="Notes" />
              <button className="btn btn-ghost btn-sm" onClick={() => { saveNote(enrolId, note); setSaved(true) }}>{saved ? 'Saved' : 'Save notes'}</button>
            </section>
          )}
        </div>

        <aside className="sd-class-side">
          <div className="card">
            <h3>Instructor</h3>
            <div className="lc-seller-row"><span className="avatar">{instructor.initials}</span><div><strong className="small">{instructor.name}</strong><br /><span className="muted small">{instructor.title}</span></div></div>
          </div>
          <div className="card">
            <h3>Your peer pod</h3>
            <ul className="sd-pod">{classmates.slice(0, 4).map((m) => <li key={m.id}><span className="avatar sm">{m.initials}</span> {m.name.replace('Sample Learner — ', '')}</li>)}</ul>
          </div>
          <div className="card">
            <h3>Next class</h3>
            {(() => { const n = sessions.find((x) => x.date >= TODAY); return n ? <><p className="small"><strong>{fmtDate(n.date)} · {n.time}</strong><br />{n.topic}</p><a className="small" href={icsHref(`${skill.name}: ${n.topic}`, n.date, n.time, n.hours, where)} download="next-class.ics">Add to calendar</a></> : <p className="muted small">All sessions finished.</p> })()}
          </div>
          <button className="ac-link-btn danger" onClick={() => { withdraw(enrolId); navigate('/sdc/learn') }}>Withdraw from cohort</button>
        </aside>
      </div>
      {live && <LiveRoom title={live} onLeave={() => setLive(null)} />}
    </div>
  )
}

export function ItemView() {
  const { enrolId = '', itemId = '' } = useParams()
  const navigate = useNavigate()
  const { s, levelStatus, complete, scoreQuiz, submit } = useSdc()
  const e = s.enrolments.find((x) => x.id === enrolId)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [text, setText] = useState('')
  const doneRef = useRef(false)

  useEffect(() => { setPos(0); setPlaying(false); setFlipped({}); setAnswers({}); setSubmitted(false); doneRef.current = false; setText(e ? s.submissions[itemId]?.text ?? '' : '') }, [itemId]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!playing) return; const t = setInterval(() => setPos((p) => Math.min(100, p + 4)), 100); return () => clearInterval(t) }, [playing])
  useEffect(() => { if (pos >= 100 && !doneRef.current) { doneRef.current = true; setPlaying(false); complete(itemId) } }, [pos, itemId, complete])

  if (!e) return <NotFound />
  const st = levelStatus(enrolId)
  const items = st.lvl.units.flatMap((u) => u.items)
  const idx = items.findIndex((i) => i.id === itemId)
  const item = items[idx]
  if (!item) return <NotFound />
  const unitIndex = st.lvl.units.findIndex((u) => u.items.some((i) => i.id === itemId))
  if (!unlocked(unitIndex, st.lvl.units, s.quiz)) return <div className="ac-wrap ac-sections"><p className="note"><Icon name="lock" size={18} /> This unit is locked. Pass the previous unit’s quiz first. <Link to={`/sdc/class/${enrolId}`}>Back to class</Link></p></div>
  const next = items[idx + 1]
  const terms = families.find((f) => f.slug === st.skill.family)!.terms
  const qs = quizBank[st.skill.family]
  const score = Math.round((qs.filter((q, i) => answers[i] === q.answer).length / qs.length) * 100)
  const guide = `${st.lvl.units[unitIndex].title}. ${st.lvl.outcomes.join('. ')}. Work through each step slowly. Practise with your instructor's supervision before working alone, and record what you did in your logbook.`
  const sub = s.submissions[item.id]

  return (
    <div className="ac-wrap ac-sections sd-item">
      <nav className="ac-crumbs"><Link to="/sdc/learn">My learning</Link> / <Link to={`/sdc/class/${enrolId}`}>{st.skill.name} — {levelName[st.cohort.level]}</Link> / Unit {unitIndex + 1}</nav>
      <div className="sd-item-head"><span className="pill">{kindLabel[item.kind]} · {item.minutes} min</span>{s.done[item.id] && <span className="status status-completed">Done</span>}</div>
      <h1>{item.title}</h1>

      {item.kind === 'video' && (
        <div className="ac-player">
          <div className="ac-screen">
            <button className="ac-play" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <svg width="28" height="28" viewBox="0 0 24 24"><path d="M7 5h4v14H7zm6 0h4v14h-4z" fill="currentColor" /></svg> : <svg width="28" height="28" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>}
            </button>
            <span className="ac-screen-title">{item.title}</span>
          </div>
          <div className="ac-controls"><input type="range" min={0} max={100} value={pos} onChange={(ev) => setPos(Number(ev.target.value))} aria-label="Seek" /><div className="ac-control-row"><span className="small">Urdu narration · English subtitles</span><button className="btn btn-ghost btn-sm">Download for offline</button></div></div>
        </div>
      )}

      {item.kind === 'reading' && (
        <article className="ac-reading">
          <div className="lc-head-actions"><Speak text={guide} label="Read aloud" /></div>
          <p>{guide}</p>
          <h3>Key points</h3>
          <ul>{st.lvl.outcomes.map((o) => <li key={o}>{o}.</li>)}</ul>
          <h3>Safety and good practice</h3>
          <p>Always follow your instructor’s instructions. If something is unclear, ask in the community tab before trying it on your own.</p>
        </article>
      )}

      {item.kind === 'practice' && (
        <div>
          <p className="muted">Tap each card to see its meaning. {Object.keys(flipped).length}/{terms.length} viewed.</p>
          <div className="sd-cards">{terms.map(([t, d], i) => (
            <button key={t} className={`sd-card ${flipped[i] ? 'flipped' : ''}`} onClick={() => { const f = { ...flipped, [i]: true }; setFlipped(f); if (Object.keys(f).length === terms.length) complete(item.id) }} aria-label={flipped[i] ? `${t}: ${d}` : `Show meaning of ${t}`}>
              {flipped[i] ? <span className="small">{d}</span> : <strong>{t}</strong>}
            </button>
          ))}</div>
        </div>
      )}

      {item.kind === 'quiz' && (
        <div className="ac-quiz">
          <p className="muted small">Pass mark 70% · unlimited attempts{s.quiz[item.id] !== undefined ? ` · best ${s.quiz[item.id]}%` : ''}. Passing unlocks the next unit.</p>
          {qs.map((q, i) => (
            <fieldset key={q.q} className="ac-q"><legend>{i + 1}. {q.q} <Speak text={`${q.q} Options: ${q.options.join('. ')}`} label="Listen" /></legend>
              {q.options.map((o, j) => {
                const cls = submitted ? (j === q.answer ? 'right' : answers[i] === j ? 'wrong' : '') : ''
                return <label key={o} className={`ac-opt ${answers[i] === j ? 'sel' : ''} ${cls}`}><input type="radio" name={`q${i}`} disabled={submitted} checked={answers[i] === j} onChange={() => setAnswers({ ...answers, [i]: j })} /> {o}</label>
              })}
              {submitted && <p className={`ac-explain ${answers[i] === q.answer ? 'right' : 'wrong'}`}>{q.explain}</p>}
            </fieldset>
          ))}
          {submitted ? <div className={`ac-result ${score >= 70 ? 'pass' : 'fail'}`}><strong>{score >= 70 ? 'Passed' : 'Not passed yet'} — {score}%</strong><button className="btn btn-ghost btn-sm" onClick={() => { setAnswers({}); setSubmitted(false) }}>Try again</button></div>
            : <button className="btn btn-primary" disabled={Object.keys(answers).length < qs.length} onClick={() => { setSubmitted(true); scoreQuiz(item.id, score) }}>Submit answers</button>}
        </div>
      )}

      {item.kind === 'assignment' && (
        <div className="ac-assign">
          <div className="card ac-brief"><h3>Task</h3><p>Apply what you learned in this level to a real situation. Describe the job, the steps you followed, any safety checks, and what you would do differently. Your instructor grades it against the rubric.</p>
            <h3>Rubric</h3><ul className="small"><li>Correct method and sequence (40%)</li><li>Safety and quality (30%)</li><li>Explanation and reflection (30%)</li></ul></div>
          {sub && (sub.grade !== undefined
            ? <div className={`ac-result ${sub.grade >= 50 ? 'pass' : 'fail'}`}><strong>Graded: {sub.grade}%</strong><span>{sub.feedback}</span></div>
            : <div className="ac-result pass"><strong>Submitted {sub.date}</strong><span>Waiting for your instructor to grade it. (You can grade it yourself in the Instructor workspace.)</span></div>)}
          <label className="ac-form">Your answer<textarea rows={8} value={text} onChange={(ev) => setText(ev.target.value)} placeholder="Write at least 50 characters" /></label>
          <button className="btn btn-primary" disabled={text.trim().length < 50 || sub?.grade !== undefined} onClick={() => submit(item.id, text.trim(), s.me.name, st.cohort.id, item.title)}>{sub ? 'Update submission' : 'Submit to instructor'}</button>
        </div>
      )}

      <div className="ac-lesson-nav">
        <Link to={`/sdc/class/${enrolId}`} className="btn btn-ghost btn-sm">← Back to class</Link>
        {(item.kind === 'video' || item.kind === 'reading') && !s.done[item.id] && <button className="btn btn-outline btn-sm" onClick={() => complete(item.id)}><Icon name="check" size={14} /> Mark as complete</button>}
        {next && <button className="btn btn-primary btn-sm" onClick={() => { if (item.kind === 'video' || item.kind === 'reading') complete(item.id); navigate(`/sdc/class/${enrolId}/item/${next.id}`) }}>Next →</button>}
      </div>
    </div>
  )
}
