import { useParams } from 'react-router-dom'
import { findInstructor, formatCount } from '../data'
import { useAcademy } from '../store'
import { CourseCard, Stars } from '../ui'
import NotFound from '../../pages/site/NotFound'

export default function InstructorProfile() {
  const { id = '' } = useParams()
  const { allCourses } = useAcademy()
  const inst = findInstructor(id)
  if (!inst) return <NotFound />
  const list = allCourses.filter((c) => c.instructorIds.includes(inst.id))
  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-inst-head card">
        <span className="avatar xl">{inst.initials}</span>
        <div>
          <h1>{inst.name}</h1>
          <p className="muted">{inst.title}</p>
          <p>{inst.bio}</p>
          <div className="ac-inst-stats"><Stars rating={inst.rating} /><span>{formatCount(inst.learners)} learners</span><span>{list.length} courses</span></div>
        </div>
      </header>
      <section>
        <h2>Courses by {inst.name}</h2>
        <div className="ac-grid">{list.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
      </section>
    </div>
  )
}
