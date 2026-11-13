// Skill Lancer — SAMPLE marketplace data for the prototype. All people, prices,
// ratings and fees are illustrative.

export const FEES = { buyer: 0.05, seller: 0.1 } // sample rates; final fees are set after market testing

export type Category = { slug: string; name: string; icon: string; subs: string[] }

export const categories: Category[] = [
  { slug: 'design', name: 'Graphics & Design', icon: 'layers', subs: ['Logo design', 'Social media design', 'UI/UX', 'Print design'] },
  { slug: 'dev', name: 'Programming & Tech', icon: 'grid', subs: ['Websites', 'Mobile apps', 'WordPress', 'Bug fixing'] },
  { slug: 'marketing', name: 'Digital Marketing', icon: 'rocket', subs: ['Social media marketing', 'SEO', 'PPC ads', 'E-commerce marketing'] },
  { slug: 'writing', name: 'Writing & Translation', icon: 'book', subs: ['Content writing', 'Urdu–English translation', 'CV writing', 'Copywriting'] },
  { slug: 'video', name: 'Video & Animation', icon: 'eye', subs: ['Video editing', 'Explainer videos', 'Short-form reels', 'Subtitles'] },
  { slug: 'data', name: 'Data & Admin', icon: 'clipboard', subs: ['Data entry', 'Excel & dashboards', 'Virtual assistance', 'Bookkeeping'] },
  { slug: 'trades', name: 'Technical & On-site', icon: 'award', subs: ['Solar design', 'Electrical drawings', 'CAD drafting', 'Site surveys'] },
]

export type Level = 'New seller' | 'Level 1' | 'Level 2' | 'Top rated'

export type Freelancer = {
  id: string
  name: string
  initials: string
  title: string
  city: string
  languages: string[]
  level: Level
  verified: 0 | 1 | 2 | 3 // verification ladder step reached (0-based)
  abc: string[]
  skills: string[]
  rating: number
  reviews: number
  jobs: number
  rate: number // PKR per hour
  response: string
  onTime: number
  bio: string
  agency?: { name: string; members: number }
  portfolio: string[]
  memberSince: string
}

export const freelancers: Freelancer[] = [
  { id: 'f1', name: 'Sample Freelancer — Hira', initials: 'HR', title: 'Brand & logo designer', city: 'Lahore', languages: ['Urdu', 'English'], level: 'Top rated', verified: 3, abc: ['Graphic Design (Practitioner)'], skills: ['Logo design', 'Brand identity', 'Illustrator', 'Social media design'], rating: 4.9, reviews: 412, jobs: 530, rate: 3500, response: '1 hour', onTime: 99, bio: 'I design memorable logos and brand kits for startups and small businesses. Over 500 projects delivered for clients in Pakistan, the Gulf and the UK.', portfolio: ['Café brand identity', 'Tech startup logo', 'Textile packaging'], memberSince: '2023' },
  { id: 'f2', name: 'Sample Freelancer — Bilal', initials: 'BL', title: 'Full-stack web developer', city: 'Islamabad', languages: ['English', 'Urdu'], level: 'Level 2', verified: 3, abc: ['Web Development (Advanced)'], skills: ['React', 'Node.js', 'WordPress', 'Bug fixing'], rating: 4.8, reviews: 186, jobs: 214, rate: 5500, response: '2 hours', onTime: 97, bio: 'I build fast, accessible websites and web apps — from landing pages to full e-commerce stores.', agency: { name: 'Sample Web Studio', members: 6 }, portfolio: ['E-commerce store', 'School portal', 'Booking app'], memberSince: '2022' },
  { id: 'f3', name: 'Sample Freelancer — Sana', initials: 'SN', title: 'Social media & PPC marketer', city: 'Karachi', languages: ['Urdu', 'English'], level: 'Level 1', verified: 2, abc: ['Digital Marketing (Practitioner)'], skills: ['Social media marketing', 'PPC ads', 'Content calendars', 'Analytics'], rating: 4.8, reviews: 74, jobs: 81, rate: 3000, response: '1 hour', onTime: 98, bio: 'Former bank officer turned digital marketer. I grow small brands with clear strategy, good content and well-run ads.', portfolio: ['Clothing brand launch', 'Restaurant ads', 'Clinic lead generation'], memberSince: '2025' },
  { id: 'f4', name: 'Sample Freelancer — Usman', initials: 'US', title: 'Video editor & motion designer', city: 'Peshawar', languages: ['Urdu', 'Pashto', 'English'], level: 'Level 2', verified: 2, abc: [], skills: ['Video editing', 'Reels', 'Motion graphics', 'Subtitles'], rating: 4.9, reviews: 233, jobs: 260, rate: 3000, response: '3 hours', onTime: 96, bio: 'I edit YouTube videos, reels and explainer animations that keep viewers watching.', portfolio: ['YouTube channel edits', 'Product explainer', 'Wedding highlights'], memberSince: '2023' },
  { id: 'f5', name: 'Sample Freelancer — Mariam', initials: 'MR', title: 'Urdu–English translator & writer', city: 'Multan', languages: ['Urdu', 'English', 'Saraiki'], level: 'Level 1', verified: 3, abc: ['Translation (Practitioner)'], skills: ['Translation', 'Content writing', 'Proofreading', 'CV writing'], rating: 4.9, reviews: 98, jobs: 120, rate: 2500, response: '1 hour', onTime: 100, bio: 'Accurate, natural translations between Urdu and English, plus blog and website content.', portfolio: ['NGO report translation', 'E-commerce product copy', 'Academic CVs'], memberSince: '2024' },
  { id: 'f6', name: 'Sample Freelancer — Kamran', initials: 'KM', title: 'Excel, data & virtual assistant', city: 'Faisalabad', languages: ['Urdu', 'English'], level: 'New seller', verified: 2, abc: ['Data Analysis (Foundation)'], skills: ['Excel', 'Data entry', 'Dashboards', 'Bookkeeping'], rating: 5.0, reviews: 9, jobs: 11, rate: 1800, response: '1 hour', onTime: 100, bio: 'Skill Academy graduate. I clean data, build Excel dashboards and keep your records organised.', portfolio: ['Sales dashboard', 'Inventory sheet'], memberSince: '2026' },
  { id: 'f7', name: 'Sample Freelancer — Rizwan', initials: 'RZ', title: 'Solar system designer', city: 'Rawalpindi', languages: ['Urdu', 'English'], level: 'Level 1', verified: 3, abc: ['Solar PV Installation (Practitioner)'], skills: ['Solar design', 'Load calculation', 'AutoCAD', 'Site surveys'], rating: 4.7, reviews: 41, jobs: 47, rate: 4000, response: '4 hours', onTime: 95, bio: 'ABC-certified solar technician. I size systems, draw single-line diagrams and prepare installation plans.', portfolio: ['10 kW home system', 'Factory rooftop plan'], memberSince: '2025' },
]

export type Package = { name: 'Basic' | 'Standard' | 'Premium'; title: string; price: number; days: number; revisions: number; features: string[] }
export type Addon = { id: string; title: string; price: number; days: number }

export type Gig = {
  id: string
  sellerId: string
  category: string
  sub: string
  title: string
  rating: number
  reviews: number
  description: string
  packages: Package[]
  addons: Addon[]
  faqs: [string, string][]
  tags: string[]
}

const pk = (name: Package['name'], title: string, price: number, days: number, revisions: number, features: string[]): Package => ({ name, title, price, days, revisions, features })

export const gigs: Gig[] = [
  { id: 'g1', sellerId: 'f1', category: 'design', sub: 'Logo design', title: 'I will design a modern, minimalist logo for your business', rating: 4.9, reviews: 312, tags: ['logo', 'branding', 'minimal'],
    description: 'A logo is the face of your business. I create clean, modern logos that work on signs, social media and packaging. You get original concepts, unlimited colour tests and all the files you need.',
    packages: [pk('Basic', '1 concept', 6000, 3, 2, ['1 logo concept', 'PNG and JPG files', 'Transparent background']), pk('Standard', '3 concepts + source', 12000, 4, 4, ['3 logo concepts', 'Vector source file', 'Social media kit', 'Transparent background']), pk('Premium', 'Full brand kit', 25000, 6, 99, ['5 logo concepts', 'Vector source files', 'Brand guidelines PDF', 'Business card design', 'Social media kit'])],
    addons: [{ id: 'a1', title: 'Extra fast delivery (1 day)', price: 3000, days: -2 }, { id: 'a2', title: 'Urdu wordmark version', price: 2500, days: 1 }, { id: 'a3', title: 'Stationery design', price: 4000, days: 2 }],
    faqs: [['Do I own the logo?', 'Yes. Full ownership transfers to you when the order is completed.'], ['What do you need from me?', 'Your business name, a short description and any colours or styles you like.']] },
  { id: 'g2', sellerId: 'f1', category: 'design', sub: 'Social media design', title: 'I will design 10 eye-catching social media posts', rating: 4.8, reviews: 98, tags: ['instagram', 'facebook', 'posts'],
    description: 'Scroll-stopping posts designed to your brand, ready for Instagram, Facebook and LinkedIn.',
    packages: [pk('Basic', '5 posts', 4000, 2, 1, ['5 static posts', 'Editable source']), pk('Standard', '10 posts', 7500, 3, 2, ['10 static posts', 'Editable source', 'Captions']), pk('Premium', '15 posts + stories', 12000, 4, 3, ['15 posts', '5 stories', 'Editable source', 'Captions'])],
    addons: [{ id: 'a1', title: 'Animated version of 3 posts', price: 3000, days: 1 }], faqs: [['Can you use my photos?', 'Yes, send your product photos and I will edit them in.']] },
  { id: 'g3', sellerId: 'f2', category: 'dev', sub: 'Websites', title: 'I will build a fast, responsive business website', rating: 4.8, reviews: 141, tags: ['website', 'react', 'responsive'],
    description: 'A professional, mobile-friendly website that loads fast and is easy for you to update. Includes contact form, basic SEO and launch support.',
    packages: [pk('Basic', 'Landing page', 25000, 5, 2, ['1 page', 'Responsive design', 'Contact form']), pk('Standard', '5-page site', 60000, 10, 3, ['Up to 5 pages', 'Responsive design', 'Contact form', 'Basic SEO', 'Speed optimisation']), pk('Premium', 'Site + CMS', 120000, 18, 5, ['Up to 10 pages', 'Content management', 'Blog', 'Basic SEO', 'Training session'])],
    addons: [{ id: 'a1', title: 'Urdu (right-to-left) version', price: 15000, days: 3 }, { id: 'a2', title: '1 month of maintenance', price: 8000, days: 0 }],
    faqs: [['Do you provide hosting?', 'I can set it up on your hosting, or recommend a plan.'], ['Can I edit the site myself?', 'Yes, with the Premium package you get a content management system and a training session.']] },
  { id: 'g4', sellerId: 'f2', category: 'dev', sub: 'Bug fixing', title: 'I will fix bugs in your WordPress or React site', rating: 4.9, reviews: 45, tags: ['bug', 'wordpress', 'fix'],
    description: 'Broken layout, errors or slow pages? I find the cause and fix it, with a short report of what changed.',
    packages: [pk('Basic', '1 bug', 5000, 1, 1, ['Fix 1 issue', 'Short report']), pk('Standard', 'Up to 3 bugs', 12000, 2, 2, ['Fix up to 3 issues', 'Short report', 'Backup before changes']), pk('Premium', 'Full health check', 25000, 4, 3, ['Fix up to 8 issues', 'Speed audit', 'Security check', 'Report'])],
    addons: [], faqs: [['What if you cannot fix it?', 'You get a full refund through escrow if the issue cannot be fixed.']] },
  { id: 'g5', sellerId: 'f3', category: 'marketing', sub: 'Social media marketing', title: 'I will manage your Instagram and Facebook for a month', rating: 4.8, reviews: 52, tags: ['social media', 'management', 'growth'],
    description: 'Strategy, content calendar, posting and community management, with a monthly results report.',
    packages: [pk('Basic', '12 posts / month', 20000, 30, 2, ['12 posts', 'Content calendar', 'Monthly report']), pk('Standard', '20 posts + stories', 35000, 30, 3, ['20 posts', '10 stories', 'Community replies', 'Monthly report']), pk('Premium', 'Full management + ads', 60000, 30, 4, ['30 posts', '20 stories', 'Ad campaign set-up', 'Community replies', 'Weekly report'])],
    addons: [{ id: 'a1', title: 'Add LinkedIn page', price: 8000, days: 0 }], faqs: [['Is ad spend included?', 'No. Ad budget is paid directly by you; my fee covers management.']] },
  { id: 'g6', sellerId: 'f3', category: 'marketing', sub: 'PPC ads', title: 'I will set up and optimise your search ad campaign', rating: 4.7, reviews: 22, tags: ['ppc', 'google ads', 'leads'],
    description: 'Keyword research, ad copy, conversion tracking and two weeks of optimisation.',
    packages: [pk('Basic', 'Campaign set-up', 15000, 3, 1, ['Keyword research', '1 campaign', 'Ad copy']), pk('Standard', 'Set-up + 2 weeks', 28000, 14, 2, ['Keyword research', '2 campaigns', 'Conversion tracking', '2 weeks optimisation']), pk('Premium', 'Set-up + 1 month', 45000, 30, 3, ['Full account', 'Conversion tracking', '1 month optimisation', 'Weekly reports'])],
    addons: [], faqs: [] },
  { id: 'g7', sellerId: 'f4', category: 'video', sub: 'Short-form reels', title: 'I will edit engaging reels and short videos', rating: 4.9, reviews: 189, tags: ['reels', 'tiktok', 'shorts'],
    description: 'Fast-paced edits with captions, music and effects that keep viewers watching to the end.',
    packages: [pk('Basic', '1 reel', 3000, 2, 2, ['Up to 60 seconds', 'Captions', 'Music']), pk('Standard', '5 reels', 13000, 4, 2, ['5 reels', 'Captions', 'Music', 'Thumbnail']), pk('Premium', '12 reels', 28000, 7, 3, ['12 reels', 'Captions', 'Music', 'Thumbnails', 'Hook scripts'])],
    addons: [{ id: 'a1', title: 'Urdu and English subtitles', price: 1500, days: 1 }], faqs: [['What footage do you need?', 'Send raw clips through the order page; large files can be shared by link.']] },
  { id: 'g8', sellerId: 'f5', category: 'writing', sub: 'Urdu–English translation', title: 'I will translate between Urdu and English accurately', rating: 4.9, reviews: 88, tags: ['translation', 'urdu', 'english'],
    description: 'Human translation (not machine) that reads naturally, for documents, websites, reports and subtitles.',
    packages: [pk('Basic', 'Up to 500 words', 2500, 1, 1, ['500 words', 'Proofread']), pk('Standard', 'Up to 2,000 words', 8000, 3, 2, ['2,000 words', 'Proofread', 'Formatting kept']), pk('Premium', 'Up to 5,000 words', 18000, 5, 3, ['5,000 words', 'Proofread', 'Formatting kept', 'Glossary'])],
    addons: [{ id: 'a1', title: 'Certified-style declaration', price: 2000, days: 0 }], faqs: [] },
  { id: 'g9', sellerId: 'f5', category: 'writing', sub: 'CV writing', title: 'I will write a professional CV and cover letter', rating: 4.8, reviews: 31, tags: ['cv', 'resume', 'cover letter'],
    description: 'A clear, achievement-focused CV tailored to the roles you want, plus a matching cover letter.',
    packages: [pk('Basic', 'CV', 4000, 2, 2, ['CV rewrite', 'Editable file']), pk('Standard', 'CV + cover letter', 6500, 3, 3, ['CV rewrite', 'Cover letter', 'Editable files']), pk('Premium', 'CV + letter + profile', 9500, 4, 4, ['CV rewrite', 'Cover letter', 'Professional profile summary', 'Interview tips'])],
    addons: [], faqs: [] },
  { id: 'g10', sellerId: 'f6', category: 'data', sub: 'Excel & dashboards', title: 'I will build an Excel dashboard for your business data', rating: 5.0, reviews: 9, tags: ['excel', 'dashboard', 'data'],
    description: 'Turn messy sheets into a clean dashboard with charts and summaries that update when you add data.',
    packages: [pk('Basic', 'Data clean-up', 3000, 2, 1, ['Clean 1 sheet', 'Formulas checked']), pk('Standard', 'Dashboard', 7000, 3, 2, ['Clean data', 'Dashboard with 4 charts', 'Instructions']), pk('Premium', 'Automated dashboard', 14000, 5, 3, ['Clean data', 'Dashboard', 'Pivot reports', 'Automation', 'Video walkthrough'])],
    addons: [], faqs: [['Do you sign an NDA?', 'Yes. Your data stays private and is deleted after delivery if you wish.']] },
  { id: 'g11', sellerId: 'f7', category: 'trades', sub: 'Solar design', title: 'I will design your home or business solar system', rating: 4.7, reviews: 33, tags: ['solar', 'design', 'load calculation'],
    description: 'Load calculation, system sizing, equipment list and single-line diagram, prepared by an ABC-certified technician.',
    packages: [pk('Basic', 'Sizing report', 6000, 2, 1, ['Load calculation', 'System size', 'Equipment list']), pk('Standard', 'Report + diagram', 12000, 4, 2, ['Load calculation', 'System size', 'Equipment list', 'Single-line diagram']), pk('Premium', 'Full installation plan', 22000, 6, 3, ['Everything in Standard', 'Panel layout', 'Bill of quantities', 'Installation checklist'])],
    addons: [{ id: 'a1', title: 'Video call to review the plan', price: 2500, days: 0 }], faqs: [['Do you install?', 'Design is remote. On-site installation can be arranged in Rawalpindi and Islamabad.']] },
]

export type Project = {
  id: string
  title: string
  category: string
  client: { name: string; city: string; paymentVerified: boolean; hires: number; spent: number; rating: number }
  budgetType: 'Fixed' | 'Hourly'
  budget: [number, number] // PKR (fixed total) or PKR/hour
  duration: string
  experience: 'Entry' | 'Intermediate' | 'Expert'
  skills: string[]
  description: string
  posted: string
  proposals: number
}

export const projects: Project[] = [
  { id: 'p1', title: 'Website for a family-run furniture business', category: 'dev', client: { name: 'Sample Client — Furniture', city: 'Gujranwala', paymentVerified: true, hires: 4, spent: 320000, rating: 4.8 }, budgetType: 'Fixed', budget: [50000, 90000], duration: '1–3 months', experience: 'Intermediate', skills: ['Websites', 'WordPress', 'E-commerce'], description: 'We need a simple website to show our furniture with prices, a WhatsApp order button and an Urdu option. Must work well on phones.', posted: '2 hours ago', proposals: 6 },
  { id: 'p2', title: 'Monthly social media manager for a clothing brand', category: 'marketing', client: { name: 'Sample Client — Fashion', city: 'Karachi', paymentVerified: true, hires: 12, spent: 1150000, rating: 4.9 }, budgetType: 'Hourly', budget: [1500, 3000], duration: 'More than 6 months', experience: 'Intermediate', skills: ['Social media marketing', 'Content calendars', 'Canva'], description: 'Looking for someone to plan and post content, reply to comments and report monthly. About 15 hours a week.', posted: '5 hours ago', proposals: 18 },
  { id: 'p3', title: 'Translate a 40-page NGO report from English to Urdu', category: 'writing', client: { name: 'Sample Client — NGO', city: 'Islamabad', paymentVerified: true, hires: 7, spent: 410000, rating: 5.0 }, budgetType: 'Fixed', budget: [40000, 60000], duration: 'Less than 1 month', experience: 'Expert', skills: ['Translation', 'Urdu', 'Proofreading'], description: 'Human translation of a health report. Accuracy and consistent terminology are essential. Glossary provided.', posted: '1 day ago', proposals: 9 },
  { id: 'p4', title: 'Edit 20 short videos for a cooking channel', category: 'video', client: { name: 'Sample Client — Kitchen', city: 'Lahore', paymentVerified: false, hires: 0, spent: 0, rating: 0 }, budgetType: 'Fixed', budget: [25000, 40000], duration: '1–3 months', experience: 'Entry', skills: ['Video editing', 'Reels', 'Subtitles'], description: 'Raw footage is ready. Need snappy edits with Urdu captions and background music.', posted: '1 day ago', proposals: 23 },
  { id: 'p5', title: 'Excel inventory and sales tracker for a pharmacy', category: 'data', client: { name: 'Sample Client — Pharmacy', city: 'Hyderabad', paymentVerified: true, hires: 2, spent: 45000, rating: 4.7 }, budgetType: 'Fixed', budget: [8000, 15000], duration: 'Less than 1 month', experience: 'Entry', skills: ['Excel', 'Dashboards', 'Data entry'], description: 'Need a sheet to track stock, expiry dates and daily sales with a simple dashboard.', posted: '2 days ago', proposals: 11 },
  { id: 'p6', title: 'Solar system design for a small textile unit', category: 'trades', client: { name: 'Sample Client — Textiles', city: 'Faisalabad', paymentVerified: true, hires: 3, spent: 210000, rating: 4.6 }, budgetType: 'Fixed', budget: [30000, 60000], duration: 'Less than 1 month', experience: 'Expert', skills: ['Solar design', 'Load calculation', 'AutoCAD'], description: 'Rooftop system for daytime loads of about 40 kW. Need sizing, layout and equipment list. ABC-certified preferred.', posted: '3 days ago', proposals: 4 },
  { id: 'p7', title: 'Logo and brand kit for a new tutoring academy', category: 'design', client: { name: 'Sample Client — Academy', city: 'Quetta', paymentVerified: true, hires: 1, spent: 15000, rating: 5.0 }, budgetType: 'Fixed', budget: [10000, 25000], duration: 'Less than 1 month', experience: 'Entry', skills: ['Logo design', 'Brand identity'], description: 'Friendly, trustworthy logo with Urdu and English versions, plus a simple colour palette.', posted: '4 days ago', proposals: 15 },
]

export const sampleReviews = [
  { from: 'Client in Lahore', rating: 5, text: 'Excellent communication and delivered before the deadline. Will hire again.', when: '2 weeks ago' },
  { from: 'Client in Dubai', rating: 5, text: 'Understood exactly what I needed. Escrow made me comfortable hiring for the first time.', when: '1 month ago' },
  { from: 'Client in Karachi', rating: 4, text: 'Great quality. One revision needed but handled quickly.', when: '1 month ago' },
]

export const findFreelancer = (id: string) => freelancers.find((f) => f.id === id)
export const findGig = (id: string) => gigs.find((g) => g.id === id)
export const findProject = (id: string) => projects.find((p) => p.id === id)
export const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug
export const pkr = (n: number) => `PKR ${Math.round(n).toLocaleString('en-PK')}`
export const fromPrice = (g: Gig) => Math.min(...g.packages.map((p) => p.price))
export const verificationSteps = ['Phone verified', 'Identity submitted', 'Identity verified (CNIC)', 'Skills verified (ABC)']
