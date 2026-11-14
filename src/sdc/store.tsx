import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { cohorts as baseCohorts, findSkill, levelName, sessionsFor, TODAY, type Cohort, type LevelKey } from './data'

// Prototype persistence in this browser's localStorage. Learner, instructor and
// centre views share this one store, so work submitted as a learner appears in
// the instructor's grading queue and the feedback flows back.

export type Enrolment = { id: string; cohortId: string; status: 'Active' | 'Completed' | 'Withdrawn'; date: string; scholarship: boolean }
export type Submission = { text: string; date: string; grade?: number; feedback?: string }
export type LogEntry = { id: string; enrolId: string; taskId: string; note: string; evidence: string; date: string; status: 'Pending review' | 'Signed off' | 'Needs rework'; feedback?: string }
export type AbcBooking = { id: string; skillId: string; level: LevelKey; centreId: string; date: string; status: 'Booked' | 'Passed' }
export type Certificate = { code: string; skillId: string; level: LevelKey; title: string; name: string; date: string }
export type Post = { id: string; author: string; text: string; date: string; kind: 'announcement' | 'discussion'; replies: { author: string; text: string }[] }
export type QueueItem = { id: string; learner: string; cohortId: string; kind: 'Assignment' | 'Logbook'; title: string; text: string; evidence?: string; status: 'Pending' | 'Done'; grade?: number; feedback?: string }

type State = {
  me: { name: string; lowLiteracy: boolean; targetRole: string }
  enrolments: Enrolment[]
  done: Record<string, true>
  quiz: Record<string, number>
  submissions: Record<string, Submission>
  logbook: LogEntry[]
  attendance: Record<string, 'Present' | 'Watched recording'>
  abc: AbcBooking[]
  certificates: Certificate[]
  posts: Record<string, Post[]>
  notes: Record<string, string>
  custom: Cohort[]
  queue: QueueItem[]
  roster: Record<string, Record<string, boolean>>
}

const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const uid = (p = '') => p + Math.random().toString(36).slice(2, 9)

function seed(): State {
  const solar = findSkill('solar')!
  const co1 = baseCohorts.find((c) => c.id === 'co1')!
  const attendance: State['attendance'] = {}
  sessionsFor(co1, solar).filter((s) => s.date < TODAY).forEach((s, i) => { if (i !== 2) attendance[s.id] = 'Present' })
  const done: State['done'] = {}
  solar.levels.foundation.units[0].items.forEach((it) => (done[it.id] = true))
  done[solar.levels.foundation.units[1].items[0].id] = true
  return {
    me: { name: 'Ayesha Khan', lowLiteracy: false, targetRole: 'r-solar' },
    enrolments: [
      { id: 'e1', cohortId: 'co1', status: 'Active', date: '20 Oct 2026', scholarship: false },
      { id: 'e2', cohortId: 'co13', status: 'Active', date: '10 Nov 2026', scholarship: true },
    ],
    done,
    quiz: { [solar.levels.foundation.units[0].items[3].id]: 100 },
    submissions: {},
    logbook: [{ id: 'lg1', enrolId: 'e1', taskId: 'solar-foundation-t0', note: 'Isolated the DC side at the combiner box, locked off and proved dead with a tester before and after.', evidence: 'isolation-procedure.mp4', date: '5 Nov 2026', status: 'Signed off', feedback: 'Excellent, correct sequence and good commentary. — Instructor' }],
    attendance,
    abc: [],
    certificates: [],
    posts: {
      co1: [
        { id: 'p1', author: 'Sample Instructor — Tariq', text: 'Saturday lab session moved to 11:00 because of the power schedule. Bring your safety gloves.', date: '11 Nov 2026', kind: 'announcement', replies: [] },
        { id: 'p2', author: 'Sample Learner — Hina', text: 'Does anyone have a good diagram showing where the charge controller sits in a hybrid system?', date: '9 Nov 2026', kind: 'discussion', replies: [{ author: 'Sample Learner — Bilal', text: 'Check the Unit 2 guide, page 3 has one.' }] },
      ],
    },
    notes: {},
    custom: [],
    queue: [
      { id: 'q1', learner: 'Sample Learner — Bilal', cohortId: 'co1', kind: 'Logbook', title: 'Identify system components on site', text: 'Labelled panels, combiner box, inverter, batteries and the AC distribution board at my uncle’s house.', evidence: 'components-photos.zip', status: 'Pending' },
      { id: 'q2', learner: 'Sample Learner — Zara', cohortId: 'co1', kind: 'Assignment', title: 'Assignment: apply reading single-line diagrams', text: 'I traced the single-line diagram for a 5 kW hybrid system and listed every protection device with its rating and purpose.', status: 'Pending' },
      { id: 'q3', learner: 'Sample Learner — Imran', cohortId: 'co5', kind: 'Logbook', title: 'Build a personal profile page', text: 'My first page with a photo, bio and contact links.', evidence: 'profile-page-link.txt', status: 'Pending' },
    ],
    roster: {},
  }
}

const KEY = 'sdc-v1'
function load(): State {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...seed(), ...JSON.parse(raw) } } catch { /* storage unavailable */ }
  return seed()
}

function useSdcState() {
  const [s, set] = useState<State>(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ } }, [s])

  const allCohorts = useMemo(() => [...baseCohorts, ...s.custom], [s.custom])
  const getCohort = (id: string) => allCohorts.find((c) => c.id === id)

  /** Everything needed to decide whether a learner has completed a level. */
  const levelStatus = (enrolId: string) => {
    const e = s.enrolments.find((x) => x.id === enrolId)!
    const c = getCohort(e.cohortId)!
    const skill = findSkill(c.skillId)!
    const lvl = skill.levels[c.level]
    const items = lvl.units.flatMap((u) => u.items)
    const quizzes = items.filter((i) => i.kind === 'quiz')
    const assignments = items.filter((i) => i.kind === 'assignment')
    const past = sessionsFor(c, skill).filter((x) => x.date < TODAY)
    const attended = past.filter((x) => s.attendance[x.id]).length
    const signed = lvl.tasks.filter((t) => s.logbook.some((l) => l.enrolId === enrolId && l.taskId === t.id && l.status === 'Signed off')).length
    const r = {
      itemsDone: items.filter((i) => s.done[i.id]).length, itemsTotal: items.length,
      quizzesPassed: quizzes.filter((q) => (s.quiz[q.id] ?? 0) >= 70).length, quizzesTotal: quizzes.length,
      assignmentsPassed: assignments.filter((a) => (s.submissions[a.id]?.grade ?? 0) >= 50).length, assignmentsTotal: assignments.length,
      tasksSigned: signed, tasksTotal: lvl.tasks.length,
      attendancePct: past.length ? Math.round((attended / past.length) * 100) : 100, sessionsPast: past.length,
    }
    const progress = Math.round(((r.itemsDone / r.itemsTotal) * 0.6 + (r.tasksSigned / r.tasksTotal) * 0.3 + (r.assignmentsPassed / Math.max(1, r.assignmentsTotal)) * 0.1) * 100)
    const complete = r.itemsDone === r.itemsTotal && r.quizzesPassed === r.quizzesTotal && r.assignmentsPassed === r.assignmentsTotal && r.tasksSigned === r.tasksTotal && r.attendancePct >= 75
    return { ...r, progress, complete, cohort: c, skill, lvl, enrolment: e }
  }

  /** Highest level certified per skill, used for the skills map and gap analysis. */
  const reached = (skillId: string): LevelKey | null => {
    const order: LevelKey[] = ['advanced', 'practitioner', 'foundation']
    return order.find((l) => s.certificates.some((c) => c.skillId === skillId && c.level === l)) ?? null
  }

  const updEnrol = (id: string, f: (e: Enrolment) => Enrolment) => set((x) => ({ ...x, enrolments: x.enrolments.map((e) => (e.id === id ? f(e) : e)) }))

  const a = {
    setLowLiteracy: (v: boolean) => set((x) => ({ ...x, me: { ...x.me, lowLiteracy: v } })),
    setTargetRole: (v: string) => set((x) => ({ ...x, me: { ...x.me, targetRole: v } })),
    enrol: (cohortId: string, scholarship: boolean): string => {
      const existing = s.enrolments.find((e) => e.cohortId === cohortId && e.status !== 'Withdrawn')
      if (existing) return existing.id
      const id = uid('e')
      set((x) => ({ ...x, enrolments: [...x.enrolments, { id, cohortId, status: 'Active', date: today(), scholarship }] }))
      return id
    },
    withdraw: (id: string) => updEnrol(id, (e) => ({ ...e, status: 'Withdrawn' })),
    complete: (itemId: string) => set((x) => ({ ...x, done: { ...x.done, [itemId]: true } })),
    scoreQuiz: (itemId: string, score: number) => set((x) => ({ ...x, quiz: { ...x.quiz, [itemId]: Math.max(score, x.quiz[itemId] ?? 0) }, done: score >= 70 ? { ...x.done, [itemId]: true } : x.done })),
    submit: (itemId: string, text: string, learnerName: string, cohortId: string, title: string) => set((x) => ({
      ...x,
      submissions: { ...x.submissions, [itemId]: { text, date: today() } },
      queue: [{ id: `me-${itemId}`, learner: `${learnerName} (you)`, cohortId, kind: 'Assignment', title, text, status: 'Pending' }, ...x.queue.filter((q) => q.id !== `me-${itemId}`)],
    })),
    addLog: (enrolId: string, taskId: string, title: string, note: string, evidence: string, cohortId: string) => {
      const id = uid('lg')
      set((x) => ({
        ...x,
        logbook: [{ id, enrolId, taskId, note, evidence, date: today(), status: 'Pending review' }, ...x.logbook.filter((l) => !(l.enrolId === enrolId && l.taskId === taskId))],
        queue: [{ id: `me-${id}`, learner: `${x.me.name} (you)`, cohortId, kind: 'Logbook', title, text: note, evidence, status: 'Pending' }, ...x.queue],
      }))
    },
    attend: (sessionId: string, how: 'Present' | 'Watched recording') => set((x) => ({ ...x, attendance: { ...x.attendance, [sessionId]: x.attendance[sessionId] === 'Present' ? 'Present' : how } })),
    post: (cohortId: string, author: string, text: string, kind: Post['kind']) => set((x) => ({ ...x, posts: { ...x.posts, [cohortId]: [{ id: uid('p'), author, text, date: today(), kind, replies: [] }, ...(x.posts[cohortId] ?? [])] } })),
    reply: (cohortId: string, postId: string, author: string, text: string) => set((x) => ({ ...x, posts: { ...x.posts, [cohortId]: (x.posts[cohortId] ?? []).map((p) => (p.id === postId ? { ...p, replies: [...p.replies, { author, text }] } : p)) } })),
    saveNote: (enrolId: string, text: string) => set((x) => ({ ...x, notes: { ...x.notes, [enrolId]: text } })),

    // Instructor
    review: (queueId: string, grade: number | undefined, feedback: string, signOff: boolean) => set((x) => {
      const item = x.queue.find((q) => q.id === queueId)!
      const queue = x.queue.map((q) => (q.id === queueId ? { ...q, status: 'Done' as const, grade, feedback } : q))
      if (!queueId.startsWith('me-')) return { ...x, queue }
      const ref = queueId.slice(3)
      if (item.kind === 'Assignment') return { ...x, queue, submissions: { ...x.submissions, [ref]: { ...x.submissions[ref], grade, feedback }, }, done: (grade ?? 0) >= 50 ? { ...x.done, [ref]: true } : x.done }
      return { ...x, queue, logbook: x.logbook.map((l) => (l.id === ref ? { ...l, status: signOff ? 'Signed off' : 'Needs rework', feedback } : l)) }
    }),
    markRoster: (sessionId: string, learnerId: string, present: boolean) => set((x) => ({ ...x, roster: { ...x.roster, [sessionId]: { ...(x.roster[sessionId] ?? {}), [learnerId]: present } } })),
    createCohort: (c: Omit<Cohort, 'id' | 'enrolled'>): string => { const id = uid('co'); set((x) => ({ ...x, custom: [...x.custom, { ...c, id, enrolled: 0 }] })); return id },

    // ABC & certificates
    claimCertificate: (enrolId: string): Certificate => {
      const st = levelStatus(enrolId)
      const existing = s.certificates.find((c) => c.skillId === st.skill.id && c.level === st.cohort.level)
      if (existing) return existing
      const cert: Certificate = { code: 'SDC-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(), skillId: st.skill.id, level: st.cohort.level, title: `${st.skill.name} — ${levelName[st.cohort.level]}`, name: s.me.name, date: today() }
      set((x) => ({ ...x, certificates: [...x.certificates, cert], enrolments: x.enrolments.map((e) => (e.id === enrolId ? { ...e, status: 'Completed' } : e)) }))
      return cert
    },
    bookAbc: (skillId: string, level: LevelKey, centreId: string, date: string) => set((x) => ({ ...x, abc: [...x.abc.filter((b) => !(b.skillId === skillId && b.level === level)), { id: uid('abc'), skillId, level, centreId, date, status: 'Booked' }] })),
    simulateAbcPass: (id: string) => set((x) => ({ ...x, abc: x.abc.map((b) => (b.id === id ? { ...b, status: 'Passed' } : b)) })),
    reset: () => set(seed()),
  }

  return { s, allCohorts, getCohort, levelStatus, reached, ...a }
}

type Ctx = ReturnType<typeof useSdcState>
const SdcContext = createContext<Ctx | null>(null)

export function SdcProvider({ children }: { children: ReactNode }) {
  const value = useSdcState()
  return <SdcContext.Provider value={value}>{children}</SdcContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSdc() {
  const ctx = useContext(SdcContext)
  if (!ctx) throw new Error('useSdc must be used inside SdcProvider')
  return ctx
}
