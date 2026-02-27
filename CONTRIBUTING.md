# Sader & Carter — Contributor Guide

## Collaborators
- **Louis Sader** — [@louissader](https://github.com/louissader)
- **Logan Carter** — [@Logan566C](https://github.com/Logan566C)

## Rules for Every New Client Repo

1. **Add both collaborators immediately** after creating the repo:
   - Go to `Settings → Collaborators → Add people`
   - Add `louissader` with **Write** access
   - Add `Logan566C` with **Write** access

2. **Naming convention:** `firstname-lastname-portfolio`

3. **After launch**, add the project to the showcase carousel:
   - Edit `src/data/projects.js` in `louissader/portfolio-showcase`
   - Add a screenshot to `public/images/projects/[slug].jpg`
   - Update the "Projects Delivered" stat in `src/pages/Home.jsx`
   - Push → Vercel auto-deploys to `websites-sader-carter.vercel.app`

4. **Screenshots auto-update** every Monday via GitHub Actions.
   To trigger manually: `Actions → Update Project Screenshots → Run workflow`

## Production URL
`https://websites-sader-carter.vercel.app`
