import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FEES, freelancers, gigs as catalogue, projects as openProjects, type Gig } from './data'

// Prototype persistence in this browser's localStorage. Actions marked "simulate"
// stand in for the other party (client, freelancer or mediator) until a backend exists.

export type Tx = { id: string; date: string; desc: string; amount: number; kind: 'in' | 'out' | 'escrow' | 'release' | 'refund' | 'fee' | 'withdraw' }
export type OrderEvent = { date: string; text: string }
export type Order = {
  id: string
  gigId: string
  gigTitle: string
  pkg: string
  addons: string[]
  price: number
  fee: number
  days: number
  role: 'buyer' | 'seller'
  other: string // name of the other party
  otherId?: string
  requirements: string
  status: 'In progress' | 'Delivered' | 'Revision requested' | 'Completed' | 'In dispute' | 'Cancelled'
  placed: string
  due: string
  revisions: number
  events: OrderEvent[]
  delivery?: string
  review?: { rating: number; text: string }
  dispute?: { reason: string; detail: string; outcome?: string }
}
export type Proposal = { id: string; freelancerId: string; bid: number; days: number; cover: string; status: 'New' | 'Shortlisted' | 'Declined' | 'Hired' }
export type MyProject = { id: string; title: string; category: string; skills: string[]; budgetType: 'Fixed' | 'Hourly'; budget: [number, number]; duration: string; experience: string; description: string; posted: string; status: 'Open' | 'Closed'; proposals: Proposal[] }
export type SentProposal = { id: string; projectId: string; bid: number; days: number; cover: string; status: 'Submitted' | 'Viewed' | 'Hired' | 'Declined'; date: string }
export type Milestone = { id: string; title: string; amount: number; status: 'Not funded' | 'Funded' | 'Submitted' | 'Released' }
export type HourLog = { id: string; date: string; hours: number; memo: string; status: 'Logged' | 'Paid' }
export type Contract = {
  id: string
  title: string
  role: 'client' | 'freelancer'
  other: string
  otherId?: string
  type: 'Fixed' | 'Hourly'
  rate: number
  weeklyLimit: number
  milestones: Milestone[]
  hours: HourLog[]
  status: 'Active' | 'Ended' | 'In dispute'
  started: string
  review?: { rating: number; text: string }
  dispute?: { reason: string; detail: string; outcome?: string }
}
export type Msg = { from: 'me' | 'them'; text: string; date: string }
export type Thread = { id: string; with: string; withId?: string; about: string; messages: Msg[] }
export type MyGig = Gig & { status: 'Active' | 'Paused' | 'Draft'; impressions: number; clicks: number }

type State = {
  me: { name: string; title: string; bio: string; skills: string[]; rate: number }
  mode: 'buying' | 'selling'
  wallet: { balance: number; escrow: number; earned: number; tx: Tx[] }
  credits: number
  orders: Order[]
  myGigs: MyGig[]
  myProjects: MyProject[]
  sent: SentProposal[]
  contracts: Contract[]
  threads: Thread[]
  saved: string[]
}

const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
export const uid = (p = '') => p + Math.random().toString(36).slice(2, 9)

const starterGig: MyGig = {
  id: 'my-g1', sellerId: 'me', category: 'dev', sub: 'Websites', title: 'I will build a responsive landing page in HTML and CSS', rating: 5, reviews: 3, tags: ['landing page', 'html', 'css'],
  description: 'A clean, mobile-friendly landing page for your business or event, built with semantic HTML and modern CSS.',
  packages: [
    { name: 'Basic', title: 'Simple page', price: 8000, days: 3, revisions: 1, features: ['1 section page', 'Responsive design'] },
    { name: 'Standard', title: 'Full landing page', price: 15000, days: 5, revisions: 2, features: ['Up to 5 sections', 'Responsive design', 'Contact form'] },
    { name: 'Premium', title: 'Landing page + launch', price: 25000, days: 7, revisions: 3, features: ['Up to 8 sections', 'Responsive design', 'Contact form', 'Publishing to your host'] },
  ],
  addons: [{ id: 'a1', title: 'Urdu version', price: 5000, days: 2 }], faqs: [['Do you write the text?', 'I can help edit it; please send your main content.']],
  status: 'Active', impressions: 1240, clicks: 96,
}

const initial: State = {
  me: { name: 'Ayesha Khan', title: 'Junior web developer', bio: 'Software engineering student building responsive websites. Skill Academy graduate in Web Development Foundations.', skills: ['HTML', 'CSS', 'Responsive design', 'Git'], rate: 2000 },
  mode: 'buying',
  wallet: { balance: 50000, escrow: 0, earned: 21000, tx: [
    { id: 't1', date: '2 Nov 2026', desc: 'Added funds (sample)', amount: 50000, kind: 'in' },
    { id: 't0', date: '20 Oct 2026', desc: 'Earnings: landing page for Sample Buyer — Tutor', amount: 13500, kind: 'release' },
  ] },
  credits: 30,
  orders: [
    { id: 'o-seed', gigId: 'my-g1', gigTitle: starterGig.title, pkg: 'Standard', addons: [], price: 15000, fee: 1500, days: 5, role: 'seller', other: 'Sample Buyer — Bakery', requirements: 'A one-page site for our bakery with menu, opening hours, location map and a WhatsApp order button. Colours: cream and brown.', status: 'In progress', placed: '10 Nov 2026', due: '15 Nov 2026', revisions: 2, events: [{ date: '10 Nov 2026', text: 'Order placed — PKR 15,000 held in escrow' }, { date: '10 Nov 2026', text: 'Buyer submitted requirements' }] },
  ],
  myGigs: [starterGig],
  myProjects: [],
  sent: [],
  contracts: [],
  threads: [
    { id: 'th-seed', with: 'Sample Buyer — Bakery', about: 'Order: landing page', messages: [{ from: 'them', text: 'Assalam-o-Alaikum! Can you add an Urdu line under the logo?', date: '10 Nov 2026' }] },
  ],
  saved: [],
}

const KEY = 'skill-lancer-v1'
function load(): State {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...initial, ...JSON.parse(raw) } } catch { /* storage unavailable */ }
  return initial
}

function useLancerState() {
  const [s, set] = useState<State>(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ } }, [s])

  const allGigs = useMemo(() => [...catalogue, ...s.myGigs.filter((g) => g.status === 'Active')], [s.myGigs])
  const getGig = (id: string): Gig | undefined => catalogue.find((g) => g.id === id) ?? s.myGigs.find((g) => g.id === id)
  const tx = (desc: string, amount: number, kind: Tx['kind']): Tx => ({ id: uid('t'), date: today(), desc, amount, kind })

  const ensureThread = (x: State, withName: string, about: string, withId?: string): State =>
    x.threads.some((t) => t.with === withName) ? x : { ...x, threads: [{ id: uid('th'), with: withName, withId, about, messages: [] }, ...x.threads] }

  const updOrder = (id: string, f: (o: Order) => Order) => set((x) => ({ ...x, orders: x.orders.map((o) => (o.id === id ? f(o) : o)) }))
  const updContract = (id: string, f: (c: Contract) => Contract) => set((x) => ({ ...x, contracts: x.contracts.map((c) => (c.id === id ? f(c) : c)) }))
  const ev = (text: string): OrderEvent => ({ date: today(), text })

  const a = {
    setMode: (mode: State['mode']) => set((x) => ({ ...x, mode })),
    toggleSaved: (id: string) => set((x) => ({ ...x, saved: x.saved.includes(id) ? x.saved.filter((y) => y !== id) : [...x.saved, id] })),
    updateMe: (me: Partial<State['me']>) => set((x) => ({ ...x, me: { ...x.me, ...me } })),

    // Wallet
    addFunds: (amount: number) => set((x) => ({ ...x, wallet: { ...x.wallet, balance: x.wallet.balance + amount, tx: [tx('Added funds', amount, 'in'), ...x.wallet.tx] } })),
    withdraw: (amount: number, method: string) => set((x) => ({ ...x, wallet: { ...x.wallet, balance: x.wallet.balance - amount, tx: [tx(`Withdrawal to ${method}`, -amount, 'withdraw'), ...x.wallet.tx] } })),

    // Gig orders (buyer side)
    placeOrder: (gig: Gig, pkgName: string, addonIds: string[], requirements: string): string | null => {
      const pkgObj = gig.packages.find((p) => p.name === pkgName)!
      const addons = gig.addons.filter((ad) => addonIds.includes(ad.id))
      const price = pkgObj.price + addons.reduce((t, ad) => t + ad.price, 0)
      const fee = Math.round(price * FEES.buyer)
      const days = Math.max(1, pkgObj.days + addons.reduce((t, ad) => t + ad.days, 0))
      if (s.wallet.balance < price + fee) return null
      const seller = freelancers.find((f) => f.id === gig.sellerId)
      const id = uid('o')
      set((x) => {
        const order: Order = { id, gigId: gig.id, gigTitle: gig.title, pkg: pkgName, addons: addons.map((ad) => ad.title), price, fee, days, role: 'buyer', other: seller?.name ?? x.me.name, otherId: seller?.id, requirements, status: 'In progress', placed: today(), due: addDays(days), revisions: pkgObj.revisions, events: [ev(`Order placed — ${price.toLocaleString('en-PK')} PKR held in escrow`), ev('Requirements sent to the seller')] }
        const y = ensureThread(x, order.other, `Order: ${gig.title}`, seller?.id)
        return { ...y, orders: [order, ...y.orders], wallet: { ...y.wallet, balance: y.wallet.balance - price - fee, escrow: y.wallet.escrow + price, tx: [tx(`Escrow: ${gig.title}`, -price, 'escrow'), tx('Service fee', -fee, 'fee'), ...y.wallet.tx] } }
      })
      return id
    },
    simulateDelivery: (id: string) => updOrder(id, (o) => ({ ...o, status: 'Delivered', delivery: 'Here is your delivery. Files are attached (prototype). Please review and let me know if you need any changes.', events: [...o.events, ev('Seller delivered the order')] })),
    requestRevision: (id: string, note: string) => updOrder(id, (o) => ({ ...o, status: 'Revision requested', revisions: o.revisions - 1, events: [...o.events, ev(`Revision requested: ${note}`)] })),
    acceptOrder: (id: string) => set((x) => {
      const o = x.orders.find((y) => y.id === id)!
      const orders = x.orders.map((y) => (y.id === id ? { ...y, status: 'Completed' as const, events: [...y.events, ev('Order completed — payment released to seller')] } : y))
      return { ...x, orders, wallet: { ...x.wallet, escrow: x.wallet.escrow - o.price, tx: [tx(`Released: ${o.gigTitle}`, 0, 'release'), ...x.wallet.tx] } }
    }),
    reviewOrder: (id: string, rating: number, text: string) => updOrder(id, (o) => ({ ...o, review: { rating, text }, events: [...o.events, ev(`You left a ${rating}-star review`)] })),

    // Gig orders (seller side)
    deliver: (id: string, text: string) => updOrder(id, (o) => ({ ...o, status: 'Delivered', delivery: text, events: [...o.events, ev('You delivered the order')] })),
    simulateBuyerAccept: (id: string) => set((x) => {
      const o = x.orders.find((y) => y.id === id)!
      const net = o.price - o.fee
      const orders = x.orders.map((y) => (y.id === id ? { ...y, status: 'Completed' as const, review: { rating: 5, text: 'Great work, delivered on time. (sample review)' }, events: [...y.events, ev('Buyer accepted the delivery'), ev(`Earnings released: PKR ${net.toLocaleString('en-PK')} after fee`)] } : y))
      return { ...x, orders, wallet: { ...x.wallet, balance: x.wallet.balance + net, earned: x.wallet.earned + net, tx: [tx(`Earnings: ${o.gigTitle}`, net, 'release'), ...x.wallet.tx] } }
    }),

    // Disputes
    openOrderDispute: (id: string, reason: string, detail: string) => updOrder(id, (o) => ({ ...o, status: 'In dispute', dispute: { reason, detail }, events: [...o.events, ev(`Dispute opened: ${reason}`)] })),
    simulateOrderResolution: (id: string) => set((x) => {
      const o = x.orders.find((y) => y.id === id)!
      const refund = o.role === 'buyer' ? Math.round(o.price / 2) : 0
      const orders = x.orders.map((y) => (y.id === id ? { ...y, status: 'Cancelled' as const, dispute: { ...y.dispute!, outcome: 'Mediator decision: 50% refund to the buyer, 50% released to the seller.' }, events: [...y.events, ev('Dispute resolved by mediator: 50% refund')] } : y))
      const wallet = o.role === 'buyer'
        ? { ...x.wallet, escrow: x.wallet.escrow - o.price, balance: x.wallet.balance + refund, tx: [tx(`Refund (dispute): ${o.gigTitle}`, refund, 'refund'), ...x.wallet.tx] }
        : { ...x.wallet, balance: x.wallet.balance + Math.round((o.price - o.fee) / 2), tx: [tx(`Partial earnings (dispute): ${o.gigTitle}`, Math.round((o.price - o.fee) / 2), 'release'), ...x.wallet.tx] }
      return { ...x, orders, wallet }
    }),

    // Seller gigs
    saveGig: (g: MyGig) => set((x) => ({ ...x, myGigs: x.myGigs.some((y) => y.id === g.id) ? x.myGigs.map((y) => (y.id === g.id ? g : y)) : [...x.myGigs, g] })),
    setGigStatus: (id: string, status: MyGig['status']) => set((x) => ({ ...x, myGigs: x.myGigs.map((g) => (g.id === id ? { ...g, status } : g)) })),
    deleteGig: (id: string) => set((x) => ({ ...x, myGigs: x.myGigs.filter((g) => g.id !== id) })),

    // Client: projects and proposals
    postProject: (p: Omit<MyProject, 'id' | 'posted' | 'status' | 'proposals'>): string => {
      const id = uid('mp')
      const pool = freelancers.filter((f) => f.skills.some((sk) => p.skills.some((ps) => ps.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(ps.toLowerCase()))))
      const chosen = (pool.length >= 3 ? pool : [...pool, ...freelancers.filter((f) => !pool.includes(f))]).slice(0, 4)
      const mid = (p.budget[0] + p.budget[1]) / 2
      const proposals: Proposal[] = chosen.map((f, i) => ({
        id: uid('pr'), freelancerId: f.id, status: 'New',
        bid: p.budgetType === 'Hourly' ? f.rate : Math.round((mid * (0.85 + i * 0.1)) / 500) * 500,
        days: [7, 10, 14, 5][i % 4],
        cover: `Assalam-o-Alaikum! I have read your brief for “${p.title}”. I have done similar work (see my portfolio) and can start this week. My plan: understand your goals in a short call, share a first draft early, and refine it with you. ${f.abc.length ? `I hold an ABC credential in ${f.abc[0]}.` : ''}`,
      }))
      set((x) => ({ ...x, myProjects: [{ ...p, id, posted: today(), status: 'Open', proposals }, ...x.myProjects] }))
      return id
    },
    setProposalStatus: (projectId: string, proposalId: string, status: Proposal['status']) =>
      set((x) => ({ ...x, myProjects: x.myProjects.map((p) => (p.id === projectId ? { ...p, proposals: p.proposals.map((r) => (r.id === proposalId ? { ...r, status } : r)) } : p)) })),
    closeProject: (projectId: string) => set((x) => ({ ...x, myProjects: x.myProjects.map((p) => (p.id === projectId ? { ...p, status: 'Closed' } : p)) })),
    hire: (projectId: string, proposalId: string, milestones: { title: string; amount: number }[], weeklyLimit: number): string | null => {
      const p = s.myProjects.find((y) => y.id === projectId)!
      const r = p.proposals.find((y) => y.id === proposalId)!
      const f = freelancers.find((y) => y.id === r.freelancerId)!
      const first = p.budgetType === 'Fixed' ? milestones[0]?.amount ?? 0 : 0
      if (s.wallet.balance < first) return null
      const id = uid('c')
      set((x) => {
        const contract: Contract = {
          id, title: p.title, role: 'client', other: f.name, otherId: f.id, type: p.budgetType, rate: r.bid, weeklyLimit, started: today(), status: 'Active', hours: [],
          milestones: p.budgetType === 'Fixed' ? milestones.map((m, i) => ({ id: uid('m'), title: m.title, amount: m.amount, status: i === 0 ? 'Funded' : 'Not funded' })) : [],
        }
        const y = ensureThread(x, f.name, `Contract: ${p.title}`, f.id)
        return {
          ...y,
          contracts: [contract, ...y.contracts],
          myProjects: y.myProjects.map((q) => (q.id === projectId ? { ...q, status: 'Closed', proposals: q.proposals.map((z) => (z.id === proposalId ? { ...z, status: 'Hired' } : z)) } : q)),
          wallet: first ? { ...y.wallet, balance: y.wallet.balance - first, escrow: y.wallet.escrow + first, tx: [tx(`Escrow: milestone 1 — ${p.title}`, -first, 'escrow'), ...y.wallet.tx] } : y.wallet,
        }
      })
      return id
    },

    // Freelancer: proposals on open projects
    sendProposal: (projectId: string, bid: number, days: number, cover: string) =>
      set((x) => ({ ...x, credits: x.credits - 2, sent: [{ id: uid('sp'), projectId, bid, days, cover, status: 'Submitted', date: today() }, ...x.sent] })),
    withdrawProposal: (id: string) => set((x) => ({ ...x, sent: x.sent.filter((p) => p.id !== id) })),
    simulateHired: (sentId: string): string => {
      const sp = s.sent.find((p) => p.id === sentId)!
      const proj = openProjects.find((p) => p.id === sp.projectId)!
      const id = uid('c')
      set((x) => {
        const contract: Contract = {
          id, title: proj.title, role: 'freelancer', other: proj.client.name, type: proj.budgetType, rate: sp.bid, weeklyLimit: 15, started: today(), status: 'Active', hours: [],
          milestones: proj.budgetType === 'Fixed' ? [
            { id: uid('m'), title: 'First draft', amount: Math.round(sp.bid * 0.4), status: 'Funded' },
            { id: uid('m'), title: 'Final delivery', amount: sp.bid - Math.round(sp.bid * 0.4), status: 'Not funded' },
          ] : [],
        }
        const y = ensureThread(x, proj.client.name, `Contract: ${proj.title}`)
        return { ...y, contracts: [contract, ...y.contracts], sent: y.sent.map((p) => (p.id === sentId ? { ...p, status: 'Hired' } : p)) }
      })
      return id
    },

    // Contracts
    fundMilestone: (cid: string, mid: string): boolean => {
      const c = s.contracts.find((y) => y.id === cid)!
      const m = c.milestones.find((y) => y.id === mid)!
      if (s.wallet.balance < m.amount) return false
      set((x) => ({
        ...x,
        contracts: x.contracts.map((y) => (y.id === cid ? { ...y, milestones: y.milestones.map((z) => (z.id === mid ? { ...z, status: 'Funded' } : z)) } : y)),
        wallet: { ...x.wallet, balance: x.wallet.balance - m.amount, escrow: x.wallet.escrow + m.amount, tx: [tx(`Escrow: ${m.title} — ${c.title}`, -m.amount, 'escrow'), ...x.wallet.tx] },
      }))
      return true
    },
    addMilestone: (cid: string, title: string, amount: number) => updContract(cid, (c) => ({ ...c, milestones: [...c.milestones, { id: uid('m'), title, amount, status: 'Not funded' }] })),
    submitMilestone: (cid: string, mid: string) => updContract(cid, (c) => ({ ...c, milestones: c.milestones.map((m) => (m.id === mid ? { ...m, status: 'Submitted' } : m)) })),
    releaseMilestone: (cid: string, mid: string) => set((x) => {
      const c = x.contracts.find((y) => y.id === cid)!
      const m = c.milestones.find((y) => y.id === mid)!
      const contracts = x.contracts.map((y) => (y.id === cid ? { ...y, milestones: y.milestones.map((z) => (z.id === mid ? { ...z, status: 'Released' as const } : z)) } : y))
      if (c.role === 'client') return { ...x, contracts, wallet: { ...x.wallet, escrow: x.wallet.escrow - m.amount, tx: [tx(`Released: ${m.title} — ${c.title}`, 0, 'release'), ...x.wallet.tx] } }
      const net = Math.round(m.amount * (1 - FEES.seller))
      return { ...x, contracts, wallet: { ...x.wallet, balance: x.wallet.balance + net, earned: x.wallet.earned + net, tx: [tx(`Earnings: ${m.title} — ${c.title}`, net, 'release'), ...x.wallet.tx] } }
    }),
    logHours: (cid: string, hours: number, memo: string) => updContract(cid, (c) => ({ ...c, hours: [{ id: uid('h'), date: today(), hours, memo, status: 'Logged' }, ...c.hours] })),
    payHours: (cid: string): boolean => {
      const c = s.contracts.find((y) => y.id === cid)!
      const due = c.hours.filter((h) => h.status === 'Logged').reduce((t, h) => t + h.hours, 0) * c.rate
      if (c.role === 'client' && s.wallet.balance < due) return false
      set((x) => {
        const contracts = x.contracts.map((y) => (y.id === cid ? { ...y, hours: y.hours.map((h) => ({ ...h, status: 'Paid' as const })) } : y))
        if (c.role === 'client') return { ...x, contracts, wallet: { ...x.wallet, balance: x.wallet.balance - due, tx: [tx(`Weekly hours — ${c.title}`, -due, 'out'), ...x.wallet.tx] } }
        const net = Math.round(due * (1 - FEES.seller))
        return { ...x, contracts, wallet: { ...x.wallet, balance: x.wallet.balance + net, earned: x.wallet.earned + net, tx: [tx(`Weekly hours — ${c.title}`, net, 'release'), ...x.wallet.tx] } }
      })
      return true
    },
    endContract: (cid: string, rating: number, text: string) => updContract(cid, (c) => ({ ...c, status: 'Ended', review: { rating, text } })),
    openContractDispute: (cid: string, reason: string, detail: string) => updContract(cid, (c) => ({ ...c, status: 'In dispute', dispute: { reason, detail } })),
    simulateContractResolution: (cid: string) => set((x) => {
      const c = x.contracts.find((y) => y.id === cid)!
      const held = c.milestones.filter((m) => m.status === 'Funded' || m.status === 'Submitted').reduce((t, m) => t + m.amount, 0)
      const contracts = x.contracts.map((y) => (y.id === cid ? { ...y, status: 'Ended' as const, milestones: y.milestones.map((m) => (m.status === 'Funded' || m.status === 'Submitted' ? { ...m, status: 'Released' as const } : m)), dispute: { ...y.dispute!, outcome: 'Mediator decision: funds in escrow split 50/50.' } } : y))
      const half = Math.round(held / 2)
      const wallet = c.role === 'client'
        ? { ...x.wallet, escrow: x.wallet.escrow - held, balance: x.wallet.balance + half, tx: [tx(`Refund (dispute): ${c.title}`, half, 'refund'), ...x.wallet.tx] }
        : { ...x.wallet, balance: x.wallet.balance + Math.round(half * (1 - FEES.seller)), tx: [tx(`Partial earnings (dispute): ${c.title}`, Math.round(half * (1 - FEES.seller)), 'release'), ...x.wallet.tx] }
      return { ...x, contracts, wallet }
    }),

    // Messages
    contact: (name: string, about: string, withId?: string): string => {
      const existing = s.threads.find((t) => t.with === name)
      if (existing) return existing.id
      const id = uid('th')
      set((x) => ({ ...x, threads: [{ id, with: name, withId, about, messages: [] }, ...x.threads] }))
      return id
    },
    send: (threadId: string, text: string) => {
      set((x) => ({ ...x, threads: x.threads.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, { from: 'me', text, date: today() }] } : t)) }))
      setTimeout(() => set((x) => ({ ...x, threads: x.threads.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, { from: 'them', text: 'Thanks for your message — I’ll reply shortly. (automatic reply in the prototype)', date: today() }] } : t)) })), 900)
    },
    reset: () => set(initial),
  }

  return { s, allGigs, getGig, ...a }
}

type Ctx = ReturnType<typeof useLancerState>
const LancerContext = createContext<Ctx | null>(null)

export function LancerProvider({ children }: { children: ReactNode }) {
  const value = useLancerState()
  return <LancerContext.Provider value={value}>{children}</LancerContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLancer() {
  const ctx = useContext(LancerContext)
  if (!ctx) throw new Error('useLancer must be used inside LancerProvider')
  return ctx
}
