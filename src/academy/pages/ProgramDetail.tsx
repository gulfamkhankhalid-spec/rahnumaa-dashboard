import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { findPartner, formatPKR, programs } from '../data'
import { useAcademy } from '../store'
import { CourseCard, Cover, EnrollDialog } from '../ui'
import NotFound from '../../pages/site/NotFound'

export default function ProgramDetail() {
  const { slug = '' } = useParams()
  const { s, getCourse, enrollProgram, progress, issueCertificate } = useAcademy()
  const [dialog, setDialog] = useState(false)
  const program = programs.find((p) => p.slug === slug)
  if (!program) return <NotFound />

  const courseList = program.courseSlugs.map(getCourse).filter((c) => !!c)
  const enrolled = s.programs.includes(program.slug)
  const allDone = courseList.every((c) => s.certificates.some((x) => x.slug === c.slug))
  const programCert = s.certificates.find((c) => c.slug === program.slug)
  const hours = courseList.reduce((a, c) => a + c.hours, 0)
  const skills = [...new Set(courseList.flatMap((c) => c.skills))]

  return (
    <>
      <section className="ac-detail-hero">
        <div className="ac-wrap ac-detail-grid">
          <div>
            <nav className="ac-crumbs"><Link to="/academy">Skill Academy</Link> / <Link to="/academy/browse?kind=programs">Programs</Link></nav>
            <span className={`ac-type ${program.type === 'Professional Certificate' ? 'pro' : ''}`}>{program.type}</span>
            <h1>{program.title}</h1>
            <p className="lead">{program.summary}</p>
            <p className="muted">Offered by {findPartner(program.partnerId)?.name}</p>
            <div className="ac-enroll-row">
              {enrolled ? (
                <Link to="/academy/my-learning?tab=programs" className="btn btn-primary btn-lg">Go to My Learning <Icon name="arrow" size={18} /></Link>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => setDialog(true)}>Enrol in program<small>{formatPKR(program.price)} / month · cancel any time</small></button>
              )}
            </div>
            {enrolled && allDone && !programCert && (
              <button className="btn btn-gold" onClick={() => issueCertificate(program.slug, `${program.title} ${program.type}`, 'Program')}>
                <Icon name="award" size={16} /> Claim your {program.type}
              </button>
            )}
            {programCert && <Link className="btn btn-gold" to={`/academy/certificate/${programCert.code}`}><Icon name="award" size={16} /> View program certificate</Link>}
          </div>
          <Cover category={program.category} title={program.title} />
        </div>
      </section>

      <div className="ac-wrap">
        <div className="ac-facts card">
          <div><strong>{courseList.length}-course series</strong><span className="muted small">Earn a certificate for each course</span></div>
          <div><strong>{program.level} level</strong><span className="muted small">No degree required</span></div>
          <div><strong>{program.months} months</strong><span className="muted small">At about {Math.round(hours / (program.months * 4))} hours a week</span></div>
          <div><strong>Flexible schedule</strong><span className="muted small">Learn at your own pace</span></div>
        </div>

        <div className="ac-detail-body">
          <div className="ac-detail-main">
            {program.career && (
              <section>
                <h2>Prepare for a career</h2>
                <p>{program.career}</p>
                <p className="muted small">Graduates can share their certificate directly to their Skill Wise skills card and get matched to openings — only if they choose to.</p>
              </section>
            )}
            <section>
              <h2>Skills you'll gain</h2>
              <div className="ac-chips">{skills.map((sk) => <span key={sk} className="ac-chip">{sk}</span>)}</div>
            </section>
            <section>
              <h2>Courses in this program</h2>
              <ol className="ac-series">
                {courseList.map((c, i) => (
                  <li key={c.slug} className="card">
                    <span className="ac-series-num">Course {i + 1}</span>
                    <div>
                      <Link to={`/academy/course/${c.slug}`}><strong>{c.title}</strong></Link>
                      <p className="muted small">{c.summary}</p>
                      <p className="muted small">{c.hours} hours · {c.level}</p>
                      {enrolled && (
                        <div className="ac-series-prog">
                          <div className="bar"><span style={{ width: `${progress(c)}%` }} /></div>
                          <span className="small">{s.certificates.some((x) => x.slug === c.slug) ? 'Certificate earned' : `${progress(c)}%`}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <h2>Applied learning project</h2>
              <p className="muted">Each course ends with a hands-on, peer-graded project. Together they form a portfolio you can show employers and clients.</p>
            </section>
          </div>
          <aside className="ac-detail-side">
            <div className="card">
              <h3>How it works</h3>
              <ul className="check-list small">
                <li><Icon name="check" size={14} /> One monthly fee covers every course</li>
                <li><Icon name="check" size={14} /> Finish faster, pay less</li>
                <li><Icon name="check" size={14} /> Financial aid available</li>
                <li><Icon name="check" size={14} /> A program certificate when all courses are complete</li>
              </ul>
            </div>
          </aside>
        </div>

        <section className="ac-sections">
          <h2>Start with the first course</h2>
          <div className="ac-grid">{courseList.slice(0, 4).map((c) => <CourseCard key={c.slug} course={c} />)}</div>
        </section>
      </div>

      {dialog && (
        <EnrollDialog
          title={`${program.title} ${program.type}`}
          price={program.price}
          priceNote=" / month"
          canAudit={false}
          onClose={() => setDialog(false)}
          onDone={(_, aid) => {
            enrollProgram(program.slug, program.courseSlugs, aid)
            setDialog(false)
          }}
        />
      )}
    </>
  )
}
