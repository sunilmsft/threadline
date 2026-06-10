## Project: Threadline
## Type: Personal Builder OS (PWA, GitHub Pages)
## Stack: Vanilla HTML/CSS/JS, GitHub API, JSON data layer

### Rules
- NEVER auto-push to remote — user reviews locally first, then says "push it"
- Keep it simple — no build tools, no frameworks unless explicitly requested
- User is a Product Manager, not a software engineer — explain tradeoffs plainly
- Read .copilot/context.md for full project history and design decisions
- Data lives in data/projects.json — treat it as the source of truth
- Dark theme (VS Code aesthetic) — see css/style.css for design tokens
- Mobile-first responsive design — must work on phone

### Architecture
- index.html — single page app shell
- css/style.css — all styles (CSS variables for theming)
- js/app.js — all logic (load data, render, interactions)
- data/projects.json — project registry (version controlled)
- localStorage — session state, unsaved ideas, user preferences
