import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Icon from './Icon'
import Logo from './Logo'

const nav = [
  { to: '/skillsrator', label: 'Skillsrator' },
  { to: '/academy', label: 'Skill Academy' },
  { to: '/guidance', label: 'Career Guidance' },
  { to: '/abc', label: 'ABC Certification' },
  { to: '/pilot', label: 'Pilot Domains' },
  { to: '/partners', label: 'Partners' },
  { to: '/trust', label: 'Trust & Privacy' },
]

export default function SiteLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="site">
      <header className="site-header">
        <div className="wrap header-inner">
          <Logo />
          <nav className={`site-nav ${open ? 'open' : ''}`} aria-label="Main">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ))}
            <div className="nav-cta-mobile">
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/signup" className="btn btn-primary">Get started</Link>
            </div>
          </nav>
          <div className="header-actions">
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/signup" className="btn btn-primary">Get started</Link>
          </div>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <Logo />
            <p className="muted footer-tag">One platform for Education, Employment and Engagement. Pakistan first, global by design.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <Link to="/skillsrator">Skillsrator</Link>
            <Link to="/academy">Skill Academy</Link>
            <Link to="/lancer">Skill Lancer</Link>
            <Link to="/guidance">Career Guidance</Link>
            <Link to="/abc">ABC Certification</Link>
            <Link to="/roadmap">Roadmap</Link>
          </div>
          <div>
            <h4>Who it's for</h4>
            <Link to="/pilot">Students &amp; learners</Link>
            <Link to="/pilot">TVET learners</Link>
            <Link to="/partners">Institutions &amp; employers</Link>
            <Link to="/partners">Trainers &amp; counselors</Link>
          </div>
          <div>
            <h4>Trust</h4>
            <Link to="/trust">Trust &amp; Privacy</Link>
            <Link to="/trust">Your consent</Link>
            <Link to="/app">Preview the app</Link>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© {new Date().getFullYear()} Rahnuma Pakistan. All rights reserved.</span>
          <span>Guidance is exploratory — no guarantees of admission, employment or income.</span>
        </div>
      </footer>
    </div>
  )
}
