## UI/UX work

- For any UI or UX change (new page, component, layout, styling, animation, or visual polish), use the `ui-ux-pro-max` skill before writing code. Follow its design direction, palette, typography, and spacing guidance.
- Use the `nextjs` skill for App Router structure, layouts, routing, and image/font handling.
- Use the `shadcn` skill when adding or restyling base components.
- Use `react-best-practices` for client/server component boundaries and keeping animation code lean.
- Animations use Motion (Framer Motion). Respect `prefers-reduced-motion` on every animated element.
- Check responsive layout at mobile (375px) and desktop widths before reporting a UI task as done.

## Folder structure

- Use the Next.js App Router with `src/` as the source root.
- Routes and layouts: `src/app/` (one folder per route, with `page.tsx` and `layout.tsx` as needed).
- Reusable UI primitives: `src/components/ui/`.
- Page sections (hero, about, projects, contact): `src/components/sections/`.
- Animation wrappers and motion presets: `src/components/motion/`.
- Static content such as project data and copy: `src/content/`.
- Global styles and design tokens: `src/styles/`.
- Images and fonts: `public/` for assets, `src/fonts/` for local font files.
- Do not put business logic in `components/ui/`. Keep it presentational.

## Component colocation

The app has more than 5 pages, so components live next to the page that uses them.

- Page-specific components go in a `_components/` folder inside that route's folder (e.g. `src/app/about/_components/`). The underscore prefix keeps the folder out of routing.
- If a page-specific component is later used by another page, move it to the global `src/components/` folder (matching the structure above).
- If a global component ends up used by only one page, move it into that page's `_components/` folder.
- When adding or removing a usage of a component, check whether it now belongs in a different location and move it, updating imports.

## Working rules

- Before creating a new folder or moving files, state the proposed structure and wait for approval.
- Keep changes scoped to the task; do not refactor unrelated files.
- Summarize which skills were used and which files changed at the end of each UI task.
