import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, programs } from '../data'
import { useAcademy } from '../store'
import { CourseCard, Empty, ProgramCard } from '../ui'

const levels = ['Beginner', 'Intermediate', 'Advanced']
const durations = [['short', 'Under 10 hours'], ['medium', '10–25 hours'], ['long', 'Over 25 hours']]

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const { allCourses } = useAcademy()
  const q = params.get('q') ?? ''
  const cat = params.get('cat') ?? ''
  const level = params.get('level') ?? ''
  const lang = params.get('lang') ?? ''
  const price = params.get('price') ?? ''
  const dur = params.get('dur') ?? ''
  const type = params.get('type') ?? ''
  const abc = params.get('abc') === '1'
  const sort = params.get('sort') ?? 'relevance'
  const kind = params.get('kind') ?? ''

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const ql = q.toLowerCase()

  const courseResults = useMemo(() => {
    if (kind === 'programs' || type === 'Professional Certificate' || type === 'Specialization') return []
    const list = allCourses.filter(
      (c) =>
        (!ql || `${c.title} ${c.summary} ${c.skills.join(' ')}`.toLowerCase().includes(ql)) &&
        (!cat || c.category === cat) &&
        (!level || c.level === level) &&
        (!lang || c.languages.includes(lang as 'Urdu' | 'English')) &&
        (!price || (price === 'free' ? c.price === 0 : c.price > 0)) &&
        (!type || c.type === type) &&
        (!abc || c.abc) &&
        (!dur || (dur === 'short' ? c.hours < 10 : dur === 'medium' ? c.hours <= 25 && c.hours >= 10 : c.hours > 25)),
    )
    if (sort === 'popular') list.sort((a, b) => b.enrolled - a.enrolled)
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'new') list.sort((a, b) => b.updated.localeCompare(a.updated))
    return list
  }, [allCourses, ql, cat, level, lang, price, type, abc, dur, sort, kind])

  const programType = type === 'Professional Certificate' || type === 'Specialization' ? type : ''
  const programResults =
    kind === 'programs' || programType || (!type && !price && !lang && !dur && !abc)
      ? programs.filter(
          (p) =>
            (!programType || p.type === programType) &&
            (!ql || `${p.title} ${p.summary}`.toLowerCase().includes(ql)) &&
            (!cat || p.category === cat) &&
            (!level || p.level === level),
        )
      : []

  const total = courseResults.length + programResults.length

  return (
    <div className="ac-wrap ac-browse">
      <aside className="ac-filters" aria-label="Filters">
        <div className="ac-filter-head">
          <h2>Filter</h2>
          {[...params.keys()].length > 0 && <button className="ac-clear" onClick={() => setParams({})}>Clear all</button>}
        </div>
        <fieldset>
          <legend>Category</legend>
          <select value={cat} onChange={(e) => set('cat', e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </fieldset>
        <fieldset>
          <legend>Learning product</legend>
          {[['', 'All'], ['Course', 'Courses'], ['Guided Project', 'Guided Projects'], ['Specialization', 'Specializations'], ['Professional Certificate', 'Professional Certificates']].map(([v, l]) => (
            <label key={l}><input type="radio" name="type" checked={type === v && kind === ''} onChange={() => { const n = new URLSearchParams(params); n.delete('kind'); if (v) n.set('type', v); else n.delete('type'); setParams(n, { replace: true }) }} /> {l}</label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Level</legend>
          {['', ...levels].map((l) => <label key={l || 'any'}><input type="radio" name="level" checked={level === l} onChange={() => set('level', l)} /> {l || 'Any level'}</label>)}
        </fieldset>
        <fieldset>
          <legend>Language</legend>
          {[['', 'Any'], ['Urdu', 'Urdu'], ['English', 'English']].map(([v, l]) => <label key={l}><input type="radio" name="lang" checked={lang === v} onChange={() => set('lang', v)} /> {l}</label>)}
        </fieldset>
        <fieldset>
          <legend>Duration</legend>
          {[['', 'Any'], ...durations].map(([v, l]) => <label key={l}><input type="radio" name="dur" checked={dur === v} onChange={() => set('dur', v)} /> {l}</label>)}
        </fieldset>
        <fieldset>
          <legend>Price</legend>
          {[['', 'Any'], ['free', 'Free certificate'], ['paid', 'Paid']].map(([v, l]) => <label key={l}><input type="radio" name="price" checked={price === v} onChange={() => set('price', v)} /> {l}</label>)}
        </fieldset>
        <fieldset>
          <legend>Credential</legend>
          <label><input type="checkbox" checked={abc} onChange={(e) => set('abc', e.target.checked ? '1' : '')} /> ABC-aligned assessment</label>
        </fieldset>
      </aside>

      <section className="ac-results">
        <div className="ac-results-head">
          <div>
            <h1>{q ? `Results for “${q}”` : cat ? categories.find((c) => c.slug === cat)?.name : 'Browse the catalogue'}</h1>
            <p className="muted">{total} result{total === 1 ? '' : 's'}</p>
          </div>
          <label className="ac-sort">Sort by
            <select value={sort} onChange={(e) => set('sort', e.target.value === 'relevance' ? '' : e.target.value)}>
              <option value="relevance">Best match</option>
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="new">Newest</option>
            </select>
          </label>
        </div>
        {programResults.length > 0 && (
          <>
            <h2 className="ac-sub">Programs</h2>
            <div className="ac-grid three">{programResults.map((p) => <ProgramCard key={p.slug} program={p} />)}</div>
          </>
        )}
        {courseResults.length > 0 && (
          <>
            {programResults.length > 0 && <h2 className="ac-sub">Courses & projects</h2>}
            <div className="ac-grid three">{courseResults.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
          </>
        )}
        {total === 0 && <Empty title="No results" text="Try removing a filter or searching for something broader." cta={<button className="btn btn-outline" onClick={() => setParams({})}>Clear filters</button>} />}
      </section>
    </div>
  )
}
