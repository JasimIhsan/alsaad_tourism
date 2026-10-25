The Next.js app lives in `app/`. All paths below are relative to the repo root. Run npm/next commands from `app/`.

@app/AGENTS.md

## UI/UX work

- For any UI or UX change (new page, component, layout, styling, animation, or visual polish), use the `ui-ux-pro-max` skill before writing code. Follow its design direction, palette, typography, and spacing guidance.
- Use the `nextjs` skill for App Router structure, layouts, routing, and image/font handling.
- Use the `shadcn` skill when adding or restyling base components.
- Use `react-best-practices` for client/server component boundaries and keeping animation code lean.
- Animations use Motion (Framer Motion). Respect `prefers-reduced-motion` on every animated element.
- Check responsive layout at mobile (375px) and desktop widths before reporting a UI task as done.

## Folder structure

- Use the Next.js App Router with `app/src/` as the source root.
- Routes and layouts: `app/src/app/` (one folder per route, with `page.tsx` and `layout.tsx` as needed).
- Reusable UI primitives: `app/src/components/ui/`.
- Site shell used on every page (header, mobile nav, footer, contact buttons): `app/src/components/layout/`.
- Page sections (hero, about, projects, contact): `app/src/components/sections/`.
- Animation wrappers and motion presets: `app/src/components/motion/`.
- Static content such as project data and copy: `app/src/content/`.
- Global styles and design tokens: `app/src/styles/`.
- Images and fonts: `app/public/` for assets, `app/src/fonts/` for local font files.
- Do not put business logic in `components/ui/`. Keep it presentational.

## Component colocation

The app has more than 5 pages, so components live next to the page that uses them.

- Page-specific components go in a `_components/` folder inside that route's folder (e.g. `app/src/app/about/_components/`). The underscore prefix keeps the folder out of routing.
- If a page-specific component is later used by another page, move it to the global `app/src/components/` folder (matching the structure above).
- If a global component ends up used by only one page, move it into that page's `_components/` folder.
- When adding or removing a usage of a component, check whether it now belongs in a different location and move it, updating imports.

## Content, i18n and theming

- No hard-coded user-facing text in components. Every string (copy, labels, placeholders, `aria-label`, `alt`, metadata, validation messages, WhatsApp messages) comes from the global dictionaries in `app/src/content/locales/{en,ar}.json`. Both locales share one type.
- Build every UI for both LTR (`en`) and RTL (`ar`). Use logical utilities (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), never physical `left`/`right`/`ml`/`mr`/`pl`/`pr`. Mirror asymmetric layouts, flip directional icons and Motion `x` offsets, open sheets and drawers from the reading side, and drop uppercase and letter-spacing for Arabic. Check every UI change in both directions.
- Traveler Diaries (blog) posts are Markdown files with frontmatter in `app/src/content/diaries/`.
- No hard-coded colours. Colours, gradients, shadows and overlays are CSS variable tokens defined only in `app/src/app/globals.css`, and components use semantic Tailwind classes (`bg-primary`, `text-muted-foreground`). No hex, `rgb()`, `oklch()`, named colours or arbitrary colour values (`bg-[#...]`) in components.

## Working rules

- Before creating a new folder or moving files, state the proposed structure and wait for approval.
- Keep changes scoped to the task; do not refactor unrelated files.
- Summarize which skills were used and which files changed at the end of each UI task.
