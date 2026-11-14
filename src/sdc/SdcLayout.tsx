import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Icon from '../components/Icon'
import { SdcProvider, useSdc } from './store'

function Shell() {
  const { s, setLowLiteracy } = useSdc()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])
  const easy = s.me.lowLiteracy

  return (
    <div className={`ac sd ${easy ? 'sd-easy' : ''}`}>
      <div className="demo-banner">
        <Icon name="info" size={16} />
        <span>Skill Development Center prototype — sample cohorts and people; saved only in this browser.</span>
        <Link to="/">Rahnuma home</Link>
      </div>
      <header className="ac-header">
        <div className="ac-wrap ac-header-inner">
          <Link to="/sdc" className="ac-logo" aria-label="Skill Development Center home">
            <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="var(--brand)" />
              <path d="M8 23V15m8 8V10m8 13v-5" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span>Skill Development<small>Center · by Rahnuma</small></span>
          </Link>
          <nav className={`ac-nav sd-nav ${open ? 'open' : ''}`} aria-label="Skill Development Center">
            <NavLink to="/sdc/skills">Skills</NavLink>
            <NavLink to="/sdc/learn">My learning</NavLink>
            <NavLink to="/sdc/calendar">Calendar</NavLink>
            <NavLink to="/sdc/instructor">Instructor</NavLink>
            <NavLink to="/sdc/centre">Training centre</NavLink>
            <button className={`sd-easy-toggle ${easy ? 'on' : ''}`} onClick={() => setLowLiteracy(!easy)} aria-pressed={easy}>
              <Icon name="eye" size={16} /> {easy ? 'Easy mode on' : 'Easy mode'}
            </button>
          </nav>
          <button className="ac-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="ac-footer">
        <div className="ac-wrap ac-footer-grid">
          <div>
            <strong>Skill Development Center</strong>
            <p>Guided, assessed skills training — online, hybrid or at assisted centres — with a clear path to ABC certification. Part of the Rahnuma Skillsrator ecosystem.</p>
          </div>
          <div>
            <h4>Learn</h4>
            <Link to="/sdc/skills">Skills catalogue</Link>
            <Link to="/sdc/learn">My learning</Link>
            <Link to="/sdc/assessment">Book an ABC assessment</Link>
            <Link to="/sdc/verify">Verify a certificate</Link>
          </div>
          <div>
            <h4>Teach & manage</h4>
            <Link to="/sdc/instructor">Instructor workspace</Link>
            <Link to="/sdc/centre">Training centre admin</Link>
            <Link to="/sdc/guardian">Guardian view</Link>
          </div>
          <div>
            <h4>Skillsrator</h4>
            <Link to="/academy">Skill Academy (self-paced)</Link>
            <Link to="/lancer">Skill Lancer (freelance)</Link>
            <Link to="/abc">ABC Certification</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function SdcLayout() {
  return <SdcProvider><Shell /></SdcProvider>
}
