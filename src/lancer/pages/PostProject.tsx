import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { categories, findFreelancer } from '../data'
import { useLancer } from '../store'

export default function PostProject() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const invited = findFreelancer(params.get('invite') ?? '')
  const { postProject } = useLancer()
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('dev')
  const [skills, setSkills] = useState('')
  const [duration, setDuration] = useState('Less than 1 month')
  const [experience, setExperience] = useState('Intermediate')
  const [budgetType, setBudgetType] = useState<'Fixed' | 'Hourly'>('Fixed')
  const [min, setMin] = useState(20000)
  const [max, setMax] = useState(40000)
  const [description, setDescription] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    const id = postProject({ title: title.trim(), category, skills: skills.split(',').map((x) => x.trim()).filter(Boolean), duration, experience, budgetType, budget: [min, max], description: description.trim() })
    navigate(`/lancer/client/project/${id}`)
  }

  const steps = ['Title', 'Skills & scope', 'Budget', 'Description']
  const canNext = step === 1 ? title.trim().length > 5 : step === 2 ? skills.trim().length > 1 : step === 3 ? min > 0 && max >= min : description.trim().length > 20

  return (
    <div className="ac-wrap lc-post">
      <div className="lc-steps" aria-label="Progress">
        {steps.map((t, i) => <span key={t} className={i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}>{i + 1}. {t}</span>)}
      </div>
      {invited && <p className="toast"><Icon name="users" size={16} /> {invited.name} will be invited to this project.</p>}
      <form className="card ac-form lc-post-card" onSubmit={submit}>
        {step === 1 && (
          <>
            <h1>Let’s start with a strong title</h1>
            <p className="muted">A clear title helps the right freelancers find your project.</p>
            <label>Project title<input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build a website for my tuition centre" /></label>
            <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
          </>
        )}
        {step === 2 && (
          <>
            <h1>What skills and scope?</h1>
            <label>Skills needed (comma-separated)<input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder={categories.find((c) => c.slug === category)?.subs.slice(0, 3).join(', ')} /></label>
            <label>How long will it take?<select value={duration} onChange={(e) => setDuration(e.target.value)}>{['Less than 1 month', '1–3 months', '3–6 months', 'More than 6 months'].map((d) => <option key={d}>{d}</option>)}</select></label>
            <fieldset className="lc-radio-cards">
              <legend>Experience level</legend>
              {[['Entry', 'Looking for someone relatively new'], ['Intermediate', 'Looking for substantial experience'], ['Expert', 'Looking for deep expertise']].map(([v, d]) => (
                <label key={v} className={experience === v ? 'on' : ''}><input type="radio" name="exp" checked={experience === v} onChange={() => setExperience(v)} /><strong>{v}</strong><span className="muted small">{d}</span></label>
              ))}
            </fieldset>
          </>
        )}
        {step === 3 && (
          <>
            <h1>Tell us about your budget</h1>
            <fieldset className="lc-radio-cards two">
              <legend>Budget type</legend>
              <label className={budgetType === 'Fixed' ? 'on' : ''}><input type="radio" name="bt" checked={budgetType === 'Fixed'} onChange={() => { setBudgetType('Fixed'); setMin(20000); setMax(40000) }} /><strong>Fixed price</strong><span className="muted small">Pay by milestones, held in escrow.</span></label>
              <label className={budgetType === 'Hourly' ? 'on' : ''}><input type="radio" name="bt" checked={budgetType === 'Hourly'} onChange={() => { setBudgetType('Hourly'); setMin(1500); setMax(3500) }} /><strong>Hourly rate</strong><span className="muted small">Pay weekly for hours worked, with a weekly limit.</span></label>
            </fieldset>
            <div className="ac-form-row two">
              <label>{budgetType === 'Fixed' ? 'Minimum budget (PKR)' : 'From (PKR / hour)'}<input type="number" min={0} step="any" value={min} onChange={(e) => setMin(Number(e.target.value))} /></label>
              <label>{budgetType === 'Fixed' ? 'Maximum budget (PKR)' : 'To (PKR / hour)'}<input type="number" min={0} step="any" value={max} onChange={(e) => setMax(Number(e.target.value))} /></label>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h1>Describe the project</h1>
            <label>Description<textarea rows={7} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What do you need done? What does success look like? Include deadlines, examples or files you will share." /></label>
            <p className="muted small"><Icon name="shield" size={14} /> Only identity-verified freelancers can send proposals. Never pay or share contact details outside Skill Lancer — escrow only protects payments made here.</p>
          </>
        )}
        <div className="lc-step-actions">
          {step > 1 ? <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button> : <Link to="/lancer/client" className="btn btn-ghost">Cancel</Link>}
          {step < 4 ? <button key="next" type="button" className="btn btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>Next</button> : <button key="post" type="submit" className="btn btn-primary" disabled={!canNext}>Post project</button>}
        </div>
      </form>
    </div>
  )
}
