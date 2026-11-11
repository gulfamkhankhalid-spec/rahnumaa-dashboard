import Icon from '../../components/Icon'
import { plan } from '../../data/app'

const statusText = { done: 'Done', current: 'Now', upcoming: 'Upcoming' }

export default function Plan() {
  return (
    <>
      <header className="app-head">
        <div>
          <h1>My Plan</h1>
          <p className="muted">Your living pathway — reviewed and updated with your counselor as life changes.</p>
        </div>
      </header>

      <div className="app-grid wide-left">
        <section className="card">
          <h2>Milestones</h2>
          <ol className="plan-timeline">
            {plan.milestones.map((m) => (
              <li key={m.title} className={`pm pm-${m.status}`}>
                <span className="pm-dot">{m.status === 'done' && <Icon name="check" size={14} />}</span>
                <div className="pm-body">
                  <div className="pm-title">
                    <strong>{m.title}</strong>
                    <span className={`status status-${m.status}`}>{statusText[m.status]}</span>
                  </div>
                  <span className="muted small">{m.date}</span>
                  {m.door && <span className="door-chip"><Icon name="grid" size={12} /> {m.door}</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="stack-col">
          <section className="card">
            <h2>My goal</h2>
            <p className="plan-goal">“{plan.goal}”</p>
          </section>
          <section className="card">
            <h2>Plan A, B and C</h2>
            <div className="plan-abc vertical">
              <span><b>A</b> {plan.planA}</span>
              <span><b>B</b> {plan.planB}</span>
              <span><b>C</b> {plan.planC}</span>
            </div>
          </section>
          <section className="card">
            <h2>Feasibility</h2>
            <ul className="check-list">
              {plan.feasibility.map((f) => <li key={f}><Icon name="info" size={16} /> {f}</li>)}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
