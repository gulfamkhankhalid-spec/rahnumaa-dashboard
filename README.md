# Rahnuma

Website and platform prototypes for [rahnumaa.com](https://rahnumaa.com), built with React, TypeScript and Vite.
Content follows the Rahnuma Concept Blueprint (v1.1). All people, prices and figures in the prototypes are sample data.

## Sections

| Path | What it is | Data / state |
|---|---|---|
| `/` | Public website: home (with the official partners logo section), official partners page (`/partners`, data in `src/data/partners.ts`), Skillsrator and its seven initiatives, career guidance, ABC certification, pilot domains, partners, trust and privacy, roadmap, sign-up | `src/data/site.ts` |
| `/app` | Student dashboard prototype: next step, assessments, My Plan, program explorer, counselors, Skillsrator launcher, My Record & Privacy | `src/data/app.ts` |
| `/academy` | **Skill Academy** — self-paced courses, Professional Certificates and Specializations; enrolment (audit, certificate, financial aid); course player with video, readings, graded quizzes, peer-graded projects, notes, discussion and grades; certificates with verification; instructor course builder; institution plans and admin | `src/academy/data.ts`, `src/academy/store.tsx` |
| `/lancer` | **Skill Lancer** — freelance marketplace: gigs with Basic/Standard/Premium packages and checkout into escrow; orders with delivery, revisions, reviews and disputes; projects with proposals, milestone and hourly contracts; seller dashboard and gig builder; profiles, messages and a PKR wallet | `src/lancer/data.ts`, `src/lancer/store.tsx` |
| `/sdc` | **Skill Development Center** — guided, assessed training: skills with Foundation/Practitioner/Advanced levels, cohorts (online, hybrid, assisted centre), mastery-gated classroom, live classes with attendance and calendar files, practical evidence logbook, level certificates, ABC assessment booking, Easy mode with read-aloud, guardian view, instructor workspace and training-centre admin | `src/sdc/data.ts`, `src/sdc/store.tsx` |
| `/magnets` | **Skill Magnets** — interest communities nested to any depth (e.g. E-commerce › Amazon › PPC › Sponsored Brands); member- or admin-created groups with privacy, rules and roles; feed with stories, text, photo, question, poll, brainstorm, event and job/gig posts; reactions, comments, sharing; group chats and DMs; professional profiles with endorsements; platform admin console | `src/magnets/data.ts`, `src/magnets/store.tsx` |

The prototypes keep their state in the visitor's browser (`localStorage`). Where another person would act (a client approving work, a mediator deciding a dispute), the UI offers a clearly labelled "Simulate…" action. Each section needs a real backend (accounts, database, file and video storage, payments) before launch.

## Development

```bash
npm install
npm run dev
```

## How deployment works

1. Push to `main`.
2. A GitHub Action (`.github/workflows/deploy.yml`) runs `npm run build` and commits the built files to the `deploy` branch.
3. Hostinger's Git deployment (hPanel → Advanced → Git) pulls the `deploy` branch into `public_html`. Auto-deployment is triggered by a GitHub webhook.

`public/.htaccess` forces HTTPS and sends all routes to `index.html` so client-side routing works on Hostinger's shared hosting.
