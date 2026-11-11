import { Link } from 'react-router-dom'
import Icon, { type IconName } from '../../components/Icon'
import { categories, partners, programs } from '../data'
import { useAcademy } from '../store'
import { CourseCard, ProgramCard } from '../ui'

export default function AcademyHome() {
  const { s, allCourses, getCourse, progress } = useAcademy()
  const inProgress = Object.keys(s.enrollments).map(getCourse).filter((c) => c && progress(c) < 100).slice(0, 3)
  const popular = [...allCourses].sort((a, b) => b.enrolled - a.enrolled).slice(0, 8)
  const free = allCourses.filter((c) => c.price === 0).slice(0, 4)
  const trades = allCourses.filter((c) => c.category === 'tvet')

  return (
    <>
      <section className="ac-hero">
        <div className="ac-wrap ac-hero-grid">
          <div>
            <span className="eyebrow">Skillsrator · Skill Academy</span>
            <h1>Learn job-ready skills, in Urdu and English.</h1>
            <p className="lead">Self-paced courses, Professional Certificates and guided projects from universities, institutes, industry experts and trainers — priced for Pakistan, built for your phone.</p>
            <div className="ac-hero-actions">
              <Link to="/academy/browse" className="btn btn-primary btn-lg">Explore courses <Icon name="arrow" size={18} /></Link>
              <Link to="/academy/browse?price=free" className="btn btn-outline btn-lg">Start learning free</Link>
            </div>
            <ul className="hero-points">
              <li><Icon name="check" size={16} /> Free to audit</li>
              <li><Icon name="check" size={16} /> Shareable certificates</li>
              <li><Icon name="check" size={16} /> Financial aid available</li>
              <li><Icon name="check" size={16} /> Download to learn offline</li>
            </ul>
          </div>
          <div className="ac-hero-panel card">
            <h2>Find your path</h2>
            {[
              ['I want to get a job', '/academy/browse?type=Professional+Certificate', 'briefcase'],
              ['I want to freelance', '/academy/browse?cat=freelance', 'compass'],
              ['I want to learn a trade', '/academy/browse?cat=tvet', 'award'],
              ['I want to upskill at work', '/academy/browse?level=Intermediate', 'rocket'],
            ].map(([label, to, icon]) => (
              <Link key={label} to={to} className="ac-goal">
                <Icon name={icon as IconName} size={20} /> <span>{label}</span> <Icon name="arrow" size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="ac-wrap ac-sections">
        {inProgress.length > 0 && (
          <section>
            <div className="ac-row-head"><h2>Continue learning</h2><Link to="/academy/my-learning">My Learning <Icon name="arrow" size={14} /></Link></div>
            <div className="ac-continue">
              {inProgress.map((c) => c && (
                <Link key={c.slug} to={`/academy/learn/${c.slug}`} className="card ac-continue-card">
                  <strong>{c.title}</strong>
                  <div className="bar"><span style={{ width: `${progress(c)}%` }} /></div>
                  <span className="muted small">{progress(c)}% complete · Resume</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="ac-row-head"><h2>Explore categories</h2></div>
          <div className="ac-cats">
            {categories.map((c) => (
              <Link key={c.slug} to={`/academy/browse?cat=${c.slug}`} className="ac-cat">
                <Icon name={c.icon as IconName} size={22} />
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="ac-row-head">
            <div><h2>Professional Certificates & Specializations</h2><p className="muted">Multi-course programs that prepare you for a specific role.</p></div>
            <Link to="/academy/browse?kind=programs">View all <Icon name="arrow" size={14} /></Link>
          </div>
          <div className="ac-grid">
            {programs.slice(0, 4).map((p) => <ProgramCard key={p.slug} program={p} />)}
          </div>
        </section>

        <section>
          <div className="ac-row-head"><h2>Most popular courses</h2><Link to="/academy/browse?sort=popular">View all <Icon name="arrow" size={14} /></Link></div>
          <div className="ac-grid">{popular.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
        </section>

        <section>
          <div className="ac-row-head"><h2>Free courses with free certificates</h2><Link to="/academy/browse?price=free">View all <Icon name="arrow" size={14} /></Link></div>
          <div className="ac-grid">{free.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
        </section>

        <section>
          <div className="ac-row-head"><div><h2>Technical & vocational trades</h2><p className="muted">Practical skills with ABC-aligned assessment.</p></div></div>
          <div className="ac-grid">{trades.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
        </section>

        <section className="ac-split-cards">
          <Link to="/academy/teach" className="card ac-promo">
            <Icon name="users" size={26} />
            <h3>Teach on Skill Academy</h3>
            <p className="muted">Share your expertise with learners across Pakistan and earn a transparent revenue share.</p>
            <span className="link-arrow">Become an instructor <Icon name="arrow" size={14} /></span>
          </Link>
          <Link to="/academy/institutions" className="card ac-promo">
            <Icon name="layers" size={26} />
            <h3>For institutions & teams</h3>
            <p className="muted">Give your students or staff access to the catalogue, assign learning and track progress.</p>
            <span className="link-arrow">See plans <Icon name="arrow" size={14} /></span>
          </Link>
          <Link to="/skillsrator/skill-education" className="card ac-promo">
            <Icon name="book" size={26} />
            <h3>Looking for a full degree?</h3>
            <p className="muted">Formal online degrees from verified institutions are offered through Skill Education.</p>
            <span className="link-arrow">Explore Skill Education <Icon name="arrow" size={14} /></span>
          </Link>
        </section>

        <section className="ac-partners">
          <h2>Learn from universities, institutes and industry</h2>
          <div className="ac-partner-row">
            {partners.map((p) => <span key={p.id}>{p.name}</span>)}
          </div>
        </section>
      </div>
    </>
  )
}
