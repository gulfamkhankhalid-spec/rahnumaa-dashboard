import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon, { type IconName } from '../components/Icon'
import { MagnetsProvider, useMagnets } from './store'
import { Avatar } from './ui'

function Shell() {
  const { s, unread } = useMagnets()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [q, setQ] = useState('')
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  const chats = Object.keys(s.chats).reduce((t, k) => t + (unread(k) > 0 ? 1 : 0), 0)
  const notes = s.notices.filter((n) => !n.read).length
  const tabs: { to: string; label: string; icon: IconName; badge?: number; end?: boolean }[] = [
    { to: '/magnets', label: 'Home', icon: 'home', end: true },
    { to: '/magnets/discover', label: 'Discover', icon: 'compass' },
    { to: '/magnets/new', label: 'Create', icon: 'grid' },
    { to: '/magnets/chats', label: 'Chats', icon: 'users', badge: chats },
    { to: '/magnets/notifications', label: 'Alerts', icon: 'info', badge: notes },
  ]

  function search(e: FormEvent) {
    e.preventDefault()
    navigate(`/magnets/discover?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="ac mg">
      <div className="demo-banner">
        <Icon name="info" size={16} />
        <span>Skill Magnets prototype — sample people and replies; saved only in this browser.</span>
        <Link to="/">Rahnuma home</Link>
      </div>
      <header className="ac-header">
        <div className="ac-wrap ac-header-inner">
          <Link to="/magnets" className="ac-logo" aria-label="Skill Magnets home">
            <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="var(--brand)" />
              <path d="M9 8v8a7 7 0 0 0 14 0V8h-4v8a3 3 0 0 1-6 0V8z" fill="none" stroke="var(--gold)" strokeWidth="2.4" strokeLinejoin="round" />
            </svg>
            <span>Skill Magnets<small>by Rahnuma</small></span>
          </Link>
          <form className="ac-search" onSubmit={search} role="search">
            <Icon name="search" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search magnets, people, #tags" aria-label="Search Skill Magnets" />
          </form>
          <nav className="mg-topnav" aria-label="Skill Magnets">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} className="mg-topnav-item" aria-label={t.label}>
                <Icon name={t.icon} size={20} /><span>{t.label}</span>{!!t.badge && <span className="mg-badge">{t.badge}</span>}
              </NavLink>
            ))}
            <NavLink to="/magnets/admin" className="mg-topnav-item" aria-label="Admin"><Icon name="shield" size={20} /><span>Admin</span></NavLink>
            <NavLink to="/magnets/me" className="mg-topnav-item me" aria-label="My profile"><Avatar p={s.me} size={28} /><span>Me</span></NavLink>
          </nav>
          <NavLink to="/magnets/me" className="mg-mobile-me" aria-label="My profile"><Avatar p={s.me} size={32} /></NavLink>
        </div>
      </header>
      <main className="mg-main"><Outlet /></main>
      <nav className="mg-bottom" aria-label="Skill Magnets mobile">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} aria-label={t.label}>
            <Icon name={t.icon} size={22} /><span>{t.label}</span>{!!t.badge && <span className="mg-badge">{t.badge}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function MagnetsLayout() {
  return <MagnetsProvider><Shell /></MagnetsProvider>
}
