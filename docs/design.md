# Design system — DataMind

Binding for all UI, the way `architecture.md` is binding for the system. If a
screen needs something not defined here, add it here first, in the same PR.

**Rewritten 2026-11-03 (D-070): the "Calm" design.** The approved reference is
the *Design 1 · Calm* mockup — soft palettes, a serif voice for the answer, and
an answer built from figures, tables, number cards and callouts. The honesty
rules of the previous system (the working state, waiting and empty states, the
true word for an ending) survived unchanged, and the sections that say so say
why.

## The feel

Calm, airy and soft. A pale tinted page, surfaces a shade lighter with a
hairline and a whisper of shadow, one accent per palette, and an answer that
reads like a short memo from an analyst: a sentence in serif, then the figure
that proves it, then what to watch.

Closer to a considered reading application than to a dashboard.

**Deliberately not:** dense grids, borders everywhere, saturated colour, or
chrome that is louder than the content.

Four rules that decide most arguments:

1. **Space is the layout.** Reach for spacing before borders.
2. **Colour means something.** The accent marks the brand and the primary
   action; green and red mean a change went up or down; amber means "worth
   knowing". Never colour for interest.
3. **One primary action per view.** Everything else is quieter.
4. **The content outranks the chrome.** An answer's evidence controls and its
   trace are visually lighter than the sentence they belong to.

## Stack

| Concern | Library | Where |
|---|---|---|
| Styling | Tailwind CSS v4 (CSS-first config) | `src/app/globals.css` |
| Components | shadcn/ui on Radix | `src/components/ui` |
| Icons | Lucide (`lucide-react`) | everywhere; 16–18px, stroke 1.75 |
| Motion | Motion (`motion/react`) and CSS keyframes | `animate-*` utilities |
| Charts | Apache ECharts (tree-shaken, lazy) | `src/lib/echarts.ts`, `src/components/answer` |
| Tables | TanStack Table v9 | `src/components/answer/data-table.tsx` |
| Toasts | Sonner | `src/components/ui/sonner.tsx` |
| Fonts | Inter, Source Serif 4, JetBrains Mono via fontsource | self-hosted; no CDN at build or run time |

The product primitives (`Button`, `Card`, `Badge`, `Input`/`Select`, `Page`/
`PageHeader`, `EmptyState`, `Pending`, `SkeletonList`) keep their APIs; they are
shadcn-style components built on the tokens below. `Button` accepts both the
product's variants (`primary`, `secondary`, `ghost`, `danger`, `soft`) and
shadcn's, so registry components compose without edits.

## Tokens

Defined once in `apps/web/src/app/globals.css` as CSS custom properties, and
mapped into Tailwind utilities with `@theme inline`. Use the token or its
utility, never a raw hex value in a component.

| Token | Utility | Role |
|---|---|---|
| `--bg` | `bg-background` | the page |
| `--sidebar` | `bg-sidebar` | the sidebar, a shade deeper than the page |
| `--surface` | `bg-surface` | cards, figures, inputs, menus |
| `--surface-2` | `bg-surface-2` | wells, pills, the thinking pill, hover fills |
| `--border` / `--border-soft` | `border-border` / `border-border-soft` | hairlines; table row rules |
| `--text` / `--text-2` | `text-text` / `text-text-2` | primary and secondary text |
| `--prose` | `text-prose` | the answer's serif text |
| `--muted` / `--muted-2` | `text-muted-foreground` / `text-faint` | labels, captions; the faintest strokes |
| `--accent`, `--accent-ink`, `--accent-soft`, `--accent-hover` | `bg-brand`, `text-brand-ink`, `bg-brand-soft`, `hover:bg-brand-hover` | brand, primary action, accent highlight |
| `--bubble` | `bg-bubble` | the person's own message |
| `--good*`, `--bad*`, `--warn*` | `text-good`, `bg-bad-soft`, `text-warn-ink`, … | up / down / worth knowing |
| `--code-bg`, `--code-ink`, `--code-kw`, `--code-str` | `bg-code`, `text-code-ink` | SQL and code |
| `--chart-muted`, `--chart-grid`, `--chart-pos`, `--chart-neg`, `--chart-cat-1…8` | — | read by the chart theme at draw time |

The names the older CSS Modules used (`--paper`, `--ink`, `--clay`, `--line`,
`--accent-mint-soft`, …) are kept as aliases of these, so a module that has not
been rewritten still paints in the current palette. New code uses the names above.

### Palettes and dark mode

Seven soft palettes share one set of token names: **Sage (default)**, Lavender,
Mist, Seafoam, Mauve, Slate and Clay. A palette is `data-palette` on `<html>`;
dark mode is `data-theme="dark"`, and each palette has a dark accent. **Light
Sage is the default and the operating system does not get a vote** (D-046):
both choices are a person's, made in Settings → Appearance and stored per
browser (`lib/theme.tsx`, keys in `lib/theme-keys.ts`).

A small inline script in `app/layout.tsx` applies both attributes **before
first paint** — the one script the app injects, because React can only run after
hydration. It reads storage, sets two attributes, and stops. Charts are drawn on
canvas/SVG and cannot read CSS live, so they redraw when either attribute changes.

### Typography

- **Inter**, 15px / 1.55, for every piece of chrome.
- **Source Serif 4** for the machine's own words — the answer (17.5px / 1.7),
  callout text — and for titles: page titles (28px), card and figure titles
  (17px), the wordmark.
- **JetBrains Mono** for SQL, specs and code (12.5px).
- Numbers in tables and cards use `tabular-nums`.

### Shape and depth

Cards and figures `16px`; controls `11px`; the composer `24px`; pills and
chips fully round. Depth is a hairline plus `0 1px 2px rgba(shadow, .05)`;
hover lifts to `0 6px 16px rgba(shadow, .08)` with a 1px rise.

### Motion

Calm and short. New blocks fade up 10px over 0.5s; table rows stagger by 60ms;
the thinking title shimmers and its icon breathes while a run is live; the
active step pulses a ring; numbers in cards count up once; charts draw in
~0.9s. Collapsibles animate `grid-template-rows` from `0fr` to `1fr` and stay
mounted. Everything honours `prefers-reduced-motion`.

## Components

### The shell

A 268px sidebar: the mark and **DataMind** wordmark, *New chat*, *Questions for
you* (imported definitions waiting for an Admin, with a count), *Knowledge*,
your chats grouped by day (rename and archive on hover — *archive*, never
delete, D-039), *Settings* and the account card. It collapses to a 60px icon
rail (remembered per browser) and becomes a drawer below `md`. **It holds no
admin controls**: Data sources and Members live behind Settings and gate
themselves. Each screen has a quiet top bar (title centred, actions right).

### The thread

The person's message is a soft bubble on the right. The agent's turn is the
mark, then:

1. **Thinking** — a pill: *Thought for 18 seconds · 13 steps · 1 query*, which
   opens into a dot timeline. See *The working state*.
2. **The answer** (`data-testid="answer"`), in this order: the words, the
   chart, the caveats, *How I worked this out*.
3. **Actions** — copy, a reaction, *This is wrong* (the correction is sent back
   as the next question), and the ending word on the right.
4. **You might also ask** — follow-up chips after the latest answer; they fill
   the composer rather than send.

The composer floats at the bottom: it grows with the question, has the
documents button and the *Thinking* mode chip, and a round send button.

### The answer's words

Markdown, rendered without raw HTML (an answer is written by a model that has
read customer rows, so HTML is escaped, always). Prose is serif. **A change
with a direction is highlighted**: a bold phrase or a plain phrase such as
"up 11.0%", "down 16.6%", "−$21.4K" or "+4.1%" is marked green or red; a bold
name stays bold; `==phrase==` is an accent highlight. A phrase that points
both ways, or carries no number, is never marked.

### Figures

A figure is a card with a serif title, a muted subtitle, and actions that
appear on hover (always on touch): download as image, full screen, and **the
chart spec**, which opens the way the SQL does — a picture nobody can check is
decoration that looks like evidence.

**Charts only ever show numbers the answer already holds.** Either the server's
spec (assembled from a closed vocabulary in `agent/charts.py`), or — when the
answer carries a table of a period against a figure, or of things against a
change — the same cells drawn as a chart, with a *Chart / Table* switch and the
table one click away. Nothing is computed or invented on the way.

| Data | Drawn as |
|---|---|
| things with changes both ways | diverging bars, the biggest fall called out in red |
| a ranked list | soft horizontal bars, the top one in the accent |
| a series over time | a smooth line with a fading area |
| several series | lines or grouped columns in `--chart-cat-*`, with a legend |
| x against y | points |

Axes are muted 11px on a dashed hairline grid; values keep the table's unit
(`RM 28,204`, `−5.3%`). Charts are SVG on screen, re-laid-out below 520px, and
exported to PNG through an off-screen canvas.

### Tables

TanStack Table: quiet sortable headers, numbers right-aligned, a column of
signed percentages as green/red pills, rows that fade in, and a CSV download.
**Cells are verbatim** — the digits a reader checks against the query are the
digits shown. A table that is really a list of figures — `Metric | Value`, or
one row of numbers — is shown as **number cards** instead.

### Caveats and evidence

Limitations are an amber callout — *One thing to know* / *N things to know* —
and are **never folded away**: a caveat changes what the answer means.
*How I worked this out* collapses the method, the definitions that governed the
answer (or that none matched), the cited findings with their confidence and
**the query behind each** (SQL verbatim, rows verbatim, masked columns labelled
where they are read), and the cost. A finding with one citation shows its query
as soon as the panel opens.

### The ending, in the true word

*answered* (green, with "backed by N queries"), *could not answer …* naming the
missing half (amber), *could not answer* for an honest refusal (muted, never
red), *failed* only when the platform failed (red). A refusal is an answer, and
the word **answered** never appears on one (B-133, D-044).

### The working state

Unchanged in principle (D-047): **every row is one durable trace event, in the
order it was written.** No scripted sequence, no minimum display time, no step
that appears because somebody expected it to. While a run is live the pill
reads *Thinking…* with the current step beside it, the timeline is open, and
below it the run says what it is doing in counters (*working · step 6 of 12 ·
3:30 of 5:30*), never a bar that predicts a finish. Once it settles the pill
reads *Thought for …* and folds away.

### Waiting, and having nothing to show

Unchanged in principle (D-049). A skeleton claims the shape and nothing else,
announced once; `null` means *not asked yet* and `[]` means *there is nothing*.
A one-shot operation shows a word (and an indeterminate bar), then its real
result sentence. An empty state is a mark, a serif title, a line of why, and
exactly one action — or the sentence naming who can act, never a disabled
control (B-008).

### Admin and account screens

A centred column (880px, 1120px for wide tables) under a `PageHeader`: an icon
tile, a serif title, a muted subtitle, and a quiet *Back to …* link above it.
Content sits in cards with serif titles; lists and tables use the same
TanStack table and pills as answers.

## Accessibility, non-negotiable

- Every interactive element has a visible `:focus-visible` ring in the accent.
- Text meets WCAG AA on its surface in every palette, light and dark; `-soft`
  fills are backgrounds only, never text.
- **Colour never carries meaning alone** — a change has a sign and a word, a
  status has a word, a chart has its table.
- Icon-only controls have an accessible name and a tooltip with the same words.
- Collapsed content stays in the document but is hidden from assistive
  technology until opened.
- `prefers-reduced-motion` disables animation.
