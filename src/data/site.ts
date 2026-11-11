// Public-site content, adapted from the Rahnuma Concept Blueprint (v1.1, Part A and B2).
// Kept at vision level: no financials, prices, market figures or partner names.

export type PillarKey = 'education' | 'employment' | 'engagement' | 'bridge'

export const pillars = [
  {
    key: 'education' as const,
    name: 'Education',
    summary: 'Every form of learning — school, college, university, TVET, online and physical training.',
    detail:
      'Guides you from choosing the right discipline and institution to a complete study and skills track, with honest trade-offs and a clear next step.',
    connects: 'Schools, colleges, universities, training institutes, independent trainers, scholarship providers',
  },
  {
    key: 'employment' as const,
    name: 'Employment',
    summary: 'Every form of earning — a job, freelancing, self-employment, a startup or an agency.',
    detail:
      'Guides you into and through work at any age and from any starting point, verifies your skills and connects you to employers — only with your consent.',
    connects: 'Employers, recruiters, certification bodies, incubators, freelance clients, mentors',
  },
  {
    key: 'engagement' as const,
    name: 'Engagement',
    summary: 'The relationships that decide whether education and career succeed.',
    detail:
      'Business partners, co-founders, collaborators and mentors — and, strictly at your option, life-readiness that keeps personal decisions aligned with your goals.',
    connects: 'Verified individuals, co-founders, collaborators, mentors, counselors',
  },
]

export type Initiative = {
  slug: string
  name: string
  tagline: string
  pillar: PillarKey
  pillarLabel: string
  description: string
  forWhom: string
  features: { title: string; text: string }[]
  release: string
}

export const initiatives: Initiative[] = [
  {
    slug: 'skill-education',
    name: 'Skill Education',
    tagline: 'A verified online campus',
    pillar: 'education',
    pillarLabel: 'Education',
    description:
      'Formal online education from authenticated, verified and internationally recognisable universities, colleges and schools. Compare programs side by side and track your applications in one place.',
    forWhom: 'Students, parents and working adults',
    features: [
      { title: 'Verified institutions only', text: 'Every listed institution and program is checked before it appears.' },
      { title: 'Compare with reasons', text: 'See fit, feasibility, fees and outcomes side by side — with why each one was suggested.' },
      { title: 'Application tracker', text: 'Deadlines, documents and status for every program you apply to.' },
    ],
    release: 'Discovery in Release 1',
  },
  {
    slug: 'skill-academy',
    name: 'Skill Academy',
    tagline: 'Self-paced learning at national scale',
    pillar: 'education',
    pillarLabel: 'Education',
    description:
      'A catalogue of self-paced courses, specialisations and micro-credentials that anyone can start at any time — in Urdu and English, priced locally, mobile-first and built for low bandwidth.',
    forWhom: 'Self-learners, professionals and the diaspora',
    features: [
      { title: 'Free to audit', text: 'Start learning for free; pay only when you want a certificate.' },
      { title: 'Learn offline', text: 'Download lessons and keep studying on a low-end phone or weak connection.' },
      { title: 'Credentials that count', text: 'Completion certificates, with an ABC-assessed tier where supervised assessment is added.' },
    ],
    release: 'Catalogue in Release 2',
  },
  {
    slug: 'skill-development-center',
    name: 'Skill Development Center',
    tagline: 'A skills college without degrees',
    pillar: 'education',
    pillarLabel: 'Education',
    description:
      'A structured, assessed learning centre offering hundreds of skills — each with a syllabus, practice work, assessment and, where it exists, an ABC certification.',
    forWhom: 'Learners at any stage, including TVET learners',
    features: [
      { title: 'Guided and assessed', text: 'A clear path from foundation to advanced level, with practical work.' },
      { title: 'Skill logbook', text: 'Record practical evidence, including video, that counts towards certification.' },
      { title: 'Online, hybrid or assisted', text: 'Study online, in partner labs, or at assisted centres for low-connectivity learners.' },
    ],
    release: 'Pilot in Release 2',
  },
  {
    slug: 'skill-accelerator',
    name: 'Skill Accelerator',
    tagline: 'A boot camp plus an incubator',
    pillar: 'bridge',
    pillarLabel: 'Education → Employment',
    description:
      'Regular, time-boxed acceleration programs and incubation boot camps. Every participant follows a personal plan built from their assessments and a gap analysis against a target role or venture.',
    forWhom: 'Job seekers, freelancers, founders and people returning to work',
    features: [
      { title: 'Personal acceleration plan', text: 'Goals, weekly milestones, a mentor and a peer pod.' },
      { title: 'Proof of work', text: 'Leave with projects and a portfolio — not just a certificate of attendance.' },
      { title: 'Programs for every stage', text: 'Career acceleration, freelance launch, technical boot camps, re-entry and founder cohorts.' },
    ],
    release: 'First cohorts in Release 2',
  },
  {
    slug: 'skill-wise',
    name: 'Skill Wise',
    tagline: 'Skills-first hiring and outsourcing',
    pillar: 'employment',
    pillarLabel: 'Employment',
    description:
      'Where employers find the right skills and people with the right skills market themselves. Hiring, recruitment and outsourcing built on verified skills rather than unverified CVs.',
    forWhom: 'Job seekers, employers, recruiters and agencies',
    features: [
      { title: 'Your skills card', text: 'Verified badges, portfolio and availability — visible only if you opt in.' },
      { title: 'Consent before contact', text: 'Employers search masked profiles and must request access for a stated purpose.' },
      { title: 'Never pay to be hired', text: 'Candidates are never charged for being hired.' },
    ],
    release: 'Employer pilot in Release 2',
  },
  {
    slug: 'skill-lancer',
    name: 'Skill Lancer',
    tagline: 'A freelance marketplace with verified skills',
    pillar: 'employment',
    pillarLabel: 'Employment',
    description:
      'Highlight your skills and sell them — as fixed-price service packages or by bidding on posted projects — with verified identity, certified skills, local payments and Urdu support.',
    forWhom: 'Freelancers and the clients who hire them',
    features: [
      { title: 'Gigs and projects', text: 'Publish service packages, or send proposals on projects buyers post.' },
      { title: 'Protected payments', text: 'Escrowed milestones, clear contracts and local payout options.' },
      { title: 'From learning to first client', text: 'A direct route from Skill Academy and the Accelerator to your first paid work.' },
    ],
    release: 'Launch in Release 3',
  },
  {
    slug: 'skill-magnets',
    name: 'Skill Magnets',
    tagline: 'Communities organised by interest',
    pillar: 'engagement',
    pillarLabel: 'Engagement',
    description:
      'Interest-based communities that bring messaging, networking, posting and events into one place — organised from broad domains down to niches.',
    forWhom: 'Everyone, in moderated communities',
    features: [
      { title: 'Broad to niche', text: 'Join a domain like Digital Marketing, then narrow down to a niche that fits you.' },
      { title: 'Learn from peers', text: 'Threads, live sessions and events with practitioners and mentors.' },
      { title: 'Safe by design', text: 'Verified members, moderators and common trust-and-safety rules.' },
    ],
    release: 'Moderated pilot in Release 2',
  },
]

export const pathwayStages = [
  { stage: 'Explore', when: 'Grade 8–10', question: 'What am I good at?', output: 'Stream recommendation and a first pathway plan' },
  { stage: 'Choose', when: 'Inter / A-level', question: 'Which degree and institution?', output: 'A shortlist with Plan A, B and C' },
  { stage: 'Study and train', when: 'University / TVET', question: 'How do I get ready for work?', output: 'A skills plan and certification targets' },
  { stage: 'Launch', when: 'First job or gig', question: 'How do I earn my first income?', output: 'A verified profile and a first role or gig' },
  { stage: 'Grow', when: 'Mid-career', question: 'How do I move up?', output: 'A growth plan' },
  { stage: 'Pivot or re-enter', when: 'Any time', question: 'Can I switch or return?', output: 'A transition plan' },
  { stage: 'Build', when: 'Freelance, agency, startup', question: 'How do I build something of my own?', output: 'A venture plan' },
  { stage: 'Live and give back', when: 'Throughout life', question: 'How do I balance life, family and contribution?', output: 'A life plan aligned with your goals' },
]

export const sixQuestions = [
  { q: 'Who am I?', a: 'Interests, strengths, personality, values and constraints — from assessments and conversation.' },
  { q: 'What are my options?', a: 'Education, skills, jobs, freelancing, business and further study, with honest trade-offs.' },
  { q: 'What should I do next?', a: 'One clear next action, with the reason.' },
  { q: 'How do I get there?', a: 'A plan with milestones, dates, alternatives and the right Skillsrator door for each step.' },
  { q: 'Am I on track?', a: 'Scheduled reviews that adapt the plan as life changes.' },
  { q: 'Who can help?', a: 'Verified counselors, mentors, coaches, peers and family — at the right moment.' },
]

export const counselingStack = [
  { layer: 'Self-serve tools', text: 'Assessments, reports, a pathway explorer, fee and scholarship calculators. Free at the base.' },
  { layer: 'AI guide', text: 'Explains reports, helps you navigate and drafts plans — and hands high-stakes matters to a human.' },
  { layer: 'Verified counselors', text: 'Academic, career, CV and admissions counselors — vetted, rated and accountable.' },
  { layer: 'Mentors and coaches', text: 'Practitioners in your field, found through Skill Magnets and Skill Accelerator.' },
  { layer: 'Group guidance', text: 'School and college drives, accelerator cohorts and live community sessions.' },
  { layer: 'Parent and family sessions', text: 'Informed family involvement, within clear privacy rules for minors.' },
]

export const principles = [
  { title: 'Trust is the product', text: 'Verified identities, verified institutions, vetted counselors and transparent methodology.' },
  { title: 'You own your data', text: 'Granular, revocable consent. Nothing is shared without your permission, and every access is visible to you.' },
  { title: 'Personalised, not generic', text: 'Recommendations come from your profile, always with a clear explanation of why.' },
  { title: 'A counselor, not a directory', text: 'Rahnuma asks, interprets, plans and follows up — it does not just list information.' },
  { title: 'Exploratory, not diagnostic', text: 'Assessments describe fit and possibility. They never label people or make guarantees.' },
  { title: 'Affordable and inclusive', text: 'Built for low-end phones and low bandwidth, in Urdu and English, usable with limited literacy.' },
]

export const abcComponents = [
  { name: 'Theory examination', weight: 30, text: 'Multiple choice, short answers and case studies.' },
  { name: 'Practical demonstration', weight: 50, text: 'Supervised, hands-on tasks under timed conditions.' },
  { name: 'Oral / viva', weight: 10, text: 'Problem-solving and communication.' },
  { name: 'Workplace simulation', weight: 10, text: 'Realistic on-the-job scenarios.' },
]

export const roadmap = [
  {
    release: 'Release 1',
    title: 'Guidance foundation',
    items: ['Verified accounts and the Life Record', 'Assessments and results', 'University, program and TVET discovery', 'Counselor sessions', 'My Plan and My Record & Privacy'],
  },
  {
    release: 'Release 2',
    title: 'Employability and verified skills',
    items: ['Skill-gap analysis and certified CV', 'ABC pilot assessments', 'Skill Development Center and Academy catalogue', 'First Accelerator cohorts', 'Skill Wise employer pilot and Skill Magnets pilot'],
  },
  {
    release: 'Release 3',
    title: 'Employment network',
    items: ['Employer portal, jobs and internships', 'Skill Lancer freelance marketplace', 'Entrepreneurship tracks', 'Institution dashboards'],
  },
  {
    release: 'Release 4',
    title: 'Engagement and global',
    items: ['Collaboration and co-founder matching', 'Life-readiness, under strict safeguards', 'Global education partners', 'Multi-country support'],
  },
]

export const partnerTypes = [
  { name: 'Institutions', text: 'Schools, colleges, universities and TVET institutes reach the right students and see consented outcomes.' },
  { name: 'Employers', text: 'Find verified skills, assess candidates and hire — with consent built into every step.' },
  { name: 'Trainers', text: 'Independent trainers and learning providers list programs, teach and grow on one platform.' },
  { name: 'Counselors and mentors', text: 'Vetted professionals deliver sessions, follow up on plans and build a reputation.' },
  { name: 'Government and regulators', text: 'Align assessments with national frameworks and gain insight into skills supply and demand.' },
]
