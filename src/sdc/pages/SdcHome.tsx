import { Link } from 'react-router-dom'
import Icon, { type IconName } from '../../components/Icon'
import { centres, families, skills } from '../data'
import { Speak } from '../ui'

const steps = [
  ['Choose a skill and level', 'Pick from hundreds of skills, each with Foundation, Practitioner and Advanced levels and clear outcomes.'],
  ['Join a cohort', 'Learn with a group and an instructor on a fixed schedule — online, hybrid with lab days, or at an assisted centre.'],
  ['Learn, practise, prove', 'Video lessons, guides, practice and quizzes, live classes, assignments and a practical logbook with video evidence.'],
  ['Get certified', 'Earn a level certificate, then book a supervised ABC assessment for a nationally trusted credential.'],
]

export default function SdcHome() {
  const intro = 'The Skill Development Center is where you learn a skill properly — with an instructor, a group, real practice and a clear path to certification.'
  return (
    <>
      <section className="ac-hero">
        <div className="ac-wrap ac-hero-grid">
          <div>
            <span className="eyebrow">Skillsrator · Skill Development Center</span>
            <h1>A skills college without degrees.</h1>
            <p className="lead">{intro}</p>
            <div className="ac-hero-actions">
              <Link to="/sdc/skills" className="btn btn-primary btn-lg">Explore skills <Icon name="arrow" size={18} /></Link>
              <Link to="/sdc/learn" className="btn btn-outline btn-lg">My learning</Link>
              <Speak text={intro} />
            </div>
            <ul className="hero-points">
              <li><Icon name="users" size={16} /> Instructor-led cohorts</li>
              <li><Icon name="clipboard" size={16} /> Practical logbook</li>
              <li><Icon name="award" size={16} /> Path to ABC certification</li>
              <li><Icon name="eye" size={16} /> Easy mode with read-aloud</li>
            </ul>
          </div>
          <div className="card ac-hero-panel">
            <h2>Three ways to learn</h2>
            {[
              ['layers', 'Online', 'Live online classes plus lessons you can download for offline study.'],
              ['grid', 'Hybrid', 'Online theory plus hands-on lab days at a partner institute.'],
              ['users', 'Assisted centre', 'Supported learning for people without a smartphone, data or confidence with reading.'],
            ].map(([ic, t, d]) => (
              <div key={t} className="lc-way static"><Icon name={ic as IconName} size={22} /><div><strong>{t}</strong><span className="muted small">{d}</span></div></div>
            ))}
          </div>
        </div>
      </section>

      <div className="ac-wrap ac-sections">
        <section>
          <h2>How it works</h2>
          <ol className="steps">{steps.map(([t, d], i) => <li key={t} className="step"><span className="step-num">{i + 1}</span><h3>{t}</h3><p className="muted">{d}</p></li>)}</ol>
        </section>

        <section>
          <div className="ac-row-head"><h2>Skill families</h2><Link to="/sdc/skills">All skills <Icon name="arrow" size={14} /></Link></div>
          <div className="sd-families">
            {families.map((f) => {
              const list = skills.filter((s) => s.family === f.slug)
              return (
                <Link key={f.slug} to={`/sdc/skills?family=${f.slug}`} className="card sd-family">
                  <Icon name={f.icon as IconName} size={26} />
                  <h3>{f.name}</h3>
                  <p className="muted small">{list.map((s) => s.name).join(' · ')}</p>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="sd-compare card">
          <div>
            <h2>Skill Development Center or Skill Academy?</h2>
            <p className="muted">Both run on the same learning engine. Choose the one that fits how you learn.</p>
          </div>
          <table className="table">
            <thead><tr><th></th><th>Skill Development Center</th><th>Skill Academy</th></tr></thead>
            <tbody>
              <tr><td>Style</td><td>Guided cohort with an instructor</td><td>Self-paced, start any time</td></tr>
              <tr><td>Practice</td><td>Live classes, labs and a practical logbook</td><td>Videos, quizzes and projects</td></tr>
              <tr><td>Assessment</td><td>Instructor-graded, attendance and evidence</td><td>Auto-graded and peer-graded</td></tr>
              <tr><td>Outcome</td><td>Level certificate and a path to ABC certification</td><td>Course certificate</td></tr>
            </tbody>
          </table>
          <Link to="/academy" className="link-arrow">Go to Skill Academy <Icon name="arrow" size={14} /></Link>
        </section>

        <section>
          <h2>Partner training centres</h2>
          <div className="sd-centres">
            {centres.map((c) => <div key={c.id} className="card"><strong>{c.name}</strong><span className="muted small">{c.labs.join(' · ')}</span></div>)}
          </div>
        </section>
      </div>
    </>
  )
}
