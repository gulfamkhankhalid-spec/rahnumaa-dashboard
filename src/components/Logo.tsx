import { Link } from 'react-router-dom'

export default function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="logo" aria-label="Rahnuma home">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="var(--brand)" />
        <path d="M16 6.5 19 13l6.5 3-6.5 3-3 6.5-3-6.5L6.5 16l6.5-3z" fill="var(--gold)" />
        <circle cx="16" cy="16" r="2.2" fill="var(--brand)" />
      </svg>
      <span>Rahnuma</span>
    </Link>
  )
}
