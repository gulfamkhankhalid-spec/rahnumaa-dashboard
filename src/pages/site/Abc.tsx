import Icon from '../../components/Icon'
import { abcComponents } from '../../data/site'
import PageHero from './PageHero'

const loop = [
  { title: 'Rahnuma discovers', text: 'Identifies your skill gap and the target you are working towards.' },
  { title: 'Skillsrator trains', text: 'You learn and practise through the Development Center, Academy or Accelerator.' },
  { title: 'ABC certifies', text: 'A credible, local assessment proves what you can do.' },
  { title: 'Employers trust it', text: 'Verified credentials improve employability, and outcomes improve the guidance.' },
]

const offerings = [
  'Localised assessments for technical and vocational trades',
  'IT and vocational certifications',
  'Certified CVs — a 360° view of competencies and credentials',
  'Digital proctoring and a video skill logbook',
  'An employer verification portal',
  'Corporate and institutional assessments',
]

export default function Abc() {
  return (
    <>
      <PageHero eyebrow="ABC — Assessment Benchmark Certifications" title="Skills that employers can trust and verify">
        ABC is a proposed Pakistan-based assessment and certification body for technical, vocational and IT
        qualifications — affordable, credible and built for international recognition.
      </PageHero>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>A closed loop for human capital</h2>
          </div>
          <ol className="steps">
            {loop.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step-num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap split">
          <div>
            <h2>How an assessment is built</h2>
            <p className="muted">
              Practical ability carries the most weight. To pass, a candidate needs at least 70% overall and no fail in any
              core component. Every assessment is double-blind graded by two assessors.
            </p>
          </div>
          <div className="weights">
            {abcComponents.map((c) => (
              <div key={c.name} className="weight-row">
                <div className="weight-label">
                  <strong>{c.name}</strong>
                  <span>{c.weight}%</span>
                </div>
                <div className="bar"><span style={{ width: `${c.weight * 2}%` }} /></div>
                <p className="muted small">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>What ABC offers</h2>
          </div>
          <ul className="check-list two-col">
            {offerings.map((o) => (
              <li key={o}><Icon name="award" size={18} /> {o}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
