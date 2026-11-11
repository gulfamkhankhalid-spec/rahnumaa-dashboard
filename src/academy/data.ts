// Skill Academy — SAMPLE catalogue for the prototype. Instructors, institutions,
// prices, ratings and enrolment numbers are illustrative only.

export type Level = 'Beginner' | 'Intermediate' | 'Advanced'
export type Lang = 'English' | 'Urdu'
export type LessonKind = 'video' | 'reading' | 'quiz' | 'assignment'

export type Lesson = { id: string; title: string; kind: LessonKind; minutes: number }
export type Module = { title: string; lessons: Lesson[] }

export type Category = { slug: string; name: string; icon: string }

export const categories: Category[] = [
  { slug: 'it', name: 'Digital & IT', icon: 'layers' },
  { slug: 'data', name: 'Data & AI', icon: 'grid' },
  { slug: 'business', name: 'Business & Finance', icon: 'briefcase' },
  { slug: 'marketing', name: 'Marketing & Sales', icon: 'rocket' },
  { slug: 'freelance', name: 'Freelancing & Creator Skills', icon: 'compass' },
  { slug: 'tvet', name: 'Technical & Vocational', icon: 'award' },
  { slug: 'foundation', name: 'Foundation & Life Skills', icon: 'book' },
]

export type Instructor = { id: string; name: string; initials: string; title: string; bio: string; learners: number; courses: number; rating: number }

export const instructors: Instructor[] = [
  { id: 'i1', name: 'Sample Instructor — Software', initials: 'SW', title: 'Senior Software Engineer', bio: 'Builds web products for a living and has taught programming to beginners for eight years.', learners: 48200, courses: 3, rating: 4.8 },
  { id: 'i2', name: 'Sample Instructor — Data', initials: 'DA', title: 'Data Scientist', bio: 'Works on analytics and machine learning; passionate about making data skills accessible in Urdu.', learners: 31900, courses: 3, rating: 4.7 },
  { id: 'i3', name: 'Sample Instructor — Business', initials: 'BF', title: 'Chartered Accountant', bio: 'Advises small businesses on bookkeeping, tax and growth.', learners: 22500, courses: 2, rating: 4.6 },
  { id: 'i4', name: 'Sample Instructor — Marketing', initials: 'MK', title: 'Growth Marketing Lead', bio: 'Has run performance marketing for e-commerce brands across South Asia and the Gulf.', learners: 39700, courses: 2, rating: 4.7 },
  { id: 'i5', name: 'Sample Instructor — Freelance', initials: 'FR', title: 'Top-rated Freelancer', bio: 'Full-time freelancer for a decade; mentors new freelancers on finding first clients.', learners: 56100, courses: 2, rating: 4.9 },
  { id: 'i6', name: 'Sample Instructor — Electrical', initials: 'EL', title: 'Master Electrician & Assessor', bio: 'Licensed electrician and certified trade assessor with 20 years on site.', learners: 12800, courses: 2, rating: 4.8 },
  { id: 'i7', name: 'Sample Instructor — Communication', initials: 'CM', title: 'Language & Workplace Trainer', bio: 'Helps graduates and professionals communicate with confidence at work.', learners: 64300, courses: 2, rating: 4.7 },
]

export type Partner = { id: string; name: string; kind: 'University' | 'Institute' | 'Industry' | 'Skill Academy' }

export const partners: Partner[] = [
  { id: 'u1', name: 'Sample University of Technology', kind: 'University' },
  { id: 'u2', name: 'Sample Business School', kind: 'University' },
  { id: 't1', name: 'Sample Technical Institute', kind: 'Institute' },
  { id: 'x1', name: 'Sample Tech Company', kind: 'Industry' },
  { id: 'sa', name: 'Skill Academy Originals', kind: 'Skill Academy' },
]

export type CourseType = 'Course' | 'Guided Project'

export type Course = {
  slug: string
  title: string
  type: CourseType
  category: string
  level: Level
  languages: Lang[]
  hours: number
  rating: number
  reviews: number
  enrolled: number
  instructorIds: string[]
  partnerId: string
  price: number // PKR for a certificate; 0 = free certificate
  abc: boolean
  skills: string[]
  summary: string
  outcomes: string[]
  modules: Module[]
  updated: string
}

let lessonSeq = 0
function mod(title: string, opts: { assignment?: boolean } = {}): Module {
  const base = title.replace(/^[^:]+:\s*/, '')
  // Lower-case only the first letter so acronyms like "AI" or "PV" stay intact.
  const lower = base.charAt(0).toLowerCase() + base.slice(1)
  const lessons: Lesson[] = [
    { id: `l${++lessonSeq}`, title: `Introduction to ${lower}`, kind: 'video', minutes: 8 },
    { id: `l${++lessonSeq}`, title: `${base} in practice`, kind: 'video', minutes: 12 },
    { id: `l${++lessonSeq}`, title: `Reading: key ideas of ${lower}`, kind: 'reading', minutes: 10 },
    { id: `l${++lessonSeq}`, title: `Practice quiz: ${base}`, kind: 'quiz', minutes: 10 },
  ]
  if (opts.assignment) lessons.push({ id: `l${++lessonSeq}`, title: `Peer-graded project: apply ${lower}`, kind: 'assignment', minutes: 60 })
  return { title, lessons }
}

function c(partial: Omit<Course, 'modules'> & { moduleTitles: string[] }): Course {
  const { moduleTitles, ...rest } = partial
  return { ...rest, modules: moduleTitles.map((t, i) => mod(t, { assignment: i === moduleTitles.length - 1 })) }
}

export const courses: Course[] = [
  c({ slug: 'web-development-foundations', title: 'Web Development Foundations', type: 'Course', category: 'it', level: 'Beginner', languages: ['English', 'Urdu'], hours: 24, rating: 4.8, reviews: 3120, enrolled: 41200, instructorIds: ['i1'], partnerId: 'sa', price: 4500, abc: true, skills: ['HTML', 'CSS', 'Responsive design', 'Git'], summary: 'Build and publish your first websites with HTML and CSS, then share your work with Git.', outcomes: ['Structure pages with semantic HTML', 'Style responsive layouts with modern CSS', 'Use Git to track and publish your work', 'Publish a portfolio site online'], moduleTitles: ['Week 1: How the web works', 'Week 2: HTML structure', 'Week 3: CSS and layout', 'Week 4: Responsive design', 'Week 5: Git and publishing'], updated: 'Oct 2026' }),
  c({ slug: 'javascript-essentials', title: 'JavaScript Essentials', type: 'Course', category: 'it', level: 'Beginner', languages: ['English'], hours: 30, rating: 4.7, reviews: 2210, enrolled: 28900, instructorIds: ['i1'], partnerId: 'u1', price: 5500, abc: true, skills: ['JavaScript', 'DOM', 'Debugging', 'APIs'], summary: 'Learn programming fundamentals with JavaScript and make web pages interactive.', outcomes: ['Write programs with variables, functions and loops', 'Update pages with the DOM', 'Fetch data from web APIs', 'Debug code methodically'], moduleTitles: ['Week 1: Programming basics', 'Week 2: Functions and arrays', 'Week 3: The DOM', 'Week 4: Working with APIs', 'Week 5: Debugging and testing'], updated: 'Sep 2026' }),
  c({ slug: 'react-front-end', title: 'Front-End Apps with React', type: 'Course', category: 'it', level: 'Intermediate', languages: ['English'], hours: 28, rating: 4.7, reviews: 1180, enrolled: 14300, instructorIds: ['i1'], partnerId: 'x1', price: 6500, abc: false, skills: ['React', 'Components', 'State management', 'Routing'], summary: 'Build modern single-page applications with components, state and routing.', outcomes: ['Design apps as reusable components', 'Manage state and side effects', 'Add routing and forms', 'Deploy a production build'], moduleTitles: ['Week 1: Components and props', 'Week 2: State and events', 'Week 3: Effects and data', 'Week 4: Routing and forms', 'Week 5: Shipping to production'], updated: 'Oct 2026' }),
  c({ slug: 'it-support-fundamentals', title: 'IT Support Fundamentals', type: 'Course', category: 'it', level: 'Beginner', languages: ['English', 'Urdu'], hours: 20, rating: 4.6, reviews: 980, enrolled: 17600, instructorIds: ['i1'], partnerId: 't1', price: 3500, abc: true, skills: ['Troubleshooting', 'Networking basics', 'Operating systems', 'Customer support'], summary: 'Get job-ready for help-desk and IT support roles.', outcomes: ['Troubleshoot hardware and software problems', 'Set up basic networks', 'Support users professionally'], moduleTitles: ['Week 1: Computer hardware', 'Week 2: Operating systems', 'Week 3: Networking basics', 'Week 4: Customer support'], updated: 'Aug 2026' }),
  c({ slug: 'data-analysis-spreadsheets', title: 'Data Analysis with Spreadsheets', type: 'Course', category: 'data', level: 'Beginner', languages: ['English', 'Urdu'], hours: 18, rating: 4.8, reviews: 2640, enrolled: 36800, instructorIds: ['i2'], partnerId: 'sa', price: 3500, abc: true, skills: ['Spreadsheets', 'Formulas', 'Pivot tables', 'Charts'], summary: 'Clean, analyse and visualise data using everyday spreadsheet tools.', outcomes: ['Clean messy data', 'Summarise with formulas and pivot tables', 'Build clear charts and dashboards'], moduleTitles: ['Week 1: Spreadsheet basics', 'Week 2: Cleaning data', 'Week 3: Formulas and pivot tables', 'Week 4: Charts and dashboards'], updated: 'Oct 2026' }),
  c({ slug: 'python-for-data', title: 'Python for Data Analysis', type: 'Course', category: 'data', level: 'Intermediate', languages: ['English'], hours: 32, rating: 4.7, reviews: 1730, enrolled: 21500, instructorIds: ['i2'], partnerId: 'u1', price: 6000, abc: true, skills: ['Python', 'pandas', 'Data visualisation', 'Statistics'], summary: 'Use Python and pandas to explore real datasets and communicate findings.', outcomes: ['Write Python for data tasks', 'Wrangle data with pandas', 'Visualise and explain results'], moduleTitles: ['Week 1: Python basics', 'Week 2: Working with pandas', 'Week 3: Exploring data', 'Week 4: Visualisation', 'Week 5: Telling stories with data'], updated: 'Sep 2026' }),
  c({ slug: 'intro-to-ai', title: 'AI for Everyone: Practical Foundations', type: 'Course', category: 'data', level: 'Beginner', languages: ['English', 'Urdu'], hours: 8, rating: 4.8, reviews: 4210, enrolled: 58300, instructorIds: ['i2'], partnerId: 'sa', price: 0, abc: false, skills: ['AI literacy', 'Prompting', 'Responsible AI'], summary: 'Understand what AI can and cannot do, and use AI tools responsibly at work and study.', outcomes: ['Explain how modern AI works', 'Use AI assistants effectively', 'Recognise risks and limits'], moduleTitles: ['Week 1: What AI is', 'Week 2: Using AI tools', 'Week 3: Responsible AI'], updated: 'Nov 2026' }),
  c({ slug: 'bookkeeping-basics', title: 'Bookkeeping and Accounting Basics', type: 'Course', category: 'business', level: 'Beginner', languages: ['English', 'Urdu'], hours: 16, rating: 4.6, reviews: 1040, enrolled: 15900, instructorIds: ['i3'], partnerId: 'u2', price: 3500, abc: true, skills: ['Bookkeeping', 'Financial statements', 'Cash flow'], summary: 'Keep accurate books for a small business and read its financial statements.', outcomes: ['Record transactions correctly', 'Prepare basic financial statements', 'Manage cash flow'], moduleTitles: ['Week 1: Accounting principles', 'Week 2: Recording transactions', 'Week 3: Financial statements', 'Week 4: Cash flow'], updated: 'Jul 2026' }),
  c({ slug: 'small-business-launch', title: 'Start and Run a Small Business', type: 'Course', category: 'business', level: 'Beginner', languages: ['Urdu', 'English'], hours: 14, rating: 4.7, reviews: 860, enrolled: 12400, instructorIds: ['i3'], partnerId: 'u2', price: 0, abc: false, skills: ['Business planning', 'Pricing', 'Customer discovery'], summary: 'Turn an idea into a small business: test demand, price well and plan your first year.', outcomes: ['Validate a business idea', 'Set prices that cover costs', 'Write a one-page plan'], moduleTitles: ['Week 1: Finding an idea', 'Week 2: Customers and demand', 'Week 3: Pricing and costs', 'Week 4: Your first-year plan'], updated: 'Sep 2026' }),
  c({ slug: 'digital-marketing', title: 'Digital Marketing Fundamentals', type: 'Course', category: 'marketing', level: 'Beginner', languages: ['English', 'Urdu'], hours: 22, rating: 4.7, reviews: 2380, enrolled: 33600, instructorIds: ['i4'], partnerId: 'x1', price: 4500, abc: true, skills: ['SEO', 'Social media', 'Content marketing', 'Analytics'], summary: 'Plan and run digital campaigns across search, social and content.', outcomes: ['Plan a digital marketing strategy', 'Grow organic reach with SEO and content', 'Measure results with analytics'], moduleTitles: ['Week 1: Marketing strategy', 'Week 2: SEO', 'Week 3: Social media', 'Week 4: Content marketing', 'Week 5: Measuring results'], updated: 'Oct 2026' }),
  c({ slug: 'ppc-advertising', title: 'Pay-Per-Click Advertising', type: 'Guided Project', category: 'marketing', level: 'Intermediate', languages: ['English'], hours: 3, rating: 4.6, reviews: 410, enrolled: 6200, instructorIds: ['i4'], partnerId: 'sa', price: 1500, abc: false, skills: ['PPC', 'Keyword research', 'Ad copy'], summary: 'In this hands-on project, set up a search ad campaign step by step in a practice account.', outcomes: ['Research keywords', 'Write effective ads', 'Set budgets and bids'], moduleTitles: ['Project: Build a search campaign'], updated: 'Oct 2026' }),
  c({ slug: 'freelancing-launchpad', title: 'Freelancing Launchpad', type: 'Course', category: 'freelance', level: 'Beginner', languages: ['Urdu', 'English'], hours: 12, rating: 4.9, reviews: 5120, enrolled: 72400, instructorIds: ['i5'], partnerId: 'sa', price: 2500, abc: false, skills: ['Freelancing', 'Proposals', 'Client communication', 'Pricing'], summary: 'Choose a niche, build a portfolio, win your first client and get paid safely.', outcomes: ['Pick a profitable niche', 'Write proposals that win', 'Price and deliver work professionally'], moduleTitles: ['Week 1: Choosing your niche', 'Week 2: Portfolio and profile', 'Week 3: Proposals and pricing', 'Week 4: Delivering and getting paid'], updated: 'Nov 2026' }),
  c({ slug: 'graphic-design-basics', title: 'Graphic Design Basics', type: 'Course', category: 'freelance', level: 'Beginner', languages: ['English', 'Urdu'], hours: 18, rating: 4.7, reviews: 1650, enrolled: 24800, instructorIds: ['i5'], partnerId: 'sa', price: 3500, abc: false, skills: ['Typography', 'Colour', 'Layout', 'Branding'], summary: 'Learn the principles of design and create social posts, logos and simple brand kits.', outcomes: ['Apply typography, colour and layout', 'Design social media graphics', 'Create a simple brand kit'], moduleTitles: ['Week 1: Design principles', 'Week 2: Typography and colour', 'Week 3: Layout', 'Week 4: Branding project'], updated: 'Aug 2026' }),
  c({ slug: 'solar-pv-installation', title: 'Solar PV Installation', type: 'Course', category: 'tvet', level: 'Beginner', languages: ['Urdu', 'English'], hours: 26, rating: 4.8, reviews: 720, enrolled: 9800, instructorIds: ['i6'], partnerId: 't1', price: 5000, abc: true, skills: ['Solar PV', 'Electrical safety', 'Inverters', 'Site survey'], summary: 'Plan, install and maintain residential solar systems safely. Practical assessment through ABC.', outcomes: ['Survey a site and size a system', 'Install panels, inverters and batteries safely', 'Test, commission and maintain systems'], moduleTitles: ['Week 1: Solar basics and safety', 'Week 2: Site survey and sizing', 'Week 3: Panels and mounting', 'Week 4: Inverters and batteries', 'Week 5: Testing and maintenance'], updated: 'Oct 2026' }),
  c({ slug: 'domestic-electrical-wiring', title: 'Domestic Electrical Wiring', type: 'Course', category: 'tvet', level: 'Beginner', languages: ['Urdu'], hours: 30, rating: 4.7, reviews: 540, enrolled: 7100, instructorIds: ['i6'], partnerId: 't1', price: 4500, abc: true, skills: ['Wiring', 'Circuit protection', 'Electrical safety'], summary: 'Learn safe house-wiring practice, from reading circuits to fitting protection devices.', outcomes: ['Read simple circuit diagrams', 'Choose correct cables and protection', 'Wire and test domestic circuits safely'], moduleTitles: ['Week 1: Electrical safety', 'Week 2: Circuits and diagrams', 'Week 3: Cables and protection', 'Week 4: Wiring and testing'], updated: 'Sep 2026' }),
  c({ slug: 'workplace-english', title: 'English for the Workplace', type: 'Course', category: 'foundation', level: 'Beginner', languages: ['English', 'Urdu'], hours: 20, rating: 4.7, reviews: 3890, enrolled: 66100, instructorIds: ['i7'], partnerId: 'sa', price: 0, abc: false, skills: ['Business English', 'Email writing', 'Interviews'], summary: 'Speak and write with confidence at work — emails, meetings and interviews.', outcomes: ['Write clear professional emails', 'Take part in meetings confidently', 'Prepare for interviews in English'], moduleTitles: ['Week 1: Everyday workplace English', 'Week 2: Emails and messages', 'Week 3: Meetings and calls', 'Week 4: Interviews'], updated: 'Oct 2026' }),
  c({ slug: 'financial-literacy', title: 'Personal Finance and Money Habits', type: 'Course', category: 'foundation', level: 'Beginner', languages: ['Urdu', 'English'], hours: 6, rating: 4.8, reviews: 1470, enrolled: 25300, instructorIds: ['i3'], partnerId: 'sa', price: 0, abc: false, skills: ['Budgeting', 'Saving', 'Digital payments'], summary: 'Build healthy money habits: budgeting, saving and using digital payments safely.', outcomes: ['Make and keep a budget', 'Build an emergency fund', 'Avoid common scams'], moduleTitles: ['Week 1: Budgeting', 'Week 2: Saving and goals', 'Week 3: Staying safe with money'], updated: 'Jun 2026' }),
  c({ slug: 'interview-skills', title: 'Job Search and Interview Skills', type: 'Guided Project', category: 'foundation', level: 'Beginner', languages: ['English', 'Urdu'], hours: 2, rating: 4.7, reviews: 690, enrolled: 11800, instructorIds: ['i7'], partnerId: 'sa', price: 0, abc: false, skills: ['CV writing', 'Interviewing'], summary: 'A guided project: build a targeted CV and practise answers to common interview questions.', outcomes: ['Tailor a CV to a role', 'Answer common interview questions'], moduleTitles: ['Project: CV and interview practice'], updated: 'Oct 2026' }),
]

export type ProgramType = 'Specialization' | 'Professional Certificate'

export type Program = {
  slug: string
  title: string
  type: ProgramType
  category: string
  level: Level
  months: number
  partnerId: string
  courseSlugs: string[]
  summary: string
  career?: string
  price: number // PKR per month
}

export const programs: Program[] = [
  { slug: 'web-developer', title: 'Web Developer', type: 'Professional Certificate', category: 'it', level: 'Beginner', months: 6, partnerId: 'x1', courseSlugs: ['web-development-foundations', 'javascript-essentials', 'react-front-end'], summary: 'Get job-ready for an entry-level web developer role in about six months — no experience needed.', career: 'Junior web developer · Front-end developer · Freelance web developer', price: 3000 },
  { slug: 'data-analyst', title: 'Data Analyst', type: 'Professional Certificate', category: 'data', level: 'Beginner', months: 5, partnerId: 'u1', courseSlugs: ['data-analysis-spreadsheets', 'python-for-data', 'intro-to-ai'], summary: 'Learn the tools analysts use every day and build a portfolio of real projects.', career: 'Data analyst · Business analyst · Reporting analyst', price: 3000 },
  { slug: 'digital-marketing-specialist', title: 'Digital Marketing', type: 'Specialization', category: 'marketing', level: 'Beginner', months: 3, partnerId: 'x1', courseSlugs: ['digital-marketing', 'ppc-advertising', 'graphic-design-basics'], summary: 'Plan, run and measure campaigns, and create the visuals to go with them.', price: 2500 },
  { slug: 'freelancer-ready', title: 'Freelancer Ready', type: 'Specialization', category: 'freelance', level: 'Beginner', months: 2, partnerId: 'sa', courseSlugs: ['freelancing-launchpad', 'graphic-design-basics', 'workplace-english'], summary: 'Pick a skill, build a portfolio and win clients — with the communication skills to keep them.', price: 2000 },
  { slug: 'solar-technician', title: 'Solar Technician', type: 'Professional Certificate', category: 'tvet', level: 'Beginner', months: 4, partnerId: 't1', courseSlugs: ['domestic-electrical-wiring', 'solar-pv-installation'], summary: 'From electrical safety to commissioning solar systems, ending in an ABC practical assessment.', career: 'Solar installer · Electrical technician · Maintenance technician', price: 2500 },
]

export type Review = { name: string; rating: number; text: string; date: string }

export const sampleReviews: Review[] = [
  { name: 'Learner from Lahore', rating: 5, text: 'Clear explanations and the Urdu subtitles helped a lot. I finished it on my phone.', date: 'Oct 2026' },
  { name: 'Learner from Karachi', rating: 5, text: 'The projects were practical. I used my final project in my portfolio and got interviews.', date: 'Sep 2026' },
  { name: 'Learner from Peshawar', rating: 4, text: 'Very good content. I would like more practice quizzes in the later weeks.', date: 'Sep 2026' },
]

export type QuizQ = { q: string; options: string[]; answer: number; explain: string }

// Small per-category question banks used for every practice quiz in the prototype.
export const quizBank: Record<string, QuizQ[]> = {
  it: [
    { q: 'Which language defines the structure of a web page?', options: ['CSS', 'HTML', 'SQL', 'Python'], answer: 1, explain: 'HTML describes structure; CSS describes presentation.' },
    { q: 'What does a version control system like Git help you do?', options: ['Design logos', 'Track changes to code over time', 'Speed up the internet', 'Host email'], answer: 1, explain: 'Git records every change so you can review or undo it.' },
    { q: 'A layout that adapts to phone and desktop screens is called…', options: ['Responsive', 'Static', 'Encrypted', 'Compiled'], answer: 0, explain: 'Responsive design adapts to screen size.' },
  ],
  data: [
    { q: 'What is the first step before analysing a new dataset?', options: ['Build a chart', 'Clean and check the data', 'Train an AI model', 'Delete outliers'], answer: 1, explain: 'Cleaning and checking prevents misleading results.' },
    { q: 'A pivot table is mainly used to…', options: ['Summarise data by groups', 'Encrypt data', 'Draw logos', 'Send email'], answer: 0, explain: 'Pivot tables group and summarise rows.' },
    { q: 'Which chart best shows change over time?', options: ['Pie chart', 'Line chart', 'Word cloud', 'Map'], answer: 1, explain: 'Line charts show trends across time.' },
  ],
  business: [
    { q: 'Which statement shows a business’s profit over a period?', options: ['Balance sheet', 'Income statement', 'Bank slip', 'Invoice'], answer: 1, explain: 'The income (profit and loss) statement shows revenue minus expenses.' },
    { q: 'Your price should at least cover…', options: ['Only materials', 'All of your costs', 'Competitor prices', 'Taxes only'], answer: 1, explain: 'Prices below total cost lose money on every sale.' },
    { q: 'Validating an idea means…', options: ['Registering a company', 'Testing that customers want it', 'Printing business cards', 'Hiring staff'], answer: 1, explain: 'Validation checks real demand before you invest heavily.' },
  ],
  marketing: [
    { q: 'SEO helps you…', options: ['Rank higher in search results organically', 'Pay for every click', 'Design packaging', 'Hire staff'], answer: 0, explain: 'Search engine optimisation improves organic visibility.' },
    { q: 'In pay-per-click advertising you pay when…', options: ['An ad is shown', 'Someone clicks the ad', 'You write the ad', 'A month ends'], answer: 1, explain: 'PPC charges per click.' },
    { q: 'Which metric tells you how many visitors became customers?', options: ['Impressions', 'Conversion rate', 'Followers', 'Bounce colour'], answer: 1, explain: 'Conversion rate measures the share of visitors who take the goal action.' },
  ],
  freelance: [
    { q: 'A strong proposal starts with…', options: ['Your life story', 'The client’s problem and how you will solve it', 'Your lowest price', 'A long list of tools'], answer: 1, explain: 'Clients care most about their problem.' },
    { q: 'Why choose a niche?', options: ['To work less', 'To stand out and charge for expertise', 'Because it is required', 'To avoid clients'], answer: 1, explain: 'Specialists are easier to find and trust.' },
    { q: 'Milestone payments protect…', options: ['Only the client', 'Only the freelancer', 'Both client and freelancer', 'Neither'], answer: 2, explain: 'Milestones share risk fairly.' },
  ],
  tvet: [
    { q: 'Before working on any circuit you must first…', options: ['Test it is live', 'Isolate the supply and confirm it is dead', 'Wear gloves only', 'Call the client'], answer: 1, explain: 'Safe isolation is always the first step.' },
    { q: 'An inverter in a solar system…', options: ['Stores energy', 'Converts DC to AC', 'Cools panels', 'Measures sunlight'], answer: 1, explain: 'Panels produce DC; homes mostly use AC.' },
    { q: 'A circuit breaker protects against…', options: ['Overcurrent', 'Rain', 'Low voltage only', 'Theft'], answer: 0, explain: 'Breakers trip when current exceeds a safe limit.' },
  ],
  foundation: [
    { q: 'A professional email should begin with…', options: ['A clear subject and greeting', 'An emoji', 'Your CV', 'No subject'], answer: 0, explain: 'Clear subjects and greetings set a professional tone.' },
    { q: 'An emergency fund is for…', options: ['Shopping sales', 'Unexpected expenses', 'Investing in shares', 'Gifts'], answer: 1, explain: 'It covers surprises without debt.' },
    { q: 'The STAR method helps you answer…', options: ['Maths questions', 'Behavioural interview questions', 'Emails', 'Surveys'], answer: 1, explain: 'Situation, Task, Action, Result.' },
  ],
}

export const institutionPlans = [
  { name: 'Teams', for: 'Small companies and NGOs', price: 'PKR 2,500 / learner / month', features: ['5–100 learners', 'Full catalogue with certificates', 'Admin dashboard and progress reports', 'Assign courses and deadlines'] },
  { name: 'Campus', for: 'Universities, colleges and TVET institutes', price: 'Custom pricing', features: ['Unlimited student access', 'Credit-mapped learning paths', 'Upload your own courses', 'Integration with your LMS', 'ABC assessment centre option'] },
  { name: 'Enterprise & Government', for: 'Large employers and public programs', price: 'Custom pricing', features: ['Skills benchmarking and gap analytics', 'Custom academies and branded paths', 'ABC certification at scale', 'Dedicated success manager'] },
]

export const findCourse = (slug: string) => courses.find((x) => x.slug === slug)
export const findProgram = (slug: string) => programs.find((x) => x.slug === slug)
export const findInstructor = (id: string) => instructors.find((x) => x.id === id)
export const findPartner = (id: string) => partners.find((x) => x.id === id)
export const categoryName = (slug: string) => categories.find((x) => x.slug === slug)?.name ?? slug
export const allLessons = (course: Course) => course.modules.flatMap((m) => m.lessons)
export const formatPKR = (n: number) => (n === 0 ? 'Free' : `PKR ${n.toLocaleString('en-PK')}`)
export const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`)
