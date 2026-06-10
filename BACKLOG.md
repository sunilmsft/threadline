# Threadline — Product Backlog

## Phase 0: Foundation (Current)
- [x] Create repo and project structure
- [x] Define vision and README
- [ ] Scaffold HTML/CSS/JS framework
- [ ] Create data schema (projects.json)
- [ ] Seed with existing projects (from smb-automation/projects.html)
- [ ] Remove MS-specific projects, archive retirement tools
- [ ] Deploy to GitHub Pages
- [ ] Basic responsive layout (works on phone)

## Phase 1: Living Dashboard (MVP)
- [x] Project cards with lifecycle stages (idea → validated → building → live → archived)
- [x] Multiple views: by stage, by category, by last activity
- [x] View toggle/switcher (let user pick their preferred home view)
- [x] Quick-add: "New Idea" button → minimal form (title + one-liner + category)
- [x] Pin/unpin ideas to keep them visible
- [x] Search/filter across all projects
- [x] Collapsible stage/category sections
- [x] Hide/show projects for focus
- [x] GitHub repo discovery (auto-detect untracked repos)
- [x] Tags system (searchable, rendered as pills)
- [ ] Last updated indicator on cards (from GitHub API for repos, manual for others)
- [ ] Project detail panel (click to expand: status, links, blockers, notes)
- [ ] Manual status updates (drag or dropdown to change stage)
- [ ] Last activity indicator (pulled from GitHub API — last commit date)

## Phase 2: Memory & Context
- [ ] Blockers & waiting-on tracker per project (e.g., "TFN verification — waiting on Twilio")
- [ ] Follow-up reminders / nudges ("Kolo hasn't been touched in 14 days")
- [ ] Session memory: "You were last working on X and Y" (localStorage + sync)
- [ ] Learnings log per project (key decisions, patterns discovered)
- [ ] Cross-project pattern library (reusable components, shared approaches)
- [ ] Tag system for connecting related projects

## Phase 3: Integrations
- [ ] GitHub API: auto-pull last commit, open issues, deploy status per repo
- [ ] One-click "Open in VS Code" (vscode:// protocol link)
- [ ] ChatGPT integration: brainstorm button that opens ChatGPT with project context pre-loaded
- [ ] VS Code .copilot integration: project graph readable by Copilot during coding sessions
- [ ] GitHub Actions: auto-update project data on push events (webhook → rebuild)

## Phase 4: Mobile & Capture
- [ ] PWA manifest + service worker (installable on phone)
- [ ] Quick capture from phone (share sheet / home screen shortcut)
- [ ] Voice note capture (speech-to-text → idea card)
- [ ] Push notifications for nudges/reminders

## Phase 5: Multi-user & Open Source
- [ ] Clean separation of framework vs. user data
- [ ] Customizable home screen view (users pick their default layout)
- [ ] Onboarding flow for new users
- [ ] Contribution guide + controlled release process
- [ ] Public launch

---

## Parking Lot (Future ideas, no commitment)
- AI-powered "what should I work on?" recommendation based on momentum + blockers
- Time tracking (optional) — how much time per project per week
- Revenue/cost tracker per project
- Integration with Render/Vercel deploy status
- "Project health" score (activity + blockers + staleness)
- Shared project boards (collaborate with others on same project)
- Export to portfolio (auto-generate sunilvenugopal.com project entries)
