import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { AcademyProvider, useAcademy } from './store'

function Header() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const { s } = useAcademy()
  const { pathname } = useLocation()
  const learning = Object.keys(s.enrollments).length

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  function search(e: FormEvent) {
    e.preventDefault()
    navigate(`/academy/browse?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="ac-header">
      <div className="ac-wrap ac-header-inner">
        <Link to="/academy" className="ac-logo" aria-label="Skill Academy home">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="var(--brand)" />
            <path d="M16 7 27 12.5 16 18 5 12.5zM9 15v5c2 2 4.5 3 7 3s5-1 7-3v-5" fill="none" stroke="var(--gold)" strokeWidth="2.2" strokeLinejoin="round" />
          </svg>
          <span>Skill Academy<small>by Rahnuma</small></span>
        </Link>
        <NavLink to="/academy/browse" className="ac-explore">Explore</NavLink>
        <form className="ac-search" onSubmit={search} role="search">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What do you want to learn?" aria-label="Search courses" />
        </form>
        <nav className={`ac-nav ${open ? 'open' : ''}`} aria-label="Academy">
          <NavLink to="/academy/browse" className="ac-explore-mobile">Explore</NavLink>
          <NavLink to="/academy/institutions">For Institutions</NavLink>
          <NavLink to="/academy/teach">Teach</NavLink>
          <NavLink to="/academy/my-learning">My Learning{learning > 0 && <span className="ac-count">{learning}</span>}</NavLink>
        </nav>
        <button className="ac-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </div>
    </header>
  )
}

export default function AcademyLayout() {
  return (
    <AcademyProvider>
      <div className="ac">
        <div className="demo-banner">
          <Icon name="info" size={16} />
          <span>Skill Academy prototype — sample courses; your progress is saved only in this browser.</span>
          <Link to="/">Rahnuma home</Link>
        </div>
        <Header />
        <main>
          <Outlet />
        </main>
        <footer className="ac-footer">
          <div className="ac-wrap ac-footer-grid">
            <div>
              <strong>Skill Academy</strong>
              <p>Self-paced learning at national scale — in Urdu and English, part of the Rahnuma Skillsrator ecosystem.</p>
            </div>
            <div>
              <h4>Learn</h4>
              <Link to="/academy/browse">Browse catalogue</Link>
              <Link to="/academy/browse?type=Professional+Certificate">Professional Certificates</Link>
              <Link to="/academy/browse?price=free">Free courses</Link>
              <Link to="/academy/verify">Verify a certificate</Link>
            </div>
            <div>
              <h4>Partner</h4>
              <Link to="/academy/teach">Teach on Skill Academy</Link>
              <Link to="/academy/institutions">For institutions & teams</Link>
              <Link to="/abc">ABC Certification</Link>
            </div>
            <div>
              <h4>Rahnuma</h4>
              <Link to="/">Rahnuma home</Link>
              <Link to="/skillsrator">Skillsrator</Link>
              <Link to="/trust">Trust & Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </AcademyProvider>
  )
}
