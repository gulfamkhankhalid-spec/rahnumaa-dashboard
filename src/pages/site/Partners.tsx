import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { partnerTypes } from '../../data/site'
import PageHero from './PageHero'

export default function Partners() {
  return (
    <>
      <PageHero eyebrow="The partner network" title="Guidance is only as useful as its connections">
        Education advice matters when it is tied to real institutions; employment advice when it is tied to real
        employers and real skills demand. Rahnuma connects people to both.
      </PageHero>
      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            {partnerTypes.map((p) => (
              <div key={p.name} className="card">
                <Icon name="users" size={22} className="accent" />
                <h3>{p.name}</h3>
                <p className="muted">{p.text}</p>
              </div>
            ))}
            <div className="card abc-card">
              <h3>Become a partner</h3>
              <p>Interested in joining the pilot as an institution, employer, trainer or counselor?</p>
              <Link to="/signup?role=partner" className="btn btn-gold">Register interest</Link>
            </div>
          </div>
          <div className="note">
            <Icon name="shield" size={18} />
            <p>Rahnuma is neutral: it is not paid commissions to push particular institutions, and partners only ever see what a person has consented to share.</p>
          </div>
        </div>
      </section>
    </>
  )
}
