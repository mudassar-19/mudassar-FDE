# 3D Developer Portfolio Template — Analysis Report

Analyzed in place at `/Users/mudassarnaeem/portfolio-website-main`. No template files were modified. Dependencies were installed (`node_modules/`, gitignored), a production build was generated (`dist/`, gitignored) and then removed is not required (left in place, gitignored), and this repo is **not a git repository** (no `.git` found) — it appears to be a plain folder extracted from a download, not a clone.

Testing tools: Playwright 1.64.0 (Chromium) against `npm run dev` (Vite, :5173) and `npm run preview` (production build, :4173); Lighthouse 12.8.2 CLI against the production build.

---

## 1. Summary

This is **"moncy-portfolio"** (`package.json` name), a single-developer, highly animated **3D personal portfolio** for "Redoyanul Haque", an AI/full-stack developer from Bangladesh. The live reference is `redoyanulhaque.me`.

It is built around one centerpiece idea: a custom-rigged, Blender-style low-poly 3D avatar that sits at a desk, reacts to mouse movement, and performs a scripted scroll-driven sequence (rotate → zoom out → turn to the monitor → screen lights up) as you scroll from the hero into the About/What-I-Do sections. Everything else (About, Career timeline, Work gallery, Tech-stack pyramid, Contact) is a conventional one-page scrolling layout wrapped in GSAP scroll animations and Lenis smooth-scroll.

**Who it suits:** a solo developer/AI engineer who wants a visually striking, animation-heavy hero piece and is comfortable doing TypeScript/React/Three.js maintenance themselves. It is **not** a drag-and-drop or CMS-driven template — content is scattered across a mix of a central config file and several hardcoded components, and the 3D character asset is deliberately obfuscated against reuse (see §6). It suits someone willing to treat this as a codebase to fork and rewire, not a theme to configure.

It is **not** suited to non-technical users, to multi-page/blog-style portfolios, or to anyone who needs the 3D centerpiece to be swappable without 3D/Three.js knowledge.

---

## 2. Tech stack and structure

### Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.5.3 |
| Build tool | Vite | 5.4.1 (resolved 5.4.4) |
| Router | react-router-dom | 7.12.0 |
| 3D | three + three-stdlib | 0.168.0 / 2.33.0 |
| 3D React bindings | @react-three/fiber, @react-three/drei, @react-three/cannon, @react-three/rapier, @react-three/postprocessing | 8.17–9.120 range | 
| Animation | GSAP (+ ScrollTrigger) | 3.12.7 |
| Smooth scroll | lenis | 1.3.15 |
| Chess | chess.js, stockfish.js | 1.4.0 / 10.0.2 |
| Icons | react-icons | 5.3.0 |
| Marquee | react-fast-marquee | 1.6.5 |
| Analytics | @vercel/analytics, @vercel/speed-insights | 1.4.1 / 2.0.0 |
| Lint | ESLint 9 + typescript-eslint 8 | |

**Important: several dependencies are installed but unused in `src/`.** Confirmed by grep — `@react-three/fiber`, `@react-three/drei`, `@react-three/cannon`, `@react-three/rapier`, `@react-three/postprocessing`, and `stockfish.js` have zero imports anywhere in the codebase. The 3D scene is hand-rolled with raw `three` + `three-stdlib`, not `@react-three/fiber`. The chess engine is a custom WASM engine (`public/redoxchess.js/.wasm`) loaded via a plain Web Worker in `src/utils/redoxchessEngine.ts`, not `stockfish.js`. These are dead weight in `package.json`/`package-lock.json` (they don't bloat the production bundle since they're never imported and Vite tree-shakes unused modules, but they do bloat `npm install` time, `node_modules` size, and the `npm audit` surface for no benefit).

### Folder structure

```
index.html                 entry HTML, <title>, no meta description/OG/favicon
vite.config.ts              manual chunk splitting (three/react-three/gsap/vendor), terser, drops console in prod
api/chat.js                 Vercel serverless function, proxies to Groq (chat persona)
public/
  draco/                    DRACO decoder (JS+WASM) for compressed GLTF geometry
  models/                   character.enc (1.5MB, AES-encrypted GLB), character.glb (132B stub), char_enviorment.hdr (289KB), encrypt.cjs
  images/                   project screenshots (PNG, ~1.8-2.1MB each, unoptimized), tech logos (webp), profile photos
  video/video.webm           tech-stack section background video (640KB)
  redoxchess.js/.wasm        custom chess engine (worker + WASM, ~2MB combined)
src/
  main.tsx, App.tsx          router: "/" (home), "/myworks", "/play"
  config.ts                  ← single source of truth for most text content (see §4)
  context/LoadingProvider.tsx  global isLoading/percent context, gates first paint behind the 3D intro
  components/
    MainContainer.tsx        assembles the one-page layout, defers mounting the 3D character via requestIdleCallback
    Character/                3D hero scene (see §3)
      Scene.tsx                raw three.js scene/camera/renderer/animation-loop setup
      index.tsx                thin wrapper
      utils/character.ts       GLTFLoader + DRACOLoader + decrypt pipeline
      utils/decrypt.ts         WebCrypto AES-CBC decryption of character.enc
      utils/animationUtils.ts  AnimationMixer, intro clip, blink, hover eyebrow-raise, typing loop
      utils/lighting.ts        directional + point light, HDR environment, screen-glow pulse
      utils/mouseUtils.ts      mouse/touch → head-bone rotation interpolation
      utils/resizeUtils.ts     camera/renderer resize handling
    utils/GsapScroll.ts       the big scroll-driven timeline: character rotation/camera moves tied to landing/about/whatIDO sections
    utils/splitText.ts, initialFX.ts  text-splitting + entrance animations (GSAP + custom TextSplitter)
    Navbar.tsx                 Lenis init, anchor-link smooth scroll
    Landing/About/WhatIDo/Career/Work/TechStackNew/CallToAction/Contact.tsx  page sections (mostly read from config.ts)
    Loading.tsx                loading screen (progress %, marquee, click-to-enter animation)
    Cursor.tsx, SocialIcons.tsx, HoverLinks.tsx, WorkImage.tsx  cursor-follow / hover micro-interactions
  pages/
    MyWorks.tsx                grid of all projects (reads config.projects)
    Play.tsx                   full chess UI + WASM engine + Groq-backed chat persona
  data/boneData.ts             bone-name lists used to filter GLTF animation tracks (eyebrows, typing fingers)
  utils/textSplitter.ts, redoxchessEngine.ts
```

### 3D / animation / scroll architecture

- **No `@react-three/fiber`** — the scene is imperative, hand-wired three.js inside a `useEffect` in `Scene.tsx`: creates `WebGLRenderer`, a `PerspectiveCamera` (fov 14.5, manually positioned `(0, 13.1, 24.7)`), a `Scene`, and runs its own `requestAnimationFrame` loop (`src/components/Character/Scene.tsx:110-129`).
- **Model pipeline:** `character.enc` is fetched, decrypted client-side with WebCrypto AES-CBC using a **hardcoded password `"Character3D#@"`** (`src/components/Character/utils/decrypt.ts`, `utils/character.ts:19-22`), turned into a Blob URL, then loaded with `GLTFLoader` + `DRACOLoader` (decoder served from `/public/draco/`). This is **not real security** — the key ships in the client bundle, so anyone can decrypt the file by reading the source; it only stops someone from directly downloading a `.glb` by URL and dragging it into a 3D viewer. The actual `character.glb` in `public/models/` is a 132-byte stub, not the real asset.
- **Animation:** `AnimationMixer` plays an intro clip once, loops a few "typing"/idle clips, and uses bone-name filtering (`data/boneData.ts`) to isolate just the eyebrow bones (hover reaction) or typing-finger bones from a larger animation clip (`utils/animationUtils.ts`).
- **Lighting:** a purple directional light + point light, both start at intensity 0 and fade in via GSAP after the model loads (`utils/lighting.ts`); an HDR equirectangular environment map (`char_enviorment.hdr`) drives reflections; the "screen glow" on the character's monitor is a flickering point light intensity driven by `Math.random()` on a 200ms interval (`components/utils/GsapScroll.ts:9-11`).
- **Mouse tracking:** raw mouse/touch position is lerped into head-bone rotation every frame (`utils/mouseUtils.ts`, consumed in `Scene.tsx`'s `animate()` loop).
- **Scroll-driven camera/character choreography:** `src/components/utils/GsapScroll.ts` is the core of the "journey" feel — three GSAP timelines pinned to `.landing-section`, `.about-section`, `.whatIDO`, each with `scrollTrigger.scrub` tied to scroll position, animating the character's rotation, the camera's z/y position, and opacity/position of DOM text blocks in lockstep. `setAllTimeline()` separately animates the Career section's vertical timeline line height and staggered fade-ins.
- **Horizontal project carousel:** `Work.tsx` uses a classic GSAP `ScrollTrigger` **pin + horizontal scrub** pattern (pins `.work-section`, translates `.work-flex` on the x-axis as the user scrolls vertically) — disabled below 768px so mobile just scrolls normally.
- **Desktop-only gating:** the whole 3D character only mounts when `window.innerWidth > 1024` **and** `window.innerWidth > 768` (`MainContainer.tsx:16-20,67`), and only after an idle callback (`requestIdleCallback`, 1500ms timeout, or a 1200ms `setTimeout` fallback) to avoid blocking first paint. Below 1024px a static `<img>` (`mobile-photo`, `public/images/mypicnbg.png`) is shown instead — confirmed in testing (§5).

---

## 3. Section-by-section walkthrough (desktop, 1440px)

Screenshots in `./screenshots/`. All captured against the **production build** (`npm run preview`, port 4173) after the loading gate cleared, since the dev server under React StrictMode exhibited a loading-progress bug (see §5).

1. **Landing / Hero** (`desktop-landing.png`, `.landing-section`) — Full-bleed 3D character centered, "Hello I'm REDOYANUL HAQUE" on the left, rotating role text ("AI Engineer" / "Full-Stack Developer") on the right, nav bar (RH logo, email, ABOUT/WORK/CONTACT) top, social icons + "RESUME" link bottom-left. The character's head tracks the cursor.
2. **About** (`desktop-about.png`) — as you scroll, the camera pulls back, the character turns toward its desk/monitor, the monitor screen lights up, and a single paragraph of bio text fades in. This is the most technically impressive moment in the site — the About copy isn't a separate "section" visually so much as a camera move layered over the same 3D scene.
3. **What I Do** (`desktop-whatido.png`) — character now fully at the desk typing. Two bordered cards ("AI DEVELOPER", "FULL-STACK") with tool-tag chips, dashed-line corner brackets (custom SVG), expand/collapse on hover (desktop) or tap (touch, via `ScrollTrigger.isTouch` branch in `WhatIDo.tsx`).
4. **Career & experience** (`desktop-career.png`) — vertical timeline with a growing line + dot, six entries from "Microsoft Office / 2021" through "Learning Something New / NOW", each with role, company, year badge, and description. Timeline-line height and item opacity are scroll-scrubbed.
5. **My Work** (`desktop-work.png`) — horizontally-pinned carousel (scroll vertically, content moves horizontally) showing the first 5 of 8 projects (numbered 01–05) with title/category/tech list/thumbnail, plus a 6th "Want to see more? → See All Works" CTA card linking to `/myworks`.
6. **Tech Stack** (`desktop-techstack.png`) — an inverted-pyramid grid (12→10→8→6→4→2 icons) of ~42 technology logos pulled live from `cdn.jsdelivr.net/gh/devicons/devicon` over a looping background video with a dark gradient overlay.
7. **Call to action** (`desktop-cta.png`) — two buttons: "Play With Me →" (`/play`, the chess game) and "Hire Me →" (opens LinkedIn).
8. **Contact** (`desktop-contact.png`) — name heading, Email/Location box, Social links box (GitHub/LinkedIn/Twitter/Facebook/Instagram), "Designed and Developed by… © 2026" box.
9. **`/myworks`** (`desktop-myworks.png`) — a static grid of all 8 projects with full descriptions.
10. **`/play`** (`desktop-play.png`) — full chess board (custom SVG pieces, purple/cream theme matching the site accent), a left-side "Talk with me" chat panel backed by a Groq LLM via `api/chat.js`, move history, captured pieces, New Game / Flip Board controls.

**Tablet (768px)** and **mobile (390px)**: identical section order, but the 3D character is replaced by a static photo (`mypicnbg.png`) in the hero, the horizontal work-carousel pin is disabled (plain vertical stacking), and the page becomes a normal scrolling document (desktop uses `body{overflow:hidden}` + Lenis virtual scroll; the mobile media query flips `overflow` back to normal browser scroll — see `src/index.css:38-56`). Tablet and mobile screenshots: `tablet-*.png`, `mobile-*.png`.

---

## 4. Where content lives (what to edit)

Content is **not** fully centralized — expect to touch 5+ files:

| Content | File |
|---|---|
| Name, title, bio, all 6 career entries, all 8 projects, skills/tools, contact links, social links | **`src/config.ts`** (single biggest file to edit) |
| Page `<title>` | `index.html:7` (no meta description/OG tags exist to edit — you'll be adding them, not editing them) |
| Tech-stack pyramid (42 icons/links) | **`src/components/TechStackNew.tsx:11-72`** — hardcoded array, not in `config.ts` |
| Loading-screen marquee text ("AI Engineer" / "Full Stack Developer") | **`src/components/Loading.tsx:65-66`** — hardcoded, duplicated from config instead of reading it |
| Chatbot persona / system prompt (name, bio, project list, links, ELO claim) | **`src/pages/Play.tsx:40-78`** — a long hardcoded prose block, duplicates `config.ts` content in a different format |
| Resume link | `src/components/SocialIcons.tsx:84` — currently `href="#"`, not wired to anything |
| 3D character model | `public/models/character.enc` + `character.glb` + `char_enviorment.hdr` — see §6/§7, this is the hard part |
| Project images | `public/images/*.png` — large, unoptimized (1.8–2.1MB PNGs, see §5) |
| Profile photos | `public/images/mypic.jpeg` (chess avatar), `mypicnbg.png` (mobile hero) |
| Favicon | **missing entirely** — `index.html:5` has the `<link rel="icon">` commented out, and there's no favicon file in `public/` |
| Environment variable | `.env.example` — **contains a bug**: the example key is named `laga_api_call`, but `api/chat.js:9` actually reads `process.env.GROQ_API_KEY`. Following the `.env.example` file as-is will not make the chat feature work. |

Net effect: renaming/rebranding this template means editing `config.ts` plus at minimum `TechStackNew.tsx`, `Loading.tsx`, and `Play.tsx`'s system prompt by hand, or the loader and chatbot will keep announcing the original author's identity.

---

## 5. Live-site testing findings (Playwright + Lighthouse)

### Console errors / network

- **Zero failed requests and zero HTTP error responses** on the home route across all 3 breakpoints in a vanilla `vite dev` crawl.
- One recurring **React warning** (not from user code triggering it, from React itself): `Warning: React does not recognize the fetchPriority prop... did you mean fetchpriority?` — caused by `fetchPriority="high"` (camelCase) on the `<img>` in `src/components/Landing.tsx:38`; React (at this version) expects the lowercase DOM attribute name. Cosmetic in dev, harmless in prod (console dropped by terser in the production build per `vite.config.ts:21-23`), but it's a real prop-name bug.
- On the production build, Lighthouse's `errors-in-console` audit failed with three 404s: `/_vercel/insights/script.js`, `/_vercel/speed-insights/script.js` (expected — these only resolve once actually deployed on Vercel), and **`/favicon.ico` (confirmed real bug — no favicon exists)**.
- `robots.txt` request returns HTTP 200 but with the SPA's `index.html` body (via the catch-all rewrite in `vercel.json`), which Lighthouse correctly flags as "robots.txt is not valid" — there is no real `robots.txt` in `public/`.

### Interactions tested

- **Nav smooth-scroll** (`#about`/`#work`/`#contact` links, Lenis-powered): works once the page is interactive.
- **Chess game** (`/play`): fully functional — clicking e2 then e4 registered the move, status flipped to "Black's turn", and the custom WASM engine replied with a legal move (e6) within ~3s. Confirmed via DOM move-history assertions, not just visual inspection.
- **Chat panel** (`/play`): gracefully degrades. Under plain `vite dev`/`vite preview` the `/api/chat` serverless function isn't served (Vercel functions require `vercel dev` or an actual Vercel deployment), so it 404s and the UI shows a friendly fallback ("Sorry, having some connection issues…") instead of crashing. **Not testable end-to-end locally** without `vercel dev` + a real `GROQ_API_KEY` (and note the `.env.example` key-name bug above).
- **Hover micro-interactions** (social icon magnetic-follow, nav link flip, work-card image reveal): present and functional in code; verified hover events fire without script errors.
- **Keyboard navigation**: Tab order is logical — logo → email → ABOUT → WORK → CONTACT → social icons, in visual order, each landing on a real `<a>` element. No keyboard traps found in the 8-tab sample.
- **3D character hover** (eyebrow raise on face hover) and **mouse-follow head rotation**: present in code (`utils/mouseUtils.ts`, `utils/animationUtils.ts:47-82`) and visually confirmed in screenshots; not independently assertable via DOM since it's a canvas-only effect.

### ⚠️ Loading-gate reliability — most significant finding

The entire desktop experience (including the **navbar**, which is visually present immediately) is **non-interactive** until a full-screen loading overlay (`.loading-screen`, `z-index: 999999999`, plus a separate `.loading-header`/`.loaderGame` layer at `z-index: 9999999999`) finishes and unmounts. Measured, reproducible findings:

- On the **production build**, a clean run took **~22–25 seconds** from navigation to the loader disappearing (`"loading screen gone after ms"` traced second-by-second; percent climbed roughly linearly the whole way rather than the two-phase fast/slow curve the code in `src/components/Loading.tsx:95-135` implies). Network timing (via the Resource Timing API) shows this is **not network-bound** — `character.enc` (1.5MB) transferred in 28ms on localhost, the HDR environment in 7ms. The bottleneck is CPU-side: WebCrypto AES-CBC decrypt + DRACO geometry decompression + `renderer.compileAsync` shader compilation. This number was measured in headless Chromium (likely software/SwiftShader rendering) — **a real user's GPU-accelerated browser will probably be faster**, but there is no hard upper bound in the code, no timeout, and no "skip intro" control, so slow devices or decode hiccups have no escape hatch.
- In **dev mode under React 18 `StrictMode`** (which double-invokes effects), the displayed loading percentage was observed to **jump backwards** (e.g. 21%→19%→21%, 31%→29%→31%) in a clean, isolated browser run. Root cause: `setProgress()` in `Loading.tsx` returns an interval-driven counter, and `Scene.tsx`'s `useEffect` (`src/components/Character/Scene.tsx:23-147`) never calls `progress.clear()` or otherwise tears down that interval in its cleanup function — so StrictMode's intentional double-mount leaves two independent counters racing to update the same React state. This is a genuine missing-cleanup bug; it's dev-only in its visible symptom (StrictMode doesn't double-invoke in production) but it reveals the same resource isn't being cleaned up in production either, just less visibly.
- **While the diagnostic script in §(interactions) above DID eventually click through once the loader cleared**, an earlier attempt that clicked a nav link after a fixed 6-second wait was **blocked for the full 30-second Playwright timeout** by the stale `.loaderGame` element intercepting pointer events — direct evidence that on a slow load, visible, seemingly-unrelated UI (the loader's decorative mini-game header) silently keeps absorbing clicks after a user might reasonably assume the site has loaded.
- **Tablet and mobile skip this gate almost entirely** — confirmed `loaderGoneAfterMs` of 3–4ms at 768px/390px, because `LoadingProvider.tsx:19-23` explicitly sets `isLoading=false` on mount when `window.innerWidth <= 768`. Good: the worst performance problem does not reach the majority of real-world mobile traffic.

**Recommendation if reused:** add a hard timeout (e.g. force-unlock at 8s regardless of load state) and a clickable "skip" affordance, and fix the missing interval cleanup in `Scene.tsx`.

### Performance numbers

| Metric | Value | Source |
|---|---|---|
| Production JS+CSS, gzipped (all routes combined) | **~305 KB** | `vite build` output, summed |
| Largest single chunk | `three-CbFrQusb.js` — 580 KB raw / 144 KB gzip | `vite build` output |
| `dist/` total (all routes + all public assets) | **20 MB** | `du -sh dist` |
| Initial `/` page weight, desktop, after full 3D load (images+video+fonts+model, content-length sum) | **~2.73 MB** | Playwright network capture, production build |
| Initial `/` page weight, mobile (no 3D model/env-map/draco) | **~1.19 MB** | Playwright network capture, production build |
| Character model payload | `character.enc` 1.50 MB + `char_enviorment.hdr` 289 KB + DRACO decoder (JS+WASM) 704+280 KB | `du -h public/` |
| Largest static images | `RedxChess.png` 2.1 MB, `Drishti.png` 2.0 MB, `VoteChain.png`/`Prodesk.png`/`Phoenix3.0.png` ~1.9 MB each, `FloodSpaces.png` 1.8 MB — **all unoptimized PNG screenshots, no WebP/AVIF, no responsive `srcset`** | `du -h public/images` |
| `npm audit` | **33 vulnerabilities (23 high, 7 moderate, 3 low)** — predominantly `react-router`/`react-router-dom` (7 separate advisories: XSS, open redirect, DoS), plus `rollup` (path traversal, DOM-clobbering XSS), `source-map-js` (DoS), `uuid` (pulled in transitively by the **unused** `@react-three/drei`). All have fixes available via `npm audit fix` without apparent breaking major-version jumps. | `npm audit` |

**Lighthouse (production build, Chrome headless, `localhost:4173`):**

| | Desktop preset | Mobile (default) preset |
|---|---|---|
| Performance | 73 | 79 |
| Accessibility | 88 | 80 |
| Best Practices | 96 | 96 |
| SEO | 83 | 83 |
| First Contentful Paint | 1.6s | 2.1s |
| Largest Contentful Paint | 1.6s | 5.1s |
| Speed Index | 1.6s | 3.4s |
| Time to Interactive | 2.0s | 5.1s |
| Total Blocking Time | 320ms | 0ms |
| Cumulative Layout Shift | 0.002 | 0 |

**Important caveat on these scores:** Lighthouse's TTI/FCP/LCP heuristics measure paint and long-task activity, not whether a full-screen, high-`z-index`, `pointer-events`-absorbing overlay is sitting on top of the page. They do **not** capture the loading-gate problem described above — Lighthouse will tell you the page "looks interactive" in ~2–5s while real automated click tests showed the nav being unclickable for far longer on a cold load. Treat the Lighthouse Performance score as optimistic relative to actual perceived usability on this specific site.

**FPS during the 3D scene:** not independently measured (no reliable headless-Chromium FPS counter was set up in this pass); the animation loop is a standard `requestAnimationFrame` render call (`Scene.tsx:110-129`) with no frame-rate cap or adaptive-quality logic, so frame rate on low-end GPUs is untested and unbounded by the code.

### Mobile 3D fallback

Confirmed via DOM inspection at 390px and 768px: `<canvas>` is **absent** (`canvasPresent: false`), and the static `<img class="mobile-photo">` (`mypicnbg.png`) is shown instead (`mobilePhotoVisible: true`), loaded eagerly with `fetchPriority="high"`. This is a deliberate, working fallback — not a crash or blank space.

### SEO basics

- `<title>`: present and descriptive — "Redoyanul Haque - AI Developer | Python Engineer".
- **Meta description: missing.** **Open Graph tags (title/description/image): missing entirely.** **Canonical link: missing. Favicon: missing** (link tag is commented out in `index.html:5`, and no icon file exists in `public/`).
- `lang="en"` set correctly on `<html>`.
- One `<h1>` per page ("REDOYANUL HAQUE"), 8 `<h2>`s — reasonable outline depth, but Lighthouse's `heading-order` audit failed: heading levels are not strictly sequential in places (e.g. a `career-info-box h4` and a `contact-box h5` appear without an intervening level in their local subtree) — a semantic-structure nit, not a visual bug.
- 48 `<img>` elements site-wide, **0 missing `alt` attributes** — good baseline image accessibility.
- `robots.txt`: not a valid robots file (see above).

### Accessibility

- **Color contrast:** spot-checked 5 high-traffic text/background pairs (body paragraph, career description, contact label, nav email link, skill-card description) — all measured **16:1 / 16.05:1** against their effective background, comfortably exceeding WCAG AA (4.5:1) and AAA (7:1). However, Lighthouse's automated full-page scan did flag **two specific low-contrast elements**: the `navbar-title` ("RH") link and the `.resume-button` hover-state text — both likely edge cases involving hover/transition states or very small text against a busy background, not representative of the page as a whole.
- **Touch target size:** Lighthouse flagged the top-nav links (`ABOUT`/`WORK`/`CONTACT`) as under the recommended 24×24px touch target (~17px tall in the audited viewport) — a real mobile-usability nit.
- **Keyboard navigation:** functional and in logical order (see interactions above).
- **Redundant alt text:** the 42 tech-stack icons have both an `alt="React"` (etc.) and visible adjacent `<span>` text with the same name — technically redundant per Lighthouse, but a common and low-risk pattern (not a real barrier).
- `user-select: none` is set globally in `src/index.css:19-21` — prevents text selection site-wide, including the About/Career prose, which is a minor accessibility/usability regression for anyone wanting to copy contact info or quote text (the email `mailto:` link and board moves still work; it's prose-copying that's blocked).

---

## 6. License and reuse

- `LICENSE`: **MIT**, copyright "Redoyanul Haque", 2025. `package.json` has `"private": true` (meaningless for licensing, just prevents accidental `npm publish`).
- **Personal use and modification are explicitly permitted** under MIT — you can use, copy, modify, merge, publish, distribute, and sell copies, with no attribution requirement beyond retaining the license text in copies of the *software*.
- **The 3D character model is a gap in that story.** The repository goes out of its way to encrypt the model (`public/models/character.enc`, AES-CBC, custom `encrypt.cjs` script in `public/models/`) specifically so it can't be trivially extracted from a cloned repo — the README and LICENSE say nothing about where the model came from (custom-made, commissioned, or a marketplace asset), and there's no separate asset license file. MIT covers the *code*; it does not establish that you have rights to keep using, redistributing, or publicly deploying *this specific 3D character* in a forked project. **Practically**: if you fork this template, plan to replace the character model with your own (self-made, commissioned, or a properly-licensed marketplace asset) rather than assuming the included one is yours to keep shipping.
- No other third-party asset licenses are documented (tech-stack icons are hotlinked live from `cdn.jsdelivr.net/gh/devicons/devicon`, not vendored — acceptable since devicon is itself MIT-licensed and publicly hosted, but it's an external runtime dependency with no fallback if that CDN is ever down).
- **No attribution is legally required** to use this as a base, beyond keeping the MIT license notice in the code you keep.

---

## 7. Adapting this into a "journey" portfolio (scroll-based road/timeline, Oct 2024 → Oct 2026, 4 stations + final room)

**Feasibility: moderate-to-hard, not a config change.** The good news is the hardest infrastructure — a scroll-scrubbed GSAP timeline driving a live 3D scene's camera and character state — already exists and works (`src/components/utils/GsapScroll.ts`, `Scene.tsx`). The bad news is it's wired specifically to *this* character/scene/section layout, not a generic "waypoint" system, so a "road with 4 stations + a final room" would mean replacing the scene content, not just re-skinning text.

**What transfers directly:**
- The scroll-scrub mechanism itself: `gsap.timeline({ scrollTrigger: { trigger, start, end, scrub, pin } })` pattern used in `GsapScroll.ts` and `Work.tsx` is exactly the right tool for "camera moves along a path as the user scrolls through 4 stations." You'd keep this pattern and author new timelines.
- Lenis smooth-scroll setup (`Navbar.tsx`) — fine as-is for a long single-page scroll experience.
- The Career section's existing vertical-timeline-with-dot UI (`Career.tsx` + `.css`) is conceptually close to "stations along a path" already — it's a 2D CSS/SVG version of the idea, reusable as a fallback/overlay UI even if you build a 3D road.
- The desktop/mobile split pattern (3D on desktop, static fallback on mobile) is a sound, already-proven approach to keep applying to a road/journey scene.
- `MainContainer.tsx`'s lazy/idle-mount pattern for the 3D layer is reusable as-is.

**What you'd need to change or remove:**
- **The 3D asset itself.** The current scene is one static desk/character rig with hand-tuned camera waypoints (`camera.position.set(0, 13.1, 24.7)`, specific rotation targets per section). A "road" is a different asset entirely — you'd need (a) a new 3D model/scene (road, 4 station markers, a "room" interior) authored in Blender or similar, exported as GLTF/GLB, and (b) all-new camera waypoints and character-bone references rewritten in `GsapScroll.ts`/`character.ts`/`animationUtils.ts`, since those files reference specific bone names (`spine006`, `spine005`, `footR/footL`, `screenlight`, `Plane004`) and object names (`Material.027`) baked into the current character's rig. None of that transfers to a new model.
- **Drop the AES encryption step** (`decrypt.ts`, `encrypt.cjs`) unless you specifically want to obfuscate your own new model — it adds complexity (a build-time encrypt script, a hardcoded password, a decrypt-on-load step) for a security property it doesn't actually provide (see §3). For a personal "journey" piece you'd likely just serve the `.glb` directly.
- **Re-author `GsapScroll.ts` as N station timelines instead of 3 ad-hoc ones.** Currently there are exactly 3 hand-tuned timelines (landing→about, about→whatIDO handoff, career). For "4 stations + final room" you'd want a cleaner, parameterized pattern — e.g. one timeline per station keyed off a `stations` array (position, camera target, label, date range) rather than copy-pasting the current one-off blocks, since the current code is not written as a reusable abstraction (each `.to()`/`.fromTo()` call has hand-tuned magic numbers specific to this one layout).
- **Re-map `config.ts`'s `experiences` array.** It's already a reasonable shape (position/company/period/location/description/responsibilities/technologies) and already covers 2021–"Present" — you'd trim/remap it to your actual Oct 2024–Oct 2026 range and attach each entry to a station index instead of rendering it as a flat vertical list.
- **Work carousel (`Work.tsx`) and Tech-stack pyramid (`TechStackNew.tsx`)** are unrelated to the journey concept and would either need to become content *inside* the "final room" (e.g. a project showcase at the end of the road) or be cut — as built, they're generic portfolio sections, not journey/station content.
- **Mobile strategy needs a real decision up front.** The current mobile fallback is "replace 3D with a static photo." A road/journey concept likely wants *some* scrolly experience on mobile too (even a simplified 2D/CSS version), which means designing a second, lighter "mobile journey" from the start rather than just falling back to a flat image — this template's existing mobile strategy (skip the 3D, show a photo, keep normal scroll) won't by itself satisfy "a journey on mobile," it'll just silently drop the journey there unless you build a parallel mobile path.
- **Loading-gate fix is a prerequisite, not optional**, if you keep any 3D on the journey page — see §5's reliability findings. A journey/story format is more sensitive to a broken or endless loading screen than a simple hero, because the *entire* experience is gated behind that one model load, not just a decorative hero.

**Bottom line:** treat this repo as a reference implementation of "scroll-scrubbed GSAP timeline driving a live three.js camera + character," worth studying and reusing the *pattern* from (`GsapScroll.ts`'s structure, the pin/scrub `ScrollTrigger` config, the desktop/mobile split). Do not expect to reuse the *content* (the specific model, its bone names, or the 3 existing timelines) — a 4-station road + final room is effectively a new 3D scene and a new, more systematically-authored timeline, built using this codebase's techniques rather than its assets.

---

## 8. Final verdict

**Use as a reference, not as a drop-in base — with one exception.**

**Reasons to use only as reference:**
- The single most valuable thing here — the scroll-scrubbed 3D camera/character choreography (`GsapScroll.ts`) — is hand-tuned to one specific rigged character and is not written as a reusable/parameterized system. Reusing it for a different scene (a road/journey) means rewriting it, not configuring it.
- Content is scattered across `config.ts`, `TechStackNew.tsx`, `Loading.tsx`, and a long hardcoded prompt in `Play.tsx` — full rebranding touches 4+ files, not one.
- The confirmed loading-gate reliability issue (§5) — up to ~22-25s to interactive on a cold load in testing, no skip/timeout, a missing-cleanup bug that visibly causes progress to regress under React StrictMode — is a real, user-facing problem you'd inherit, not just a cosmetic nit.
- 33 `npm audit` vulnerabilities (23 high) in current dependencies, several unused dependencies adding audit surface and install weight for zero functional benefit.
- Missing meta description/OG tags/favicon/valid robots.txt — baseline SEO hygiene that's normally "comes for free with a template" is absent here and would need to be added from scratch.
- The included 3D character's licensing/provenance is undocumented and the repo actively works to prevent its extraction — you should plan to replace it, which is most of the "hard part" of this template's value proposition.

**Reason it's still worth having around:** the chess game (`/play`, custom WASM engine + chess.js + an LLM-backed chat persona) and the overall "3D desk scene reacts to scroll" technique are both genuinely well-executed and non-trivial to build from scratch — keep the repo as a worked example of (a) raw-three.js scene setup inside React without `@react-three/fiber`, (b) GLTF animation-track filtering by bone name, and (c) GSAP `ScrollTrigger` pin/scrub choreography, and pull techniques from it rather than importing the project wholesale.

**For the specific "journey portfolio" goal (§7):** skip this as a base. Start a smaller, cleaner project that borrows the scroll-scrub *pattern* (and, if desired, the Lenis + GSAP ScrollTrigger dependency pair) but with your own, purpose-built 3D scene and a parameterized, multi-station timeline authored from day one — bolting a road/journey onto this specific codebase would mean discarding most of what makes it heavy (the desk character, its rig-specific animation code, the encryption step) anyway.
