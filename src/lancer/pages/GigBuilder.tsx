import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { categories, type Addon, type Package } from '../data'
import { uid, useLancer, type MyGig } from '../store'

const blankPkgs: Package[] = [
  { name: 'Basic', title: '', price: 5000, days: 3, revisions: 1, features: [] },
  { name: 'Standard', title: '', price: 10000, days: 5, revisions: 2, features: [] },
  { name: 'Premium', title: '', price: 20000, days: 7, revisions: 3, features: [] },
]

export default function GigBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { s, saveGig } = useLancer()
  const existing = s.myGigs.find((g) => g.id === id)
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState(existing?.title ?? 'I will ')
  const [category, setCategory] = useState(existing?.category ?? 'dev')
  const [sub, setSub] = useState(existing?.sub ?? categories[1].subs[0])
  const [tags, setTags] = useState(existing?.tags.join(', ') ?? '')
  const [pkgs, setPkgs] = useState<(Package & { featuresText: string })[]>((existing?.packages ?? blankPkgs).map((p) => ({ ...p, featuresText: p.features.join('\n') })))
  const [addons, setAddons] = useState<Addon[]>(existing?.addons ?? [])
  const [description, setDescription] = useState(existing?.description ?? '')
  const [faqs, setFaqs] = useState<[string, string][]>(existing?.faqs ?? [])

  const cat = categories.find((c) => c.slug === category)!
  const upd = (i: number, p: Partial<Package & { featuresText: string }>) => setPkgs(pkgs.map((x, j) => (j === i ? { ...x, ...p } : x)))
  const valid = [title.trim().length > 12, pkgs.every((p) => p.title.trim() && p.price > 0 && p.days > 0), description.trim().length > 30]

  function save(status: MyGig['status']) {
    const gig: MyGig = {
      id: existing?.id ?? uid('my-g'), sellerId: 'me', category, sub, title: title.trim(), tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      rating: existing?.rating ?? 0, reviews: existing?.reviews ?? 0, description: description.trim(),
      packages: pkgs.map(({ featuresText, ...p }) => ({ ...p, features: featuresText.split('\n').map((f) => f.trim()).filter(Boolean) })),
      addons, faqs: faqs.filter(([q, a]) => q.trim() && a.trim()), status, impressions: existing?.impressions ?? 0, clicks: existing?.clicks ?? 0,
    }
    saveGig(gig)
    navigate(status === 'Active' ? `/lancer/gig/${gig.id}` : '/lancer/seller?tab=gigs')
  }

  const steps = ['Overview', 'Pricing', 'Description & FAQ', 'Publish']

  return (
    <div className="ac-wrap ac-sections ac-builder">
      <header className="ac-row-head">
        <div><h1>{existing ? 'Edit gig' : 'Create a gig'}</h1><p className="muted">Offer a clear, fixed-price service with three packages.</p></div>
        <Link to="/lancer/seller?tab=gigs" className="btn btn-ghost">Back</Link>
      </header>
      <div className="lc-steps">{steps.map((t, i) => <button key={t} className={i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''} onClick={() => setStep(i + 1)}>{i + 1}. {t}</button>)}</div>

      {step === 1 && (
        <section className="card ac-form">
          <label>Gig title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="I will design a logo for your business" /><span className="muted small">Start with “I will…”. {title.length}/80</span></label>
          <div className="ac-form-row two">
            <label>Category<select value={category} onChange={(e) => { setCategory(e.target.value); setSub(categories.find((c) => c.slug === e.target.value)!.subs[0]) }}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
            <label>Subcategory<select value={sub} onChange={(e) => setSub(e.target.value)}>{cat.subs.map((x) => <option key={x}>{x}</option>)}</select></label>
          </div>
          <label>Search tags (comma-separated)<input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="logo, branding, minimal" /></label>
        </section>
      )}

      {step === 2 && (
        <>
          <section className="lc-pkg-editor">
            {pkgs.map((p, i) => (
              <div key={p.name} className="card ac-form">
                <h2>{p.name}</h2>
                <label>Package name<input value={p.title} onChange={(e) => upd(i, { title: e.target.value })} placeholder={['Starter', 'Standard', 'Complete'][i]} /></label>
                <label>Price (PKR)<input type="number" min={500} step="any" value={p.price} onChange={(e) => upd(i, { price: Number(e.target.value) })} /></label>
                <div className="ac-form-row two">
                  <label>Delivery (days)<input type="number" min={1} value={p.days} onChange={(e) => upd(i, { days: Number(e.target.value) })} /></label>
                  <label>Revisions<input type="number" min={0} value={p.revisions} onChange={(e) => upd(i, { revisions: Number(e.target.value) })} /></label>
                </div>
                <label>What's included (one per line)<textarea rows={4} value={p.featuresText} onChange={(e) => upd(i, { featuresText: e.target.value })} /></label>
              </div>
            ))}
          </section>
          <section className="card ac-form">
            <h2>Extras (optional)</h2>
            {addons.map((a, i) => (
              <div key={a.id} className="lc-ms-row three">
                <input value={a.title} onChange={(e) => setAddons(addons.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} placeholder="Extra title" aria-label="Extra title" />
                <input type="number" value={a.price} onChange={(e) => setAddons(addons.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)))} aria-label="Extra price" />
                <input type="number" value={a.days} onChange={(e) => setAddons(addons.map((x, j) => (j === i ? { ...x, days: Number(e.target.value) } : x)))} aria-label="Extra days" />
                <button className="ac-link-btn danger" onClick={() => setAddons(addons.filter((_, j) => j !== i))} aria-label="Remove extra">✕</button>
              </div>
            ))}
            <button className="ac-link-btn" onClick={() => setAddons([...addons, { id: uid('a'), title: '', price: 2000, days: 1 }])}>+ Add extra</button>
          </section>
        </>
      )}

      {step === 3 && (
        <section className="card ac-form">
          <label>Description<textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain what buyers get, your process and why they should choose you." /></label>
          <h2>FAQ</h2>
          {faqs.map(([q, a], i) => (
            <div key={i} className="lc-faq-edit">
              <input value={q} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? [e.target.value, x[1]] : x)))} placeholder="Question" aria-label="Question" />
              <textarea rows={2} value={a} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? [x[0], e.target.value] : x)))} placeholder="Answer" aria-label="Answer" />
              <button className="ac-link-btn danger" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
          <button className="ac-link-btn" onClick={() => setFaqs([...faqs, ['', '']])}>+ Add question</button>
        </section>
      )}

      {step === 4 && (
        <section className="card ac-form">
          <h2>Ready to publish?</h2>
          <ul className="lc-checklist">
            {[['A clear title', valid[0]], ['Three complete packages', valid[1]], ['A description of at least 30 characters', valid[2]]].map(([t, ok]) => (
              <li key={t as string} className={ok ? 'done' : ''}><span>{ok ? <Icon name="check" size={12} /> : ''}</span>{t as string}</li>
            ))}
          </ul>
          <p className="muted small">Gigs are checked for originality and policy before going live. Prototype: published immediately.</p>
        </section>
      )}

      <div className="ac-builder-actions">
        {step > 1 && <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
        <button className="btn btn-ghost" onClick={() => save('Draft')} disabled={!title.trim()}>Save draft</button>
        {step < 4 ? <button key="next" className="btn btn-primary" onClick={() => setStep(step + 1)}>Save &amp; continue</button> : <button key="publish" className="btn btn-primary" onClick={() => save('Active')} disabled={!valid.every(Boolean)}>Publish gig</button>}
      </div>
    </div>
  )
}
