// SAMPLE DATA for the clickable dashboard prototype. Nothing here is real or saved.

export const user = {
  name: 'Ayesha Khan',
  initials: 'AK',
  stage: 'Choose',
  domain: 'Business & IT',
  city: 'Lahore',
  verification: 2, // index into verificationLadder
  profileComplete: 72,
}

export const verificationLadder = [
  { level: 'Phone verified', text: 'Mobile number confirmed by OTP' },
  { level: 'Identity submitted', text: 'CNIC / B-Form submitted' },
  { level: 'Identity verified', text: 'Identity matched and confirmed' },
  { level: 'Credentials verified', text: 'Certificates and transcripts checked' },
]

export const nextAction = {
  title: 'Book a session to review your shortlist',
  reason: 'Your results point to Software Engineering and Data Science. A counselor can help you choose between Plan A and Plan B before admissions open.',
  cta: 'Find a counselor',
  to: '/app/counselors',
}

export type Assessment = {
  id: string
  name: string
  measures: string
  minutes: number
  status: 'completed' | 'in-progress' | 'not-started'
  progress: number
}

export const assessments: Assessment[] = [
  { id: 'interest', name: 'Career Interest Profile', measures: 'What kinds of work you enjoy', minutes: 15, status: 'completed', progress: 100 },
  { id: 'aptitude', name: 'Aptitude Assessment', measures: 'Numerical, verbal and logical reasoning', minutes: 30, status: 'completed', progress: 100 },
  { id: 'personality', name: 'Personality & Work Style', measures: 'How you prefer to work and learn', minutes: 20, status: 'in-progress', progress: 45 },
  { id: 'values', name: 'Values & Constraints', measures: 'Budget, location, family and income priorities', minutes: 10, status: 'not-started', progress: 0 },
]

export const interestResults = [
  { label: 'Investigative', score: 82 },
  { label: 'Conventional', score: 68 },
  { label: 'Enterprising', score: 61 },
  { label: 'Artistic', score: 44 },
  { label: 'Social', score: 39 },
  { label: 'Realistic', score: 27 },
]

export const aptitudeResults = [
  { label: 'Logical reasoning', score: 78 },
  { label: 'Numerical reasoning', score: 74 },
  { label: 'Verbal reasoning', score: 66 },
]

export const pathwayFits = [
  { field: 'Software Engineering', fit: 86, why: 'High investigative interest and strong logical reasoning.' },
  { field: 'Data Science & Analytics', fit: 81, why: 'Strong numerical reasoning and a preference for structured problems.' },
  { field: 'Accounting & Finance', fit: 69, why: 'Conventional interest and numerical strength; less aligned with your stated goals.' },
]

export type Milestone = { title: string; date: string; status: 'done' | 'current' | 'upcoming'; door?: string; note?: string }

export const plan = {
  goal: 'Become a software engineer at a product company, and freelance on the side while studying.',
  planA: 'BS Software Engineering',
  planB: 'BS Data Science',
  planC: 'Associate Degree in Computing, then transfer',
  milestones: [
    { title: 'Complete Career Interest and Aptitude assessments', date: 'Oct 2026', status: 'done' },
    { title: 'Shortlist programs (Plan A, B and C)', date: 'Nov 2026', status: 'done', door: 'Skill Education' },
    { title: 'Review shortlist with a counselor', date: 'Nov 2026', status: 'current', note: 'Next step' },
    { title: 'Prepare for entry test — mathematics and analytical', date: 'Dec 2026 – Feb 2027', status: 'upcoming', door: 'Skill Academy' },
    { title: 'Submit applications and scholarship forms', date: 'Mar 2027', status: 'upcoming', door: 'Skill Education' },
    { title: 'Join the Web Development community', date: 'Apr 2027', status: 'upcoming', door: 'Skill Magnets' },
  ] as Milestone[],
  feasibility: ['Budget: up to PKR 150,000 per year', 'Location: Lahore preferred, Islamabad possible', 'Needs a scholarship for Plan A institutions'],
}

export type Program = {
  id: string
  name: string
  institution: string
  city: string
  type: 'University' | 'TVET' | 'Online'
  domain: 'Business & IT' | 'TVET'
  duration: string
  fit: number
  verified: boolean
}

export const programs: Program[] = [
  { id: 'p1', name: 'BS Software Engineering', institution: 'Sample University of Technology', city: 'Lahore', type: 'University', domain: 'Business & IT', duration: '4 years', fit: 86, verified: true },
  { id: 'p2', name: 'BS Data Science', institution: 'Sample Institute of Computing', city: 'Islamabad', type: 'University', domain: 'Business & IT', duration: '4 years', fit: 81, verified: true },
  { id: 'p3', name: 'BBA (Business Analytics)', institution: 'Sample Business School', city: 'Karachi', type: 'University', domain: 'Business & IT', duration: '4 years', fit: 72, verified: true },
  { id: 'p4', name: 'Associate Degree in Computing', institution: 'Sample College of Commerce', city: 'Lahore', type: 'University', domain: 'Business & IT', duration: '2 years', fit: 70, verified: true },
  { id: 'p5', name: 'Web Development Certificate', institution: 'Sample Online Academy', city: 'Online', type: 'Online', domain: 'Business & IT', duration: '6 months', fit: 79, verified: false },
  { id: 'p6', name: 'Solar PV Installation', institution: 'Sample Technical Institute', city: 'Faisalabad', type: 'TVET', domain: 'TVET', duration: '3 months', fit: 48, verified: true },
  { id: 'p7', name: 'Electrical Wiring (Domestic)', institution: 'Sample Vocational Centre', city: 'Multan', type: 'TVET', domain: 'TVET', duration: '6 months', fit: 41, verified: true },
  { id: 'p8', name: 'Mobile Phone Repair', institution: 'Independent trainer — Sample Trainer', city: 'Rawalpindi', type: 'TVET', domain: 'TVET', duration: '8 weeks', fit: 45, verified: true },
]

export type Counselor = {
  id: string
  name: string
  initials: string
  specialty: string
  languages: string
  rating: number
  sessions: number
  nextSlot: string
}

export const counselors: Counselor[] = [
  { id: 'c1', name: 'Sample Counselor A', initials: 'SA', specialty: 'Admissions — Business & IT', languages: 'Urdu, English', rating: 4.9, sessions: 312, nextSlot: 'Thu, 13 Nov · 5:00 pm' },
  { id: 'c2', name: 'Sample Counselor B', initials: 'SB', specialty: 'Career — Software & Data', languages: 'Urdu, English', rating: 4.8, sessions: 205, nextSlot: 'Fri, 14 Nov · 7:30 pm' },
  { id: 'c3', name: 'Sample Counselor C', initials: 'SC', specialty: 'TVET & vocational pathways', languages: 'Urdu, Punjabi', rating: 4.7, sessions: 148, nextSlot: 'Sat, 15 Nov · 11:00 am' },
  { id: 'c4', name: 'Sample Counselor D', initials: 'SD', specialty: 'CV & employability', languages: 'English, Urdu', rating: 4.8, sessions: 176, nextSlot: 'Mon, 17 Nov · 6:00 pm' },
]

export const sessions = [
  { with: 'Sample Counselor B', topic: 'Understanding my assessment results', date: '28 Oct 2026', status: 'Completed' },
]

export type Consent = { id: string; who: string; what: string; purpose: string; granted: boolean }

export const consents: Consent[] = [
  { id: 'k1', who: 'Your counselors', what: 'Assessment results and My Plan', purpose: 'Guidance sessions', granted: true },
  { id: 'k2', who: 'Shortlisted institutions', what: 'Academic record summary', purpose: 'Admissions enquiries', granted: true },
  { id: 'k3', who: 'Parent / guardian', what: 'My Plan milestones', purpose: 'Family involvement', granted: false },
  { id: 'k4', who: 'Employers on Skill Wise', what: 'Skills card (masked)', purpose: 'Job matching', granted: false },
  { id: 'k5', who: 'Research (anonymised)', what: 'Aggregated, de-identified results', purpose: 'Improving recommendations', granted: false },
]

export const accessLog = [
  { who: 'Sample Counselor B', what: 'Viewed assessment results', when: '28 Oct 2026, 7:42 pm' },
  { who: 'Sample University of Technology', what: 'Viewed academic record summary', when: '2 Nov 2026, 11:05 am' },
  { who: 'You', what: 'Exported your Life Record', when: '5 Nov 2026, 9:18 pm' },
]
