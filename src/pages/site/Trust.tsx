import Icon from '../../components/Icon'
import { verificationLadder } from '../../data/app'
import PageHero from './PageHero'

const is = [
  'A guidance, verification and connection platform',
  'A personalised counselor at scale, with human experts on top',
  'A holder of consented, verified Life Records',
  'A neutral layer that makes institutions comparable',
]
const isNot = [
  'An admissions broker paid to push particular universities',
  'A seller of user data or a profiling tool for employers',
  'A replacement for institutions, regulators or professional advice',
  'A promise of admission, a job or an income',
]

const consent = [
  { icon: 'lock' as const, title: 'Granular and revocable', text: 'Choose exactly who sees what, for what purpose — and withdraw it at any time.' },
  { icon: 'eye' as const, title: '“Who saw my data”', text: 'Every access to your record is logged and visible to you.' },
  { icon: 'download' as const, title: 'Export or delete', text: 'Download your Life Record, or ask for it to be deleted.' },
  { icon: 'users' as const, title: 'Protection for minors', text: 'Guardian consent for under-18s, with a deliberately limited guardian view.' },
]

export default function Trust() {
  return (
    <>
      <PageHero eyebrow="Trust & Privacy" title="Your life, your record, your choice">
        Rahnuma is built on one verified identity and a Life Record that you control. Nothing is shared with an
        employer, institution or partner without your permission.
      </PageHero>

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Verified identity</span>
            <h2>A verification ladder, not a wall</h2>
            <p className="muted">
              Adults verify with a CNIC and minors with a B-Form. You can start exploring straight away and verify step by
              step as you need to — each step explains why it is needed and how your data is used.
            </p>
          </div>
          <ol className="ladder">
            {verificationLadder.map((l, i) => (
              <li key={l.level}>
                <span className="ladder-num">{i + 1}</span>
                <div>
                  <strong>{l.level}</strong>
                  <p className="muted small">{l.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Consent</span>
            <h2>You decide who sees what</h2>
          </div>
          <div className="grid-4">
            {consent.map((c) => (
              <div key={c.title} className="card">
                <Icon name={c.icon} size={22} className="accent" />
                <h3>{c.title}</h3>
                <p className="muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2">
          <div className="card">
            <h3 className="is-head">Rahnuma is…</h3>
            <ul className="check-list">
              {is.map((x) => <li key={x}><Icon name="check" size={16} /> {x}</li>)}
            </ul>
          </div>
          <div className="card">
            <h3 className="isnot-head">Rahnuma is not…</h3>
            <ul className="check-list cross">
              {isNot.map((x) => <li key={x}><Icon name="close" size={16} /> {x}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
