import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const isSignup = mode === 'signup'

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (isSignup) setSubmitted(true)
    else navigate('/app')
  }

  return (
    <section className="auth">
      <div className="auth-card card">
        {submitted ? (
          <div className="auth-done">
            <Icon name="check" size={32} className="accent" />
            <h1>You're on the list</h1>
            <p className="muted">Accounts open with the Release 1 pilot. Meanwhile, take a look at the app preview.</p>
            <Link to="/app" className="btn btn-primary">Preview the app</Link>
          </div>
        ) : (
          <>
            <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
            <p className="muted">
              {isSignup ? 'Join the pilot waitlist. You can verify your identity step by step later.' : 'Log in to continue your journey.'}
            </p>
            <form onSubmit={onSubmit} className="form">
              {isSignup && (
                <label>
                  Full name
                  <input required name="name" autoComplete="name" />
                </label>
              )}
              <label>
                Mobile number or email
                <input required name="contact" autoComplete="username" />
              </label>
              {isSignup ? (
                <label>
                  I am interested in
                  <select name="domain" defaultValue="Business & IT">
                    <option>Business &amp; IT</option>
                    <option>TVET / vocational</option>
                    <option>Partnering (institution, employer, trainer)</option>
                  </select>
                </label>
              ) : (
                <label>
                  Password
                  <input required type="password" name="password" autoComplete="current-password" />
                </label>
              )}
              <button className="btn btn-primary btn-block" type="submit">
                {isSignup ? 'Join the waitlist' : 'Log in'}
              </button>
            </form>
            <p className="note-inline">
              <Icon name="info" size={14} /> Prototype — {isSignup ? 'details are not stored yet.' : 'any details open the sample dashboard.'}
            </p>
            <p className="auth-switch">
              {isSignup ? <>Already have an account? <Link to="/login">Log in</Link></> : <>New to Rahnuma? <Link to="/signup">Create an account</Link></>}
            </p>
          </>
        )}
      </div>
    </section>
  )
}
