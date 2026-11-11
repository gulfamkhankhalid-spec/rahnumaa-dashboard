import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { counselingStack, pathwayStages, sixQuestions } from '../../data/site'
import PageHero from './PageHero'

export default function Guidance() {
  return (
    <>
      <PageHero eyebrow="Career counseling and guidance" title="A pathway that runs for a lifetime">
        Rahnuma behaves like a counselor, not a directory: it asks, interprets, plans and follows up — from choosing a
        stream in Grade 8 to building something of your own.
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Six questions, answered at every stage</h2>
          </div>
          <div className="grid-3">
            {sixQuestions.map((q) => (
              <div key={q.q} className="card question">
                <h3>{q.q}</h3>
                <p className="muted">{q.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-head">
            <h2>The lifelong pathway</h2>
            <p>Enter at any stage. TVET learners can start at Choose, Study and train, or Launch with a simplified, Urdu and voice-first experience.</p>
          </div>
          <ol className="timeline">
            {pathwayStages.map((s) => (
              <li key={s.stage}>
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <div className="timeline-title">
                    <h3>{s.stage}</h3>
                    <span className="pill">{s.when}</span>
                  </div>
                  <p className="timeline-q">“{s.question}”</p>
                  <p className="muted small">You leave with: {s.output}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>How guidance is delivered</h2>
            <p>Automation where it helps, people where judgement matters.</p>
          </div>
          <div className="stack">
            {counselingStack.map((l, i) => (
              <div key={l.layer} className="stack-row">
                <span className="stack-num">{i + 1}</span>
                <div>
                  <h3>{l.layer}</h3>
                  <p className="muted">{l.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="note">
            <Icon name="info" size={18} />
            <p>Guidance is exploratory, not diagnostic. Life coaching is non-clinical; where distress or risk appears, people are routed to human support.</p>
          </div>
          <div className="center">
            <Link to="/app/plan" className="btn btn-primary">See a sample plan <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
