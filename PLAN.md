# QuickQR — Phase 1 Plan

Scope: responsive shell, theme, navigation, landing page. Nothing from Phases 2–5.

## Setup commands (run locally with network access)

```bash
# Option A: use the files in this folder
cd quickqr
npm install
npm run lint && npm run typecheck && npm run build
npm run dev

# Option B: scaffold fresh, then copy src/, public/ and configs over
npx create-next-app@latest quickqr --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd quickqr && npm install next-themes lucide-react
```

## Dependencies and why

| Package | Why | Phase |
| --- | --- | --- |
| next, react, react-dom | App Router framework | 1 |
| typescript, @types/* | Strict typing | 1 |
| tailwindcss, @tailwindcss/postcss | Styling with design tokens | 1 |
| next-themes | Class-based light/dark with no flash on load | 1 |
| lucide-react | Consistent icon family from the brief | 1 |
| eslint, eslint-config-next | Lint | 1 |
| qr-code-styling, @zxing/browser | Not added yet; added in Phases 2 and 5 after API verification | later |

## File structure (Phase 1 only, no empty abstractions)

```
quickqr/
  public/logo.svg
  src/
    app/
      layout.tsx          root layout, font, metadata, providers, skip link
      page.tsx            landing page
      globals.css         Tailwind import + design tokens (light/dark)
      icon.svg            favicon
      generator/page.tsx  placeholder, clearly marked not implemented
      my-codes/page.tsx   placeholder
      scanner/page.tsx    placeholder
      about/page.tsx      privacy-first About page (real content)
    components/
      layout/  Header, Footer, Logo, ThemeToggle, ThemeProvider
      home/    Hero, Features
      ui/      ButtonLink, ComingSoon
    lib/       nav.ts, cn.ts
```

## Key decisions

1. Tailwind v4, CSS-first config. Tokens live in `globals.css`; dark mode is a `.dark` class set by next-themes.
2. Semantic color tokens (background, surface, border, muted, brand) so Phases 2+ never hard-code colors.
3. Button background and link text use separate blue tokens so both pass WCAG AA contrast in both themes.
4. Server components by default. Only Header (menu state, active link) and ThemeToggle are client components.
5. Placeholder pages say plainly they are not implemented yet. No fake QR output.
6. The hero graphic is decorative, hidden from assistive tech, and not a scannable code.
7. Inter via `next/font` (self-hosted at build time).

## Done criteria for Phase 1

- All five routes render and navigate; active link highlighted.
- Light/dark toggle works and persists; no flash.
- Usable at 360px wide through desktop; mobile menu is keyboard accessible.
- Skip link, visible focus states, labelled controls.
- lint, type-check and build pass (run locally; see report).
