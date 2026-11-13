import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { categories, courses, formatCount, formatPKR, type Lesson, type LessonKind, type Level, type Lang } from '../data'
import { useAcademy, type CustomCourse } from '../store'

export function TeachLanding() {
  return (
    <>
      <section className="ac-hero">
        <div className="ac-wrap ac-hero-grid">
          <div>
            <span className="eyebrow">Teach on Skill Academy</span>
            <h1>Share your skills with learners across Pakistan.</h1>
            <p className="lead">Universities, institutes, industry experts and independent trainers can publish courses, reach learners in Urdu and English, and earn a transparent revenue share.</p>
            <div className="ac-hero-actions">
              <Link to="/academy/teach/dashboard" className="btn btn-primary btn-lg">Open instructor dashboard <Icon name="arrow" size={18} /></Link>
              <Link to="/academy/teach/new" className="btn btn-outline btn-lg">Create a course</Link>
            </div>
          </div>
          <div className="card ac-hero-panel">
            <h2>Who can teach</h2>
            {['Independent trainers and practitioners', 'Universities and colleges', 'TVET institutes and training centres', 'Companies with in-house expertise'].map((x) => (
              <p key={x} className="ac-goal static"><Icon name="check" size={18} /> {x}</p>
            ))}
          </div>
        </div>
      </section>
      <div className="ac-wrap ac-sections">
        <section>
          <h2>How it works</h2>
          <ol className="steps">
            {[
              ['Plan your course', 'Choose a skill learners and employers need. We share demand data to help.'],
              ['Build it', 'Upload videos, readings, quizzes and projects with our course builder.'],
              ['Quality review', 'Every course is reviewed for accuracy, accessibility and integrity before listing.'],
              ['Publish and earn', 'Get paid monthly, with analytics on enrolments, completion and ratings.'],
            ].map(([t, d], i) => (
              <li key={t} className="step"><span className="step-num">{i + 1}</span><h3>{t}</h3><p className="muted">{d}</p></li>
            ))}
          </ol>
        </section>
        <section className="ac-split-cards">
          {[
            ['Transparent revenue share', 'See exactly how earnings are calculated for every enrolment and certificate.', 'briefcase'],
            ['Instructor tools', 'Course builder, quiz and project tools, learner Q&A, announcements and analytics.', 'grid'],
            ['ABC alignment', 'Map your course to ABC skills so learners can earn higher-trust credentials.', 'award'],
          ].map(([t, d, ic]) => (
            <div key={t} className="card ac-promo"><Icon name={ic as 'grid'} size={26} /><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </section>
        <section className="note"><Icon name="info" size={18} /><p>Quality thresholds apply: courses must keep good ratings and completion to stay listed. Instructors are identity-verified.</p></section>
      </div>
    </>
  )
}

const months = [['Jun', 2.1], ['Jul', 2.8], ['Aug', 3.4], ['Sep', 3.1], ['Oct', 4.2], ['Nov', 4.8]] as const

export function TeachDashboard() {
  const { s, deleteCustom } = useAcademy()
  const mine = courses.filter((c) => c.instructorIds.includes('i1'))
  const learners = mine.reduce((a, c) => a + c.enrolled, 0)
  const max = Math.max(...months.map((m) => m[1]))

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>Instructor dashboard</h1><p className="muted">Sample instructor view — figures are illustrative.</p></div>
        <Link to="/academy/teach/new" className="btn btn-primary"><Icon name="book" size={16} /> Create course</Link>
      </header>

      <section className="stats">
        <div className="card stat"><span className="stat-label">Total learners</span><span className="stat-value">{formatCount(learners)}</span></div>
        <div className="card stat"><span className="stat-label">Average rating</span><span className="stat-value">4.7</span></div>
        <div className="card stat"><span className="stat-label">Completion rate</span><span className="stat-value">38<small>%</small></span></div>
        <div className="card stat"><span className="stat-label">Earnings this month</span><span className="stat-value small-value">PKR 186,400</span><span className="muted small">Next payout 1 Dec</span></div>
      </section>

      <div className="app-grid">
        <section className="card">
          <h2>New enrolments (thousands)</h2>
          <div className="ac-bars" role="img" aria-label="Enrolments rising from 2.1 thousand in June to 4.8 thousand in November">
            {months.map(([m, v]) => (
              <div key={m} className="ac-bar-col"><span className="ac-bar-val">{v}</span><span className="ac-bar" style={{ height: `${(v / max) * 100}%` }} /><span className="small muted">{m}</span></div>
            ))}
          </div>
        </section>
        <section className="card">
          <h2>Learner questions</h2>
          <ul className="ac-inbox">
            {[['JavaScript Essentials', 'How do I debug a function that returns undefined?', '2h'], ['Web Development Foundations', 'Can I use Urdu text in my portfolio site?', '5h'], ['React Front-End', 'Is there a project template for week 4?', '1d']].map(([c, q, t]) => (
              <li key={q}><strong className="small">{c}</strong><span>{q}</span><span className="muted small">{t} ago · Unanswered</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card">
        <h2>My courses</h2>
        <table className="table">
          <thead><tr><th>Course</th><th>Status</th><th>Learners</th><th>Rating</th><th>Price</th><th></th></tr></thead>
          <tbody>
            {mine.map((c) => (
              <tr key={c.slug}><td><Link to={`/academy/course/${c.slug}`}>{c.title}</Link></td><td><span className="status status-completed">Published</span></td><td>{formatCount(c.enrolled)}</td><td>{c.rating}</td><td>{formatPKR(c.price)}</td><td></td></tr>
            ))}
            {s.custom.map((c) => (
              <tr key={c.slug}>
                <td>{c.status === 'Published' ? <Link to={`/academy/course/${c.slug}`}>{c.title}</Link> : c.title}</td>
                <td><span className={`status ${c.status === 'Published' ? 'status-completed' : c.status === 'In review' ? 'status-in-progress' : 'status-not-started'}`}>{c.status}</span></td>
                <td>0</td><td>—</td><td>{formatPKR(c.price)}</td>
                <td className="ac-row-actions"><Link to={`/academy/teach/edit/${c.slug}`}>Edit</Link><button className="ac-link-btn" onClick={() => deleteCustom(c.slug)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

type DraftLesson = { id: string; title: string; kind: LessonKind; minutes: number }
type DraftModule = { title: string; lessons: DraftLesson[] }
const rid = () => 'c' + Math.random().toString(36).slice(2, 9)

export function CourseBuilder() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { s, saveCustom } = useAcademy()
  const existing = s.custom.find((c) => c.slug === slug)

  const [title, setTitle] = useState(existing?.title ?? '')
  const [category, setCategory] = useState(existing?.category ?? 'it')
  const [level, setLevel] = useState<Level>(existing?.level ?? 'Beginner')
  const [languages, setLanguages] = useState<Lang[]>(existing?.languages ?? ['English'])
  const [summary, setSummary] = useState(existing?.summary ?? '')
  const [outcomes, setOutcomes] = useState(existing?.outcomes.join('\n') ?? '')
  const [skills, setSkills] = useState(existing?.skills.join(', ') ?? '')
  const [price, setPrice] = useState(existing?.price ?? 0)
  const [abc, setAbc] = useState(existing?.abc ?? false)
  const [modules, setModules] = useState<DraftModule[]>(
    existing?.modules.map((m) => ({ title: m.title, lessons: m.lessons.map((l) => ({ ...l })) })) ?? [{ title: 'Week 1: Getting started', lessons: [{ id: rid(), title: 'Welcome to the course', kind: 'video', minutes: 5 }] }],
  )
  const [msg, setMsg] = useState('')

  const updMod = (i: number, m: Partial<DraftModule>) => setModules(modules.map((x, j) => (j === i ? { ...x, ...m } : x)))
  const updLesson = (mi: number, li: number, l: Partial<DraftLesson>) => updMod(mi, { lessons: modules[mi].lessons.map((x, j) => (j === li ? { ...x, ...l } : x)) })
  const move = (i: number, d: number) => {
    const n = [...modules]
    const j = i + d
    if (j < 0 || j >= n.length) return
    ;[n[i], n[j]] = [n[j], n[i]]
    setModules(n)
  }

  const valid = title.trim().length > 3 && summary.trim().length > 10 && modules.every((m) => m.title.trim() && m.lessons.length && m.lessons.every((l) => l.title.trim()))

  function save(status: CustomCourse['status']) {
    const s2 = existing?.slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 5)
    const lessonsCount = modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.minutes, 0), 0)
    const course: CustomCourse = {
      slug: s2, title: title.trim(), type: 'Course', category, level, languages, hours: Math.max(1, Math.round(lessonsCount / 60)),
      rating: 0, reviews: 0, enrolled: 0, instructorIds: [], partnerId: 'sa', price, abc,
      skills: skills.split(',').map((x) => x.trim()).filter(Boolean), summary: summary.trim(),
      outcomes: outcomes.split('\n').map((x) => x.trim()).filter(Boolean),
      modules: modules.map((m) => ({ title: m.title, lessons: m.lessons as Lesson[] })), updated: 'Nov 2026', status, owner: 'me',
    }
    saveCustom(course)
    if (status === 'Draft') { setMsg('Draft saved.'); if (!existing) navigate(`/academy/teach/edit/${s2}`, { replace: true }) }
    else navigate('/academy/teach/dashboard')
  }

  return (
    <div className="ac-wrap ac-sections ac-builder">
      <header className="ac-row-head">
        <div><h1>{existing ? 'Edit course' : 'Create a course'}</h1><p className="muted">Build your course outline. Prototype: courses are saved in this browser only.</p></div>
        <Link to="/academy/teach/dashboard" className="btn btn-ghost">Back to dashboard</Link>
      </header>

      <section className="card ac-form">
        <h2>1. Course details</h2>
        <label>Course title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mobile Phone Repair Basics" /></label>
        <label>Short summary<textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One or two sentences learners will see first" /></label>
        <div className="ac-form-row">
          <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
          <label>Level<select value={level} onChange={(e) => setLevel(e.target.value as Level)}>{['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}</select></label>
          <label>Certificate price (PKR, 0 = free)<input type="number" min={0} step="any" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></label>
        </div>
        <fieldset className="ac-inline">
          <legend>Languages</legend>
          {(['English', 'Urdu'] as Lang[]).map((l) => (
            <label key={l}><input type="checkbox" checked={languages.includes(l)} onChange={(e) => setLanguages(e.target.checked ? [...languages, l] : languages.filter((x) => x !== l))} /> {l}</label>
          ))}
          <label><input type="checkbox" checked={abc} onChange={(e) => setAbc(e.target.checked)} /> Map to ABC skills</label>
        </fieldset>
        <label>Learning outcomes (one per line)<textarea rows={3} value={outcomes} onChange={(e) => setOutcomes(e.target.value)} /></label>
        <label>Skills (comma-separated)<input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Diagnostics, Soldering, Customer service" /></label>
      </section>

      <section className="card ac-form">
        <h2>2. Curriculum</h2>
        {modules.map((m, mi) => (
          <div key={mi} className="ac-build-mod">
            <div className="ac-build-mod-head">
              <input value={m.title} onChange={(e) => updMod(mi, { title: e.target.value })} aria-label={`Module ${mi + 1} title`} />
              <button className="ac-link-btn" onClick={() => move(mi, -1)} aria-label="Move module up">↑</button>
              <button className="ac-link-btn" onClick={() => move(mi, 1)} aria-label="Move module down">↓</button>
              <button className="ac-link-btn danger" onClick={() => setModules(modules.filter((_, j) => j !== mi))} disabled={modules.length === 1}>Remove</button>
            </div>
            {m.lessons.map((l, li) => (
              <div key={l.id} className="ac-build-lesson">
                <select value={l.kind} onChange={(e) => updLesson(mi, li, { kind: e.target.value as LessonKind })} aria-label="Item type">
                  <option value="video">Video</option><option value="reading">Reading</option><option value="quiz">Quiz</option><option value="assignment">Peer project</option>
                </select>
                <input value={l.title} onChange={(e) => updLesson(mi, li, { title: e.target.value })} placeholder="Item title" aria-label="Item title" />
                <input type="number" min={1} value={l.minutes} onChange={(e) => updLesson(mi, li, { minutes: Number(e.target.value) })} aria-label="Minutes" className="ac-min" />
                <span className="muted small">min</span>
                {l.kind === 'video' && <button className="btn btn-ghost btn-sm" type="button" onClick={() => setMsg('Video upload is not connected in the prototype.')}>Upload</button>}
                <button className="ac-link-btn danger" onClick={() => updMod(mi, { lessons: m.lessons.filter((_, j) => j !== li) })} aria-label="Remove item">✕</button>
              </div>
            ))}
            <button className="ac-link-btn" onClick={() => updMod(mi, { lessons: [...m.lessons, { id: rid(), title: '', kind: 'video', minutes: 10 }] })}>+ Add item</button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setModules([...modules, { title: `Week ${modules.length + 1}: `, lessons: [{ id: rid(), title: '', kind: 'video', minutes: 10 }] }])}>+ Add module</button>
      </section>

      {msg && <p className="toast"><Icon name="info" size={16} /> {msg}</p>}
      <div className="ac-builder-actions">
        <button className="btn btn-ghost" onClick={() => save('Draft')} disabled={!title.trim()}>Save draft</button>
        <button className="btn btn-outline" onClick={() => save('In review')} disabled={!valid}>Submit for review</button>
        <button className="btn btn-primary" onClick={() => save('Published')} disabled={!valid}>Publish now (prototype)</button>
      </div>
      {!valid && <p className="muted small">To submit, add a title, a summary and give every module and item a title.</p>}
    </div>
  )
}
