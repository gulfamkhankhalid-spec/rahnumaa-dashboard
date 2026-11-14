// Skill Magnets — SAMPLE people, communities and content for the prototype.

export type Privacy = 'Public' | 'Private' | 'Hidden'
export type Magnet = {
  id: string
  name: string
  parentId: string | null
  description: string
  privacy: Privacy
  hue: number
  icon: string
  tags: string[]
  rules: string[]
  ownerId: string
  createdBy: 'admin' | 'member'
  members: number
  featured?: boolean
  locked?: boolean
  status: 'Active' | 'Pending approval'
  created: string
}

export type Person = {
  id: string
  name: string
  initials: string
  headline: string
  city: string
  verified: boolean
  abc: string[]
  skills: { name: string; endorsements: number }[]
  about: string
  experience: { role: string; org: string; years: string }[]
  hue: number
}

export const people: Person[] = [
  { id: 'u1', name: 'Sample Member — Hamza', initials: 'HZ', headline: 'Amazon PPC specialist · 6 years · Private label', city: 'Lahore', verified: true, abc: ['Digital Marketing (Practitioner)'], skills: [{ name: 'Amazon PPC', endorsements: 48 }, { name: 'Product research', endorsements: 31 }, { name: 'Listing optimisation', endorsements: 22 }], about: 'I manage advertising for private-label brands on Amazon US and UK. Happy to help new sellers avoid wasted ad spend.', experience: [{ role: 'PPC Lead', org: 'Sample E-commerce Agency', years: '2022–now' }, { role: 'Virtual Assistant', org: 'Freelance', years: '2019–2022' }], hue: 20 },
  { id: 'u2', name: 'Sample Member — Fatima', initials: 'FT', headline: 'Shopify store owner · Modest fashion', city: 'Karachi', verified: true, abc: [], skills: [{ name: 'Shopify', endorsements: 27 }, { name: 'Instagram marketing', endorsements: 19 }], about: 'Built a modest-fashion brand from my bedroom to 2,000 orders a month. I share what works and what didn’t.', experience: [{ role: 'Founder', org: 'Sample Fashion Brand', years: '2021–now' }], hue: 330 },
  { id: 'u3', name: 'Sample Member — Ali', initials: 'AL', headline: 'Solar installer · ABC certified', city: 'Multan', verified: true, abc: ['Solar PV Installation (Practitioner)'], skills: [{ name: 'Solar PV', endorsements: 35 }, { name: 'Load calculation', endorsements: 20 }], about: 'Installing residential and agricultural solar systems across South Punjab.', experience: [{ role: 'Lead Installer', org: 'Sample Solar Services', years: '2020–now' }], hue: 45 },
  { id: 'u4', name: 'Sample Member — Sara', initials: 'SR', headline: 'Frontend developer · React · Mentor', city: 'Islamabad', verified: true, abc: ['Web Development (Advanced)'], skills: [{ name: 'React', endorsements: 52 }, { name: 'TypeScript', endorsements: 38 }, { name: 'Mentoring', endorsements: 17 }], about: 'Building web apps for a fintech by day, mentoring new developers by night.', experience: [{ role: 'Senior Frontend Engineer', org: 'Sample Fintech', years: '2021–now' }], hue: 205 },
  { id: 'u5', name: 'Sample Member — Bilal', initials: 'BL', headline: 'Top-rated freelancer · Logo & brand design', city: 'Peshawar', verified: true, abc: ['Graphic Design (Practitioner)'], skills: [{ name: 'Logo design', endorsements: 44 }, { name: 'Branding', endorsements: 30 }], about: 'Full-time freelancer since 2018. I post my client process and pricing openly.', experience: [{ role: 'Freelance Designer', org: 'Skill Lancer', years: '2018–now' }], hue: 280 },
  { id: 'u6', name: 'Sample Member — Nadia', initials: 'ND', headline: 'TikTok Shop & Daraz seller', city: 'Faisalabad', verified: false, abc: [], skills: [{ name: 'Daraz', endorsements: 12 }, { name: 'Product photography', endorsements: 8 }], about: 'Selling home textiles online. Learning every day.', experience: [{ role: 'Owner', org: 'Sample Home Textiles', years: '2023–now' }], hue: 160 },
  { id: 'u7', name: 'Sample Member — Usman', initials: 'UM', headline: 'Wholesale sourcing · China & Pakistan', city: 'Karachi', verified: true, abc: [], skills: [{ name: 'Sourcing', endorsements: 25 }, { name: 'Import logistics', endorsements: 14 }], about: 'I help sellers find reliable manufacturers and ship safely.', experience: [{ role: 'Sourcing Consultant', org: 'Independent', years: '2017–now' }], hue: 100 },
]

const m = (id: string, name: string, parentId: string | null, description: string, members: number, extra: Partial<Magnet> = {}): Magnet => ({
  id, name, parentId, description, members, privacy: 'Public', hue: 175, icon: 'magnet', tags: [], rules: ['Be respectful and helpful', 'No spam or unsolicited selling', 'Share sources for claims'], ownerId: 'admin', createdBy: 'admin', status: 'Active', created: 'Sep 2026', ...extra,
})

export const seedMagnets: Magnet[] = [
  // E-commerce
  m('ecom', 'E-commerce', null, 'Selling online in Pakistan and worldwide — marketplaces, your own store, logistics and growth.', 18420, { hue: 20, icon: 'briefcase', tags: ['ecommerce', 'selling'], featured: true }),
  m('amazon', 'Amazon', 'ecom', 'Everything about selling on Amazon: research, sourcing, listings, ads and account health.', 9310, { hue: 30, tags: ['amazon', 'fba'], ownerId: 'u1', createdBy: 'member' }),
  m('amazon-ppc', 'PPC', 'amazon', 'Amazon advertising: Sponsored Products, Brands and Display, bidding and ACoS.', 3120, { hue: 35, tags: ['ppc', 'amazon', 'ads'], ownerId: 'u1', createdBy: 'member' }),
  m('amazon-ppc-sb', 'Sponsored Brands', 'amazon-ppc', 'Headline, video and store spotlight ads — creative and bidding strategy.', 640, { hue: 40, tags: ['sponsoredbrands', 'ppc'], ownerId: 'u1', createdBy: 'member' }),
  m('amazon-ppc-auto', 'Auto vs manual campaigns', 'amazon-ppc', 'When to run auto campaigns, harvesting keywords, and moving to manual.', 512, { hue: 40, tags: ['ppc', 'keywords'], ownerId: 'u1', createdBy: 'member' }),
  m('amazon-research', 'Product research', 'amazon', 'Finding winning products, validating demand and checking competition.', 2870, { hue: 30, tags: ['productresearch'] }),
  m('amazon-fba', 'FBA & logistics', 'amazon', 'Shipping to Amazon warehouses, prep, freight forwarders and fees.', 1990, { hue: 30, tags: ['fba', 'logistics'], ownerId: 'u7', createdBy: 'member' }),
  m('shopify', 'Shopify & own store', 'ecom', 'Building and growing your own store: themes, apps, payments and conversion.', 4210, { hue: 150, tags: ['shopify', 'store'], ownerId: 'u2', createdBy: 'member' }),
  m('daraz', 'Daraz', 'ecom', 'Selling on Daraz: listings, campaigns, returns and seller ratings.', 3560, { hue: 15, tags: ['daraz'] }),
  m('tiktok-shop', 'TikTok Shop', 'ecom', 'Short-video commerce, live selling and creator partnerships.', 1420, { hue: 340, tags: ['tiktok', 'livecommerce'], ownerId: 'u6', createdBy: 'member' }),
  // Digital marketing
  m('marketing', 'Digital Marketing', null, 'SEO, social media, paid ads, content and analytics.', 15200, { hue: 260, icon: 'rocket', tags: ['marketing'], featured: true }),
  m('seo', 'SEO', 'marketing', 'Ranking on search: technical SEO, content and links.', 4300, { hue: 265, tags: ['seo'] }),
  m('meta-ads', 'Meta ads', 'marketing', 'Facebook and Instagram ads for Pakistani and international audiences.', 5100, { hue: 230, tags: ['metaads', 'ads'] }),
  // Freelancing
  m('freelance', 'Freelancing', null, 'Winning clients, pricing, delivery and getting paid — on Skill Lancer and beyond.', 22600, { hue: 300, icon: 'compass', tags: ['freelancing'], featured: true }),
  m('first-client', 'First client', 'freelance', 'For new freelancers: profiles, proposals and landing the first job.', 8900, { hue: 305, tags: ['newfreelancer', 'proposals'] }),
  m('design-freelance', 'Design freelancers', 'freelance', 'Logo, brand and social media designers sharing process and pricing.', 3700, { hue: 285, tags: ['design', 'logo'], ownerId: 'u5', createdBy: 'member' }),
  // Software
  m('software', 'Software Development', null, 'Web, mobile, cloud and careers in software.', 12800, { hue: 205, icon: 'layers', tags: ['software', 'dev'] }),
  m('react', 'React', 'software', 'React, Next.js and front-end architecture.', 4100, { hue: 200, tags: ['react', 'frontend'], ownerId: 'u4', createdBy: 'member' }),
  m('react-interviews', 'Interview prep', 'react', 'Mock interviews, take-home tasks and salary talk for front-end roles.', 880, { hue: 195, tags: ['interviews', 'career'], ownerId: 'u4', createdBy: 'member', privacy: 'Private' }),
  // Trades
  m('energy', 'Solar & Energy', null, 'Solar installation, net metering, batteries and energy business.', 7400, { hue: 45, icon: 'award', tags: ['solar', 'energy'], featured: true }),
  m('net-metering', 'Net metering', 'energy', 'Applications, approvals and real numbers from net-metered homes.', 2300, { hue: 50, tags: ['netmetering'] }),
  m('solar-installers', 'Installers’ circle', 'energy', 'A private circle for verified installers to share site problems and fixes.', 640, { hue: 40, tags: ['installers'], ownerId: 'u3', createdBy: 'member', privacy: 'Private' }),
  m('textiles', 'Textiles & Garments', null, 'Manufacturing, exports, sourcing and design in Pakistan’s textile sector.', 6100, { hue: 120, icon: 'grid', tags: ['textiles', 'exports'] }),
]

export type Reaction = 'like' | 'insightful' | 'celebrate' | 'support'
export const reactionEmoji: Record<Reaction, string> = { like: '👍', insightful: '💡', celebrate: '🎉', support: '❤️' }
export const reactionLabel: Record<Reaction, string> = { like: 'Like', insightful: 'Insightful', celebrate: 'Celebrate', support: 'Support' }

export type PostKind = 'text' | 'photo' | 'poll' | 'question' | 'brainstorm' | 'event' | 'opportunity'
export type Comment = { id: string; authorId: string; text: string; time: string; likes: number; replies: { id: string; authorId: string; text: string; time: string }[] }
export type Post = {
  id: string
  magnetId: string
  authorId: string
  kind: PostKind
  text: string
  image?: string // data URL or gradient key
  poll?: { options: { text: string; votes: number }[]; voted?: number }
  ideas?: { id: string; text: string; by: string; votes: number; voted?: boolean }[]
  event?: { title: string; date: string; time: string; where: string; going: number; rsvp?: boolean }
  opportunity?: { role: string; type: 'Job' | 'Gig'; link: string }
  reactions: Record<Reaction, number>
  myReaction?: Reaction
  comments: Comment[]
  shares: number
  time: string
  pinned?: boolean
  sharedFrom?: string
  answered?: boolean
}

const rx = (like: number, insightful = 0, celebrate = 0, support = 0) => ({ like, insightful, celebrate, support })

export const seedPosts: Post[] = [
  { id: 'p1', magnetId: 'amazon-ppc', authorId: 'u1', kind: 'text', text: 'My rule of thumb for new launches: run an auto campaign at a low bid for 2 weeks, then harvest every search term with 2+ orders into an exact-match manual campaign and negate it in auto. Cut our ACoS from 48% to 29% on a kitchen product. #ppc #amazon', reactions: rx(212, 96, 14, 3), comments: [{ id: 'c1', authorId: 'u6', text: 'Do you negate as exact or phrase in the auto campaign?', time: '3h', likes: 12, replies: [{ id: 'r1', authorId: 'u1', text: 'Negative exact — phrase can block too much early on.', time: '2h' }] }], shares: 41, time: '5h', pinned: true },
  { id: 'p2', magnetId: 'amazon-ppc', authorId: 'u7', kind: 'poll', text: 'What target ACoS do you aim for during a product launch?', poll: { options: [{ text: 'Under 30%', votes: 84 }, { text: '30–50%', votes: 211 }, { text: '50–80%', votes: 97 }, { text: 'I don’t track it yet', votes: 45 }] }, reactions: rx(58, 9), comments: [], shares: 6, time: '1d' },
  { id: 'p3', magnetId: 'ecom', authorId: 'u2', kind: 'photo', image: 'g:330', text: 'Packed our 2,000th order this month! Started with 15 abayas and an Instagram page in 2021. Never give up. 🙏 #shopify #smallbusiness', reactions: rx(540, 22, 310, 120), comments: [{ id: 'c2', authorId: 'u5', text: 'Mashallah! Inspiring journey.', time: '6h', likes: 30, replies: [] }], shares: 18, time: '8h' },
  { id: 'p4', magnetId: 'amazon', authorId: 'u6', kind: 'question', text: 'Is it possible to open an Amazon US seller account from Pakistan now? Which documents did you need for verification?', reactions: rx(34, 4), comments: [{ id: 'c3', authorId: 'u7', text: 'Yes — CNIC, a utility bill in your name and a bank or payment account that can receive USD. Video verification took 2 weeks for me.', time: '1d', likes: 22, replies: [] }], shares: 2, time: '1d', answered: true },
  { id: 'p5', magnetId: 'freelance', authorId: 'u5', kind: 'brainstorm', text: 'Brainstorm: how can new freelancers in Pakistan get their first 5-star review faster? Add your ideas and vote 👇', ideas: [{ id: 'i1', text: 'Offer a small fixed-price starter package with a 24-hour delivery', by: 'u4', votes: 41 }, { id: 'i2', text: 'Ask a mentor in Skill Magnets to review your profile before going live', by: 'u2', votes: 28 }, { id: 'i3', text: 'Get an ABC credential so clients trust you sooner', by: 'u3', votes: 19 }], reactions: rx(122, 40), comments: [], shares: 12, time: '2d' },
  { id: 'p6', magnetId: 'energy', authorId: 'u3', kind: 'photo', image: 'g:45', text: '12 kW agricultural system done in Muzaffargarh — the tube well now runs on sun all day. Ground-mount with tilt adjusted for winter. #solar', reactions: rx(301, 45, 88, 20), comments: [], shares: 23, time: '1d' },
  { id: 'p7', magnetId: 'react', authorId: 'u4', kind: 'event', text: 'Free live session for anyone learning React: we’ll build a small app together and answer questions.', event: { title: 'Build a React app live', date: '2026-11-22', time: '20:00', where: 'Online — Skill Magnets live room', going: 146 }, reactions: rx(88, 12), comments: [], shares: 15, time: '3d' },
  { id: 'p8', magnetId: 'react', authorId: 'u4', kind: 'opportunity', text: 'Our team is hiring a junior React developer (remote, Pakistan). Freshers with a strong portfolio welcome.', opportunity: { role: 'Junior React Developer', type: 'Job', link: '/skillsrator/skill-wise' }, reactions: rx(160, 8, 30), comments: [], shares: 54, time: '4d' },
  { id: 'p9', magnetId: 'amazon-ppc-sb', authorId: 'u1', kind: 'text', text: 'Sponsored Brands video ads are getting 2–3× the click-through of static headline ads in our home & kitchen accounts. Keep videos 15–30s, product in the first second, no sound needed. #sponsoredbrands', reactions: rx(74, 39), comments: [], shares: 9, time: '6h' },
  { id: 'p10', magnetId: 'net-metering', authorId: 'u3', kind: 'question', text: 'How long did your net-metering approval take with your local distribution company this year?', reactions: rx(21), comments: [], shares: 1, time: '2d' },
]

export type ChatMsg = { id: string; from: string; text: string; time: string; image?: string; replyTo?: string; reactions?: string[] }
export const seedChats: Record<string, ChatMsg[]> = {
  'amazon-ppc': [
    { id: 'm1', from: 'u1', text: 'Assalam-o-Alaikum everyone 👋 Welcome to the PPC chat. Share your ACoS wins and questions here.', time: '09:12' },
    { id: 'm2', from: 'u6', text: 'Is it worth running Sponsored Display for a new listing?', time: '09:40' },
    { id: 'm3', from: 'u1', text: 'Not at first. Get reviews and conversion data from Sponsored Products, then test Display retargeting.', time: '09:44', replyTo: 'm2' },
  ],
  ecom: [{ id: 'm4', from: 'u2', text: 'Any recommendations for a reliable courier for COD in Karachi?', time: 'Yesterday' }],
  'dm-u1': [{ id: 'm5', from: 'u1', text: 'Thanks for joining the PPC magnet! Let me know if you need help with your first campaign.', time: 'Yesterday' }],
}

export type Story = { id: string; authorId: string; magnetId?: string; bg: string; text: string; image?: string; time: string }
export const seedStories: Story[] = [
  { id: 's1', authorId: 'u1', magnetId: 'amazon-ppc', bg: '20', text: 'Today’s tip: check your search term report every Monday. 10 minutes = less wasted spend.', time: '2h' },
  { id: 's2', authorId: 'u2', bg: '330', text: 'New winter collection shoot behind the scenes 📸', time: '4h' },
  { id: 's3', authorId: 'u3', magnetId: 'energy', bg: '45', text: 'Sunrise on site. 3 installs this week ☀️', time: '6h' },
  { id: 's4', authorId: 'u4', magnetId: 'react', bg: '205', text: 'Live tonight at 8pm: React Q&A. Bring your questions!', time: '9h' },
  { id: 's5', authorId: 'u5', bg: '280', text: 'Before → after logo redesign for a bakery. Swipe in the magnet!', time: '12h' },
]

export const findPerson = (id: string) => people.find((p) => p.id === id)
export const icons = ['magnet', 'briefcase', 'rocket', 'compass', 'layers', 'award', 'grid', 'book', 'users']
