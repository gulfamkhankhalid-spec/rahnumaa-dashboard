const stats = [
  { label: 'Total users', value: '—' },
  { label: 'Active today', value: '—' },
  { label: 'Reports', value: '—' },
  { label: 'Pending tasks', value: '—' },
]

export default function Overview() {
  return (
    <>
      <header className="page-head">
        <h1>Overview</h1>
        <p>Welcome to the Rahnumaa dashboard.</p>
      </header>
      <section className="stats">
        {stats.map((s) => (
          <div className="card stat" key={s.label}>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </section>
      <section className="card">
        <h2>Getting started</h2>
        <p>This is the starting shell. Tell Claude what the dashboard should show and it will build it here.</p>
      </section>
    </>
  )
}
