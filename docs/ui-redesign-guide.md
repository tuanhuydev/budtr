# Budtr UI redesign: implementation guide

Audience: a Claude Code session (or a developer) implementing the redesigned Budtr content area.
Read `CLAUDE.md` first. This guide adds to it and only overrides it where it says so.

Design source: the "Budtr UI Redesign" canvas (private link, owner: tuanhuydev). It has five artboards: Overview, Icon tabs, Design foundation, Build it with MUI. This guide is written to be sufficient without the canvas. Where the two disagree, the canvas is the visual truth except for the chart notes in section 7, which explain where MUI Charts must differ.

## 0. Scope and hard rules

In scope: the Budtr content area (`src/**`).

Out of scope, do not touch:
- The shell's left sidebar and anything outside this repo. Budtr is a micro-frontend mounted next to it.
- Backend and API shapes. No new endpoints. Everything below uses existing hooks.

Hard rules:
1. `rsbuild.config.ts` exposes `./App`, `./BudgetVsActual`, `./SpendingTrends`, `./CategoryBreakdown`, `./MonthlyComparison`, `./SavingsProgress`. Do not move or rename those files or their exports. They are mounted by the shell outside `App`, so they may render without Budtr's `ThemeProvider` (see 8.3).
2. Never call `fetch`. Use existing hooks (`apiClient.request` underneath).
3. All strings go through `useBudtrTranslation()`. Add every new key to both `en` and `vi` in `src/hooks/useI18n.ts`.
4. `SxProps` constants live at the bottom of each component file.
5. No hardcoded colours, font sizes or radii in components. Use theme tokens (section 3) or `CATEGORY_COLORS`.
6. Code style (`.prettierrc`): single quotes, `jsxSingleQuote`, `arrowParens: avoid`, 80 columns, `es5` trailing commas. Path alias `@/` maps to `src/`.
7. Charts are `@mui/x-charts` (^8.24) only. Do not add another chart library.
8. Do not add packages to Module Federation `shared`.
9. `pnpm install` first: `node_modules` may be absent. Before writing chart code, open the installed `@mui/x-charts` typings and confirm each prop used below exists in this version. Prop names in this guide come from v8 knowledge, not from the installed package.

## 1. Page anatomy

```
Page background  (background.default #F7F8F9), 16px gap between the two cards
┌ Header card ──────────────────────────────────────────────┐
│ Bud·get·Tr·acker  → folds to  Budtr          [pills]*     │  *right side on desktop,
│ [This week][This month][This year][Custom]               │   under the title on tablet
│ SPENT     FIXED / VARIABLE   SAVINGS RATE   TOP CATEGORY  │
└───────────────────────────────────────────────────────────┘
┌ Content card ─────────────────────────────────────────────┐
│ ⠿ Overview   ⇄ Transactions   ▭ Asset                     │  tab bar, hairline below
├──────────────────────────────┬────────────────────────────┤
│ Daily Spends          (7)    │ Money Mix            (5)   │  1px hairlines only:
├──────────────────────────────┼────────────────────────────┤  no per-widget border,
│ Spending trends       (7)    │ Category mix         (5)   │  no per-widget background
├──────────────────────────────┼────────────────────────────┤
│ Savings progress      (7)    │ Top 5 Transactions   (5)   │
├──────────────────────────────┼────────────────────────────┤
│ Monthly Comparison    (7)    │ Weekly Comparison    (5)   │
└──────────────────────────────┴────────────────────────────┘
```

Key decisions:
- Two cards. The tab bar is the top bar of the content card, so tabs visibly own the widgets below.
- The header applies to the whole page (all tabs). Its pills and stats are self-contained: they do not drive any widget, the Transactions tab or the Asset tab. Every widget keeps its own fixed date window.
- Widgets are separated by 1px hairlines, drawn once. Do this with a flex or grid container that has `gap: '1px'` and `bgcolor: 'divider'`, and white (`background.paper`) cells. Hairlines then stay correct when cells wrap.
- Every row uses the same 7/5 split so the vertical hairline lines up between rows. Left cell `flex: '7 1 520px'`, right cell `flex: '5 1 340px'`, both `minWidth: 0`. Use DOM order that matches visual order (no CSS `order`).
- Cell padding is 24px (`p: 3`).

## 2. Phases (one PR each; use `.github/pull_request_template.md`)

| PR | Content | Files |
|---|---|---|
| 1 | Theme tokens, typography, category palette, chart theme, shared UI primitives | `configs/theme.ts`, `configs/constants.ts`, `configs/chartTheme.ts`, `components/ui/*` |
| 2 | Header card, title intro, icon tabs, content card, header stats | `App.tsx`, `components/layout/*`, `hooks/usePeriodSummary.ts`, `utils/period.ts`, `useI18n.ts` |
| 3 | Overview grid and all widgets | `features/overview/**` |
| 4 | Transactions and Asset tabs skin | `features/transactions/**`, `features/assets/**` |
| 5 (optional) | Dark mode pass | `configs/theme.ts` |

Each PR must leave `pnpm type-check`, `pnpm lint`, `pnpm format:check`, `pnpm build` green and the app usable.

## 3. Design tokens (PR 1: `src/configs/theme.ts`)

Replace the green palette. Primary is `#172733`. Build the theme with a function so dark mode can reuse it (the current `createTheme({...budtrTheme})` spread keeps stale light overrides).

```ts
export const neutral = {
  0: '#FFFFFF',
  50: '#F7F8F9', // page background
  100: '#EEF0F2', // wash, gridlines, idle fills
  200: '#E1E5E8', // borders and dividers
  400: '#8A96A0', // decorative only, fails text contrast
  500: '#7B8794', // large decorative text only (folding title parts)
  600: '#5F6C77', // muted text, inactive tabs (4.5:1 on white)
  700: '#4F5D68', // secondary text
  900: '#172733', // primary
};
```

| Role | Value |
|---|---|
| primary main / light(hover) / dark | `#172733` / `#2B3C47` / `#0F1A22`, contrast `#FFFFFF` |
| text.primary / text.secondary | `#172733` / `#4F5D68` |
| divider | `#E1E5E8` |
| background.default / paper | `#F7F8F9` / `#FFFFFF` |
| success (income) | `#16A34A` |
| error (expense) main / dark (amount text) | `#DC2626` / `#B91C1C` |
| info (savings) | `#2563EB` |
| warning | `#D97706` |

Do not add custom palette keys (e.g. `palette.neutral`) that components read at runtime. Exposed widgets can render outside Budtr's theme (8.3). Use the standard keys above; export `neutral` only for `theme.ts` itself and `chartTheme.ts` fallbacks.

Typography: `fontFamily: '"Roboto","Helvetica","Arial",sans-serif'`.

| Variant | Size / line | Weight | Use |
|---|---|---|---|
| h1 | 28 / 36 | 600, letter-spacing -0.01em | "Budtr" title |
| h2 | 20 / 28 | 600 | widget titles |
| h3 | 16 / 24 | 600 | sub-titles ("Transaction List") |
| body1 | 14 / 20 | 400 | body |
| body2 | 13 / 20 | 400 | secondary |
| caption | 12 / 16 | 500 | captions, axis labels |
| overline | 12 / 16 | 500, +0.06em, uppercase | stat labels |

Money values use `fontVariantNumeric: 'tabular-nums'`. Add a `numeric` helper in `theme.ts` or an sx constant, not per-component strings.

Fonts: set `fontFamily` only. Check whether the shell already loads Roboto. If not, add `@fontsource/roboto` (400, 500, 700) and import the CSS at the top of `src/App.tsx`. Verify it survives `pnpm build` as a federated remote.

Shape and spacing: `shape.borderRadius: 8`; cards use `12`; pills `999`. Spacing stays 8px base (MUI default). Scale used: 4, 8, 12, 16, 24, 32, 48.

Component overrides (all in `theme.ts`):

- `MuiPaper`: `outlined` variant → `border: 1px solid divider`, `borderRadius: 12`; elevation 0 by default.
- `MuiChip`: small → height 28, `fontSize 12`, `fontWeight 500`, `borderRadius: 999`; outlined → `borderColor: divider`, text `text.secondary`; filled primary → `bgcolor primary.main`, white text.
- `MuiOutlinedInput` / `MuiSelect` / `MuiTextField`: radius 8, border `divider`, height 44 (touch target), focus border `primary.main` 1px (keep `size: 'small'` defaults, override min-height).
- `MuiButton`: keep `contained` + `disableElevation`; radius 8; min-height 44; fontWeight 500; `textTransform: 'none'`.
- `MuiTabs` / `MuiTab`: see 6.2.
- Remove the `MuiTab` hover and bold-on-select rules that use the old green.

Category palette (`CATEGORY_COLORS` in `configs/constants.ts`). Keep the keys. The first six values are in the approved design; the others are proposals. Run a colour-blind check and adjust. Rules: muted, `OTHER`/`NONE` always the lightest neutral, never rainbow.

```ts
export const CATEGORY_COLORS: Record<string, string> = {
  NONE: '#D5DBE0',
  FOOD: '#3B82A0',
  TRANSPORTATION: '#6AA89A',
  UTILITIES: '#D9A441',
  SHOPPING: '#C8776B',
  HEALTHCARE: '#8C7BB5',
  OTHER: '#C5CCD2',
  // proposals
  ENTERTAINMENT: '#E0865A',
  TRAVEL: '#B8719F',
  EDUCATION: '#5B7DB1',
  SALARY: '#7FA66B',
  BUSINESS: '#8B7E74',
  INVESTMENT: '#9DB85B',
};
```

## 4. Shared UI primitives (PR 1: `src/components/ui/`)

- `WidgetCard`: title (`Typography component='h2' variant='h2'`), optional `subtitle`, `action` slot, `loading` (skeleton), `empty` (message), `error` boundary. Props `variant: 'outlined' | 'flat'`. Default `'outlined'` (`Paper variant='outlined'`, padding 3). `'flat'`: no border, no radius, no background, padding 3. The Overview supplies `'flat'` through a small context (`WidgetSurfaceContext`) so exposed widgets stay bordered when mounted standalone by the shell. Replaces every per-widget `ContainerSx`, `ChartSkeleton`, `ChartErrorBoundary` (keep those files exporting while the migration is in progress, delete after PR 3).
- `CategoryChip`: small `Chip`, neutral wash background (`neutral[100]`), 6px dot in the category colour, label from `t('categories.X')`. Not a solid category colour with white text.
- `MoneyText`: tabular numerals; expense → `error.dark`, income → `success.main`, transfer → `text.secondary`. Update `formatTransactionAmount` usage: the existing `color: 'green' | 'red' | 'grey'` is used as a CSS colour name in `DailySpendContainer`. Keep the field for compatibility but stop using it for rendering.
- `ChartLegend`: small row of 8px dots or squares plus 12px labels, built from the same series list as the chart (section 7.2).
- `EmptyState`: 32px stroke icon (`text.disabled`), one line of `text.secondary`.

## 5. Header card (PR 2: `src/components/layout/BudtrHeader.tsx`)

Lives in `App.tsx`, above the content card. Local state only (no global store).

### 5.1 Title and intro animation (`BudtrTitle.tsx`)

On load the title reads "Budget Tracker", holds 1.4s, then folds into "Budtr".

Segments (one `Typography variant='h1'`, inline):

| Segment | Colour | Behaviour |
|---|---|---|
| `Bud` | primary | stays |
| `get ` | `neutral[500]` (`#7B8794`) | folds away |
| `T` | primary | folds away |
| `t` | primary | grows in (lowercase) |
| `r` | primary | stays |
| `acker` | `neutral[500]` | folds away |

- Use `Collapse orientation='horizontal' timeout={700}` for `get `, `T`, `acker` (`in={!folded}`) and for `t` (`in={folded}`). Easing `cubic-bezier(.65, 0, .35, 1)`. Add `Fade` where the opacity should go with the width.
- Wrap segment text with `whiteSpace: 'pre'` so the trailing space in `get ` survives.
- Play once per session: key `budtr:intro-played` in `sessionStorage` (wrap access in try/catch). If already played, render `Budtr` immediately.
- `prefers-reduced-motion: reduce` → render `Budtr` immediately.
- Accessibility: the rendered heading text must be just "Budtr" for assistive tech: put `aria-label='Budtr'` on the h1 and `aria-hidden` on the animated spans.
- Clicking the title replays the animation (nice to have). If done, make it a real `<button>` inside the h1, not an `onClick` on text.

### 5.2 Period pills

Four small `Chip`s: This week (default), This month, This year, Custom. Keys already exist: `overview.thisWeek`, `overview.thisMonth`, `overview.thisYear`, `overview.custom`.

- Active: `variant='filled' color='primary'`. Idle: `variant='outlined'`, text `text.secondary`. Size small (28px). Each is a real button with `aria-pressed`.
- Custom opens the existing `DateRangePicker` in a `Popover`. Copy the pattern in `MoneyMix.tsx` (anchor by id, close when both dates are set).
- Extract the period to date-range logic from `MoneyMix.tsx` (`getDateRange`) into `src/utils/period.ts` as `getPeriodRange(period, today, custom)` and reuse it from both places. Keep `date-fns` defaults (week starts Sunday) so numbers do not shift. If the product wants Monday-first, that is a separate change.

### 5.3 Stats

Four stats, label above value (label: `overline`, `text.secondary` muted; value: 20/28, 500). Data comes from one new hook, `src/hooks/usePeriodSummary.ts`, which wraps `useTransactions({ startDate, endDate })` for the selected period (same query key as MoneyMix, so React Query dedupes) and computes, for EXPENSE transactions only:

| Stat | Value |
|---|---|
| Spent | sum of amount, then muted currency (`transaction.currency`, default `VND`). Muted `VND` is 14px `text.secondary` |
| Fixed / Variable | amount-weighted share by `transaction.behavior` (`ExpenseBehavior.FIXED` / `VARIABLE`). Show `72% / 28%` (variable = 100 minus rounded fixed) with a 56×8 two-tone bar (`LinearProgress variant='determinate'`, value = fixed share, bar `primary`, track a light neutral: the mock uses `#C5CCD2`). No expenses → `—` and no bar |
| Savings rate | `useSavingsProgress().projectedSavingsRate`, `31.3%` + muted `projected` (`insights.projected`), with a 20px ring: two stacked `CircularProgress` (determinate track `neutral[200]`, value `primary`, `thickness 5`). Clamp ring to 0 to 100; a negative rate uses `error.main` text and an empty ring. This stat is not period driven (the endpoint is fixed). Keep it anyway |
| Top category | category with the largest expense amount, `Other` + muted share `92.7%`. No expenses → `—` |

Check one thing before trusting the sums: `useTransactions` without `page` / `pageSize` must return every transaction in the range. `MoneyMix` already assumes so. Compare `data.total` with `data.transactions.length`; if they differ the backend paginates by default, so request `pageSize: data.total` or flag it.

States: loading → text `Skeleton` where each value goes. Error or no data → `—`.

### 5.4 Responsive layout (header)

Budtr is mounted next to the shell sidebar, so the viewport width is not the layout width. Use container queries, not viewport media queries: set `containerType: 'inline-size'` on the Budtr root (`App.tsx`) and use `'@container (min-width: 960px)'` inside `sx`. Thresholds are in Budtr's own width. Confirm the shell does not mount Budtr in an element that breaks container queries.

| Budtr width | Layout |
|---|---|
| ≥ 960px (desktop) | Title left and pills right on one line (`justifyContent: 'space-between'`, `alignItems: 'center'`, so no dead space). Four stats in one row, four equal columns (`repeat(4, minmax(0, 1fr))`, column gap 40) |
| < 960px (tablet) | Pills move to their own line under the title. Stats become a 2×2 grid (`repeat(2, minmax(0, 1fr))`, gap 20 24) |
| phone | Same as tablet, scaled down. Values may wrap inside their cell (`flexWrap: 'wrap'` on the value row, row gap 4). Pills wrap |

Header card padding `28px 32px`; gap 24 between title row and stats.

## 6. Tabs and content card (PR 2)

### 6.1 `App.tsx`

- Page root: `Box` with `background.default`, padding `32px 40px 48px` (24/16 on small containers), flex column, gap 16.
- Order: `BudtrHeader`, then `ContentCard` containing `PageTabs` and the active panel.
- Remove `TabWrapperSx` (`grey[50]`, fixed `calc(100vh - 96px)` height, own scroll). The page scrolls normally; the shell owns outer scrolling. Check that nothing relied on the inner scroll container.
- Tab keys: `tabs.overview`, `tabs.transactions`, and a new `tabs.asset` ("Asset" / "Tài sản"). Stop using `tabs.assetManagement`. Remove the typo key `AssetMangement` and the duplicate `AssetManagement` only after grepping for usage.
- Mount panels lazily: render a panel the first time its tab is visited and keep it mounted afterwards (keeps state, avoids fetching all three tabs at load). `TabContainer` currently hides panels with `hidden`: keep that, add the visited gate, and add real `id` / `aria-labelledby` so `aria-controls` targets exist.
- Persist the active tab in `sessionStorage` (`budtr:active-tab`, try/catch). Do not write to `location.hash`: the shell's router may own it.

### 6.2 `PageTabs.tsx` (MUI `Tabs` + `Tab`)

Use `Tabs` with `variant='scrollable'`, `scrollButtons={false}` so phones scroll the row sideways. Each `Tab` has `icon` and `iconPosition='start'`.

- Content card = `Paper variant='outlined'` with `overflow: 'hidden'`. The tab bar is its first child: padding `12px 20px 0`, `borderBottom: 1px solid divider`.
- `Tab` style: `minHeight: 0; minWidth: 0; padding: 14px 12px; textTransform: none; fontSize 16; lineHeight 24px; fontWeight 500; color neutral[600]; gap 10px` (set `.MuiTab-iconWrapper { marginRight: 0 }`), icon 20px. Hover: `text.primary`. Focus-visible ring: 2px `primary`.
- Selected: colour `primary.main` and the underline.
- MUI draws its indicator from JS and cannot inset it. Set `TabIndicatorProps={{ sx: { display: 'none' } }}` (or the theme `indicator: { display: 'none' }`) and draw the underline on `.Mui-selected::after`: `content: '""'; position: absolute; left: 12; right: 12; bottom: 0; height: 3; borderRadius: '3px 3px 0 0'; bgcolor: primary.main`.
- Keyboard: MUI `Tabs` already supports arrow keys. Keep `aria-label`.

Icons (stroke `currentColor`, 24 viewBox rendered at 20px; build as `SvgIcon` components in `src/components/icons/TabIcons.tsx`):
- Overview: 3×3 dot grid. Filled circles `r=1.6` at x,y ∈ {5, 12, 19}.
- Transactions: `<path d='M4 8h15l-3.5-3.5M20 16H5l3.5 3.5' />`, stroke 1.5, round caps and joins, no fill.
- Asset (wallet): `<rect x='3' y='6' width='18' height='13' rx='2.5' />` plus `<path d='M3 10h18M16 14.5h2' />`, same stroke.

## 7. Charts (MUI X Charts): read this section carefully

The design canvas is hand-drawn SVG. MUI renders charts its own way. Match the look where MUI can; accept the listed differences instead of fighting the library.

### 7.1 Differences between the mock and the real charts

| Mock | Real implementation |
|---|---|
| Fixed y ticks (0, 5, 10, 15, 20 mil) | Let MUI choose ticks. Set `tickNumber` (about 4) and `min: 0`. Never hardcode a max |
| X labels like `2026-05, 06, 07` | Pass real labels. Format with an x-axis `valueFormatter` to a short month (`MMM yy` via `date-fns`) or keep `YYYY-MM`. Use one format in all charts |
| Hand-made legends below the chart | `hideLegend` plus the shared `ChartLegend` component (7.2). Do not use MUI's built-in legend |
| Bars rounded all corners | `borderRadius: 4` rounds all four corners (MUI cannot round only the tops). Accept it |
| Tiny bar stubs for zero values | MUI draws nothing for 0. Do not fake them |
| Straight lines, no markers | `curve: 'linear'`, `showMark: false` per series. MUI still shows a marker on hover: fine |
| Custom tooltips (none drawn) | Default MUI tooltip with a `valueFormatter` returning the full amount (`toLocaleString()`). Optional: style via theme / `slotProps` |
| Donut with a flat centre label | Same as today: absolutely positioned `Box` over the chart (see `MoneyMix.tsx`, `CategoryBreakdown.tsx`) |
| Charts fill the card | Do not pass `width`. In v8 charts are responsive; pass `height` only. Remove the fixed `width={280}` (WeeklyComparison) and `width={380}` (CurrentWeekTransactions) |
| Chart text sharp and constant size | Real text is 12px, `text.secondary`. Do not scale text with the chart |
| Y axis label gutter drawn by hand | Prefer the axis `width` property (v8). If the typings reject it, use `margin={{ left: 56 }}` as the repo does today |

Shared constants: chart height 230 for Spending trends, Savings progress, Monthly Comparison and Weekly Comparison; Money Mix donut 180 (square).

### 7.2 Shared chart theme (`src/configs/chartTheme.ts`)

Create one module and use it from every chart so they look like one family.

```ts
import { alpha, SxProps, Theme } from '@mui/material/styles';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';

import { formatChartValue } from '@/utils/transactionFormatter';

export const CHART_HEIGHT = 230;

// Gridlines light, axis lines off (except the x baseline), 12px muted labels.
export const chartSx: SxProps<Theme> = theme => ({
  width: '100%',
  [`& .${axisClasses.tickLabel}`]: {
    fill: theme.palette.text.secondary,
    fontSize: 12,
  },
  [`& .${axisClasses.bottom} .${axisClasses.line}`]: {
    stroke: theme.palette.divider,
  },
  [`& .${chartsGridClasses.line}`]: {
    stroke: alpha(theme.palette.divider, 0.6),
  },
});

export const moneyYAxis = {
  valueFormatter: formatChartValue,
  disableLine: true,
  disableTicks: true,
  min: 0,
};

export const bandXAxis = (data: string[]) => ({
  scaleType: 'band' as const,
  data,
  disableTicks: true,
  categoryGapRatio: 0.35,
  barGapRatio: 0.1,
});
```

Use it like this (v8 shape; verify the names against the installed typings):

```tsx
<BarChart
  xAxis={[bandXAxis(months)]}
  yAxis={[moneyYAxis]}
  series={series}
  height={CHART_HEIGHT}
  borderRadius={4}
  grid={{ horizontal: true }}
  hideLegend
  sx={chartSx}
/>
```

`ChartLegend` (`src/components/ui/ChartLegend.tsx`): `items: { id: string; label: string; color: string; shape?: 'dot' | 'square' }[]`; a flex-wrap row, gap 20 (columns) / 8 (rows), 12px `text.secondary`, 8px marker (`50%` radius for dot, 2px for square). Used by Savings progress, Monthly Comparison, Money Mix, Weekly Comparison.

Series colours: always pass explicit `color` per series. Never rely on the default palette. Category series use `CATEGORY_COLORS[category] ?? CATEGORY_COLORS.OTHER`. Series `id` equals the category key so colours stay stable when series are filtered.

### 7.3 Chart by chart

#### Money Mix (`MoneyMix.tsx`, `PieChart`)

- Keep the existing data flow (`useTransactions` for its own period, EXPENSE only, grouped by category) and keep the existing in-widget period chips (Today, This Week, This Month, This Year, Custom). The approved design does not draw them; they are existing functionality. Restyle them as the same small outlined `Chip`s as the header pills and put them in the widget's `action` slot. Flag this in the PR description so the owner can decide to remove them.
- `PieChart`: `series: [{ data, innerRadius: 60, outerRadius: 84, paddingAngle: 2, cornerRadius: 3, valueFormatter }]`, `width: 180`, `height: 180`, `hideLegend`. Remove `arcLabel` (white percentages on tiny arcs are unreadable; the legend carries the percent).
- Centre: the existing absolutely positioned `Box` pattern. Show `Total` (caption) and the formatted total (20px, 700, tabular).
- Below the donut: `ChartLegend` with `Other 92.7%` style labels (category + percent), centred.
- Empty state: `EmptyState` with `overview.noTransactions`.

#### Category mix (`insights/CategoryBreakdown.tsx`; rename title to "Category mix")

- Replace the donut with ranked rows. This is not a chart; use MUI: per row a flex line (category dot + name, amount bold 14px + `· 92.7%` muted) and below it `LinearProgress variant='determinate'` (`value = percentage`, height 8, radius 4, track `neutral[100]`, bar colour from `CATEGORY_COLORS`).
- Data: existing `useCategoryBreakdown()` (`items[].category / amount / percentage`, fixed month). Order by amount descending; keep `OTHER` where its amount puts it. Ensure a minimum visible bar width of 8px for tiny shares (`min-width: 8px` on the filled part: use a custom `sx` on the bar).
- Keep the `data.month` caption as the widget `subtitle`.
- New i18n key for the title (see section 9). Keep the `insights.categoryBreakdown` key for the exposed `CategoryBreakdown` module if anything else uses it.
- Caveat: this export is also a federated module (`./CategoryBreakdown`). Changing the visual from donut to rows changes what the shell shows. Mention it in the PR.

#### Spending trends (`insights/SpendingTrends.tsx`, `LineChart`)

Replace the current "click to hide" toggle with the "All first" pill behaviour.

State: `selected: string[]` (category keys). Empty array = All.

```tsx
const allActive = selected.length === 0;
const visible = allActive ? categories : categories.filter(c => selected.includes(c));
const toggle = (cat: string) =>
  setSelected(prev =>
    prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
  );
// "All" pill: onClick={() => setSelected([])}
```

Pills (`Chip`, small, `clickable`, `aria-pressed`), in a wrapping row above the chart:

| State | All pill | Category pill |
|---|---|---|
| Nothing picked (default) | filled primary (active) | outlined, coloured dot (idle) |
| One or more picked | greyed (`bgcolor neutral[100]`, text `neutral[600]`, no border) | picked: filled primary with a dot ringed white; unpicked: outlined idle |

Picking the last picked category again returns to All. A caption on the right of the title says `Showing all categories` or `Showing Food, Transport`.

Chart: pass only the visible series to `LineChart` (do not null the data, as the current code does, because that leaves stale axes and tooltips).

```tsx
<LineChart
  xAxis={[{ scaleType: 'point', data: xLabels }]}   // verify band vs point in this version
  yAxis={[moneyYAxis]}
  series={visible.map(cat => ({
    id: cat,
    label: t(`categories.${cat}`),
    data: valuesByCat[cat],
    color: CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.OTHER,
    showMark: false,
    curve: 'linear',
  }))}
  height={CHART_HEIGHT}
  grid={{ horizontal: true }}
  hideLegend
  sx={chartSx}
/>
```

Keep the y axis stable if possible: compute `max` from all series so toggling does not rescale the axis jarringly. Optional but recommended.

#### Savings progress (`insights/SavingsProgress.tsx`, `BarChart`)

- Three series: income (`success.main`), expense (`error.main`), savings (`info.main`), grouped (not stacked), `borderRadius: 4`. These are the only charts that use these semantic colours.
- Title "Savings progress" (existing key `insights.savingsProgress`). The projected chip becomes a neutral `Chip size='small'` (`neutral[100]`, text primary) reading `Projected 31.3%`, replacing the green/red tinted chip.
- `ChartLegend` below with square markers.
- Negative savings must still render (bars go below zero): do not force `min: 0` on this chart's y axis; use `moneyYAxis` without `min`.

#### Monthly Comparison (`insights/MonthlyComparison.tsx`, `BarChart`)

- Grouped bars by category per month. Cap at 5 categories by total plus one aggregated bucket for the rest, coloured `CATEGORY_COLORS.OTHER`, always last. Name the aggregate with the existing `categories.OTHER` label only if the real `OTHER` category is not already among the top 5; if it is, merge into it.
- `ChartLegend` below. Same axes as 7.2.

#### Weekly Comparison (`WeeklyComparison.tsx` + merged `CurrentWeekTransactions.tsx`)

One widget with a small two-option control in its action slot: `By day` (default) and `vs last week` (new i18n keys). Use `ToggleButtonGroup exclusive size='small'` with pill styling, or two outlined/filled `Chip`s; match the header pills.

- By day: `BarChart`, single series from `stats.currentWeek` (`{ day, amount }[]`), colour `primary.main`, `borderRadius: 4`. Day labels via the existing `days.*` keys (lowercase day names in the current i18n; check the keys).
- vs last week: existing data from `stats.weeklyComparison`, stacked by category (`stack: 'total'`), x labels `t('overview.previousWeek' | 'overview.currentWeek')`, as the current component does, plus `ChartLegend`.
- Remove fixed widths. Keep both data sources; do not merge their hooks. `CurrentWeekTransactions.tsx` can be deleted once its chart lives inside `WeeklyComparison` (grep for imports first).

#### Top 5 Transactions (`TopTransactions.tsx`, not a chart)

`List` rows, min-height 56, top border `divider`: rank (12px muted, tabular), description (14/500, `noWrap`), `CategoryChip`, amount right-aligned (`MoneyText`, min-width ~88). Source: `stats.topTransactions`. Title key stays `overview.topTransactions` ("Top 5 Transactions").

### 7.4 Chart pitfalls

- The widgets are used in a flex layout: give the chart's parent `minWidth: 0` or the chart will not shrink and overflows the cell.
- Do not set `width` and also expect responsiveness. Omit it.
- Dark mode: `chartSx` reads theme tokens, so it survives; the explicit series colours do not change. That is fine for the category palette; check contrast later.
- Empty arrays: handle `series.length === 0` before rendering a chart (MUI throws or renders blank axes). Show `EmptyState`.
- Do not add per-chart `sx` fixes for axes; extend `chartSx` instead.
- Loading: `WidgetCard loading` shows a text skeleton plus a rectangular skeleton at `CHART_HEIGHT`.

## 8. Layout details and cross-cutting rules

### 8.1 Overview grid (`OverviewLanding.tsx`, PR 3)

```tsx
<Box sx={GridSx}>
  <Row left={<DailySpendContainer … />} right={<MoneyMix today={today} />} />
  <Row left={<SpendingTrends />} right={<CategoryBreakdown />} />
  <Row left={<SavingsProgress />} right={<TopTransactions />} />
  <Row left={<MonthlyComparison />} right={<WeeklyComparison />} />
</Box>
```

- `GridSx`: `display: 'flex'; flexDirection: 'column'; gap: '1px'; bgcolor: 'divider'`.
- Row: `display: 'flex'; flexWrap: 'wrap'; gap: '1px'; bgcolor: 'divider'`; left cell `flex: '7 1 520px'`, right `flex: '5 1 340px'`, both `minWidth: 0; bgcolor: 'background.paper'; p: 3`. Make a tiny `Row` helper component in the feature folder.
- Wrap the grid in `WidgetSurfaceContext.Provider value='flat'`.
- `OverviewLanding` currently shows one `CircularProgress` until `dailyTransactions` and `assets` load. Keep the gate only for what `DailySpendContainer` needs; let the other widgets show their own skeletons so one slow endpoint does not blank the page. Keep the midnight `today` refresh.

### 8.2 Daily Spends (`DailySpendContainer.tsx`)

It already is one widget (form plus today's list). Restyle only; do not change logic, fields, suggestions or the create mutation.

- Title "Daily Spends" (`overview.dailySpends`). Two columns that wrap (`flexWrap: 'wrap'`, each `flex: '1 1 260px'`).
- Left: 2×2 grid of selects (Type, Category with a colour dot, Source, Kind), then amount (`AmountInput`) and Save on one row. Keep the existing 4 selects and `AmountInput`; add small labels above (12px, `text.secondary`). Save is the contained primary button (`overview`/`common.save`).
- Right: `Transaction List` (h3) with `Today` caption, a 1px `divider` left border and 24px left padding (top border when wrapped). Empty: `EmptyState` using the same translation key `DailySpendContainer` already uses for its "No transactions found" message.
- Replace `formatTransactionAmount(...).color` CSS names with `MoneyText`.
- Keep the suggestions `Paper` dropdown working: it is absolutely positioned; check it is not clipped by the content card's `overflow: hidden`. If it is, use `Popper` (portal) for it or drop `overflow: hidden` from the grid area and keep it only on the card corners (`borderRadius` with `overflow: clip`).

### 8.3 Federated modules

The five exposed insight modules can be mounted by the shell outside `App`, so Budtr's `ThemeProvider` may be absent around them. Do not add new required providers to them. Specifically:
- `WidgetCard` and the new primitives must work with the default MUI theme: only standard palette keys, no custom augmentation.
- `WidgetSurfaceContext` default is `'outlined'`.
- Do not import anything from `components/layout/*` into those modules.

### 8.4 Transactions tab (PR 4)

Keep its own date picker, create button, DataGrid and summary. Header pills do not affect it. Restyle:
- Remove the grey outer wrapper; the tab content sits inside the content card with padding 24.
- DataGrid: `border: 0`; row height 48; header row `bgcolor background.default`, `text.secondary` 12px 500 uppercase optional; right-aligned amount column using `MoneyText`; category column using `CategoryChip`. Put DataGrid overrides in `theme.ts` (`MuiDataGrid`), not in the table file.
- `DateRangePicker` and `Create` button row: pill-less, input height 44, button primary.
- Empty/loading states via shared primitives.

### 8.5 Asset tab (PR 4)

Keep `AssetCard` grid, `AssetSummary`, dialog flows. Restyle only:
- Remove the hardcoded asset-type colours in `AssetSummary.tsx` (`#4caf50 #2196f3 #ff9800 #9c27b0`); use muted tokens from the category/semantic palette.
- Cards: 12px radius, 1px divider (use theme tokens), balance in 20/28 700 tabular.
- Page header row: `Asset` title is now the tab, so drop the duplicated `h2` heading if it repeats the tab label; keep the Create Asset button right-aligned.

## 9. i18n keys to add (both `en` and `vi`)

| Key | en | vi (needs native review) |
|---|---|---|
| `tabs.asset` | Asset | Tài sản |
| `overview.spent` | Spent | Đã chi |
| `overview.fixedVariable` | Fixed / Variable | Cố định / Biến đổi |
| `overview.savingsRate` | Savings rate | Tỷ lệ tiết kiệm |
| `overview.topCategory` | Top category | Danh mục nhiều nhất |
| `overview.categoryMix` | Category mix | Cơ cấu danh mục |
| `overview.byDay` | By day | Theo ngày |
| `overview.vsLastWeek` | vs last week | So với tuần trước |
| `overview.all` | All | Tất cả |
| `overview.showingAll` | Showing all categories | Đang hiển thị tất cả danh mục |
| `overview.showing` | Showing {{names}} | Đang hiển thị {{names}} |
| `overview.fixedLabel` / `variableLabel` | Fixed / Variable | Cố định / Biến đổi (used in aria-labels) |

Check how the existing resolver interpolates before using `{{names}}`. If unsupported, build the string in code from two keys. "Budtr" and "Budget Tracker" are brand text: do not translate.

## 10. Accessibility checklist

- All interactive things are real `<button>` / `<a>`. No `onClick` on `div`s.
- Contrast: body text 4.5:1; muted tab / label text uses `neutral[600]` or darker on white. `neutral[400]`/`[500]` only for decorative or large text.
- Chart containers get an `aria-label` that says what the chart shows. Pill groups are `role='group'` with a label.
- Focus rings visible on tabs, pills and chips.
- Motion respects `prefers-reduced-motion`.
- Colours that must be told apart (income/expense/savings) also differ in lightness. Do not rely on red versus green alone.

## 11. Verification (no test suite exists)

For every PR:
1. `pnpm type-check`, `pnpm lint`, `pnpm format:check`, `pnpm build` all pass. After `pnpm build` confirm `dist/remoteEntry.js` still lists the six exposed modules.
2. Run `pnpm dev` (port 2000). Standalone needs shell services: read `src/bootstrap.tsx` and, for local review only, stub `window.__SHELL_SERVICES__` with an `apiClient.request` that returns fixtures matching `src/types/*.ts` (transactions with both `behavior` values, `spendingTrends`, `categoryBreakdown`, `monthlyComparison`, `savingsProgress`, `stats` with `weeklyComparison`, `currentWeek`, `topTransactions`). Do not commit the stub.
3. Screenshot with Playwright and the preinstalled Chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`; do not run `playwright install`) at container widths 1280, 900, 390. Attach to the PR.
4. Check by hand:
   - Intro animation plays once per session, replays on title click, is static with reduced motion.
   - Header layout switches at 960px of Budtr's own width (resize the mount container, not just the window).
   - Tabs: arrow keys, scrolling on a narrow container, correct underline, lazy mount (Network tab shows no Asset or Transactions fetches before visiting them).
   - Spending trends pills: All active by default → pick Food (All greys out, only Food line) → pick Transport (two lines) → deselect both (back to All).
   - Hairlines: one line between every pair of widgets, none doubled, vertical line aligned in all four rows, still correct when the container narrows and rows wrap.
   - Charts: no fixed widths, axis labels not clipped, tooltips show full amounts, empty datasets show the empty state.
   - Exposed widgets render sensibly with no Budtr `ThemeProvider` (mount one in isolation).
5. Report honestly in the PR what could not be verified (for example vi copy, real API data).

## 12. Open decisions to confirm with the owner (do not block on them)

1. Money Mix keeps its own period chips (7.3). The approved mock shows none.
2. Category palette beyond the first six colours is a proposal (section 3).
3. Week start stays Sunday (date-fns default). Monday-first would change existing numbers.
4. Category mix replaces a federated donut with ranked rows (7.3). Confirm the shell is fine with that change.
5. Spending trends with many categories can still look busy when All is active. Possible follow-up: default All to the top 6 by total.
