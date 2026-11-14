import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { people, seedChats, seedMagnets, seedPosts, seedStories, type ChatMsg, type Magnet, type Person, type Post, type Reaction, type Story } from './data'

// Prototype persistence in this browser's localStorage. Other members' replies are
// simulated so chats and posts feel alive; everything is clearly sample data.

export type Role = 'Owner' | 'Admin' | 'Moderator' | 'Member'
export type Notice = { id: string; text: string; link: string; time: string; read: boolean }
export type Report = { id: string; postId: string; reason: string; status: 'Open' | 'Removed' | 'Dismissed'; time: string }

type State = {
  me: Person
  magnets: Magnet[]
  membership: Record<string, Role | 'Requested'>
  roles: Record<string, Record<string, Role>>
  posts: Post[]
  stories: Story[]
  seenStories: string[]
  chats: Record<string, ChatMsg[]>
  lastRead: Record<string, number>
  following: string[]
  connections: string[]
  requested: string[]
  endorsed: string[]
  saved: string[]
  notices: Notice[]
  reports: Report[]
  settings: { topLevel: 'admins' | 'anyone'; approval: boolean }
  asAdmin: boolean
}

const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
export const uid = (p = '') => p + Math.random().toString(36).slice(2, 9)

const me: Person = {
  id: 'me', name: 'Ayesha Khan', initials: 'AK', headline: 'Software engineering student · Web developer · Learning Amazon PPC', city: 'Lahore', verified: true,
  abc: ['Web Development (Foundation)'], skills: [{ name: 'HTML & CSS', endorsements: 6 }, { name: 'React', endorsements: 3 }, { name: 'Amazon PPC', endorsements: 0 }],
  about: 'Student at heart, builder by habit. I’m exploring e-commerce on the side and love learning in public.', experience: [{ role: 'Freelance Web Developer', org: 'Skill Lancer', years: '2026–now' }], hue: 175,
}

function seed(): State {
  return {
    me,
    magnets: seedMagnets,
    membership: { ecom: 'Member', amazon: 'Member', 'amazon-ppc': 'Member', freelance: 'Member', software: 'Member', react: 'Member' },
    roles: {},
    posts: seedPosts,
    stories: seedStories,
    seenStories: [],
    chats: seedChats,
    lastRead: { ecom: 1 },
    following: ['u1', 'u4'],
    connections: ['u4'],
    requested: [],
    endorsed: [],
    saved: [],
    notices: [
      { id: 'n1', text: 'Sample Member — Hamza replied to your question in PPC', link: '/magnets/m/amazon-ppc', time: '2h', read: false },
      { id: 'n2', text: 'Sample Member — Sara accepted your connection request', link: '/magnets/u/u4', time: '1d', read: false },
      { id: 'n3', text: 'New subgroup in Amazon: Sponsored Brands', link: '/magnets/m/amazon-ppc-sb', time: '2d', read: true },
    ],
    reports: [{ id: 'rp1', postId: 'p2', reason: 'Spam or self-promotion', status: 'Open', time: '1h' }],
    settings: { topLevel: 'admins', approval: false },
    asAdmin: false,
  }
}

const KEY = 'skill-magnets-v1'
function load(): State {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...seed(), ...JSON.parse(raw) } } catch { /* storage unavailable */ }
  return seed()
}

const autoReplies = ['Great point! 👍', 'JazakAllah, very helpful.', 'Can you share an example?', 'Same experience here.', 'Let’s discuss this in the next live session.', 'Bookmarking this 🔖']

function useMagnetsState() {
  const [s, set] = useState<State>(load)
  const [typing, setTyping] = useState<Record<string, string | null>>({})
  const timers = useRef<number[]>([])
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* quota or blocked — keep working in memory */ } }, [s])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const person = (id: string): Person => (id === 'me' ? s.me : people.find((p) => p.id === id) ?? { ...people[0], id, name: 'Member', initials: 'M' })
  const magnet = (id: string) => s.magnets.find((x) => x.id === id)
  const children = (id: string | null) => s.magnets.filter((x) => x.parentId === id && (x.status === 'Active' || s.membership[x.id] === 'Owner' || s.asAdmin))
  const path = (id: string): Magnet[] => { const out: Magnet[] = []; let cur = magnet(id); let guard = 0; while (cur && guard++ < 20) { out.unshift(cur); cur = cur.parentId ? magnet(cur.parentId) : undefined } return out }
  const descendants = (id: string): string[] => { const kids = s.magnets.filter((x) => x.parentId === id).map((x) => x.id); return kids.flatMap((k) => [k, ...descendants(k)]) }
  const isMember = (id: string) => !!s.membership[id] && s.membership[id] !== 'Requested'
  const canManage = (id: string) => s.asAdmin || ['Owner', 'Admin'].includes(s.membership[id] ?? '')
  const canModerate = (id: string) => canManage(id) || s.membership[id] === 'Moderator'
  const visible = (mg: Magnet) => mg.status === 'Active' && (mg.privacy !== 'Hidden' || isMember(mg.id) || s.asAdmin)
  const canSee = (id: string) => { const mg = magnet(id); return !!mg && (mg.privacy === 'Public' || isMember(id) || s.asAdmin) }
  const unread = (threadId: string) => Math.max(0, (s.chats[threadId]?.length ?? 0) - (s.lastRead[threadId] ?? 0))

  const notify = (x: State, text: string, link: string): State => ({ ...x, notices: [{ id: uid('n'), text, link, time: 'now', read: false }, ...x.notices] })
  const updPost = (id: string, f: (p: Post) => Post) => set((x) => ({ ...x, posts: x.posts.map((p) => (p.id === id ? f(p) : p)) }))
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }

  const a = {
    setAsAdmin: (v: boolean) => set((x) => ({ ...x, asAdmin: v })),
    setSettings: (v: Partial<State['settings']>) => set((x) => ({ ...x, settings: { ...x.settings, ...v } })),
    updateMe: (v: Partial<Person>) => set((x) => ({ ...x, me: { ...x.me, ...v } })),

    // Magnets
    join: (id: string) => {
      const mg = magnet(id)!
      set((x) => ({ ...x, membership: { ...x.membership, [id]: mg.privacy === 'Public' ? 'Member' : 'Requested' } }))
      if (mg.privacy !== 'Public') later(() => set((x) => (x.membership[id] === 'Requested' ? notify({ ...x, membership: { ...x.membership, [id]: 'Member' } }, `Your request to join ${mg.name} was approved`, `/magnets/m/${id}`) : x)), 4000)
    },
    leave: (id: string) => set((x) => { const mm = { ...x.membership }; delete mm[id]; return { ...x, membership: mm } }),
    createMagnet: (v: Pick<Magnet, 'name' | 'parentId' | 'description' | 'privacy' | 'hue' | 'icon' | 'tags' | 'rules'>): { id: string; pending: boolean } => {
      const id = uid('mg')
      const pending = !s.asAdmin && (s.settings.approval || (v.parentId === null && s.settings.topLevel === 'admins'))
      set((x) => {
        const created: Magnet = { ...v, id, ownerId: 'me', createdBy: x.asAdmin ? 'admin' : 'member', members: 1, status: pending ? 'Pending approval' : 'Active', created: 'Nov 2026' }
        return { ...x, magnets: [...x.magnets, created], membership: { ...x.membership, [id]: 'Owner' } }
      })
      return { id, pending }
    },
    updateMagnet: (id: string, v: Partial<Magnet>) => set((x) => ({ ...x, magnets: x.magnets.map((mg) => (mg.id === id ? { ...mg, ...v } : mg)) })),
    deleteMagnet: (id: string) => set((x) => { const gone = new Set([id, ...descendants(id)]); return { ...x, magnets: x.magnets.filter((mg) => !gone.has(mg.id)), posts: x.posts.filter((p) => !gone.has(p.magnetId)) } }),
    approveMagnet: (id: string) => set((x) => notify({ ...x, magnets: x.magnets.map((mg) => (mg.id === id ? { ...mg, status: 'Active' } : mg)) }, `Your magnet “${x.magnets.find((mg) => mg.id === id)?.name}” was approved`, `/magnets/m/${id}`)),
    setRole: (magnetId: string, personId: string, role: Role | 'Remove') => set((x) => {
      const r = { ...(x.roles[magnetId] ?? {}) }
      if (role === 'Remove') delete r[personId]; else r[personId] = role
      return { ...x, roles: { ...x.roles, [magnetId]: r } }
    }),

    // Posts
    addPost: (p: Omit<Post, 'id' | 'reactions' | 'comments' | 'shares' | 'time' | 'authorId'>) => {
      const id = uid('p')
      set((x) => ({ ...x, posts: [{ ...p, id, authorId: 'me', reactions: { like: 0, insightful: 0, celebrate: 0, support: 0 }, comments: [], shares: 0, time: 'now' }, ...x.posts] }))
      later(() => set((x) => {
        const responder = people[Math.floor(Math.random() * people.length)]
        const posts = x.posts.map((q) => (q.id === id ? { ...q, reactions: { ...q.reactions, like: q.reactions.like + 3, insightful: q.reactions.insightful + 1 }, comments: [...q.comments, { id: uid('c'), authorId: responder.id, text: p.kind === 'question' ? 'Good question — I had the same issue. Following this thread.' : autoReplies[Math.floor(Math.random() * autoReplies.length)], time: 'now', likes: 0, replies: [] }] } : q))
        return notify({ ...x, posts }, `${responder.name} commented on your post`, `/magnets/p/${id}`)
      }), 2500)
      return id
    },
    react: (postId: string, r: Reaction) => updPost(postId, (p) => {
      const reactions = { ...p.reactions }
      if (p.myReaction) reactions[p.myReaction]--
      if (p.myReaction === r) return { ...p, reactions, myReaction: undefined }
      reactions[r]++
      return { ...p, reactions, myReaction: r }
    }),
    comment: (postId: string, text: string) => updPost(postId, (p) => ({ ...p, comments: [...p.comments, { id: uid('c'), authorId: 'me', text, time: 'now', likes: 0, replies: [] }] })),
    reply: (postId: string, commentId: string, text: string) => updPost(postId, (p) => ({ ...p, comments: p.comments.map((c) => (c.id === commentId ? { ...c, replies: [...c.replies, { id: uid('r'), authorId: 'me', text, time: 'now' }] } : c)) })),
    likeComment: (postId: string, commentId: string) => updPost(postId, (p) => ({ ...p, comments: p.comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)) })),
    vote: (postId: string, idx: number) => updPost(postId, (p) => (p.poll && p.poll.voted === undefined ? { ...p, poll: { voted: idx, options: p.poll.options.map((o, i) => (i === idx ? { ...o, votes: o.votes + 1 } : o)) } } : p)),
    addIdea: (postId: string, text: string) => updPost(postId, (p) => ({ ...p, ideas: [...(p.ideas ?? []), { id: uid('i'), text, by: 'me', votes: 1, voted: true }] })),
    voteIdea: (postId: string, ideaId: string) => updPost(postId, (p) => ({ ...p, ideas: (p.ideas ?? []).map((i) => (i.id === ideaId ? { ...i, votes: i.votes + (i.voted ? -1 : 1), voted: !i.voted } : i)).sort((x, y) => y.votes - x.votes) })),
    rsvp: (postId: string) => updPost(postId, (p) => (p.event ? { ...p, event: { ...p.event, rsvp: !p.event.rsvp, going: p.event.going + (p.event.rsvp ? -1 : 1) } } : p)),
    toggleSave: (postId: string) => set((x) => ({ ...x, saved: x.saved.includes(postId) ? x.saved.filter((y) => y !== postId) : [...x.saved, postId] })),
    share: (postId: string, magnetId: string, text: string) => set((x) => {
      const orig = x.posts.find((p) => p.id === postId)!
      const shared: Post = { id: uid('p'), magnetId, authorId: 'me', kind: 'text', text, sharedFrom: postId, reactions: { like: 0, insightful: 0, celebrate: 0, support: 0 }, comments: [], shares: 0, time: 'now' }
      return { ...x, posts: [shared, ...x.posts.map((p) => (p.id === orig.id ? { ...p, shares: p.shares + 1 } : p))] }
    }),
    pin: (postId: string) => updPost(postId, (p) => ({ ...p, pinned: !p.pinned })),
    markAnswered: (postId: string) => updPost(postId, (p) => ({ ...p, answered: !p.answered })),
    removePost: (postId: string) => set((x) => ({ ...x, posts: x.posts.filter((p) => p.id !== postId), reports: x.reports.map((r) => (r.postId === postId ? { ...r, status: 'Removed' } : r)) })),
    report: (postId: string, reason: string) => set((x) => ({ ...x, reports: [{ id: uid('rp'), postId, reason, status: 'Open', time: 'now' }, ...x.reports] })),
    resolveReport: (id: string, status: Report['status']) => set((x) => {
      const r = x.reports.find((y) => y.id === id)!
      return { ...x, reports: x.reports.map((y) => (y.id === id ? { ...y, status } : y)), posts: status === 'Removed' ? x.posts.filter((p) => p.id !== r.postId) : x.posts }
    }),

    // Stories
    addStory: (st: Omit<Story, 'id' | 'authorId' | 'time'>) => set((x) => ({ ...x, stories: [{ ...st, id: uid('s'), authorId: 'me', time: 'now' }, ...x.stories] })),
    seeStory: (id: string) => set((x) => (x.seenStories.includes(id) ? x : { ...x, seenStories: [...x.seenStories, id] })),

    // Chat
    send: (threadId: string, text: string, image?: string, replyTo?: string) => {
      set((x) => ({ ...x, chats: { ...x.chats, [threadId]: [...(x.chats[threadId] ?? []), { id: uid('m'), from: 'me', text, image, replyTo, time: now() }] }, lastRead: { ...x.lastRead, [threadId]: (x.chats[threadId]?.length ?? 0) + 1 } }))
      const responderId = threadId.startsWith('dm-') ? threadId.slice(3) : people[Math.floor(Math.random() * people.length)].id
      later(() => setTyping((t) => ({ ...t, [threadId]: responderId })), 700)
      later(() => {
        setTyping((t) => ({ ...t, [threadId]: null }))
        set((x) => ({ ...x, chats: { ...x.chats, [threadId]: [...(x.chats[threadId] ?? []), { id: uid('m'), from: responderId, text: autoReplies[Math.floor(Math.random() * autoReplies.length)], time: now() }] } }))
      }, 2200)
    },
    reactChat: (threadId: string, msgId: string, emoji: string) => set((x) => ({ ...x, chats: { ...x.chats, [threadId]: (x.chats[threadId] ?? []).map((mm) => (mm.id === msgId ? { ...mm, reactions: mm.reactions?.includes(emoji) ? mm.reactions.filter((e) => e !== emoji) : [...(mm.reactions ?? []), emoji] } : mm)) } })),
    markRead: (threadId: string) => set((x) => ((x.lastRead[threadId] ?? 0) === (x.chats[threadId]?.length ?? 0) ? x : { ...x, lastRead: { ...x.lastRead, [threadId]: x.chats[threadId]?.length ?? 0 } })),
    openDm: (personId: string) => { const t = `dm-${personId}`; set((x) => (x.chats[t] ? x : { ...x, chats: { ...x.chats, [t]: [] } })); return t },

    // People
    follow: (id: string) => set((x) => ({ ...x, following: x.following.includes(id) ? x.following.filter((y) => y !== id) : [...x.following, id] })),
    connect: (id: string) => {
      set((x) => ({ ...x, requested: [...x.requested, id] }))
      later(() => set((x) => notify({ ...x, requested: x.requested.filter((y) => y !== id), connections: [...x.connections, id], following: x.following.includes(id) ? x.following : [...x.following, id] }, `${person(id).name} accepted your connection request`, `/magnets/u/${id}`)), 3000)
    },
    endorse: (personId: string, skill: string) => set((x) => {
      const key = `${personId}|${skill}`
      return { ...x, endorsed: x.endorsed.includes(key) ? x.endorsed.filter((y) => y !== key) : [...x.endorsed, key] }
    }),
    readAll: () => set((x) => ({ ...x, notices: x.notices.map((n) => ({ ...n, read: true })) })),
    reset: () => set(seed()),
  }

  const myMagnets = useMemo(() => s.magnets.filter((mg) => isMember(mg.id) && mg.status === 'Active'), [s.magnets, s.membership]) // eslint-disable-line react-hooks/exhaustive-deps

  return { s, typing, person, magnet, children, path, descendants, isMember, canManage, canModerate, visible, canSee, unread, myMagnets, ...a }
}

type Ctx = ReturnType<typeof useMagnetsState>
const MagnetsContext = createContext<Ctx | null>(null)

export function MagnetsProvider({ children }: { children: ReactNode }) {
  const value = useMagnetsState()
  return <MagnetsContext.Provider value={value}>{children}</MagnetsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMagnets() {
  const ctx = useContext(MagnetsContext)
  if (!ctx) throw new Error('useMagnets must be used inside MagnetsProvider')
  return ctx
}

/** Shrinks an uploaded photo so it fits comfortably in browser storage. */
// eslint-disable-next-line react-refresh/only-export-components
export function resizeImage(file: File, max = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('That file is not an image'))
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
