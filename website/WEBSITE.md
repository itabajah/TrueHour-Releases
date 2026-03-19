# TrueHour Website Documentation

Marketing landing page for **TrueHour**, a Windows desktop app for time tracking and attendance management. Built as a single-page static site with Astro, deployed to GitHub Pages.

Live at: `https://itabajah.github.io/TrueHour-Releases`

---

## Tech Stack

| Layer | Technology | Version | Role |
|-------|-----------|---------|------|
| Framework | Astro | 5.7 | Static site generation, component system |
| Styling | Tailwind CSS | 3.4 | Utility-first CSS with custom theme |
| 3D Graphics | Three.js | 0.172 | Interactive particle network hero background |
| Animation | GSAP + ScrollTrigger | 3.12 | Scroll-triggered entrance animations |
| Bundler | Vite | (bundled with Astro) | Fast builds, chunk splitting |
| Language | TypeScript | strict | Type-checked scripts |
| Hosting | GitHub Pages | — | Static hosting from `../docs` output |

---

## Project Structure

```
website/
├── astro.config.mjs          # Astro config — site URL, base path, output dir, integrations
├── package.json               # Dependencies and npm scripts
├── tailwind.config.mjs        # Color scheme, dark mode, custom fonts
├── tsconfig.json              # Strict TS with @/* path alias
├── public/
│   └── robots.txt             # Search engine crawl rules + sitemap reference
└── src/
    ├── consts.ts              # APP_NAME, dynamic version fetching from GitHub API
    ├── env.d.ts               # Type declarations for GSAP and Three.js
    ├── assets/
    │   └── dashboard-screenshot.png   # App UI preview image
    ├── components/
    │   ├── Navbar.astro       # Fixed nav — theme toggle, mobile menu, download CTA
    │   ├── Hero.astro         # Full-screen hero — 3D canvas, headline, CTAs
    │   ├── Features.astro     # 6-card feature grid
    │   ├── HowItWorks.astro   # 3-step workflow (Import → Review → Export)
    │   ├── AppPreview.astro   # Dashboard screenshot showcase
    │   ├── Security.astro     # Trust badges (offline, encrypted, signed)
    │   ├── Download.astro     # Download CTA with system requirements
    │   └── Footer.astro       # Links and copyright
    ├── layouts/
    │   └── Base.astro         # Root HTML — meta tags, SEO, theme script, lazy loaders
    ├── pages/
    │   └── index.astro        # Single page — composes all components
    ├── scripts/
    │   ├── three-scene.ts     # 3D particle network engine (~500 lines)
    │   └── scroll-animations.ts  # GSAP ScrollTrigger setup
    └── styles/
        └── global.css         # Theme variables, component utilities, scrollbar styles
```

---

## Configuration

### astro.config.mjs

- **Site**: `https://itabajah.github.io/TrueHour-Releases`
- **Base**: `/TrueHour-Releases` (GitHub Pages subpath)
- **Output dir**: `../docs` — builds directly into the repo-root `docs/` folder for GitHub Pages
- **Integrations**: `@astrojs/tailwind` (CSS utility framework), `@astrojs/sitemap` (auto XML sitemap)
- **Vite overrides**: Three.js isolated into a separate chunk (`three-vendor`, 700 KB limit), Astro dev toolbar disabled

### tailwind.config.mjs

- **Dark mode**: Class-based (`darkMode: "class"`) — toggled via `.dark` on `<html>`
- **Font**: Inter (Google Fonts), set as default sans-serif
- **Color palette** (CSS variable-driven):
  - Primary: deep blue `#0f3460`
  - Accent: coral/red `#e94560`
  - Semantic tokens: `deep`, `surface`, `card`, `muted`, `body`, `heading`, `success`
- **Custom colors** resolve to `var(--color-*)`, enabling runtime theme switching without rebuilds

### tsconfig.json

- Extends `astro/tsconfigs/strict`
- Path alias: `@/*` → `src/*`
- `skipLibCheck: true`

---

## Page Architecture

The site is a single page (`src/pages/index.astro`) wrapped in the `Base` layout. Sections render in this order:

```
Base.astro (HTML shell, <head>, theme init, lazy loaders)
└── index.astro
    ├── Navbar        — fixed top navigation
    ├── <main>
    │   ├── Hero          — full-screen with 3D canvas background
    │   ├── Features      — 6-card grid
    │   ├── HowItWorks    — 3-step workflow
    │   ├── AppPreview    — screenshot showcase
    │   ├── Security      — trust badges
    │   └── Download      — final CTA with system requirements
    └── Footer        — links and copyright
```

### Base Layout (`src/layouts/Base.astro`)

Provides the `<html>` shell with:

- **Meta tags**: charset, viewport, description, theme-color (`#0a0e17`)
- **Open Graph + Twitter Card** tags for social sharing
- **JSON-LD** structured data (`SoftwareApplication` schema for rich search results)
- **Google Fonts** preload for Inter
- **Inline theme script**: reads `localStorage("theme")`, defaults to dark, applies `.dark` class before paint to prevent flash
- **Lazy loaders**: scroll animations init on `DOMContentLoaded`; Three.js scene loaded via dynamic `import()` only when the hero canvas element is present

---

## Components Reference

### Navbar (`src/components/Navbar.astro`)

Fixed header with transparent-to-solid background on scroll. Contains:
- Logo + "TrueHour" brand text
- Navigation links: Features, Security, Download (smooth-scroll anchors)
- Light/dark theme toggle with animated sun/moon SVG icons
- "Get TrueHour" CTA button linking to the latest GitHub release
- Responsive mobile hamburger menu with backdrop blur and max-height animation
- Inline `<script>` handles scroll detection, theme persistence (`localStorage`), and mobile menu toggling

### Hero (`src/components/Hero.astro`)

Full-viewport section with:
- `<canvas id="hero-canvas">` — mount point for the Three.js particle scene
- Gradient overlays for depth
- Dynamic version badge fetched from GitHub releases at build time
- Headline: "Time Tracking, **Simplified**" (animated gradient shimmer on "Simplified")
- Two CTAs: primary "Download for Windows" + ghost "Learn More"
- Scroll indicator (animated bouncing chevron)
- Hero content elements have `.hero-element` class for staggered fade-in on load

### Features (`src/components/Features.astro`)

Responsive 3-column grid (1 column on mobile) with 6 `glass-card` items:

| Feature | Description |
|---------|-------------|
| Smart Import | Drag-and-drop with auto-deduplication |
| Anomaly Detection | Confidence-scored correction suggestions |
| Payroll Export | Excel/CSV output with live formulas |
| Fully Encrypted | AES-256 SQLCipher database encryption |
| Multilingual | English, Hebrew, Arabic with RTL support |
| Version History | Full undo/redo with snapshot branching |

Each card has an SVG icon, colored icon background circle, hover scale transform, and `.fade-up` / `.stagger-card` classes for scroll animation.

### HowItWorks (`src/components/HowItWorks.astro`)

Three-step flow with numbered circular badges (01, 02, 03) connected by a vertical line on desktop:

1. **Import** — Drop attendance files from ZKTeco terminals
2. **Review** — Fix anomalies with one-click AI suggestions
3. **Export** — Download payroll-ready Excel reports

Cards use `.stagger-card` for cascading entrance animation.

### AppPreview (`src/components/AppPreview.astro`)

Showcases the app's dashboard UI via a lazy-loaded screenshot (`src/assets/dashboard-screenshot.png`) inside a glass-card frame with a glow effect on hover. Includes a descriptive caption below the image.

### Security (`src/components/Security.astro`)

Three trust badges with green success icons:

| Badge | Detail |
|-------|--------|
| Offline-First | No internet required; data never leaves the machine |
| AES-256 Encrypted | Bank-grade SQLCipher encryption at rest |
| Digitally Signed | Authenticode-verified Windows binary |

Centered layout with a decorative background glow.

### Download (`src/components/Download.astro`)

Final conversion section with:
- Primary CTA: "Download for Windows" (links to latest GitHub release `.exe`)
- Dynamic version number (fetched at build time)
- "Try Demo Mode" explanation — app runs without activation for evaluation
- System requirements: Windows 10+, ~60 MB disk, no admin rights
- Contact link for activation inquiries
- Decorative concentric circle background elements

### Footer (`src/components/Footer.astro`)

Two-column responsive footer with:
- Left: Logo + "Tabajah Stack" brand
- Right: Links to GitHub repo, Security policy, Contributing guidelines, Changelog
- Bottom: Copyright with dynamic year

---

## Scripts

### three-scene.ts (~500 lines)

Interactive 3D particle network rendered on the hero `<canvas>`. Key systems:

**Scene setup**
- WebGL renderer with antialiasing (disabled on mobile)
- Perspective camera (FOV 75), ACES Filmic tone mapping
- Fog that adapts color to current theme

**Particle network**
- 120 particles (mobile) / 300 particles (desktop)
- Custom shader material with per-particle glow, dynamic sizing, color interpolation between primary blue and accent red, and sine-wave pulse animation
- Additive blending in dark mode, solid edge rendering in light mode

**Connection lines**
- Dynamic lines between particles within a 5–6 unit radius
- **Spatial grid** partitioning for O(n) neighbor lookups instead of O(n²)
- Color gradient based on distance from scene center; alpha varies for depth

**Background stars**
- 300 (mobile) / 800 (desktop) distant points with subtle parallax rotation

**Interactivity**
- Mouse position tracked with smooth lerp
- Particles repelled from cursor within an 8-unit radius
- Camera subtly follows mouse movement
- Boundary wrapping keeps particles in continuous motion

**Theme awareness**
- `MutationObserver` watches for `.dark` class changes on `<html>`
- Adjusts fog, particle colors, star opacity, and bloom in real time
- Dark mode: vibrant blues/reds with UnrealBloomPass glow
- Light mode: muted tones, no bloom post-processing

**Performance**
- `IntersectionObserver` pauses the render loop when the hero section scrolls out of view
- Mobile tier: fewer particles, lower pixel ratio, no post-processing
- `prefers-reduced-motion`: renders a single frame then stops the loop
- Three.js loaded via dynamic `import()` only when the canvas exists

### scroll-animations.ts

GSAP ScrollTrigger configuration:

- **Hero elements** (`.hero-element`): immediate fade-in + slide-up on page load (1s, staggered 0.15s)
- **Fade-up sections** (`.fade-up`): animate on scroll trigger at "top 88%" viewport position (0.8s, `power3.out` ease), reverse on scroll out
- **Staggered cards** (`.stagger-card`): cascade in groups (0.12s stagger, 0.7s per card)
- **Reduced motion**: if `prefers-reduced-motion` is active, all animations are skipped entirely

---

## Theming

The site supports **dark** and **light** modes:

**CSS custom properties** (defined in `src/styles/global.css`):

| Variable | Light | Dark |
|----------|-------|------|
| `--color-deep` | `#f0f2f5` | `#0a0e17` |
| `--color-surface` | `#ffffff` | `#1a1a2e` |
| `--color-muted` | `#5f6c7b` | `#94a3b8` |
| `--color-heading` | `#1a1a2e` | `#ffffff` |
| `--color-glass` | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.03)` |

**Toggle mechanism**:
1. Navbar button toggles `.dark` class on `<html>`
2. Preference saved to `localStorage("theme")`
3. Inline script in `Base.astro` reads storage before first paint (prevents flash)
4. `MutationObserver` in `three-scene.ts` detects class change and adapts 3D scene colors in real time
5. Tailwind config resolves colors from CSS variables, so all utility classes adapt automatically

Default theme is **dark**.

---

## Styles (`src/styles/global.css`)

Built on Tailwind's `@layer` system:

**Base layer**:
- Smooth scrolling, font antialiasing
- Custom scrollbar (8px, rounded, themed colors)
- Selection highlight in accent color

**Component utilities**:
- `.btn-primary` — accent background, hover glow shadow, scale on hover
- `.btn-ghost` — transparent with border, subtle hover background
- `.glass-card` — backdrop blur, themed border, rounded corners, hover transitions
- `.section-padding` — responsive vertical padding (`py-24` / `py-32`)
- `.glow-accent` / `.glow-primary` — colored box-shadow glow effects
- `.text-theme-*` — semantic text color classes mapped to CSS variables

**Reduced motion**: if `prefers-reduced-motion` is active, all transition/animation durations collapse to `0.01ms`.

---

## Performance Optimizations

| Technique | Detail |
|-----------|--------|
| Lazy-load Three.js | Dynamic `import()` only when `#hero-canvas` exists |
| Chunk splitting | Vite separates Three.js into `three-vendor` chunk (~700 KB) |
| IntersectionObserver | Pauses 3D render loop when hero scrolls out of viewport |
| Mobile tier | 120 particles (vs 300), no bloom post-processing, lower pixel ratio |
| Spatial grid | O(n) particle neighbor lookups instead of O(n²) brute force |
| Reduced motion | Single-frame render then stop if user prefers reduced motion |
| Image lazy-load | AppPreview screenshot uses `loading="lazy"` |
| Font preload | Inter font preconnect and preload in `<head>` |

---

## Accessibility

- **Skip-to-content** link at the top of `index.astro`
- **Semantic HTML**: `<nav>`, `<main>`, `<footer>`, `<section>` elements
- **ARIA labels**: on icon-only buttons (theme toggle, mobile menu)
- **Keyboard navigation**: all interactive elements are focusable, focus-visible outlines styled
- **prefers-reduced-motion**: all GSAP animations disabled; Three.js renders one frame then stops
- **Color contrast**: heading/body text against surface colors follows accessible contrast ratios

---

## SEO

- **Open Graph** meta tags: title, description, type, URL, image
- **Twitter Card** meta tags: `summary_large_image` card type
- **JSON-LD**: `SoftwareApplication` structured data (name, OS, category, offers, description)
- **Sitemap**: auto-generated by `@astrojs/sitemap` integration at build time
- **robots.txt**: allows all crawlers, points to sitemap URL
- **Theme color**: `#0a0e17` for browser chrome styling

---

## Development

### Prerequisites

- Node.js (LTS recommended)
- npm

### Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:4321)
npm run build        # Production build → outputs to ../docs/
npm run preview      # Preview the built site locally
npm run typecheck    # Run TypeScript type checking
```

### Dynamic Version

`src/consts.ts` exports `getAppVersion()` which fetches the latest release tag from the GitHub API at build time:

- Queries `https://api.github.com/repos/itabajah/TrueHour-Releases/releases/latest`
- Supports optional `GITHUB_TOKEN` environment variable for authenticated requests
- Caches the result in-memory after first fetch
- Falls back to `"1.0.0"` if the API call fails

The version appears in the Hero badge and Download section.

---

## Deployment

The site deploys to **GitHub Pages**:

1. `npm run build` generates static files into `../docs/` (the repo-root `docs/` folder)
2. GitHub Pages is configured to serve from the `docs/` directory on the `main` branch
3. All asset paths use the `/TrueHour-Releases` base path
4. The sitemap and robots.txt reference the full `https://itabajah.github.io/TrueHour-Releases` URL

No CI/CD pipeline is required — building locally and committing the `docs/` folder is sufficient.
