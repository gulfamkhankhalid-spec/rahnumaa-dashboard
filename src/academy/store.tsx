import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { allLessons, courses as catalogue, type Course } from './data'

// Prototype persistence: everything is kept in this browser's localStorage.
// Swap these actions for API calls once a backend exists.

export type Enrollment = { mode: 'audit' | 'certificate'; enrolledAt: string; aid?: boolean }
export type Certificate = { code: string; slug: string; title: string; name: string; date: string; kind: 'Course' | 'Program' }
export type Post = { id: string; author: string; text: string; date: string; replies: { author: string; text: string; date: string }[] }
export type CustomCourse = Course & { status: 'Draft' | 'In review' | 'Published'; owner: 'me' }
export type OrgMember = { id: string; name: string; email: string; assigned: string[] }

type State = {
  name: string
  enrollments: Record<string, Enrollment>
  programs: string[]
  completed: Record<string, true>
  quiz: Record<string, number>
  submissions: Record<string, string>
  notes: Record<string, string>
  saved: string[]
  certificates: Certificate[]
  forum: Record<string, Post[]>
  custom: CustomCourse[]
  org: { name: string; seats: number; members: OrgMember[] }
  lastLesson: Record<string, string>
}

const initial: State = {
  name: 'Ayesha Khan',
  enrollments: {},
  programs: [],
  completed: {},
  quiz: {},
  submissions: {},
  notes: {},
  saved: [],
  certificates: [],
  forum: {},
  custom: [],
  org: {
    name: 'Sample Technical Institute',
    seats: 50,
    members: [
      { id: 'm1', name: 'Sample Learner 1', email: 'learner1@example.com', assigned: ['solar-pv-installation'] },
      { id: 'm2', name: 'Sample Learner 2', email: 'learner2@example.com', assigned: ['solar-pv-installation', 'workplace-english'] },
      { id: 'm3', name: 'Sample Learner 3', email: 'learner3@example.com', assigned: ['domestic-electrical-wiring'] },
    ],
  },
  lastLesson: {},
}

const KEY = 'skill-academy-v1'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial, ...JSON.parse(raw) }
  } catch {
    /* storage unavailable */
  }
  return initial
}

const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const code = () => 'SA-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()

function useAcademyState() {
  const [s, set] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {
      /* ignore */
    }
  }, [s])

  const allCourses = useMemo<Course[]>(() => [...catalogue, ...s.custom.filter((c) => c.status === 'Published')], [s.custom])
  const getCourse = useCallback((slug: string) => allCourses.find((c) => c.slug === slug) ?? s.custom.find((c) => c.slug === slug), [allCourses, s.custom])

  const progress = useCallback(
    (course: Course) => {
      const ls = allLessons(course)
      const done = ls.filter((l) => s.completed[l.id]).length
      return ls.length ? Math.round((done / ls.length) * 100) : 0
    },
    [s.completed],
  )

  const graded = useCallback(
    (course: Course) => {
      const items = allLessons(course).filter((l) => l.kind === 'quiz' || l.kind === 'assignment')
      return items.every((l) => (l.kind === 'quiz' ? (s.quiz[l.id] ?? 0) >= 70 : !!s.submissions[l.id]))
    },
    [s.quiz, s.submissions],
  )

  const actions = {
    setName: (name: string) => set((x) => ({ ...x, name })),
    enroll: (slug: string, mode: Enrollment['mode'], aid = false) =>
      set((x) => ({ ...x, enrollments: { ...x.enrollments, [slug]: { mode, aid, enrolledAt: x.enrollments[slug]?.enrolledAt ?? today() } } })),
    unenroll: (slug: string) =>
      set((x) => {
        const e = { ...x.enrollments }
        delete e[slug]
        return { ...x, enrollments: e }
      }),
    enrollProgram: (slug: string, courseSlugs: string[], aid = false) =>
      set((x) => {
        const e = { ...x.enrollments }
        courseSlugs.forEach((c) => (e[c] = { mode: 'certificate', aid, enrolledAt: e[c]?.enrolledAt ?? today() }))
        return { ...x, enrollments: e, programs: x.programs.includes(slug) ? x.programs : [...x.programs, slug] }
      }),
    toggleSaved: (slug: string) => set((x) => ({ ...x, saved: x.saved.includes(slug) ? x.saved.filter((y) => y !== slug) : [...x.saved, slug] })),
    complete: (courseSlug: string, lessonId: string) =>
      set((x) => ({ ...x, completed: { ...x.completed, [lessonId]: true }, lastLesson: { ...x.lastLesson, [courseSlug]: lessonId } })),
    visit: (courseSlug: string, lessonId: string) => set((x) => ({ ...x, lastLesson: { ...x.lastLesson, [courseSlug]: lessonId } })),
    scoreQuiz: (lessonId: string, score: number) =>
      set((x) => ({
        ...x,
        quiz: { ...x.quiz, [lessonId]: Math.max(score, x.quiz[lessonId] ?? 0) },
        completed: score >= 70 ? { ...x.completed, [lessonId]: true } : x.completed,
      })),
    submit: (lessonId: string, text: string) =>
      set((x) => ({ ...x, submissions: { ...x.submissions, [lessonId]: text }, completed: { ...x.completed, [lessonId]: true } })),
    saveNote: (slug: string, text: string) => set((x) => ({ ...x, notes: { ...x.notes, [slug]: text } })),
    issueCertificate: (slug: string, title: string, kind: Certificate['kind'] = 'Course'): Certificate => {
      const existing = s.certificates.find((c) => c.slug === slug)
      if (existing) return existing
      const cert: Certificate = { code: code(), slug, title, name: s.name, date: today(), kind }
      set((x) => ({ ...x, certificates: [...x.certificates, cert] }))
      return cert
    },
    post: (slug: string, text: string) =>
      set((x) => ({
        ...x,
        forum: { ...x.forum, [slug]: [{ id: Math.random().toString(36).slice(2), author: x.name, text, date: today(), replies: [] }, ...(x.forum[slug] ?? [])] },
      })),
    reply: (slug: string, postId: string, text: string) =>
      set((x) => ({
        ...x,
        forum: {
          ...x.forum,
          [slug]: (x.forum[slug] ?? []).map((p) => (p.id === postId ? { ...p, replies: [...p.replies, { author: x.name, text, date: today() }] } : p)),
        },
      })),
    saveCustom: (course: CustomCourse) =>
      set((x) => ({ ...x, custom: x.custom.some((c) => c.slug === course.slug) ? x.custom.map((c) => (c.slug === course.slug ? course : c)) : [...x.custom, course] })),
    deleteCustom: (slug: string) => set((x) => ({ ...x, custom: x.custom.filter((c) => c.slug !== slug) })),
    addMember: (name: string, email: string) =>
      set((x) => ({ ...x, org: { ...x.org, members: [...x.org.members, { id: Math.random().toString(36).slice(2), name, email, assigned: [] }] } })),
    removeMember: (id: string) => set((x) => ({ ...x, org: { ...x.org, members: x.org.members.filter((m) => m.id !== id) } })),
    assign: (memberIds: string[], slug: string) =>
      set((x) => ({
        ...x,
        org: { ...x.org, members: x.org.members.map((m) => (memberIds.includes(m.id) && !m.assigned.includes(slug) ? { ...m, assigned: [...m.assigned, slug] } : m)) },
      })),
    reset: () => set(initial),
  }

  return { s, allCourses, getCourse, progress, graded, ...actions }
}

type Ctx = ReturnType<typeof useAcademyState>
const AcademyContext = createContext<Ctx | null>(null)

export function AcademyProvider({ children }: { children: ReactNode }) {
  const value = useAcademyState()
  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAcademy() {
  const ctx = useContext(AcademyContext)
  if (!ctx) throw new Error('useAcademy must be used inside AcademyProvider')
  return ctx
}
