import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Modal } from '../academy/ui'
import { partners, type Partner } from '../data/partners'
import Icon from './Icon'

export function PartnerLogo({ p }: { p: Partner }) {
  const [broken, setBroken] = useState(false)
  if (p.logo && !broken) return <img src={p.logo} alt={`${p.name} logo`} className="pt-img" onError={() => setBroken(true)} />
  return (
    <span className="pt-word" style={{ ['--h' as string]: p.hue }}>
      <span className="pt-mark" aria-hidden="true">{p.short}</span>
      <span className="pt-name">{p.name}</span>
    </span>
  )
}

/** Logo grid; clicking a logo opens its collaboration details. The open partner is kept in the URL (?partner=id) so it can be shared. */
export function PartnerGrid({ list = partners }: { list?: Partner[] }) {
  const [params, setParams] = useSearchParams()
  const openId = params.get('partner')
  const open = list.find((p) => p.id === openId)
  const known = partners.some((p) => p.id === openId)
  const close = () => { const n = new URLSearchParams(params); n.delete('partner'); setParams(n, { replace: true }) }
  useEffect(() => { if (openId && !known) close() }, [openId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ul className="pt-grid">
        {list.map((p) => (
          <li key={p.id}>
            <button className="pt-tile" onClick={() => { const n = new URLSearchParams(params); n.set('partner', p.id); setParams(n, { replace: true }) }} aria-label={`${p.name} — view partnership details`}>
              <PartnerLogo p={p} />
            </button>
          </li>
        ))}
      </ul>
      {open && (
        <Modal title={open.name} onClose={close}>
          <div className="pt-detail">
            <div className="pt-detail-logo"><PartnerLogo p={open} /></div>
            <span className="pill">{open.group === 'Consortium partners' ? 'Consortium partner' : 'Official partner'}</span>
            {open.about && <p>{open.about}</p>}
            <h3>Area of collaboration</h3>
            {open.collaboration?.length ? (
              <ul className="check-list">{open.collaboration.map((c) => <li key={c}><Icon name="check" size={16} /> {c}</li>)}</ul>
            ) : <p className="muted">Details of this collaboration will be published soon.</p>}
            {open.website && (
              <a href={open.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Visit website <Icon name="arrow" size={16} /></a>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

export function PartnerStrip() {
  return (
    <section className="section pt-section">
      <div className="wrap">
        <div className="section-head pt-head">
          <span className="eyebrow">Official partners</span>
          <h2>The official partners of Rahnuma</h2>
          <p>These organisations are official partners of Rahnuma. Our partner network will keep expanding as more institutions, employers and service providers join us.</p>
        </div>
        <PartnerGrid />
        <div className="center"><Link to="/partners" className="btn btn-outline">View all partners <Icon name="arrow" size={16} /></Link></div>
      </div>
    </section>
  )
}
