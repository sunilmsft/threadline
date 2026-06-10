# Threadline — Project Context

## What this is
Threadline is a **Personal Builder OS** — a living workspace to capture ideas, track active projects, remember blockers, connect learnings across repos, surface reusable patterns, and move things from idea → validation → build → live.

The "thread" is the continuity across all of it: ideas, context, GitHub activity, ChatGPT/Copilot learnings, and next actions.

## Owner
- Sunil Venugopal (sunilmsft on GitHub)
- Product Manager at Microsoft (not a software engineer)
- Based in Sammamish, WA
- Building personal/SMB projects outside of work

## Core Problems Being Solved
1. **Ideas evaporate** — no frictionless capture; they disappear
2. **Context trapped in silos** — each project has its own workspace/memory, nothing connects them
3. **State goes stale** — manual dashboards drift from reality
4. **No lifecycle** — no way to move something from idea → validated → building → live
5. **Cognitive overload** — flat lists don't work; needs zoom in/out
6. **Entry point problem** — should start HERE, not in VS Code or Chrome

## Design Decisions Made
- **GitHub Pages** for hosting (accessible anywhere, open-sourceable later)
- **PWA** planned (phone home screen install, quick capture)
- **GitHub API** for auto-pulling repo activity (last commit, deploy status)
- **JSON data layer** (projects.json) — portable, version-controlled
- **Multiple views** — by stage, category, recent activity, pinned (user can pick home view)
- **Dark theme** — matches VS Code aesthetic
- **Aspirational goal**: open-source it for other builders (Phase 5)

## Key Features Discussed
- Quick idea capture (phone-friendly, eventually voice notes)
- Lifecycle pipeline: idea → validated → building → live → archived
- Blockers & waiting-on tracker per project (with nudge reminders)
- Session memory: "you were last working on X" (survives crashes, works cross-machine)
- Cross-project pattern library (shared components, learnings)
- ChatGPT integration for brainstorming (pre-load project context)
- VS Code integration (vscode:// links, .copilot project graph)
- Gentle nudges for stalled projects ("Kolo hasn't been touched in 14 days")

## Projects Included (from smb-automation/projects.html)
- FrontDesk AI (live, SMB) — brand: WelcomeMat
- Swoop (building, SMB) — blocker: TFN verification pending Twilio
- Kolo (building, family) — stalled, needs revisit
- HomeOps Hub (building, family) — phases 1-3 done
- Project Cushion (building, personal-tools) — prototype
- Tuck (live, personal-tools)
- SMB Dashboard (live, SMB)
- sunilvenugopal.com (live, personal-tools)
- Lunch Menu Notifier (live, family)
- MS Retirement Toolkit (archived)
- Prep Life After MS (archived)

## Removed (MS-specific)
- eCommerce Voice AI
- Consent UX Prototype
- Ask Microsoft Redesign

## Current State (as of 2026-06-10)
- Repo initialized at: C:\Users\sunilve\GitHub Copilot Fun Projects\threadline
- README.md ✓
- BACKLOG.md ✓ (5 phases defined)
- data/projects.json ✓ (11 projects seeded)
- index.html ✓ (shell with header, view switcher, new idea modal)
- css/style.css ✓ (dark theme, responsive, card layout)
- js/app.js — NOT YET CREATED (next step)
- NOT yet pushed to GitHub
- NOT yet deployed to GitHub Pages

## Next Steps
1. Create js/app.js (load projects.json, render cards, view switching, search, new idea form)
2. Test locally
3. Create GitHub repo (sunilmsft/threadline)
4. Push and enable GitHub Pages
5. Iterate on Phase 1 backlog items

## Technical Notes
- No build tools — vanilla HTML/CSS/JS for now (keep it simple)
- Data persists in projects.json (git) + localStorage (for session state / unsaved ideas)
- GitHub API calls will need a token for private repos (public repos work without auth)
- User prefers simplicity — no over-engineering
- NEVER auto-push to remote (user reviews locally first)
