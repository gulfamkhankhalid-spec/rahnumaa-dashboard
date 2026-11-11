import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { allLessons, categoryName, findInstructor, findPartner, formatCount, formatPKR, programs, sampleReviews } from '../data'
import { useAcademy } from '../store'
import { Cover, EnrollDialog, Stars } from '../ui'
import NotFound from '../../pages/site/NotFound'

const kindIcon = { video: 'eye', reading: 'book', quiz: 'clipboard', assignment: 'award' } as const

export default function CourseDetail() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { s, getCourse, enroll, toggleSaved, progress } = useAcademy()
  const [dialog, setDialog] = useState(false)
  const [openMod, setOpenMod] = useState<number | null>(0)
  const course = getCourse(slug)
  if (!course) return <NotFound />

  const enrolled = s.enrollments[course.slug]
  const lessons = allLessons(course)
  const videos = lessons.filter((l) => l.kind === 'video').length
  const quizzes = lessons.filter((l) => l.kind === 'quiz').length
  const partOf = programs.filter((p) => p.courseSlugs.includes(course.slug))
  const saved = s.saved.includes(course.slug)

  return (
    <>
      <section className="ac-detail-hero">
        <div className="ac-wrap ac-detail-grid">
          <div>
            <nav className="ac-crumbs"><Link to="/academy">Skill Academy</Link> / <Link to={`/academy/browse?cat=${course.category}`}>{categoryName(course.category)}</Link></nav>
            <span className="ac-partner">{findPartner(course.partnerId)?.name ?? 'Independent instructor'}</span>
            <h1>{course.title}</h1>
            <p className="lead">{course.summary}</p>
            <p className="ac-instructors">
              Instructor{course.instructorIds.length > 1 ? 's' : ''}:{' '}
              {course.instructorIds.map((id) => findInstructor(id)).filter(Boolean).map((i) => (
                <Link key={i!.id} to={`/academy/instructor/${i!.id}`}>{i!.name}</Link>
              ))}
            </p>
            <div className="ac-enroll-row">
              {enrolled ? (
                <Link to={`/academy/learn/${course.slug}`} className="btn btn-primary btn-lg">{progress(course) > 0 ? 'Resume learning' : 'Go to course'} <Icon name="arrow" size={18} /></Link>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => setDialog(true)}>Enrol for free<small>Starts any time</small></button>
              )}
              <button className={`btn btn-ghost btn-lg ${saved ? 'saved' : ''}`} onClick={() => toggleSaved(course.slug)} aria-pressed={saved}><Icon name="heart" size={18} /> {saved ? 'Saved' : 'Save'}</button>
            </div>
            {enrolled && <p className="muted small">Enrolled {enrolled.enrolledAt} · {enrolled.mode === 'audit' ? 'Auditing (no certificate)' : enrolled.aid ? 'Financial aid' : 'Certificate track'} · {progress(course)}% complete</p>}
            {!enrolled && <p className="muted small">{formatCount(course.enrolled)} already enrolled · Financial aid available</p>}
          </div>
          <Cover category={course.category} title={course.title} />
        </div>
      </section>

      <div className="ac-wrap">
        <div className="ac-facts card">
          <div><Stars rating={course.rating} /><span className="muted small">{formatCount(course.reviews)} reviews</span></div>
          <div><strong>{course.level} level</strong><span className="muted small">{course.level === 'Beginner' ? 'No prior experience needed' : 'Some experience recommended'}</span></div>
          <div><strong>{course.hours} hours</strong><span className="muted small">Learn at your own pace</span></div>
          <div><strong>{course.languages.join(' & ')}</strong><span className="muted small">Subtitles available</span></div>
          <div><strong>{formatPKR(course.price)}</strong><span className="muted small">{course.price ? 'For the certificate · audit free' : 'Including certificate'}</span></div>
        </div>

        <div className="ac-detail-body">
          <div className="ac-detail-main">
            <section>
              <h2>What you'll learn</h2>
              <ul className="ac-outcomes">{course.outcomes.map((o) => <li key={o}><Icon name="check" size={16} /> {o}</li>)}</ul>
            </section>

            <section>
              <h2>Skills you'll gain</h2>
              <div className="ac-chips">{course.skills.map((sk) => <Link key={sk} to={`/academy/browse?q=${encodeURIComponent(sk)}`} className="ac-chip">{sk}</Link>)}</div>
            </section>

            <section>
              <h2>Syllabus</h2>
              <p className="muted small">{course.modules.length} modules · {videos} videos · {quizzes} quizzes · {lessons.filter((l) => l.kind === 'reading').length} readings · 1 peer-graded project</p>
              <div className="ac-syllabus">
                {course.modules.map((m, i) => (
                  <div key={m.title} className="ac-mod">
                    <button className="ac-mod-head" onClick={() => setOpenMod(openMod === i ? null : i)} aria-expanded={openMod === i}>
                      <span>{m.title}</span>
                      <span className="muted small">{m.lessons.length} items · {m.lessons.reduce((a, l) => a + l.minutes, 0)} min</span>
                    </button>
                    {openMod === i && (
                      <ul>
                        {m.lessons.map((l) => (
                          <li key={l.id}><Icon name={kindIcon[l.kind]} size={15} /> {l.title} <span className="muted small">{l.minutes} min</span></li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2>Earn a shareable certificate</h2>
              <div className="ac-cert-promo card">
                <div>
                  <p>Add it to your Rahnuma profile, CV and Skill Wise skills card. Every certificate has a public verification code.</p>
                  {course.abc && <p className="ac-abc-note"><Icon name="award" size={16} /> ABC-aligned: you can book a supervised ABC assessment for a higher-trust credential.</p>}
                </div>
                <div className="ac-cert-mini" aria-hidden="true"><strong>Certificate</strong><span>{course.title}</span></div>
              </div>
            </section>

            <section>
              <h2>Instructors</h2>
              {course.instructorIds.map((id) => findInstructor(id)).filter(Boolean).map((i) => (
                <Link key={i!.id} to={`/academy/instructor/${i!.id}`} className="ac-inst card">
                  <span className="avatar lg">{i!.initials}</span>
                  <div>
                    <strong>{i!.name}</strong>
                    <span className="muted small">{i!.title} · {formatCount(i!.learners)} learners · {i!.courses} courses</span>
                    <p className="small">{i!.bio}</p>
                  </div>
                </Link>
              ))}
            </section>

            <section>
              <h2>Learner reviews</h2>
              <div className="ac-reviews">
                <div className="ac-review-sum"><span className="ac-big">{course.rating.toFixed(1)}</span><Stars rating={course.rating} /><span className="muted small">{formatCount(course.reviews)} reviews</span></div>
                {sampleReviews.map((r) => (
                  <blockquote key={r.name} className="card">
                    <Stars rating={r.rating} />
                    <p>“{r.text}”</p>
                    <footer className="muted small">{r.name} · {r.date}</footer>
                  </blockquote>
                ))}
              </div>
            </section>

            <section>
              <h2>Frequently asked questions</h2>
              {[
                ['When does the course start?', 'Any time. All courses are self-paced with suggested weekly deadlines you can reset.'],
                ['What does auditing mean?', 'You can watch videos and read materials for free. Graded quizzes, projects and the certificate need the certificate track or financial aid.'],
                ['Can I learn on my phone without good internet?', 'Yes. Lessons can be downloaded for offline study and the player has a data-saver mode.'],
                ['Is financial aid available?', 'Yes. Apply from the enrol button; approved learners get full access at no cost.'],
                ['What is the refund policy?', 'You can get a full refund within 14 days of paying, as long as you have not earned the certificate.'],
              ].map(([q, a]) => (
                <details key={q} className="ac-faq"><summary>{q}</summary><p className="muted">{a}</p></details>
              ))}
            </section>
          </div>

          <aside className="ac-detail-side">
            {partOf.map((p) => (
              <Link key={p.slug} to={`/academy/program/${p.slug}`} className="card ac-partof">
                <span className="muted small">This course is part of the</span>
                <strong>{p.title} {p.type}</strong>
                <span className="link-arrow small">View program <Icon name="arrow" size={14} /></span>
              </Link>
            ))}
            <div className="card">
              <h3>Included</h3>
              <ul className="check-list small">
                <li><Icon name="check" size={14} /> Shareable certificate</li>
                <li><Icon name="check" size={14} /> Graded quizzes with feedback</li>
                <li><Icon name="check" size={14} /> Peer-graded project</li>
                <li><Icon name="check" size={14} /> Discussion forum</li>
                <li><Icon name="check" size={14} /> Downloadable lessons</li>
                <li><Icon name="check" size={14} /> Flexible deadlines</li>
              </ul>
            </div>
            <div className="card">
              <h3>Need help choosing?</h3>
              <p className="muted small">A Rahnuma counselor can check how this course fits your plan.</p>
              <Link to="/app/counselors" className="link-arrow small">Talk to a counselor <Icon name="arrow" size={14} /></Link>
            </div>
          </aside>
        </div>
      </div>

      {dialog && (
        <EnrollDialog
          title={course.title}
          price={course.price}
          canAudit={course.price > 0}
          onClose={() => setDialog(false)}
          onDone={(mode, aid) => {
            enroll(course.slug, mode, aid)
            setDialog(false)
            navigate(`/academy/learn/${course.slug}`)
          }}
        />
      )}
    </>
  )
}
