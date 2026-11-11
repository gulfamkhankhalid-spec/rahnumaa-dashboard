import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { categoryName, findPartner, formatCount, formatPKR, type Course, type Program } from './data'
import { useAcademy } from './store'

export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="ac-stars" aria-label={`Rated ${rating} out of 5`}>
      <strong>{rating.toFixed(1)}</strong>
      <span className="ac-star-row" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24">
            <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill={i <= Math.round(rating) ? 'var(--gold)' : 'var(--border)'} />
          </svg>
        ))}
      </span>
      {count !== undefined && <span className="muted">({formatCount(count)})</span>}
    </span>
  )
}

const coverHue: Record<string, number> = { it: 205, data: 260, business: 160, marketing: 20, freelance: 330, tvet: 40, foundation: 175 }

export function Cover({ category, title, small }: { category: string; title: string; small?: boolean }) {
  const h = coverHue[category] ?? 175
  return (
    <div className={`ac-cover ${small ? 'small' : ''}`} style={{ ['--h' as string]: h }} aria-hidden="true">
      <span>{title.split(/[\s:&-]+/).filter((w) => /^[A-Z]/.test(w) && !['and', 'for', 'with', 'the'].includes(w.toLowerCase())).slice(0, 2).map((w) => w[0]).join('')}</span>
    </div>
  )
}

export function CourseCard({ course }: { course: Course }) {
  const { s, toggleSaved } = useAcademy()
  const saved = s.saved.includes(course.slug)
  return (
    <article className="ac-card">
      <Link to={`/academy/course/${course.slug}`} className="ac-card-link">
        <Cover category={course.category} title={course.title} />
        <div className="ac-card-body">
          <span className="ac-partner">{findPartner(course.partnerId)?.name ?? 'Independent instructor'}</span>
          <h3>{course.title}</h3>
          <p className="muted small">Skills: {course.skills.slice(0, 3).join(', ')}</p>
          <Stars rating={course.rating} count={course.reviews} />
          <p className="ac-meta">{course.level} · {course.type} · {course.hours} hrs</p>
          <div className="ac-badges">
            {course.price === 0 && <span className="ac-badge free">Free certificate</span>}
            {course.abc && <span className="ac-badge abc">ABC-aligned</span>}
            {course.languages.includes('Urdu') && <span className="ac-badge">اردو</span>}
          </div>
        </div>
      </Link>
      <button className={`ac-save ${saved ? 'on' : ''}`} onClick={() => toggleSaved(course.slug)} aria-label={saved ? 'Remove from saved' : 'Save course'} aria-pressed={saved}>
        <Icon name="heart" size={16} />
      </button>
    </article>
  )
}

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Link to={`/academy/program/${program.slug}`} className="ac-card ac-card-link ac-program-card">
      <Cover category={program.category} title={program.title} />
      <div className="ac-card-body">
        <span className="ac-partner">{findPartner(program.partnerId)?.name}</span>
        <h3>{program.title}</h3>
        <p className="muted small">{program.summary}</p>
        <p className="ac-meta">{program.type} · {program.courseSlugs.length} courses · {program.months} months</p>
        <span className={`ac-type ${program.type === 'Professional Certificate' ? 'pro' : ''}`}>{program.type}</span>
      </div>
    </Link>
  )
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="ac-modal-bg" onClick={onClose} role="presentation">
      <div className="ac-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="ac-modal-head">
          <h2>{title}</h2>
          <button className="ac-x" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

/** Enrolment dialog: audit, pay for a certificate, or apply for financial aid. */
export function EnrollDialog({ title, price, priceNote, canAudit, onDone, onClose }: {
  title: string
  price: number
  priceNote?: string
  canAudit: boolean
  onDone: (mode: 'audit' | 'certificate', aid: boolean) => void
  onClose: () => void
}) {
  const [step, setStep] = useState<'choose' | 'pay' | 'aid' | 'aid-done'>(price === 0 ? 'pay' : 'choose')
  const [method, setMethod] = useState('wallet')

  function pay(e: FormEvent) {
    e.preventDefault()
    onDone('certificate', false)
  }
  function aid(e: FormEvent) {
    e.preventDefault()
    setStep('aid-done')
  }

  return (
    <Modal title={`Enrol: ${title}`} onClose={onClose}>
      {step === 'choose' && (
        <div className="ac-options">
          <button className="ac-option" onClick={() => setStep('pay')}>
            <strong>Earn a certificate — {formatPKR(price)}{priceNote}</strong>
            <span>Full access to graded quizzes and projects, plus a shareable certificate with a verification code.</span>
          </button>
          {canAudit && (
            <button className="ac-option" onClick={() => onDone('audit', false)}>
              <strong>Audit for free</strong>
              <span>Watch videos and read materials. Graded items and the certificate are not included.</span>
            </button>
          )}
          <button className="ac-option" onClick={() => setStep('aid')}>
            <strong>Apply for financial aid</strong>
            <span>Can’t afford the fee? Tell us about your situation for full access at no cost.</span>
          </button>
        </div>
      )}
      {step === 'pay' && (
        <form onSubmit={pay} className="ac-form">
          {price === 0 ? (
            <p>This course is free, including the certificate.</p>
          ) : (
            <>
              <p className="ac-total">Total: <strong>{formatPKR(price)}{priceNote}</strong></p>
              <fieldset className="ac-methods">
                <legend>Payment method</legend>
                {[['wallet', 'Mobile wallet'], ['card', 'Debit / credit card'], ['bank', 'Bank transfer']].map(([v, l]) => (
                  <label key={v} className={method === v ? 'on' : ''}>
                    <input type="radio" name="method" value={v} checked={method === v} onChange={() => setMethod(v)} /> {l}
                  </label>
                ))}
              </fieldset>
              <p className="muted small">Refunds within 14 days if you have not earned the certificate. Prototype — no payment is taken.</p>
            </>
          )}
          <button className="btn btn-primary btn-block" type="submit">{price === 0 ? 'Enrol for free' : 'Confirm and enrol'}</button>
        </form>
      )}
      {step === 'aid' && (
        <form onSubmit={aid} className="ac-form">
          <label>Your current situation
            <select required defaultValue="">
              <option value="" disabled>Choose one</option>
              <option>Student</option>
              <option>Unemployed / looking for work</option>
              <option>Employed, low income</option>
              <option>Other</option>
            </select>
          </label>
          <label>Monthly household income (PKR)
            <input required type="number" min={0} inputMode="numeric" />
          </label>
          <label>Why do you want to take this course? (150 words or more is best)
            <textarea required rows={4} />
          </label>
          <label>How will it help your goals?
            <textarea required rows={3} />
          </label>
          <button className="btn btn-primary btn-block" type="submit">Submit application</button>
        </form>
      )}
      {step === 'aid-done' && (
        <div className="ac-form">
          <p><Icon name="check" size={18} className="accent" /> Application received. Applications are normally reviewed within 15 days.</p>
          <p className="muted small">Prototype: we’ll approve it straight away so you can try the full experience.</p>
          <button className="btn btn-primary btn-block" onClick={() => onDone('certificate', true)}>Continue with financial aid</button>
        </div>
      )}
    </Modal>
  )
}

export function Empty({ title, text, cta }: { title: string; text: string; cta?: ReactNode }) {
  return (
    <div className="ac-empty">
      <Icon name="book" size={28} />
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {cta}
    </div>
  )
}

export { categoryName }
