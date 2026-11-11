import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { assessments, nextAction, pathwayFits, plan, user, verificationLadder } from '../../data/app'

export default function Dashboard() {
  const done = assessments.filter((a) => a.status === 'completed').length
  const current = plan.milestones.find((m) => m.status === 'current')
  const doneMilestones = plan.milestones.filter((m) => m.status === 'done').length

  return (
    <>
      <header className="app-head">
        <div>
          <h1>Assalam-o-Alaikum, {user.name.split(' ')[0]}</h1>
          <p className="muted">Stage: <strong>{user.stage}</strong> · Domain: <strong>{user.domain}</strong></p>
        </div>
      </header>

      <section className="next-action card">
        <div>
          <span className="eyebrow">Your next step</span>
          <h2>{nextAction.title}</h2>
          <p className="muted"><strong>Why:</strong> {nextAction.reason}</p>
        </div>
        <Link to={nextAction.to} className="btn btn-primary">{nextAction.cta} <Icon name="arrow" size={16} /></Link>
      </section>

      <section className="stats">
        <div className="card stat">
          <span className="stat-label">Assessments</span>
          <span className="stat-value">{done}<small>/{assessments.length}</small></span>
          <span className="muted small">completed</span>
        </div>
        <div className="card stat">
          <span className="stat-label">My Plan</span>
          <span className="stat-value">{doneMilestones}<small>/{plan.milestones.length}</small></span>
          <span className="muted small">milestones done</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Identity</span>
          <span className="stat-value small-value">{verificationLadder[user.verification].level}</span>
          <span className="muted small">level {user.verification + 1} of {verificationLadder.length}</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Profile</span>
          <span className="stat-value">{user.profileComplete}<small>%</small></span>
          <div className="bar"><span style={{ width: `${user.profileComplete}%` }} /></div>
        </div>
      </section>

      <div className="app-grid">
        <section className="card">
          <div className="card-head">
            <h2>Top pathway fits</h2>
            <Link to="/app/assessments" className="link-arrow small">Results <Icon name="arrow" size={14} /></Link>
          </div>
          <ul className="fit-list">
            {pathwayFits.map((f) => (
              <li key={f.field}>
                <div className="fit-row">
                  <strong>{f.field}</strong>
                  <span className="fit-score">{f.fit}% fit</span>
                </div>
                <div className="bar"><span style={{ width: `${f.fit}%` }} /></div>
                <p className="muted small">{f.why}</p>
              </li>
            ))}
          </ul>
          <p className="muted small disclaimer">Results describe fit and possibility — they are not a diagnosis or a guarantee.</p>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>My Plan</h2>
            <Link to="/app/plan" className="link-arrow small">Open <Icon name="arrow" size={14} /></Link>
          </div>
          <p className="plan-goal">“{plan.goal}”</p>
          <div className="plan-abc">
            <span><b>A</b> {plan.planA}</span>
            <span><b>B</b> {plan.planB}</span>
            <span><b>C</b> {plan.planC}</span>
          </div>
          {current && (
            <div className="current-milestone">
              <span className="pill">Now</span>
              <strong>{current.title}</strong>
              <span className="muted small">{current.date}</span>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
