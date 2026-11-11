import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { allLessons, quizBank, type Course, type Lesson } from '../data'
import { useAcademy } from '../store'
import NotFound from '../../pages/site/NotFound'

const kindIcon = { video: 'eye', reading: 'book', quiz: 'clipboard', assignment: 'award' } as const
const kindLabel = { video: 'Video', reading: 'Reading', quiz: 'Graded quiz', assignment: 'Peer-graded project' }

function VideoLesson({ lesson, course, onDone }: { lesson: Lesson; course: Course; onDone: () => void }) {
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [subs, setSubs] = useState<'Off' | 'English' | 'Urdu'>('English')
  const [quality, setQuality] = useState('Auto')
  const [downloaded, setDownloaded] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    setPos(0)
    setPlaying(false)
    done.current = false
  }, [lesson.id])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setPos((p) => Math.min(100, p + 2 * speed)), 100)
    return () => clearInterval(t)
  }, [playing, speed])

  useEffect(() => {
    if (pos >= 100 && !done.current) {
      done.current = true
      setPlaying(false)
      onDone()
    }
  }, [pos, onDone])

  const secs = Math.round((pos / 100) * lesson.minutes * 60)
  const fmt = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`

  return (
    <>
      <div className="ac-player">
        <div className="ac-screen">
          <button className="ac-play" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? (
              <svg width="28" height="28" viewBox="0 0 24 24"><path d="M7 5h4v14H7zm6 0h4v14h-4z" fill="currentColor" /></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
            )}
          </button>
          <span className="ac-screen-title">{lesson.title}</span>
          {subs !== 'Off' && playing && <span className="ac-subs">{subs === 'Urdu' ? 'آئیے اس سبق کے اہم نکات دیکھتے ہیں' : 'Let’s look at the key ideas in this lesson.'}</span>}
        </div>
        <div className="ac-controls">
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Seek" />
          <div className="ac-control-row">
            <span className="small">{fmt(secs)} / {fmt(lesson.minutes * 60)}</span>
            <label>Speed <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>{[0.75, 1, 1.25, 1.5, 2].map((x) => <option key={x} value={x}>{x}×</option>)}</select></label>
            <label>Subtitles <select value={subs} onChange={(e) => setSubs(e.target.value as typeof subs)}>{['Off', 'English', 'Urdu'].map((x) => <option key={x}>{x}</option>)}</select></label>
            <label>Quality <select value={quality} onChange={(e) => setQuality(e.target.value)}>{['Auto', 'Data saver (240p)', '480p', '720p'].map((x) => <option key={x}>{x}</option>)}</select></label>
            <button className="btn btn-ghost btn-sm" onClick={() => setDownloaded(true)}><Icon name="download" size={14} /> {downloaded ? 'Saved offline' : 'Download'}</button>
          </div>
        </div>
      </div>
      <details className="ac-transcript">
        <summary>Transcript</summary>
        <p>In this lesson from <em>{course.title}</em>, we look at {lesson.title.toLowerCase()}. We start with the core idea, work through an everyday example from Pakistan, and finish with a short checklist you can use straight away.</p>
        <p>Take notes as you go — you can keep them in the Notes panel below the lesson — and post questions in the discussion forum if anything is unclear.</p>
      </details>
    </>
  )
}

function ReadingLesson({ lesson, course }: { lesson: Lesson; course: Course }) {
  return (
    <article className="ac-reading">
      <h2>{lesson.title.replace('Reading: ', '')}</h2>
      <p>{course.summary} This reading summarises the ideas from the videos in this module so that you can review them quickly — including offline.</p>
      <h3>Key points</h3>
      <ul>{course.outcomes.slice(0, 3).map((o) => <li key={o}>{o}.</li>)}</ul>
      <h3>Try it yourself</h3>
      <p>Pick one of the key points above and apply it to a small, real example from your own life or work. Write down what you did and what you would change next time; you will use this in the module’s project.</p>
      <p className="muted small">Estimated reading time: {lesson.minutes} minutes.</p>
    </article>
  )
}

function QuizLesson({ lesson, course, locked }: { lesson: Lesson; course: Course; locked: boolean }) {
  const { s, scoreQuiz } = useAcademy()
  const questions = quizBank[course.category] ?? quizBank.foundation
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const best = s.quiz[lesson.id]

  useEffect(() => {
    setAnswers({})
    setSubmitted(false)
  }, [lesson.id])

  if (locked) return <Locked course={course} what="Graded quizzes" />

  const score = Math.round((questions.filter((q, i) => answers[i] === q.answer).length / questions.length) * 100)

  return (
    <div className="ac-quiz">
      <div className="ac-quiz-head">
        <h2>{lesson.title}</h2>
        <p className="muted small">{questions.length} questions · Pass mark 70% · Unlimited attempts{best !== undefined && ` · Best score ${best}%`}</p>
      </div>
      {questions.map((q, i) => (
        <fieldset key={q.q} className="ac-q">
          <legend>{i + 1}. {q.q}</legend>
          {q.options.map((o, j) => {
            const state = submitted ? (j === q.answer ? 'right' : answers[i] === j ? 'wrong' : '') : ''
            return (
              <label key={o} className={`ac-opt ${answers[i] === j ? 'sel' : ''} ${state}`}>
                <input type="radio" name={`q${i}`} disabled={submitted} checked={answers[i] === j} onChange={() => setAnswers({ ...answers, [i]: j })} /> {o}
              </label>
            )
          })}
          {submitted && <p className={`ac-explain ${answers[i] === q.answer ? 'right' : 'wrong'}`}>{answers[i] === q.answer ? 'Correct. ' : 'Not quite. '}{q.explain}</p>}
        </fieldset>
      ))}
      {submitted ? (
        <div className={`ac-result ${score >= 70 ? 'pass' : 'fail'}`}>
          <strong>{score >= 70 ? 'Passed' : 'Not passed yet'} — {score}%</strong>
          <span>{score >= 70 ? 'Great work. This counts towards your grade.' : 'Review the lessons and try again. Only your best score counts.'}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { setAnswers({}); setSubmitted(false) }}>Retake quiz</button>
        </div>
      ) : (
        <button className="btn btn-primary" disabled={Object.keys(answers).length < questions.length} onClick={() => { setSubmitted(true); scoreQuiz(lesson.id, score) }}>Submit answers</button>
      )}
    </div>
  )
}

function AssignmentLesson({ lesson, course, locked }: { lesson: Lesson; course: Course; locked: boolean }) {
  const { s, submit } = useAcademy()
  const existing = s.submissions[lesson.id]
  const [text, setText] = useState(existing ?? '')
  const [reviewed, setReviewed] = useState(0)

  useEffect(() => setText(s.submissions[lesson.id] ?? ''), [lesson.id, s.submissions])
  if (locked) return <Locked course={course} what="Peer-graded projects" />

  return (
    <div className="ac-assign">
      <h2>{lesson.title}</h2>
      <div className="card ac-brief">
        <h3>Instructions</h3>
        <p>Apply what you learned in <em>{course.title}</em> to a small real-world task. Describe the problem, what you did, and what you learned. Add a link to your work if you have one (for example a file, site or photos of practical work).</p>
        <h3>Rubric</h3>
        <ul className="small">
          <li>Clear description of the task (2 points)</li>
          <li>Correct use of the course’s methods (4 points)</li>
          <li>Reflection on results and next steps (2 points)</li>
          <li>Quality of presentation (2 points)</li>
        </ul>
      </div>
      {existing ? (
        <div className="ac-result pass">
          <strong>Submitted</strong>
          <span>Your work goes to three peers for grading. To get your grade, review two of your peers' submissions.</span>
          {reviewed < 2 ? (
            <button className="btn btn-ghost btn-sm" onClick={() => setReviewed(reviewed + 1)}>Review a peer ({reviewed}/2)</button>
          ) : (
            <span className="small"><Icon name="check" size={14} /> Peer reviews done — grade: 9/10 (prototype)</span>
          )}
        </div>
      ) : null}
      <label className="ac-form">
        Your submission
        <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your project (at least 50 characters)…" />
      </label>
      <button className="btn btn-primary" disabled={text.trim().length < 50} onClick={() => submit(lesson.id, text.trim())}>{existing ? 'Update submission' : 'Submit for peer review'}</button>
    </div>
  )
}

function Locked({ course, what }: { course: Course; what: string }) {
  const { enroll } = useAcademy()
  return (
    <div className="ac-locked card">
      <Icon name="lock" size={28} />
      <h2>{what} are part of the certificate track</h2>
      <p className="muted">You are auditing this course. Upgrade to get graded work, feedback and a shareable certificate — or apply for financial aid.</p>
      <button className="btn btn-primary" onClick={() => enroll(course.slug, 'certificate')}>Upgrade (prototype — free)</button>
    </div>
  )
}

function Notes({ slug }: { slug: string }) {
  const { s, saveNote } = useAcademy()
  const [text, setText] = useState(s.notes[slug] ?? '')
  const [saved, setSaved] = useState(false)
  return (
    <div className="ac-panel">
      <textarea rows={6} value={text} onChange={(e) => { setText(e.target.value); setSaved(false) }} placeholder="Write notes for this course. They are private to you." />
      <button className="btn btn-ghost btn-sm" onClick={() => { saveNote(slug, text); setSaved(true) }}>{saved ? 'Saved' : 'Save notes'}</button>
    </div>
  )
}

function Discussion({ slug }: { slug: string }) {
  const { s, post, reply } = useAcademy()
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const posts = s.forum[slug] ?? []
  const seed = [{ id: 'seed', author: 'Course mentor', text: 'Welcome! Introduce yourself here and tell us what you hope to learn.', date: 'Pinned', replies: [{ author: 'Learner from Lahore', text: 'Assalam-o-Alaikum! I want to use this for freelancing.', date: 'Oct 2026' }] }]
  return (
    <div className="ac-panel">
      <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { post(slug, text.trim()); setText('') } }} className="ac-post-form">
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask a question or share an insight with other learners…" />
        <button className="btn btn-primary btn-sm" type="submit" disabled={!text.trim()}>Post</button>
      </form>
      {[...posts, ...seed].map((p) => (
        <div key={p.id} className="ac-post">
          <div className="ac-post-head"><span className="avatar">{p.author.slice(0, 2).toUpperCase()}</span><strong>{p.author}</strong><span className="muted small">{p.date}</span></div>
          <p>{p.text}</p>
          {p.replies.map((r, i) => <div key={i} className="ac-reply"><strong className="small">{r.author}</strong> <span className="small">{r.text}</span></div>)}
          {p.id !== 'seed' && (replyTo === p.id ? (
            <form onSubmit={(e) => { e.preventDefault(); if (replyText.trim()) { reply(slug, p.id, replyText.trim()); setReplyText(''); setReplyTo(null) } }} className="ac-post-form">
              <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply" />
              <button className="btn btn-ghost btn-sm" type="submit">Reply</button>
            </form>
          ) : <button className="ac-link-btn" onClick={() => setReplyTo(p.id)}>Reply</button>)}
        </div>
      ))}
    </div>
  )
}

function Grades({ course }: { course: Course }) {
  const { s } = useAcademy()
  const items = allLessons(course).filter((l) => l.kind === 'quiz' || l.kind === 'assignment')
  return (
    <div className="ac-grades">
      <h2>Grades</h2>
      <p className="muted small">Pass every graded item (70% or more) and complete all lessons to earn your certificate.</p>
      <table className="table">
        <thead><tr><th>Item</th><th>Type</th><th>Status</th><th>Grade</th></tr></thead>
        <tbody>
          {items.map((l) => {
            const g = l.kind === 'quiz' ? s.quiz[l.id] : s.submissions[l.id] ? 90 : undefined
            return (
              <tr key={l.id}>
                <td><Link to={`/academy/learn/${course.slug}/${l.id}`}>{l.title}</Link></td>
                <td>{kindLabel[l.kind]}</td>
                <td><span className={`status ${g === undefined ? 'status-not-started' : g >= 70 ? 'status-completed' : 'status-in-progress'}`}>{g === undefined ? 'Not started' : g >= 70 ? 'Passed' : 'Try again'}</span></td>
                <td>{g === undefined ? '—' : `${g}%`}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Learn() {
  const { slug = '', lessonId } = useParams()
  const navigate = useNavigate()
  const { s, getCourse, complete, visit, progress, graded, issueCertificate } = useAcademy()
  const [tab, setTab] = useState<'notes' | 'discussion'>('discussion')
  const [menu, setMenu] = useState(false)
  const course = getCourse(slug)

  useEffect(() => {
    if (course && lessonId && lessonId !== 'grades') visit(course.slug, lessonId)
    setMenu(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  if (!course) return <NotFound />
  const enrollment = s.enrollments[course.slug]
  if (!enrollment) return <Navigate to={`/academy/course/${course.slug}`} replace />

  const lessons = allLessons(course)
  if (!lessonId) return <Navigate to={`/academy/learn/${course.slug}/${s.lastLesson[course.slug] ?? lessons[0].id}`} replace />

  const idx = lessons.findIndex((l) => l.id === lessonId)
  const lesson = lessons[idx]
  const next = lessons[idx + 1]
  const prev = lessons[idx - 1]
  const pct = progress(course)
  const locked = enrollment.mode === 'audit'
  const cert = s.certificates.find((c) => c.slug === course.slug)
  const eligible = !locked && pct === 100 && graded(course)

  return (
    <div className="ac-learn">
      <aside className={`ac-learn-nav ${menu ? 'open' : ''}`}>
        <Link to={`/academy/course/${course.slug}`} className="ac-learn-title">{course.title}</Link>
        <div className="ac-learn-progress">
          <div className="bar"><span style={{ width: `${pct}%` }} /></div>
          <span className="small muted">{pct}% complete{locked && ' · Auditing'}</span>
        </div>
        <Link to={`/academy/learn/${course.slug}/grades`} className={`ac-lesson-link ${lessonId === 'grades' ? 'active' : ''}`}><Icon name="clipboard" size={15} /> Grades</Link>
        {course.modules.map((m, mi) => (
          <div key={m.title} className="ac-learn-mod">
            <span className="ac-learn-mod-title">{m.title}<small>Suggested: week {mi + 1}</small></span>
            {m.lessons.map((l) => (
              <Link key={l.id} to={`/academy/learn/${course.slug}/${l.id}`} className={`ac-lesson-link ${l.id === lessonId ? 'active' : ''} ${s.completed[l.id] ? 'done' : ''}`}>
                <span className="ac-tick">{s.completed[l.id] ? <Icon name="check" size={12} /> : <Icon name={kindIcon[l.kind]} size={13} />}</span>
                <span>{l.title}</span>
                {locked && (l.kind === 'quiz' || l.kind === 'assignment') && <Icon name="lock" size={12} />}
              </Link>
            ))}
          </div>
        ))}
      </aside>

      <section className="ac-learn-main">
        <button className="btn btn-ghost btn-sm ac-learn-menu" onClick={() => setMenu(!menu)}><Icon name="menu" size={16} /> Course menu</button>

        {(eligible || cert) && (
          <div className="ac-cert-banner">
            <Icon name="award" size={22} />
            <div><strong>{cert ? 'You earned your certificate!' : 'Congratulations — you completed the course!'}</strong><span className="small">Share it on your profile, CV and Skill Wise skills card.</span></div>
            {cert ? <Link to={`/academy/certificate/${cert.code}`} className="btn btn-gold btn-sm">View certificate</Link> : <button className="btn btn-gold btn-sm" onClick={() => { const c = issueCertificate(course.slug, course.title); navigate(`/academy/certificate/${c.code}`) }}>Get certificate</button>}
          </div>
        )}

        {lessonId === 'grades' ? (
          <Grades course={course} />
        ) : !lesson ? (
          <NotFound />
        ) : (
          <>
            <div className="ac-lesson-head">
              <span className="pill">{kindLabel[lesson.kind]} · {lesson.minutes} min</span>
            </div>
            {lesson.kind === 'video' && <VideoLesson lesson={lesson} course={course} onDone={() => complete(course.slug, lesson.id)} />}
            {lesson.kind === 'reading' && <ReadingLesson lesson={lesson} course={course} />}
            {lesson.kind === 'quiz' && <QuizLesson lesson={lesson} course={course} locked={locked} />}
            {lesson.kind === 'assignment' && <AssignmentLesson lesson={lesson} course={course} locked={locked} />}

            <div className="ac-lesson-nav">
              {prev ? <Link to={`/academy/learn/${course.slug}/${prev.id}`} className="btn btn-ghost btn-sm">← Previous</Link> : <span />}
              {(lesson.kind === 'video' || lesson.kind === 'reading') && !s.completed[lesson.id] && (
                <button className="btn btn-outline btn-sm" onClick={() => complete(course.slug, lesson.id)}><Icon name="check" size={14} /> Mark as complete</button>
              )}
              {next ? (
                <button className="btn btn-primary btn-sm" onClick={() => { if (lesson.kind === 'video' || lesson.kind === 'reading') complete(course.slug, lesson.id); navigate(`/academy/learn/${course.slug}/${next.id}`) }}>Next →</button>
              ) : <Link to={`/academy/learn/${course.slug}/grades`} className="btn btn-primary btn-sm">See grades</Link>}
            </div>

            <div className="ac-tabs-panel">
              <div className="tabs" role="tablist">
                <button role="tab" aria-selected={tab === 'discussion'} className={tab === 'discussion' ? 'active' : ''} onClick={() => setTab('discussion')}>Discussion forum</button>
                <button role="tab" aria-selected={tab === 'notes'} className={tab === 'notes' ? 'active' : ''} onClick={() => setTab('notes')}>My notes</button>
              </div>
              {tab === 'notes' ? <Notes slug={course.slug} /> : <Discussion slug={course.slug} />}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
