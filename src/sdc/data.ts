// Skill Development Center — SAMPLE data for the prototype. Centres, instructors,
// cohorts, fees and learners are illustrative.

export type LevelKey = 'foundation' | 'practitioner' | 'advanced'
export const levelKeys: LevelKey[] = ['foundation', 'practitioner', 'advanced']
export const levelName: Record<LevelKey, string> = { foundation: 'Foundation', practitioner: 'Practitioner', advanced: 'Advanced' }

export type Mode = 'Online' | 'Hybrid' | 'Assisted centre'
export type ItemKind = 'video' | 'reading' | 'practice' | 'quiz' | 'assignment'
export type Item = { id: string; title: string; kind: ItemKind; minutes: number }
export type Unit = { title: string; items: Item[] }
export type Task = { id: string; title: string; evidence: string }

export type Family = { slug: string; name: string; icon: string; terms: [string, string][] }

export const families: Family[] = [
  { slug: 'trades', name: 'Technical & vocational trades', icon: 'award', terms: [['Isolation', 'Switching off and locking the supply before work begins'], ['Earthing', 'A safe path for fault current to flow to the ground'], ['PPE', 'Personal protective equipment such as gloves and goggles'], ['Load', 'The power a device or circuit draws, in watts']] },
  { slug: 'digital', name: 'Digital & IT', icon: 'layers', terms: [['HTML', 'The language that structures web pages'], ['Responsive', 'A layout that adapts to any screen size'], ['Repository', 'A folder of code tracked by version control'], ['Debugging', 'Finding and fixing the cause of an error']] },
  { slug: 'business', name: 'Business & professional', icon: 'briefcase', terms: [['Ledger', 'A record of all transactions for an account'], ['Gross margin', 'Revenue minus cost of goods, as a percentage'], ['KPI', 'A key number that shows progress towards a goal'], ['Invoice', 'A request for payment for goods or services']] },
  { slug: 'creator', name: 'Freelance & creator skills', icon: 'compass', terms: [['Brief', 'A short description of what the client needs'], ['Hierarchy', 'Arranging elements so the most important stands out'], ['Revision', 'A change requested by the client after delivery'], ['Portfolio', 'A collection of your best work to show clients']] },
  { slug: 'foundation', name: 'Foundation & life skills', icon: 'book', terms: [['Active listening', 'Giving full attention and checking you understood'], ['Budget', 'A plan for income and spending'], ['STAR', 'Situation, Task, Action, Result — a way to answer interview questions'], ['Etiquette', 'Polite, professional behaviour at work']] },
]

type LevelSpec = { hours: number; weeks: number; outcomes: string[]; units: string[]; tasks: [string, string][] }
export type Skill = {
  id: string
  name: string
  family: string
  summary: string
  abc: string | null
  modes: Mode[]
  languages: string[]
  roles: string[]
  prerequisites: Partial<Record<LevelKey, string>>
  levels: Record<LevelKey, { hours: number; weeks: number; outcomes: string[]; units: Unit[]; tasks: Task[] }>
}

function build(id: string, specs: Record<LevelKey, LevelSpec>) {
  const out = {} as Skill['levels']
  for (const lk of levelKeys) {
    const sp = specs[lk]
    out[lk] = {
      hours: sp.hours, weeks: sp.weeks, outcomes: sp.outcomes,
      units: sp.units.map((t, ui) => {
        const lower = t.charAt(0).toLowerCase() + t.slice(1)
        const base = `${id}-${lk}-u${ui}`
        const items: Item[] = [
          { id: `${base}-v`, title: t, kind: 'video', minutes: 12 },
          { id: `${base}-r`, title: `Guide: ${lower}`, kind: 'reading', minutes: 10 },
          { id: `${base}-p`, title: `Practice: key terms`, kind: 'practice', minutes: 8 },
          { id: `${base}-q`, title: `Check: ${lower}`, kind: 'quiz', minutes: 10 },
        ]
        if (ui === sp.units.length - 1) items.push({ id: `${base}-a`, title: `Assignment: apply ${lower}`, kind: 'assignment', minutes: 90 })
        return { title: t, items }
      }),
      tasks: sp.tasks.map(([title, evidence], ti) => ({ id: `${id}-${lk}-t${ti}`, title, evidence })),
    }
  }
  return out
}

const sk = (s: Omit<Skill, 'levels'> & { specs: Record<LevelKey, LevelSpec> }): Skill => {
  const { specs, ...rest } = s
  return { ...rest, levels: build(s.id, specs) }
}

export const skills: Skill[] = [
  sk({ id: 'solar', name: 'Solar PV Installation', family: 'trades', summary: 'Survey, size, install and maintain solar systems safely — from rooftop panels to inverters and batteries.', abc: 'Solar PV Installation', modes: ['Hybrid', 'Assisted centre'], languages: ['Urdu', 'English'], roles: ['Solar installer', 'Electrical technician'], prerequisites: { practitioner: 'Solar PV Installation — Foundation, or Domestic Electrical Wiring — Foundation' },
    specs: {
      foundation: { hours: 40, weeks: 6, outcomes: ['Work safely around DC and AC electricity', 'Name every part of a solar system and its job', 'Read a simple single-line diagram'], units: ['Electrical safety for solar work', 'Parts of a solar system', 'Reading single-line diagrams'], tasks: [['Safe isolation of a DC circuit', 'Video of the isolation procedure, step by step'], ['Identify system components on site', 'Photos of labelled components with notes']] },
      practitioner: { hours: 60, weeks: 8, outcomes: ['Survey a site and calculate household load', 'Size panels, inverter and batteries', 'Mount and wire panels to standard'], units: ['Site survey and load calculation', 'Sizing panels, inverters and batteries', 'Mounting and wiring'], tasks: [['Complete a load calculation for a home', 'Worksheet photo and a short voice note explaining it'], ['Mount and wire a two-panel string', 'Video of the finished string and polarity test']] },
      advanced: { hours: 50, weeks: 6, outcomes: ['Commission and test a complete system', 'Diagnose and fix common faults', 'Plan maintenance for commercial systems'], units: ['Commissioning and testing', 'Fault finding', 'Commercial systems and maintenance'], tasks: [['Commission a hybrid system', 'Commissioning checklist and test readings'], ['Diagnose a staged fault', 'Video explaining the fault and the fix']] },
    } }),
  sk({ id: 'wiring', name: 'Domestic Electrical Wiring', family: 'trades', summary: 'Wire homes safely: circuits, cables, protection devices and testing.', abc: 'Electrical Installation', modes: ['Hybrid', 'Assisted centre'], languages: ['Urdu'], roles: ['Electrician', 'Electrical technician'], prerequisites: {},
    specs: {
      foundation: { hours: 40, weeks: 6, outcomes: ['Apply safe working practice', 'Read circuit diagrams', 'Choose correct cables'], units: ['Safety and tools', 'Circuits and diagrams', 'Cables and sizes'], tasks: [['Prepare and terminate cables', 'Photos of terminated cable ends'], ['Wire a lighting circuit on a board', 'Video of the working circuit']] },
      practitioner: { hours: 60, weeks: 8, outcomes: ['Install distribution boards', 'Fit protection devices', 'Test installations'], units: ['Distribution boards', 'Breakers and RCDs', 'Testing and inspection'], tasks: [['Install a small distribution board', 'Photos before and after'], ['Insulation resistance test', 'Test sheet with readings']] },
      advanced: { hours: 40, weeks: 5, outcomes: ['Plan full-house wiring', 'Fault-find complex circuits', 'Supervise junior electricians'], units: ['Planning a house installation', 'Advanced fault finding', 'Supervision and quality'], tasks: [['Draw a full-house wiring plan', 'Plan drawing photo'], ['Find a hidden fault', 'Video explanation']] },
    } }),
  sk({ id: 'mobile-repair', name: 'Mobile Phone Repair', family: 'trades', summary: 'Diagnose and repair smartphones: screens, batteries, charging ports and software.', abc: 'Electronics Repair', modes: ['Hybrid', 'Assisted centre'], languages: ['Urdu'], roles: ['Mobile repair technician'], prerequisites: {},
    specs: {
      foundation: { hours: 30, weeks: 5, outcomes: ['Use repair tools safely', 'Open and close phones without damage', 'Replace a battery'], units: ['Tools and ESD safety', 'Opening devices safely', 'Battery replacement'], tasks: [['Open and reassemble a phone', 'Video of the process'], ['Replace a battery', 'Before and after photos']] },
      practitioner: { hours: 45, weeks: 6, outcomes: ['Replace screens and ports', 'Flash and update software', 'Serve customers professionally'], units: ['Screen replacement', 'Charging ports and connectors', 'Software and customer service'], tasks: [['Replace a screen', 'Video of the working screen'], ['Reinstall phone software', 'Screenshots of each step']] },
      advanced: { hours: 40, weeks: 5, outcomes: ['Board-level diagnosis', 'Micro-soldering basics', 'Run a repair shop'], units: ['Board-level diagnosis', 'Micro-soldering', 'Running a repair business'], tasks: [['Diagnose a board fault', 'Multimeter readings and notes'], ['Micro-solder a component', 'Close-up photos']] },
    } }),
  sk({ id: 'web', name: 'Web Development', family: 'digital', summary: 'Build and publish modern websites, from HTML and CSS to JavaScript and React.', abc: 'Web Development', modes: ['Online', 'Hybrid'], languages: ['English', 'Urdu'], roles: ['Junior web developer', 'Freelance web developer'], prerequisites: { practitioner: 'Web Development — Foundation', advanced: 'Web Development — Practitioner' },
    specs: {
      foundation: { hours: 40, weeks: 6, outcomes: ['Structure pages with HTML', 'Style layouts with CSS', 'Publish a site with Git'], units: ['HTML structure', 'CSS and layout', 'Git and publishing'], tasks: [['Build a personal profile page', 'Link to the published page and a screenshot'], ['Make the page responsive', 'Screenshots on phone and desktop']] },
      practitioner: { hours: 60, weeks: 8, outcomes: ['Program with JavaScript', 'Fetch and show API data', 'Build accessible forms'], units: ['JavaScript fundamentals', 'Working with APIs', 'Forms and accessibility'], tasks: [['Build an interactive to-do app', 'Link and short screen recording'], ['Show live data from an API', 'Link and screenshot']] },
      advanced: { hours: 60, weeks: 8, outcomes: ['Build apps with React', 'Manage state and routing', 'Deploy to production'], units: ['React components', 'State and routing', 'Testing and deployment'], tasks: [['Build a multi-page React app', 'Repository link and demo video'], ['Add tests and deploy', 'Test report screenshot and live link']] },
    } }),
  sk({ id: 'data', name: 'Data Analysis', family: 'digital', summary: 'Clean, analyse and visualise data with spreadsheets and Python.', abc: 'Data Analysis', modes: ['Online'], languages: ['English', 'Urdu'], roles: ['Data analyst', 'Reporting assistant'], prerequisites: { practitioner: 'Data Analysis — Foundation' },
    specs: {
      foundation: { hours: 30, weeks: 5, outcomes: ['Clean data in spreadsheets', 'Summarise with pivot tables', 'Build clear charts'], units: ['Spreadsheet essentials', 'Cleaning data', 'Charts and summaries'], tasks: [['Clean a messy sales sheet', 'Before and after screenshots'], ['Build a one-page dashboard', 'Dashboard screenshot']] },
      practitioner: { hours: 50, weeks: 7, outcomes: ['Analyse data with Python', 'Use pandas confidently', 'Explain findings'], units: ['Python basics for data', 'pandas', 'Presenting findings'], tasks: [['Analyse a public dataset', 'Notebook link'], ['Present your findings', '3-minute video presentation']] },
      advanced: { hours: 50, weeks: 7, outcomes: ['Apply statistics', 'Build simple models', 'Automate reports'], units: ['Statistics for analysts', 'Introduction to modelling', 'Automated reporting'], tasks: [['Run an A/B test analysis', 'Notebook link'], ['Automate a weekly report', 'Screenshot and script link']] },
    } }),
  sk({ id: 'networking', name: 'IT Support & Networking', family: 'digital', summary: 'Support users, set up networks and keep systems secure.', abc: 'IT Network Technician', modes: ['Online', 'Hybrid'], languages: ['English', 'Urdu'], roles: ['IT support technician', 'Network technician'], prerequisites: {},
    specs: {
      foundation: { hours: 30, weeks: 5, outcomes: ['Troubleshoot PCs', 'Install operating systems', 'Support users'], units: ['Hardware basics', 'Operating systems', 'User support'], tasks: [['Install an operating system', 'Screenshots of each step'], ['Resolve a support ticket', 'Written ticket notes']] },
      practitioner: { hours: 45, weeks: 6, outcomes: ['Set up small networks', 'Configure routers and Wi-Fi', 'Diagnose slow connections'], units: ['Networking fundamentals', 'Routers and Wi-Fi', 'Network troubleshooting'], tasks: [['Set up a small office network', 'Network diagram and photos'], ['Fix a slow-internet scenario', 'Video explaining the diagnosis']] },
      advanced: { hours: 45, weeks: 6, outcomes: ['Secure networks', 'Manage users and backups', 'Document systems'], units: ['Network security', 'Users and backups', 'Documentation'], tasks: [['Harden a router', 'Configuration screenshots'], ['Write a backup plan', 'Document upload']] },
    } }),
  sk({ id: 'bookkeeping', name: 'Bookkeeping & Accounting', family: 'business', summary: 'Keep accurate books, prepare statements and manage cash flow for small businesses.', abc: 'Bookkeeping', modes: ['Online', 'Hybrid'], languages: ['Urdu', 'English'], roles: ['Accounts assistant', 'Bookkeeper'], prerequisites: {},
    specs: {
      foundation: { hours: 30, weeks: 5, outcomes: ['Record transactions', 'Keep a cash book', 'Issue invoices'], units: ['Accounting basics', 'The cash book', 'Invoices and receipts'], tasks: [['Record a week of transactions', 'Cash book photo'], ['Issue three invoices', 'Invoice files']] },
      practitioner: { hours: 45, weeks: 6, outcomes: ['Prepare financial statements', 'Reconcile bank accounts', 'Use accounting software'], units: ['Financial statements', 'Bank reconciliation', 'Accounting software'], tasks: [['Prepare an income statement', 'Statement file'], ['Reconcile a bank statement', 'Reconciliation sheet']] },
      advanced: { hours: 40, weeks: 5, outcomes: ['Manage payroll', 'Understand tax basics', 'Advise on cash flow'], units: ['Payroll', 'Tax basics', 'Cash-flow management'], tasks: [['Run a sample payroll', 'Payroll sheet'], ['Write a cash-flow forecast', 'Forecast file']] },
    } }),
  sk({ id: 'marketing', name: 'Digital Marketing', family: 'business', summary: 'Plan, run and measure campaigns across social media, search and content.', abc: 'Digital Marketing', modes: ['Online'], languages: ['English', 'Urdu'], roles: ['Social media executive', 'Digital marketing assistant'], prerequisites: {},
    specs: {
      foundation: { hours: 30, weeks: 5, outcomes: ['Plan a content calendar', 'Write engaging posts', 'Read basic analytics'], units: ['Marketing basics', 'Content and calendars', 'Reading analytics'], tasks: [['Create a two-week content calendar', 'Calendar file'], ['Publish and report on three posts', 'Screenshots and results']] },
      practitioner: { hours: 45, weeks: 6, outcomes: ['Run paid ads', 'Do SEO basics', 'Track conversions'], units: ['Paid social ads', 'SEO basics', 'Conversion tracking'], tasks: [['Set up an ad campaign (sandbox)', 'Campaign screenshots'], ['Audit a website’s SEO', 'Audit report']] },
      advanced: { hours: 40, weeks: 5, outcomes: ['Build a full strategy', 'Manage budgets', 'Report to clients'], units: ['Marketing strategy', 'Budgets and optimisation', 'Client reporting'], tasks: [['Write a 3-month strategy', 'Strategy document'], ['Present a client report', 'Video presentation']] },
    } }),
  sk({ id: 'design', name: 'Graphic Design', family: 'creator', summary: 'Design logos, social media graphics and brand kits that clients love.', abc: 'Graphic Design', modes: ['Online', 'Hybrid'], languages: ['English', 'Urdu'], roles: ['Graphic designer', 'Freelance designer'], prerequisites: {},
    specs: {
      foundation: { hours: 30, weeks: 5, outcomes: ['Apply design principles', 'Use type and colour', 'Design social posts'], units: ['Design principles', 'Typography and colour', 'Social media graphics'], tasks: [['Design five social posts', 'Image files'], ['Redesign a poor flyer', 'Before and after images']] },
      practitioner: { hours: 45, weeks: 6, outcomes: ['Design logos', 'Build brand kits', 'Work from a client brief'], units: ['Logo design', 'Brand identity', 'Working with clients'], tasks: [['Design a logo from a brief', 'Concepts and final logo'], ['Create a brand kit', 'Brand guidelines PDF']] },
      advanced: { hours: 40, weeks: 5, outcomes: ['Design for print and packaging', 'Motion basics', 'Build a portfolio'], units: ['Print and packaging', 'Motion graphics basics', 'Portfolio building'], tasks: [['Design product packaging', 'Mock-up images'], ['Publish your portfolio', 'Portfolio link']] },
    } }),
  sk({ id: 'english', name: 'Workplace English & Communication', family: 'foundation', summary: 'Speak, write and present with confidence at work and in interviews.', abc: null, modes: ['Online', 'Assisted centre'], languages: ['English', 'Urdu'], roles: ['Customer service representative', 'Office assistant'], prerequisites: {},
    specs: {
      foundation: { hours: 25, weeks: 5, outcomes: ['Introduce yourself professionally', 'Write clear messages', 'Listen actively'], units: ['Speaking with confidence', 'Writing clear messages', 'Active listening'], tasks: [['Record a self-introduction', '1-minute video'], ['Write three workplace emails', 'Email drafts']] },
      practitioner: { hours: 30, weeks: 6, outcomes: ['Take part in meetings', 'Handle customer calls', 'Present ideas'], units: ['Meetings', 'Customer calls', 'Presentations'], tasks: [['Role-play a customer call', 'Audio recording'], ['Give a 3-minute presentation', 'Video']] },
      advanced: { hours: 25, weeks: 5, outcomes: ['Negotiate', 'Write reports', 'Ace interviews'], units: ['Negotiation', 'Report writing', 'Interview mastery'], tasks: [['Write a short report', 'Report file'], ['Mock interview', 'Video recording']] },
    } }),
]

export type Centre = { id: string; name: string; city: string; labs: string[]; capacity: number }
export const centres: Centre[] = [
  { id: 'c-lhr', name: 'Sample Technical Institute — Lahore', city: 'Lahore', labs: ['Solar lab', 'Electrical lab', 'Computer lab'], capacity: 180 },
  { id: 'c-khi', name: 'Sample Skills Centre — Karachi', city: 'Karachi', labs: ['Computer lab', 'Electronics lab'], capacity: 140 },
  { id: 'c-isb', name: 'Sample Training Hub — Islamabad', city: 'Islamabad', labs: ['Computer lab', 'Networking lab'], capacity: 120 },
  { id: 'c-mul', name: 'Sample Assisted Centre — Multan', city: 'Multan', labs: ['Assisted learning room', 'Electrical lab'], capacity: 80 },
]

export type Instructor = { id: string; name: string; initials: string; title: string }
export const instructors: Instructor[] = [
  { id: 'ins1', name: 'Sample Instructor — Tariq', initials: 'TQ', title: 'Master electrician & ABC assessor' },
  { id: 'ins2', name: 'Sample Instructor — Nadia', initials: 'ND', title: 'Senior web developer' },
  { id: 'ins3', name: 'Sample Instructor — Faisal', initials: 'FS', title: 'Data analyst' },
  { id: 'ins4', name: 'Sample Instructor — Rabia', initials: 'RB', title: 'Brand designer & marketer' },
  { id: 'ins5', name: 'Sample Instructor — Saad', initials: 'SD', title: 'Communication trainer' },
]

export type Cohort = {
  id: string
  skillId: string
  level: LevelKey
  mode: Mode
  centreId: string | null
  instructorId: string
  start: string // ISO date
  schedule: { days: number[]; time: string; hours: number } // days: 0=Sun..6=Sat
  seats: number
  enrolled: number
  fee: number
  language: string
}

export const cohorts: Cohort[] = [
  { id: 'co1', skillId: 'solar', level: 'foundation', mode: 'Hybrid', centreId: 'c-lhr', instructorId: 'ins1', start: '2026-10-26', schedule: { days: [1, 3], time: '18:00', hours: 2 }, seats: 25, enrolled: 21, fee: 12000, language: 'Urdu' },
  { id: 'co2', skillId: 'solar', level: 'practitioner', mode: 'Hybrid', centreId: 'c-lhr', instructorId: 'ins1', start: '2026-12-07', schedule: { days: [2, 4], time: '18:00', hours: 2 }, seats: 20, enrolled: 9, fee: 18000, language: 'Urdu' },
  { id: 'co3', skillId: 'solar', level: 'foundation', mode: 'Assisted centre', centreId: 'c-mul', instructorId: 'ins1', start: '2026-12-01', schedule: { days: [6], time: '10:00', hours: 4 }, seats: 20, enrolled: 6, fee: 8000, language: 'Urdu' },
  { id: 'co4', skillId: 'wiring', level: 'foundation', mode: 'Hybrid', centreId: 'c-mul', instructorId: 'ins1', start: '2026-11-24', schedule: { days: [1, 3], time: '16:00', hours: 2 }, seats: 20, enrolled: 14, fee: 10000, language: 'Urdu' },
  { id: 'co5', skillId: 'web', level: 'foundation', mode: 'Online', centreId: null, instructorId: 'ins2', start: '2026-11-17', schedule: { days: [2, 4], time: '20:00', hours: 1.5 }, seats: 40, enrolled: 33, fee: 9000, language: 'English' },
  { id: 'co6', skillId: 'web', level: 'practitioner', mode: 'Online', centreId: null, instructorId: 'ins2', start: '2026-12-01', schedule: { days: [1, 3], time: '20:00', hours: 1.5 }, seats: 35, enrolled: 18, fee: 14000, language: 'English' },
  { id: 'co7', skillId: 'data', level: 'foundation', mode: 'Online', centreId: null, instructorId: 'ins3', start: '2026-11-22', schedule: { days: [0], time: '11:00', hours: 3 }, seats: 40, enrolled: 25, fee: 8000, language: 'Urdu' },
  { id: 'co8', skillId: 'networking', level: 'foundation', mode: 'Hybrid', centreId: 'c-isb', instructorId: 'ins3', start: '2026-12-02', schedule: { days: [3, 5], time: '17:00', hours: 2 }, seats: 25, enrolled: 11, fee: 11000, language: 'English' },
  { id: 'co9', skillId: 'bookkeeping', level: 'foundation', mode: 'Online', centreId: null, instructorId: 'ins5', start: '2026-11-19', schedule: { days: [4], time: '19:00', hours: 2 }, seats: 40, enrolled: 20, fee: 7000, language: 'Urdu' },
  { id: 'co10', skillId: 'marketing', level: 'foundation', mode: 'Online', centreId: null, instructorId: 'ins4', start: '2026-11-25', schedule: { days: [2], time: '19:30', hours: 2 }, seats: 40, enrolled: 29, fee: 8000, language: 'Urdu' },
  { id: 'co11', skillId: 'design', level: 'foundation', mode: 'Hybrid', centreId: 'c-khi', instructorId: 'ins4', start: '2026-11-30', schedule: { days: [0, 3], time: '17:00', hours: 2 }, seats: 25, enrolled: 17, fee: 10000, language: 'Urdu' },
  { id: 'co12', skillId: 'mobile-repair', level: 'foundation', mode: 'Assisted centre', centreId: 'c-khi', instructorId: 'ins1', start: '2026-12-05', schedule: { days: [6], time: '10:00', hours: 4 }, seats: 16, enrolled: 7, fee: 9000, language: 'Urdu' },
  { id: 'co13', skillId: 'english', level: 'foundation', mode: 'Online', centreId: null, instructorId: 'ins5', start: '2026-11-18', schedule: { days: [1, 5], time: '19:00', hours: 1 }, seats: 50, enrolled: 41, fee: 0, language: 'English' },
]

export type Role = { id: string; name: string; needs: { skillId: string; level: LevelKey }[] }
export const roles: Role[] = [
  { id: 'r-solar', name: 'Solar installer', needs: [{ skillId: 'wiring', level: 'foundation' }, { skillId: 'solar', level: 'practitioner' }, { skillId: 'english', level: 'foundation' }] },
  { id: 'r-web', name: 'Junior web developer', needs: [{ skillId: 'web', level: 'practitioner' }, { skillId: 'english', level: 'practitioner' }, { skillId: 'design', level: 'foundation' }] },
  { id: 'r-data', name: 'Data analyst', needs: [{ skillId: 'data', level: 'practitioner' }, { skillId: 'english', level: 'practitioner' }, { skillId: 'bookkeeping', level: 'foundation' }] },
  { id: 'r-marketing', name: 'Digital marketing assistant', needs: [{ skillId: 'marketing', level: 'practitioner' }, { skillId: 'design', level: 'foundation' }, { skillId: 'english', level: 'foundation' }] },
  { id: 'r-it', name: 'IT support technician', needs: [{ skillId: 'networking', level: 'practitioner' }, { skillId: 'english', level: 'foundation' }] },
]

export type QuizQ = { q: string; options: string[]; answer: number; explain: string }
export const quizBank: Record<string, QuizQ[]> = {
  trades: [
    { q: 'What is the first step before working on any circuit?', options: ['Test it is live', 'Isolate the supply and prove it is dead', 'Put on gloves', 'Call the customer'], answer: 1, explain: 'Safe isolation always comes first.' },
    { q: 'Which device converts DC from panels into AC for the home?', options: ['Charge controller', 'Inverter', 'Breaker', 'Meter'], answer: 1, explain: 'The inverter converts DC to AC.' },
    { q: 'Earthing provides…', options: ['Extra power', 'A safe path for fault current', 'Faster charging', 'Better lighting'], answer: 1, explain: 'Earthing carries fault current safely to ground.' },
  ],
  digital: [
    { q: 'Which language structures a web page?', options: ['CSS', 'HTML', 'Python', 'SQL'], answer: 1, explain: 'HTML gives structure; CSS gives style.' },
    { q: 'A layout that adapts to phones and desktops is…', options: ['Static', 'Responsive', 'Compiled', 'Encrypted'], answer: 1, explain: 'Responsive layouts adapt to screen size.' },
    { q: 'What should you do first when code shows an error?', options: ['Delete the file', 'Read the error message and reproduce it', 'Restart the computer', 'Ask for a refund'], answer: 1, explain: 'Understanding and reproducing the error is the first step of debugging.' },
  ],
  business: [
    { q: 'Which statement shows profit over a period?', options: ['Balance sheet', 'Income statement', 'Invoice', 'Receipt'], answer: 1, explain: 'The income statement shows revenue minus expenses.' },
    { q: 'A KPI is…', options: ['A tax form', 'A key measure of progress', 'A bank account', 'A type of invoice'], answer: 1, explain: 'Key performance indicators track progress towards goals.' },
    { q: 'Reconciliation compares your records with…', options: ['Competitor prices', 'The bank statement', 'Social media', 'Your budget only'], answer: 1, explain: 'Bank reconciliation matches your books to the bank.' },
  ],
  creator: [
    { q: 'A client brief describes…', options: ['Your fees only', 'What the client needs', 'Your portfolio', 'The software you use'], answer: 1, explain: 'The brief captures the client’s goals and requirements.' },
    { q: 'Visual hierarchy helps viewers…', options: ['See the most important thing first', 'Print faster', 'Use fewer colours', 'Pay sooner'], answer: 0, explain: 'Hierarchy guides the eye.' },
    { q: 'A strong portfolio shows…', options: ['Every project you ever did', 'Your best, most relevant work', 'Only certificates', 'Your prices'], answer: 1, explain: 'Quality and relevance beat quantity.' },
  ],
  foundation: [
    { q: 'Active listening means…', options: ['Waiting for your turn to talk', 'Giving full attention and checking understanding', 'Taking notes only', 'Agreeing with everything'], answer: 1, explain: 'Listen fully, then confirm what you heard.' },
    { q: 'STAR stands for…', options: ['Skills, Talent, Ability, Results', 'Situation, Task, Action, Result', 'Start, Try, Act, Repeat', 'Speak, Think, Answer, Rest'], answer: 1, explain: 'STAR structures behavioural interview answers.' },
    { q: 'A professional email should start with…', options: ['A clear subject and greeting', 'An emoji', 'Your CV', 'No subject'], answer: 0, explain: 'Clear subjects and greetings set the right tone.' },
  ],
}

// Sample classmates for rosters, grading queues and the guardian demo.
export const classmates = [
  { id: 'l1', name: 'Sample Learner — Bilal', initials: 'BL', progress: 72, attendance: 92, avg: 81 },
  { id: 'l2', name: 'Sample Learner — Hina', initials: 'HN', progress: 88, attendance: 100, avg: 90 },
  { id: 'l3', name: 'Sample Learner — Imran', initials: 'IM', progress: 35, attendance: 58, avg: 62 },
  { id: 'l4', name: 'Sample Learner — Zara', initials: 'ZR', progress: 64, attendance: 83, avg: 77 },
  { id: 'l5', name: 'Sample Learner — Usama', initials: 'UM', progress: 20, attendance: 50, avg: 55 },
]

export const findSkill = (id: string) => skills.find((s) => s.id === id)
export const findCentre = (id: string | null) => centres.find((c) => c.id === id)
export const findInstructor = (id: string) => instructors.find((i) => i.id === id)
export const familyName = (slug: string) => families.find((f) => f.slug === slug)?.name ?? slug
export const pkr = (n: number) => (n === 0 ? 'Free' : `PKR ${n.toLocaleString('en-PK')}`)
export const fmtDate = (iso: string) => new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const scheduleText = (c: Cohort) => `${c.schedule.days.map((d) => dayNames[d]).join(' & ')} · ${c.schedule.time} · ${c.schedule.hours} hrs`

export const isoLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export type Session = { id: string; cohortId: string; n: number; date: string; time: string; hours: number; topic: string }

/** Generates the cohort's live sessions from its schedule and length. */
export function sessionsFor(c: Cohort, skill: Skill): Session[] {
  const lvl = skill.levels[c.level]
  const total = Math.min(lvl.weeks * c.schedule.days.length, 16)
  const out: Session[] = []
  const d = new Date(c.start + 'T00:00:00')
  let n = 0
  for (let i = 0; n < total && i < 200; i++) {
    if (c.schedule.days.includes(d.getDay())) {
      const unit = lvl.units[Math.min(lvl.units.length - 1, Math.floor((n / total) * lvl.units.length))]
      out.push({ id: `${c.id}-s${n}`, cohortId: c.id, n: n + 1, date: isoLocal(d), time: c.schedule.time, hours: c.schedule.hours, topic: n === total - 1 ? 'Review and practical assessment prep' : unit.title })
      n++
    }
    d.setDate(d.getDate() + 1)
  }
  return out
}

export const TODAY = isoLocal(new Date())
