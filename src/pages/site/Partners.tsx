import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { PartnerGrid } from '../../components/PartnerLogos'
import { partnerGroups, partners } from '../../data/partners'
import { partnerTypes } from '../../data/site'
import PageHero from './PageHero'

export default function Partners() {
  return (
    <>
      <PageHero eyebrow="Official partners" title="Our partners">
        These are the official partners of Rahnuma. Our partner network will keep expanding as more institutions,
        employers and service providers join us. Select a logo to see the area of collaboration.
      </PageHero>

      {partnerGroups.map((g) => {
        const list = partners.filter((p) => p.group === g.name)
        if (!list.length) return null
        return (
          <section key={g.name} className="section pt-group">
            <div className="wrap">
              <div className="section-head">
                <h2>{g.name}</h2>
                <p>{g.text}</p>
              </div>
              <PartnerGrid list={list} />
            </div>
          </section>
        )
      })}

      <section className="section section-tint">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">The partner network</span>
            <h2>Guidance is only as useful as its connections</h2>
            <p>Education advice matters when it is tied to real institutions; employment advice when it is tied to real employers and real skills demand.</p>
          </div>
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
              <p>Interested in partnering with Rahnuma as an institution, employer, trainer or service provider?</p>
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
