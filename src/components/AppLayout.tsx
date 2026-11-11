import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { user } from '../data/app'
import Icon, { type IconName } from './Icon'
import Logo from './Logo'

const nav: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/app', label: 'Dashboard', icon: 'home', end: true },
  { to: '/app/assessments', label: 'Assessments', icon: 'clipboard' },
  { to: '/app/plan', label: 'My Plan', icon: 'route' },
  { to: '/app/explore', label: 'Explore', icon: 'compass' },
  { to: '/app/counselors', label: 'Counselors', icon: 'users' },
  { to: '/app/skillsrator', label: 'Skillsrator', icon: 'grid' },
  { to: '/app/record', label: 'My Record & Privacy', icon: 'shield' },
]

export default function AppLayout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="app">
      <div className="demo-banner">
        <Icon name="info" size={16} />
        <span>Prototype with sample data — nothing you do here is saved.</span>
        <Link to="/">Back to website</Link>
      </div>
      <div className="app-shell">
        <aside className="app-sidebar">
          <Logo to="/app" />
          <nav aria-label="App">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}>
                <Icon name={n.icon} size={19} />
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-user">
            <span className="avatar">{user.initials}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.domain} · {user.stage}</small>
            </div>
          </div>
        </aside>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
