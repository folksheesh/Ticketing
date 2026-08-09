# DENSOnesia Bazzar — UI/UX & Motion Redesign Brief
**For: Claude Code / Antigravity agent, using the `ui-ux-pro-max` skill + `framer-motion`**
**Project:** DENSO Indonesia Group Family Gathering 2026 — "DENSOnesia Bazzar: Pesta Rakyat" ticketing site
**Stack:** React + TypeScript + Vite + Tailwind CSS v4 + Zustand + Framer Motion (already installed, v12.42.2)

---

## 0. How to use this brief

This is a design-and-motion redesign task, not a rebuild. The existing information architecture, routing, forms, Zustand stores, and admin functionality all stay exactly as they are — you are restyling and re-animating, not re-engineering the app logic.

Before writing any code:
1. Activate the `ui-ux-pro-max` skill for this session and run its palette/style search against the brief below (`festive`, `patriotic`, `red-white-blue`, `event landing page`) to cross-check the token set in Section 2 against its palette database, and pull a matching font pairing recommendation for Section 3.
2. Read `frontend/src/index.css` in full — it currently defines a broken token system (see Section 1) that must be replaced, not layered on top of.
3. Read every file under `frontend/src/features/landing/components/` before touching any of them, so section-to-section rhythm stays consistent.

---

## 1. Diagnosis: why the current UI doesn't match the poster

The reference poster (DENSOnesia Bazzar banner, attached) is a genuine **tricolor** composition, not "red with a blue accent." Look closely and there are actually four distinct tones doing work:

1. **DENSO red** — logo, "Bazzar" headline, "Denso Indonesia Group" line, bunting flags, small confetti shapes.
2. **A vivid royal blue** — the "Family Gathering 2026" headline, the "13 September 2026" date pill (solid fill, white text), the diagonal swoosh/gradient bands in the top-right and bottom-left corners, and the bottom wave band. This blue carries roughly as much visual weight as the red — it is not a minor accent.
3. **A pale/soft sky blue** — the city skyline silhouette illustration, several decorative outlined circles, and small stripe/dot ornaments. This is a distinctly lighter, more muted blue than #2 — it's doing quiet textural/illustrative work, not headline work.
4. **White** — the canvas everything sits on.

The current codebase's `src/index.css` defines CSS variables named `--color-denso-blue`, `--color-denso-navy`, `--color-denso-sky`, `--color-denso-cyan`, and `--color-denso-teal` — but **every one of them is hard-coded to a shade of red or slate gray**, not an actual blue. Example (current, broken):

```css
--color-denso-blue:  #DC0032;  /* this is red, not blue */
--color-denso-navy:  #2C353B;  /* this is a dark slate, not navy */
```

The result is a monochrome red/gray site. Fixing this means introducing **two real, distinct blues** (royal + pale sky), not one dark navy used sparingly — that was the mistake in the first draft of this brief. This tricolor balance is the single biggest gap to close.

---

## 2. Design tokens — replace `src/index.css` root palette with this

Extracted and derived directly from the poster's four working tones (Section 1): DENSO red, a vivid **royal blue** (headline/pill weight), a soft **pale sky blue** (illustrative weight), and white. Treat royal blue and pale sky blue as two genuinely separate tokens — do not collapse them into one "navy."

```css
:root {
  /* ── Red: DENSO logo/headline red ── */
  --color-denso-red:        #E4211F;
  --color-denso-red-dark:   #B4171A;
  --color-denso-red-light:  #F04B44;
  --color-denso-red-pale:   #FFEDEC;
  --color-denso-red-muted:  #FBD3D2;

  /* ── Royal Blue: poster's second headline color — "Family Gathering 2026",
        the date pill, the corner swoosh gradients, the bottom wave band.
        This carries as much visual weight as red. Do NOT treat it as a minor accent. ── */
  --color-denso-blue:        #1E3F8F;
  --color-denso-blue-dark:   #12285E;
  --color-denso-blue-light:  #3D64B8;
  --color-denso-blue-pale:   #E3EBFA;

  /* ── Pale Sky Blue: the skyline silhouette illustration, decorative outline
        circles, dot/stripe ornaments. Distinctly lighter/softer than royal blue —
        this is the poster's quiet, textural blue, not its headline blue. ── */
  --color-denso-sky:         #A9C9EC;
  --color-denso-sky-light:   #D3E6F9;
  --color-denso-sky-dark:    #7FA8D9;

  /* ── Deep navy: reserve ONLY for gradient depth in corner swooshes / shadows,
        never as a large flat surface — the poster never uses flat dark navy fills. ── */
  --color-denso-navy-deep:   #0B2560;

  /* ── Neutrals (kept close to current slate, still needed for body text) ── */
  --color-denso-slate:       #4A565E;
  --color-denso-slate-dark:  #2C353B;
  --color-denso-slate-mid:   #6B7882;
  --color-denso-slate-pale:  #CDD4D8;
  --color-denso-slate-mist:  #EEF1F3;
  --color-denso-slate-ghost: #F5F7F8;

  /* ── Base ── */
  --color-denso-white: #FFFFFF;
  --color-denso-paper: #F8FAFC;

  /* ── Semantic gradient stops used across hero / section backgrounds ── */
  --gradient-corner-swoosh: linear-gradient(135deg, var(--color-denso-red) 0%, var(--color-denso-blue) 55%, var(--color-denso-navy-deep) 100%);
  --gradient-hero:  radial-gradient(ellipse at top, var(--color-denso-sky-light) 0%, var(--color-denso-white) 60%);
  --gradient-cta:   linear-gradient(90deg, var(--color-denso-red) 0%, var(--color-denso-red-dark) 100%);
  --gradient-pill:  linear-gradient(90deg, var(--color-denso-blue) 0%, var(--color-denso-blue-dark) 100%);
}
```

**Rule for the agent:** delete every duplicate/misnamed variable (`--color-denso-amber-*`, `--color-denso-cyan-*`, `--color-denso-teal`, and any `--color-denso-blue-*`/`--color-denso-navy-*` that currently point to red) — do not keep dead aliases. Every component that references a color must resolve to a variable, never a raw hex value written inline. Run a final grep for `#[0-9A-Fa-f]{3,6}` across `src/` after the change and eliminate any hard-coded hex left outside `index.css`.

Usage split across the site — this should read as genuinely tricolor, matching the poster's actual balance, not "red site with a blue accent":
- **Red** (`--color-denso-red`) — primary CTA buttons, "Bazzar"-style hero headline word, active states, ticket "confirmed" badges
- **Royal blue** (`--color-denso-blue`) — secondary headline text (e.g. "Family Gathering 2026"-weight copy), date/info pills, nav bar, footer, corner swoosh gradients, admin sidebar — this should feel as present on the page as red does, not subordinate to it
- **Pale sky blue** (`--color-denso-sky`) — skyline/illustration elements, decorative circles, confetti particles, subtle section-background washes, hover glows
- **Deep navy** (`--color-denso-navy-deep`) — gradient endpoint only, for depth inside the corner swoosh/wave elements — never a flat full-section fill
- **White** — base canvas, card backgrounds, breathing room

---

## 3. Typography

Match the poster's type hierarchy:
- **Display / hero headlines:** a bold, slightly condensed sans (poster uses a heavy condensed display face for "BAZZAR"). Use a Google Fonts equivalent — e.g. `Archivo Black` or `Anton` for the largest hero word, paired with a script/brush face (e.g. `Caveat` or `Kalam`) for the "Pesta Rakyat"-style tagline accents, mirroring the poster's script subtitle.
- **Body/UI text:** keep a clean geometric sans already likely in use (check `index.css` font-family block first — reuse if it's already Inter/similar; don't introduce a third typeface family unless the current one is missing).
- Confirm final pairing against the `ui-ux-pro-max` skill's font-pairing database before locking it in.

---

## 4. Motion & animation direction — "awwwards-tier, but functional"

Goal: visitors should feel the same "wow, confetti-and-flags energy" as the poster the moment the page loads, and the scroll experience should feel considered and joyful all the way down — not decoration bolted onto a static layout.

### 4.1 Principles
- **Every scroll-triggered animation must use Framer Motion's `useScroll` / `useInView` / `whileInView`** — no animation should replay awkwardly or fire off-screen.
- **Respect `prefers-reduced-motion`** — wrap all animation variants behind a reduced-motion check (Framer Motion's `useReducedMotion` hook) and fall back to instant/opacity-only transitions. This is non-negotiable for accessibility.
- **Motion supports comprehension, not just spectacle** — countdown numbers, schedule steps, and ticket confirmation states should animate in ways that reinforce what the user is meant to notice (e.g. the ticket ID should feel like it "prints" into existence, not just fade).
- Keep interaction cost low: no animation should block the user from acting (registering, scanning a ticket) for more than ~400ms.

### 4.2 Hero (`HeroBanner.tsx`)
- Staggered entrance: DENSO logo → "DENSOnesia Bazzar" ribbon badge → "BAZZAR" display headline → "Pesta Rakyat" script tagline → date pill → CTA button, each with a short spring-based stagger (~80–120ms offset), mirroring the poster's layered composition.
- Add a lightweight animated confetti/particle layer behind the headline (small red/royal-blue/pale-blue shapes drifting or gently rotating) — CSS/SVG based, not a heavy canvas library, to keep bundle size sane. See Section 5.1 for the fuller confetti/bunting/string-light treatment.
- Parallax on the skyline silhouette (subtle `y` transform tied to scroll position via `useScroll`) echoing the poster's city skyline element.
- Recreate the poster's signature **corner swoosh**: large diagonal shapes in the top-right and bottom-left of the hero, using `--gradient-corner-swoosh` (red → royal blue → deep navy), rendered as animated SVG/`clip-path` shapes that ease into position on load rather than appearing static.
- The bottom wave band (as in the poster's footer wave) can be reused site-wide as a section-divider motif in royal blue, optionally with a slow horizontal drift animation.

### 4.3 Scroll sections (`CountdownSection`, `ScheduleSection`, `TimelineSection`, `VenueSection`, `SponsorsSection`, `FAQSection`)
- Each section reveals with `whileInView`, staggered by child (cards/list items enter with a small upward slide + fade, staggered ~60–100ms apart).
- `CountdownSection`: digit-flip or odometer-style transition on each unit change (not just re-render) — this is the kind of detail that reads as "polished" rather than generic.
- `ScheduleSection` / `TimelineSection`: animate the connecting line/progress indicator drawing in as the user scrolls past each step (`pathLength` animation via Framer Motion on an SVG line, or a scaleX-based progress bar).
- `SponsorsSection`: if there's a logo row, consider a slow infinite marquee (pause on hover) rather than a static grid, to add continuous motion without demanding attention.
- Section backgrounds should alternate white → navy-pale → white to create the poster's rhythm of color blocks, each transition itself gently animated (background color shouldn't hard-cut if a section straddles the viewport).

### 4.4 Registration flow (`PersonalDataStep`, `FamilyDataStep`, `TicketResultStep`)
- Keep this section calmer and faster than the landing page — it's a task, not a showcase. Use simple slide/fade transitions between steps (Framer Motion `AnimatePresence` with `mode="wait"`), a progress bar that animates its width, and inline field validation transitions (shake on error, checkmark pop on valid).
- `TicketResultStep` is the emotional payoff — this is where it's okay to bring back poster-style flourish: the ticket card can animate in with a flip/reveal, QR code can fade/scale in after the card settles, and a confetti burst (once, on mount, respecting reduced-motion) is appropriate here since it's a genuine "you're in" moment.

### 4.5 Admin (`DashboardTab`, `EmployeeListTab`, `ScannerTab`)
- Keep this restrained and fast — admins use this repeatedly under time pressure at the event. Micro-interactions only (button press states, list item hover, scan-success flash). Do not apply the landing page's heavy motion here; over-animating an operational tool actively hurts usability.

---

## 5. Bazaar atmosphere & scene direction — make it feel alive, not just on-brand

This section is about the *feeling* of the event, not just its colors. A "Pesta Rakyat" (people's festival/street party) bazaar is a lived-in, buzzing, nighttime-into-evening market: vendor tents in rows, string flags strung overhead on rope, people wandering between stalls eating, browsing, and haggling, string lights, music, kids running around. The site currently risks looking like a clean corporate event page with the right colors but none of that energy — this section exists to prevent that. Be careful and deliberate here: "cheerful and lively" should read as warm and inviting, not cluttered or chaotic.

### 5.1 Visual motifs to introduce
- **Bunting / triangle flag garlands strung on rope** — reuse the poster's own triangular flag-garland motif (red/white/blue triangle pennants on a line) as a recurring hero and section-divider element, drooping in a gentle catenary curve like real string-hung flags, not straight-edged.
- **Vendor tent silhouettes** — simple, flat-illustrated market tent/stall shapes (peaked awnings, striped or solid red/blue canvas) worked into the hero background or a dedicated "what to expect" strip, suggesting rows of stalls without needing photographic assets.
- **String lights** — a thin strand of small warm-glow dots strung between anchor points (mirroring the bunting rope), usable along section tops/bottoms for a night-market feel; can gently twinkle (subtle opacity pulse, staggered per bulb, very low intensity so it doesn't distract).
- **Confetti and paper-streamer bursts** — not just a one-time hero effect; scatter small confetti shapes throughout the page at low density (a few drifting pieces near section headers), reserving a *bigger* burst specifically for moments of delight: hero load, and ticket confirmation in `TicketResultStep`.
- **Warm crowd energy without literal photos** — since there's no photography asset pipeline here, suggest presence and bustle through abstract/illustrative means: layered translucent circles/blobs suggesting motion and crowd density behind content, small animated "people" or footfall dot-trails is optional/stretch — do not force literal figurative illustration if it looks generic; favor mood over literalism.

### 5.2 A new landing section worth adding: "What to Expect" / vendor & stalls preview
If it doesn't already exist, propose (and if the user approves, build) a short section between the hero and the schedule that previews the bazaar experience itself — separate from the formal event schedule/timeline. Content direction (copy is illustrative, adjust to real vendor list if the user has one):
- A row of tent-shaped cards representing categories of stalls (food, games, local UMKM/vendors, kids' zone, live music/stage) — each card entrance-animates like a tent "popping up" (scale + slight bounce via a spring transition).
- Optional short line of flavor copy per card ("Jajanan pasar & street food," "Games & doorprize," etc.) — keep this section light and scannable, not another dense info block.
- This section is the right place to concentrate the bunting/rope, string-light, and confetti motifs together, since its whole job is to make the visitor feel the market atmosphere before they even scroll to logistics (schedule/venue).

### 5.3 Motion behavior for these elements
- Bunting garlands sway very gently on load (a slow, small-amplitude rotational wobble, like flags in a light breeze) — subtle, continuous, low-amplitude; this must never be fast or jittery, or it reads as broken rather than breezy.
- Tent/stall cards in the new section (5.2) should stagger in with a soft "bounce settle" spring, echoing stalls being set up.
- String lights twinkle on an independent, staggered timer per bulb so they don't all pulse in unison (unison pulsing reads as a UI bug, not ambience).
- All of this remains subordinate to the reduced-motion and performance rules already set in Section 4.1 — ambience must never come at the cost of usability or low-end mobile performance. If budget is tight, prioritize in this order: bunting > confetti > string lights > any figurative crowd suggestion.

### 5.4 Tone guardrail
"Buzzing and cheerful" does not mean busy or noisy. Every added motif in this section competes for attention with the actual functional content (dates, registration CTA, schedule). Default to restraint: one clear atmosphere idea done well (e.g. bunting + a tent-card strip) beats five half-realized ones. If in doubt, cut a motif rather than crowd the layout.

---

## 6. Functional guardrails (do not regress these while restyling)

- Preserve all existing routes, Zustand store shape/selectors, and API calls in `useRegistrationStore.ts` / `useAdminStore.ts` — this is a visual/motion pass, not a state-management refactor.
- Preserve existing form validation logic in the registration steps.
- Keep the QR scanner (`ScannerTab.tsx`) functionally untouched beyond visual polish — scanning reliability > animation.
- Maintain responsive behavior at existing breakpoints; test the new hero animation and confetti layer specifically on mobile viewport widths, since particle/parallax effects are the most likely thing to jank on low-end phones.
- Keep Lighthouse performance in mind: no animation change should push First Contentful Paint or Cumulative Layout Shift into the red. Prefer `transform`/`opacity` animations (GPU-friendly) over animating `width`/`height`/`top`/`left` directly.

---

## 7. Suggested execution order

1. Fix the color token system in `index.css` (Section 2) — this alone will make every existing component visually correct against the poster before any animation work starts.
2. Swap in the type pairing (Section 3).
3. Re-skin `HeroBanner.tsx` with the new palette + entrance choreography (Section 4.2), including the bunting/corner-swoosh atmosphere motifs from Section 5.1.
4. Build (or extend) the "What to Expect" stalls-preview section (Section 5.2) right after the hero.
5. Add `whileInView` reveal treatment to the remaining landing sections in order: `CountdownSection` → `ScheduleSection`/`TimelineSection` → `VenueSection` → `SponsorsSection` → `FAQSection`.
6. Polish registration step transitions and the `TicketResultStep` payoff moment.
7. Light-touch pass on admin components (color tokens only, minimal motion).
8. Full pass for `prefers-reduced-motion`, mobile performance check, and a final grep for leftover hard-coded hex colors.

---

## 8. Reference asset

The poster (`DENSOnesia Bazzar — Pesta Rakyat`, DENSO Indonesia Group Family Gathering 2026, 13 September 2026) is the single source of truth for palette, mood, and composition style described above — treat every color and motion decision in this brief as derived from it, and check back against it visually if a component's direction is ambiguous.
