import { useState } from 'react'
import Icon from '../../components/Icon'
import { accessLog, consents as initial, user, verificationLadder } from '../../data/app'

export default function Record() {
  const [consents, setConsents] = useState(initial)
  const toggle = (id: string) => setConsents((cs) => cs.map((c) => (c.id === id ? { ...c, granted: !c.granted } : c)))

  return (
    <>
      <header className="app-head">
        <div>
          <h1>My Record &amp; Privacy</h1>
          <p className="muted">Your Life Record belongs to you. Decide who sees what, and see every access.</p>
        </div>
        <button className="btn btn-ghost btn-sm"><Icon name="download" size={16} /> Export my record</button>
      </header>

      <section className="card">
        <h2>Identity verification</h2>
        <ol className="ladder horizontal">
          {verificationLadder.map((l, i) => (
            <li key={l.level} className={i <= user.verification ? 'reached' : ''}>
              <span className="ladder-num">{i <= user.verification ? <Icon name="check" size={14} /> : i + 1}</span>
              <div>
                <strong>{l.level}</strong>
                <p className="muted small">{l.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>Consents</h2>
        <ul className="consent-list">
          {consents.map((c) => (
            <li key={c.id}>
              <div>
                <strong>{c.who}</strong>
                <p className="muted small">{c.what} · for {c.purpose.toLowerCase()}</p>
              </div>
              <button
                role="switch"
                aria-checked={c.granted}
                aria-label={`Share with ${c.who}`}
                className={`switch ${c.granted ? 'on' : ''}`}
                onClick={() => toggle(c.id)}
              >
                <span />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Who saw my data</h2>
        <table className="table">
          <thead><tr><th>Who</th><th>What</th><th>When</th></tr></thead>
          <tbody>
            {accessLog.map((a) => (
              <tr key={a.when}><td>{a.who}</td><td>{a.what}</td><td>{a.when}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
