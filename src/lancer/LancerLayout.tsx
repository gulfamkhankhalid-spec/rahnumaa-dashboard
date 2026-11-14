import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { pkr } from './data'
import { LancerProvider, useLancer } from './store'

function Header() {
  const { s, setMode } = useLancer()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const selling = s.mode === 'selling'
  const unread = s.threads.filter((t) => t.messages.length && t.messages[t.messages.length - 1].from === 'them').length

  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  function search(e: FormEvent) {
    e.preventDefault()
    navigate(selling ? `/lancer/projects?q=${encodeURIComponent(q)}` : `/lancer/gigs?q=${encodeURIComponent(q)}`)
  }
  function switchMode() {
    setMode(selling ? 'buying' : 'selling')
    navigate(selling ? '/lancer/client' : '/lancer/seller')
  }

  return (
    <header className="ac-header">
      <div className="ac-wrap ac-header-inner">
        <Link to="/lancer" className="ac-logo" aria-label="Skill Lancer home">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="var(--brand)" />
            <path d="M9 21.5 14 16l-5-5.5M16 22h7" fill="none" stroke="var(--gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Skill Lancer<small>by Rahnuma</small></span>
        </Link>
        <form className="ac-search" onSubmit={search} role="search">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={selling ? 'Search projects to work on' : 'What service are you looking for?'} aria-label="Search" />
        </form>
        <nav className={`ac-nav ${open ? 'open' : ''}`} aria-label="Skill Lancer">
          {selling ? (
            <>
              <NavLink to="/lancer/projects">Find work</NavLink>
              <NavLink to="/lancer/seller" end>Seller dashboard</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/lancer/gigs">Browse services</NavLink>
              <NavLink to="/lancer/talent">Find talent</NavLink>
              <NavLink to="/lancer/client" end>My hiring</NavLink>
            </>
          )}
          <NavLink to="/lancer/messages">Messages{unread > 0 && <span className="ac-count">{unread}</span>}</NavLink>
          <NavLink to="/lancer/wallet" className="lc-wallet-link">{pkr(s.wallet.balance)}</NavLink>
          <button className="lc-switch" onClick={switchMode}>Switch to {selling ? 'buying' : 'selling'}</button>
        </nav>
        <button className="ac-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </div>
    </header>
  )
}

export default function LancerLayout() {
  return (
    <LancerProvider>
      <div className="ac lc">
        <div className="demo-banner">
          <Icon name="info" size={16} />
          <span>Skill Lancer prototype — sample people and money; nothing is real or sent. Saved only in this browser.</span>
          <Link to="/">Rahnuma home</Link>
        </div>
        <Header />
        <main><Outlet /></main>
        <footer className="ac-footer">
          <div className="ac-wrap ac-footer-grid">
            <div>
              <strong>Skill Lancer</strong>
              <p>Freelance services and projects with verified identity, ABC-backed skills, escrow protection and PKR payouts — part of the Rahnuma Skillsrator ecosystem.</p>
            </div>
            <div>
              <h4>Hire</h4>
              <Link to="/lancer/gigs">Browse services</Link>
              <Link to="/lancer/post">Post a project</Link>
              <Link to="/lancer/talent">Find talent</Link>
            </div>
            <div>
              <h4>Work</h4>
              <Link to="/lancer/projects">Find work</Link>
              <Link to="/lancer/seller/gig/new">Create a gig</Link>
              <Link to="/academy/course/freelancing-launchpad">Freelancing Launchpad course</Link>
              <Link to="/magnets/m/freelance">Freelancing community</Link>
            </div>
            <div>
              <h4>Trust</h4>
              <Link to="/lancer/how-it-works">How escrow works</Link>
              <Link to="/trust">Trust &amp; Privacy</Link>
              <Link to="/abc">ABC Certification</Link>
            </div>
          </div>
        </footer>
      </div>
    </LancerProvider>
  )
}
