import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { families, familyName, levelKeys, skills, type Mode } from '../data'
import { useSdc } from '../store'
import { Empty, LevelPill } from '../ui'

export default function Skills() {
  const [params, setParams] = useSearchParams()
  const { allCohorts, reached } = useSdc()
  const family = params.get('family') ?? ''
  const mode = params.get('mode') ?? ''
  const q = (params.get('q') ?? '').toLowerCase()
  const abc = params.get('abc') === '1'
  const urdu = params.get('urdu') === '1'
  const set = (k: string, v: string) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); setParams(n, { replace: true }) }
  const list = skills.filter((s) => (!family || s.family === family) && (!mode || s.modes.includes(mode as Mode)) && (!q || `${s.name} ${s.summary} ${s.roles.join(' ')}`.toLowerCase().includes(q)) && (!abc || s.abc) && (!urdu || s.languages.includes('Urdu')))

  return (
    <div className="ac-wrap ac-browse">
      <aside className="ac-filters" aria-label="Filters">
        <div className="ac-filter-head"><h2>Filter</h2>{[...params.keys()].length > 0 && <button className="ac-clear" onClick={() => setParams({})}>Clear all</button>}</div>
        <fieldset><legend>Search</legend><input className="sd-input" value={params.get('q') ?? ''} onChange={(e) => set('q', e.target.value)} placeholder="Skill or job role" /></fieldset>
        <fieldset><legend>Skill family</legend>{[['', 'All families'], ...families.map((f) => [f.slug, f.name])].map(([v, l]) => <label key={l}><input type="radio" name="family" checked={family === v} onChange={() => set('family', v)} /> {l}</label>)}</fieldset>
        <fieldset><legend>How you learn</legend>{['', 'Online', 'Hybrid', 'Assisted centre'].map((m) => <label key={m || 'any'}><input type="radio" name="mode" checked={mode === m} onChange={() => set('mode', m)} /> {m || 'Any'}</label>)}</fieldset>
        <fieldset><legend>Options</legend>
          <label><input type="checkbox" checked={abc} onChange={(e) => set('abc', e.target.checked ? '1' : '')} /> Leads to ABC certification</label>
          <label><input type="checkbox" checked={urdu} onChange={(e) => set('urdu', e.target.checked ? '1' : '')} /> Taught in Urdu</label>
        </fieldset>
      </aside>
      <section className="ac-results">
        <div className="ac-results-head"><div><h1>{family ? familyName(family) : 'Skills catalogue'}</h1><p className="muted">{list.length} skills · each with three levels</p></div></div>
        {list.length ? (
          <div className="sd-skill-list">
            {list.map((s) => {
              const upcoming = allCohorts.filter((c) => c.skillId === s.id).length
              const r = reached(s.id)
              return (
                <Link key={s.id} to={`/sdc/skill/${s.id}`} className="card sd-skill">
                  <div className="sd-skill-top"><span className="tag tag-education">{familyName(s.family)}</span>{s.abc && <span className="ac-badge abc">ABC: {s.abc}</span>}{r && <span className="ac-badge free">You: {r}</span>}</div>
                  <h3>{s.name}</h3>
                  <p className="muted small">{s.summary}</p>
                  <div className="sd-levels-row">{levelKeys.map((l) => <span key={l}><LevelPill level={l} /> <span className="small muted">{s.levels[l].weeks} wks</span></span>)}</div>
                  <p className="small muted"><Icon name="briefcase" size={13} /> Leads to: {s.roles.join(', ')} · {s.modes.join(', ')} · {upcoming} cohort{upcoming === 1 ? '' : 's'}</p>
                </Link>
              )
            })}
          </div>
        ) : <Empty title="No skills match" text="Try another filter." />}
      </section>
    </div>
  )
}
