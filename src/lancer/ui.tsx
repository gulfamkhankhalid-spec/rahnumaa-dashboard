import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { Stars } from '../academy/ui'
import { findFreelancer, fromPrice, pkr, type Freelancer, type Gig } from './data'
import { useLancer } from './store'

export { Stars }
export { Modal } from '../academy/ui'

const hue: Record<string, number> = { design: 330, dev: 205, marketing: 20, writing: 160, video: 260, data: 185, trades: 40 }

export function GigCover({ gig, large }: { gig: Gig; large?: boolean }) {
  return (
    <div className={`lc-cover ${large ? 'large' : ''}`} style={{ ['--h' as string]: hue[gig.category] ?? 175 }} aria-hidden="true">
      <span>{gig.sub}</span>
    </div>
  )
}

export function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return <span className={`avatar ${size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : ''} ${size === 'sm' ? 'sm' : ''}`}>{initials}</span>
}

export function LevelBadge({ level }: { level: string }) {
  return <span className={`lc-level ${level === 'Top rated' ? 'top' : ''}`}>{level}</span>
}

export function TrustBadges({ f }: { f: Freelancer }) {
  return (
    <span className="lc-trust">
      {f.verified >= 2 && <span className="verified"><Icon name="shield" size={13} /> ID verified</span>}
      {f.abc.length > 0 && <span className="lc-abc"><Icon name="award" size={13} /> ABC</span>}
    </span>
  )
}

export function sellerOf(gig: Gig, me: { name: string; title: string }) {
  if (gig.sellerId === 'me') return { id: 'me', name: me.name, initials: me.name.split(' ').map((w) => w[0]).join('').slice(0, 2), level: 'Level 1', verified: 2, abc: ['Web Development (Foundation)'] } as unknown as Freelancer
  return findFreelancer(gig.sellerId)!
}

export function GigCard({ gig }: { gig: Gig }) {
  const { s, toggleSaved } = useLancer()
  const seller = sellerOf(gig, s.me)
  const saved = s.saved.includes(gig.id)
  return (
    <article className="ac-card lc-gig-card">
      <Link to={`/lancer/gig/${gig.id}`} className="ac-card-link">
        <GigCover gig={gig} />
        <div className="ac-card-body">
          <div className="lc-seller-row">
            <Avatar initials={seller.initials} size="sm" />
            <span className="small"><strong>{seller.name.replace('Sample Freelancer — ', '')}</strong></span>
            <LevelBadge level={seller.level} />
          </div>
          <h3>{gig.title}</h3>
          <Stars rating={gig.rating} count={gig.reviews} />
          <TrustBadges f={seller} />
          <p className="lc-from">From <strong>{pkr(fromPrice(gig))}</strong></p>
        </div>
      </Link>
      <button className={`ac-save ${saved ? 'on' : ''}`} onClick={() => toggleSaved(gig.id)} aria-label={saved ? 'Remove from saved' : 'Save service'} aria-pressed={saved}>
        <Icon name="heart" size={16} />
      </button>
    </article>
  )
}

export function FreelancerCard({ f }: { f: Freelancer }) {
  return (
    <Link to={`/lancer/u/${f.id}`} className="card lc-talent">
      <div className="lc-talent-top">
        <Avatar initials={f.initials} size="lg" />
        <div>
          <strong>{f.name}</strong>
          <span className="muted small">{f.title} · {f.city}</span>
          <div className="lc-talent-badges"><LevelBadge level={f.level} /><TrustBadges f={f} /></div>
        </div>
      </div>
      <div className="lc-talent-stats">
        <Stars rating={f.rating} count={f.reviews} />
        <span className="small"><strong>{pkr(f.rate)}</strong>/hr</span>
        <span className="small muted">{f.jobs} jobs · {f.onTime}% on time</span>
      </div>
      <div className="ac-chips">{f.skills.slice(0, 4).map((sk) => <span key={sk} className="ac-chip">{sk}</span>)}</div>
    </Link>
  )
}

export function StatusPill({ status }: { status: string }) {
  const tone = /Completed|Released|Hired|Active|Paid|Shortlisted/.test(status) ? 'status-completed' : /dispute|Declined|Cancelled/i.test(status) ? 'lc-danger' : /Delivered|Submitted|Funded|Revision|Viewed|Logged/.test(status) ? 'status-in-progress' : 'status-not-started'
  return <span className={`status ${tone}`}>{status}</span>
}
