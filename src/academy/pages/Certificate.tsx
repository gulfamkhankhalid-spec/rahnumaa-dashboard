import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { useAcademy } from '../store'
import { Empty } from '../ui'

export function Verify() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  function go(e: FormEvent) {
    e.preventDefault()
    if (code.trim()) navigate(`/academy/certificate/${code.trim().toUpperCase()}`)
  }
  return (
    <div className="ac-wrap ac-verify">
      <div className="card">
        <Icon name="shield" size={28} className="accent" />
        <h1>Verify a certificate</h1>
        <p className="muted">Employers and institutions can confirm a Skill Academy certificate with its ID.</p>
        <form onSubmit={go} className="ac-verify-form">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SA-AB12-CD34" aria-label="Certificate ID" />
          <button className="btn btn-primary" type="submit">Verify</button>
        </form>
        <p className="muted small">Prototype: certificates are stored in the learner's browser, so verification only works on the device that earned them.</p>
      </div>
    </div>
  )
}

export default function Certificate() {
  const { code = '' } = useParams()
  const { s } = useAcademy()
  const [copied, setCopied] = useState(false)
  const cert = s.certificates.find((c) => c.code === code)

  if (!cert) {
    return (
      <div className="ac-wrap ac-verify">
        <Empty title="Certificate not found" text={`No certificate with ID ${code} was found.`} cta={<Link to="/academy/verify" className="btn btn-outline">Try another ID</Link>} />
      </div>
    )
  }

  const url = `${window.location.origin}/academy/certificate/${cert.code}`

  return (
    <div className="ac-wrap ac-cert-page">
      <div className="ac-cert-verified"><Icon name="shield" size={18} /> Verified certificate · issued {cert.date}</div>
      <div className="ac-certificate" id="certificate">
        <div className="ac-cert-top">
          <span className="ac-cert-brand">Skill Academy · Rahnuma</span>
          <span className="small">{cert.kind === 'Program' ? 'Program certificate' : 'Course certificate'}</span>
        </div>
        <p className="ac-cert-label">This certifies that</p>
        <h1 className="ac-cert-name">{cert.name}</h1>
        <p className="ac-cert-label">has successfully completed</p>
        <h2 className="ac-cert-course">{cert.title}</h2>
        <p className="ac-cert-small">an online, non-credit {cert.kind.toLowerCase()} offered through Skill Academy, part of the Rahnuma Skillsrator ecosystem.</p>
        <div className="ac-cert-foot">
          <div><span className="ac-sign">Skill Academy</span><small>Academic Director (sample)</small></div>
          <div className="ac-seal" aria-hidden="true"><Icon name="award" size={34} /></div>
          <div><span>{cert.date}</span><small>Verify at rahnumaa.com/academy/verify · ID {cert.code}</small></div>
        </div>
      </div>
      <div className="ac-cert-actions">
        <button className="btn btn-primary" onClick={() => window.print()}><Icon name="download" size={16} /> Download / print PDF</button>
        <button className="btn btn-ghost" onClick={() => { navigator.clipboard?.writeText(url).then(() => setCopied(true)).catch(() => setCopied(false)) }}>{copied ? 'Link copied' : 'Copy share link'}</button>
        <Link to="/app/record" className="btn btn-ghost">Add to my Life Record</Link>
      </div>
    </div>
  )
}
