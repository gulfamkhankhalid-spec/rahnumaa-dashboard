import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { programs } from '../data'
import { useAcademy } from '../store'
import { Cover, CourseCard, Empty } from '../ui'

const tabs = [['progress', 'In progress'], ['completed', 'Completed'], ['programs', 'Programs'], ['saved', 'Saved'], ['certificates', 'Certificates']] as const

export default function MyLearning() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') ?? 'progress'
  const { s, getCourse, progress, unenroll } = useAcademy()
  const enrolled = Object.entries(s.enrollments).map(([slug, e]) => ({ course: getCourse(slug), e })).filter((x) => x.course)
  const inProgress = enrolled.filter((x) => !s.certificates.some((c) => c.slug === x.course!.slug))
  const completed = enrolled.filter((x) => s.certificates.some((c) => c.slug === x.course!.slug))
  const totalLessons = Object.keys(s.completed).length

  return (
    <div className="ac-wrap ac-my">
      <header className="ac-my-head">
        <div>
          <h1>My Learning</h1>
          <p className="muted">Learner: <strong>{s.name}</strong></p>
        </div>
        <div className="ac-my-stats">
          <div><strong>{enrolled.length}</strong><span>courses</span></div>
          <div><strong>{totalLessons}</strong><span>items completed</span></div>
          <div><strong>{s.certificates.length}</strong><span>certificates</span></div>
        </div>
      </header>

      <div className="tabs ac-my-tabs" role="tablist">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setParams({ tab: k })}>{l}</button>)}
      </div>

      {tab === 'progress' && (inProgress.length ? (
        <div className="ac-my-list">
          {inProgress.map(({ course, e }) => course && (
            <article key={course.slug} className="card ac-my-item">
              <Cover category={course.category} title={course.title} small />
              <div className="ac-my-info">
                <Link to={`/academy/course/${course.slug}`}><strong>{course.title}</strong></Link>
                <span className="muted small">{e.mode === 'audit' ? 'Auditing' : e.aid ? 'Financial aid' : 'Certificate track'} · Enrolled {e.enrolledAt}</span>
                <div className="bar"><span style={{ width: `${progress(course)}%` }} /></div>
                <span className="small">{progress(course)}% complete</span>
              </div>
              <div className="ac-my-actions">
                <Link to={`/academy/learn/${course.slug}`} className="btn btn-primary btn-sm">{progress(course) ? 'Resume' : 'Start'}</Link>
                <button className="ac-link-btn small" onClick={() => unenroll(course.slug)}>Unenrol</button>
              </div>
            </article>
          ))}
        </div>
      ) : <Empty title="Nothing in progress" text="Enrol in a course to start learning." cta={<Link to="/academy/browse" className="btn btn-primary">Browse courses</Link>} />)}

      {tab === 'completed' && (completed.length ? (
        <div className="ac-my-list">
          {completed.map(({ course }) => course && (
            <article key={course.slug} className="card ac-my-item">
              <Cover category={course.category} title={course.title} small />
              <div className="ac-my-info"><strong>{course.title}</strong><span className="muted small">Completed</span></div>
              <Link to={`/academy/certificate/${s.certificates.find((c) => c.slug === course.slug)!.code}`} className="btn btn-gold btn-sm"><Icon name="award" size={14} /> Certificate</Link>
            </article>
          ))}
        </div>
      ) : <Empty title="No completed courses yet" text="Finish all lessons and pass the graded items to earn a certificate." />)}

      {tab === 'programs' && (s.programs.length ? (
        <div className="ac-my-list">
          {s.programs.map((slug) => programs.find((p) => p.slug === slug)).filter(Boolean).map((p) => {
            const list = p!.courseSlugs.map(getCourse).filter((c) => !!c)
            const pct = Math.round(list.reduce((a, c) => a + progress(c), 0) / list.length)
            return (
              <article key={p!.slug} className="card ac-my-item">
                <Cover category={p!.category} title={p!.title} small />
                <div className="ac-my-info">
                  <Link to={`/academy/program/${p!.slug}`}><strong>{p!.title} {p!.type}</strong></Link>
                  <span className="muted small">{list.length} courses</span>
                  <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                  <span className="small">{pct}% complete</span>
                </div>
                <Link to={`/academy/program/${p!.slug}`} className="btn btn-primary btn-sm">Open</Link>
              </article>
            )
          })}
        </div>
      ) : <Empty title="No programs yet" text="Professional Certificates and Specializations group courses towards a career goal." cta={<Link to="/academy/browse?kind=programs" className="btn btn-primary">Explore programs</Link>} />)}

      {tab === 'saved' && (s.saved.length ? (
        <div className="ac-grid">{s.saved.map(getCourse).filter((c) => !!c).map((c) => <CourseCard key={c.slug} course={c} />)}</div>
      ) : <Empty title="No saved courses" text="Tap the heart on any course to save it for later." />)}

      {tab === 'certificates' && (s.certificates.length ? (
        <div className="ac-grid three">
          {s.certificates.map((c) => (
            <Link key={c.code} to={`/academy/certificate/${c.code}`} className="card ac-cert-card">
              <Icon name="award" size={26} />
              <strong>{c.title}</strong>
              <span className="muted small">{c.kind} certificate · {c.date}</span>
              <span className="small">ID {c.code}</span>
            </Link>
          ))}
        </div>
      ) : <Empty title="No certificates yet" text="Your certificates will appear here, ready to share." />)}
    </div>
  )
}
