import { useState } from 'react'
import Icon from '../../components/Icon'
import { counselors, sessions } from '../../data/app'

export default function Counselors() {
  const [booked, setBooked] = useState<string | null>(null)

  return (
    <>
      <header className="app-head">
        <div>
          <h1>Counselors &amp; Sessions</h1>
          <p className="muted">Vetted academic, career and admissions counselors. Credentials and price are always shown before you book.</p>
        </div>
      </header>

      {booked && (
        <div className="toast" role="status">
          <Icon name="check" size={18} /> Session request sent to {booked}. (Prototype — nothing was booked.)
        </div>
      )}

      <section className="counselor-grid">
        {counselors.map((c) => (
          <article key={c.id} className="card counselor">
            <div className="counselor-top">
              <span className="avatar lg">{c.initials}</span>
              <div>
                <h3>{c.name}</h3>
                <span className="verified"><Icon name="shield" size={14} /> Verified counselor</span>
              </div>
            </div>
            <p className="small"><strong>{c.specialty}</strong></p>
            <p className="muted small">{c.languages}</p>
            <div className="counselor-meta">
              <span><Icon name="star" size={14} /> {c.rating} · {c.sessions} sessions</span>
              <span><Icon name="calendar" size={14} /> {c.nextSlot}</span>
            </div>
            <button className="btn btn-primary btn-sm btn-block" onClick={() => setBooked(c.name)}>Book a session</button>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>My sessions</h2>
        <table className="table">
          <thead>
            <tr><th>Counselor</th><th>Topic</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.date}>
                <td>{s.with}</td><td>{s.topic}</td><td>{s.date}</td><td><span className="status status-completed">{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
