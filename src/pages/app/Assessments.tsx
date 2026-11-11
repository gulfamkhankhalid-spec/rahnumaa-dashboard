import Icon from '../../components/Icon'
import { aptitudeResults, assessments, interestResults, pathwayFits } from '../../data/app'

const statusLabel = { completed: 'Completed', 'in-progress': 'In progress', 'not-started': 'Not started' }

function Bars({ items }: { items: { label: string; score: number }[] }) {
  return (
    <ul className="score-bars">
      {items.map((i) => (
        <li key={i.label}>
          <span className="score-label">{i.label}</span>
          <div className="bar"><span style={{ width: `${i.score}%` }} /></div>
          <span className="score-num">{i.score}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Assessments() {
  return (
    <>
      <header className="app-head">
        <div>
          <h1>Assessments &amp; Results</h1>
          <p className="muted">Structured assessments that help you understand your interests, strengths and constraints.</p>
        </div>
      </header>

      <section className="assess-grid">
        {assessments.map((a) => (
          <div key={a.id} className="card assess">
            <div className="assess-top">
              <span className={`status status-${a.status}`}>{statusLabel[a.status]}</span>
              <span className="muted small"><Icon name="calendar" size={14} /> {a.minutes} min</span>
            </div>
            <h3>{a.name}</h3>
            <p className="muted small">{a.measures}</p>
            <div className="bar"><span style={{ width: `${a.progress}%` }} /></div>
            <button className={`btn ${a.status === 'completed' ? 'btn-ghost' : 'btn-primary'} btn-sm`} type="button">
              {a.status === 'completed' ? 'View report' : a.status === 'in-progress' ? 'Continue' : 'Start'}
            </button>
          </div>
        ))}
      </section>

      <div className="app-grid">
        <section className="card">
          <h2>Career interests</h2>
          <p className="muted small">Which kinds of work you are drawn to.</p>
          <Bars items={interestResults} />
        </section>
        <section className="card">
          <h2>Aptitude</h2>
          <p className="muted small">How you reason with numbers, words and logic.</p>
          <Bars items={aptitudeResults} />
          <h2 className="mt">Pathway fit</h2>
          <ul className="fit-list">
            {pathwayFits.map((f) => (
              <li key={f.field}>
                <div className="fit-row"><strong>{f.field}</strong><span className="fit-score">{f.fit}%</span></div>
                <p className="muted small">{f.why}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="note"><Icon name="info" size={18} /> Results are exploratory, not diagnostic. Book a counselor to talk through what they mean for you.</p>
    </>
  )
}
