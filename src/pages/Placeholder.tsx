export default function Placeholder({ title }: { title: string }) {
  return (
    <>
      <header className="page-head">
        <h1>{title}</h1>
      </header>
      <section className="card">
        <p>Coming soon.</p>
      </section>
    </>
  )
}
