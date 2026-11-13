import { useState, type FormEvent } from 'react'
import Icon from '../../components/Icon'
import { pkr } from '../data'
import { useLancer } from '../store'
import { Modal } from '../ui'

export default function Wallet() {
  const { s, addFunds, withdraw } = useLancer()
  const [dialog, setDialog] = useState<'add' | 'withdraw' | null>(null)
  const [amount, setAmount] = useState(10000)
  const [method, setMethod] = useState('Mobile wallet')
  const [done, setDone] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (dialog === 'add') { addFunds(amount); setDone(`${pkr(amount)} added to your wallet (prototype).`) }
    else { withdraw(amount, method); setDone(`${pkr(amount)} withdrawal to ${method} requested (prototype).`) }
    setDialog(null)
  }

  return (
    <div className="ac-wrap ac-sections">
      <header className="ac-row-head">
        <div><h1>Wallet</h1><p className="muted">One wallet for buying and selling, in Pakistani rupees.</p></div>
        <div className="lc-head-actions"><button className="btn btn-ghost" onClick={() => { setAmount(10000); setDialog('add') }}>Add funds</button><button className="btn btn-primary" onClick={() => { setAmount(Math.min(10000, s.wallet.balance)); setDialog('withdraw') }} disabled={s.wallet.balance <= 0}>Withdraw</button></div>
      </header>
      {done && <p className="toast"><Icon name="check" size={16} /> {done}</p>}
      <section className="stats">
        <div className="card stat"><span className="stat-label">Available balance</span><span className="stat-value small-value">{pkr(s.wallet.balance)}</span></div>
        <div className="card stat"><span className="stat-label">Held in escrow (your orders)</span><span className="stat-value small-value">{pkr(s.wallet.escrow)}</span></div>
        <div className="card stat"><span className="stat-label">Earned (all time)</span><span className="stat-value small-value">{pkr(s.wallet.earned)}</span></div>
        <div className="card stat"><span className="stat-label">Proposal credits</span><span className="stat-value">{s.credits}</span></div>
      </section>
      <section className="card">
        <h2>Transactions</h2>
        <table className="table"><thead><tr><th>Date</th><th>Description</th><th>Type</th><th className="num">Amount</th></tr></thead>
          <tbody>{s.wallet.tx.map((t) => (
            <tr key={t.id}><td>{t.date}</td><td>{t.desc}</td><td className="small muted">{({ in: 'Deposit', out: 'Payment', escrow: 'Escrow', release: 'Release', refund: 'Refund', fee: 'Fee', withdraw: 'Withdrawal' } as const)[t.kind]}</td><td className={`num ${t.amount > 0 ? 'pos' : t.amount < 0 ? 'neg' : ''}`}>{t.amount === 0 ? '—' : `${t.amount > 0 ? '+' : '−'}${pkr(Math.abs(t.amount))}`}</td></tr>
          ))}</tbody></table>
      </section>
      <p className="muted small">Payouts in PKR to Pakistani bank accounts and mobile wallets; receipts from clients abroad are converted at a shown rate. Subject to regulatory confirmation.</p>
      {dialog && (
        <Modal title={dialog === 'add' ? 'Add funds' : 'Withdraw earnings'} onClose={() => setDialog(null)}>
          <form className="ac-form" onSubmit={submit}>
            <label>Amount (PKR)<input type="number" min={500} step="any" max={dialog === 'withdraw' ? s.wallet.balance : undefined} value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label>
            <fieldset className="ac-methods"><legend>{dialog === 'add' ? 'Pay with' : 'Send to'}</legend>
              {['Mobile wallet', 'Bank account', 'Debit card'].map((m) => <label key={m} className={method === m ? 'on' : ''}><input type="radio" name="m" checked={method === m} onChange={() => setMethod(m)} /> {m}</label>)}
            </fieldset>
            <p className="muted small">Prototype — no money moves.</p>
            <button className="btn btn-primary btn-block" type="submit" disabled={amount <= 0 || (dialog === 'withdraw' && amount > s.wallet.balance)}>{dialog === 'add' ? `Add ${pkr(amount)}` : `Withdraw ${pkr(amount)}`}</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
