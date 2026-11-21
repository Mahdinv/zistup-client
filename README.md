<div align="center">
  <img src="./public/pwa/app-icon-192.png" alt="Zistup app icon" width="104" height="104" />

  # Zistup | زیستاپ

  **A smarter, more personal approach to nutrition and everyday well-being.**

  **زیستاپ؛ همراه شما برای تغذیه سالم‌تر و انتخاب‌های غذایی بهتر**

  [**Launch the live application**](https://app.zistup.com/) · [**View the source code**](https://github.com/Mahdinv/zistup-client)

  ![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
  ![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)
</div>

> [!IMPORTANT]
> **Looking to review or test this project?** The application is available at **https://app.zistup.com/**. Please read the [Live demo & test access](#live-demo--test-access) section before signing in.

## Overview

**Zistup** is a Persian-language, right-to-left (RTL), mobile-first nutrition and wellness web application. It brings together a personalized onboarding journey, interactive food-preference activities, meal and activity tracking, and a dashboard for following dietary progress.

This repository contains the **frontend application**, built with React, TypeScript, and Vite. Features that depend on user accounts, nutrition records, or personalized plans communicate with a separate backend API; the backend is not included in this repository.

The application is designed to feel like a focused mobile app while remaining usable on tablets and desktop browsers. It also includes Progressive Web App (PWA) support.

## Live demo & test access

| Item | Details |
| --- | --- |
| **Live application** | **[https://app.zistup.com/](https://app.zistup.com/)** |
| **Supported sign-in method** | **Mobile phone number only** |
| **Temporary verification code** | **`1010`** |
| **Email sign-in** | **Not available at this time** |
| **SMS delivery** | The SMS service is not yet active; use the temporary code above for the current testing flow. |

### How to test

1. Open **[app.zistup.com](https://app.zistup.com/)**.
2. Select the sign-in flow and enter a valid **Iranian mobile phone number** (`09xxxxxxxxx`).
3. When prompted for the four-digit verification code, enter **`1010`**.
4. Continue through the available onboarding screens and explore the application.

**برای بررسی پروژه:** وارد **[app.zistup.com](https://app.zistup.com/)** شوید، با **شماره موبایل** اقدام به ورود کنید و در مرحله تأیید، کد **`1010`** را وارد کنید. سامانه پیامکی هنوز فعال نشده و **ورود با ایمیل فعلاً پشتیبانی نمی‌شود**.

> [!NOTE]
> This code is a **temporary, publicly documented testing instruction**, not a private credential. Please use the demo only with accounts and data you are authorized to access. Authentication behavior may change when SMS verification is enabled. The backend must not accept a shared static verification code for unrestricted access to real users' accounts.

## Key features

### Authentication and onboarding

- Phone-number-based sign-in with a multi-step OTP verification interface.
- Initial personal-information collection for new users.
- A guided plan-selection experience, including information about conventional diets.
- An interactive, step-by-step food-preference journey that collects relevant choices and habits.

### Personalized nutrition journey

The guided workflow includes screens for:

- Demographic information.
- Household/tablemate context.
- Food intake during the previous week.
- Preferred-food selection and ranking.
- Free-choice and limited-shopping exercises.
- Comparing personal food preferences with broader patterns.

These experiences provide input for the application's personalized nutrition features. The actual generation and availability of individualized plans depend on the backend and the user's progress.

### Dashboard and daily tracking

- Meal logging with meal selection, food search, food details, and quantity selection.
- Voice-assisted food search through the browser's speech-recognition capabilities, where supported.
- Exercise/activity search functionality.
- Nutrition, calories, dietary adherence, and progress-oriented data views.
- Navigation areas for the dashboard, diets, Zistyar, and user profile.
- A dashboard-specific **light/dark theme**, with the selected preference persisted locally.

Some sections and content are dependent on account state, API responses, or ongoing development; availability can differ between users.

### App experience

- **Mobile-first, responsive** layouts with custom breakpoints starting at 320 px.
- **Persian/RTL** presentation, including localized typography.
- Motion and transition effects built with **Framer Motion**.
- Reusable base UI components and shared layout primitives.
- **PWA** metadata, install/update prompts, and configured asset caching.
- Request-state handling, loading feedback, and toast notifications.

## Tech stack

| Area | Main tools |
| --- | --- |
| UI framework | React 19, React DOM |
| Language | TypeScript 6 |
| Tooling | Vite 8, npm |
| Styling | Tailwind CSS 4, custom design tokens, `shadcn`, Base UI |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Client state | Zustand, React state |
| HTTP | Axios with shared interceptors and normalized API errors |
| Forms and validation | React Hook Form, Zod, `@hookform/resolvers` |
| Animation | Framer Motion |
| Charts | Chart.js, React Chart.js 2 |
| Other UI tools | Keen Slider, dnd-kit, Lucide, React Icons, Sonner |
| Progressive Web App | `vite-plugin-pwa`, Workbox |
| Date handling | `jalaali-js` and project-specific date utilities |

The exact dependency versions are maintained in [`package.json`](./package.json) and [`package-lock.json`](./package-lock.json).

## Project structure

The codebase follows a **feature-oriented architecture**: product areas own their components, API integration, hooks, and types, while shared facilities remain reusable across features.

```text
zistup-client/
├── public/                       # Static assets and PWA icons
├── src/
│   ├── app/
│   │   ├── layouts/              # Account, playground, and dashboard layouts
│   │   ├── pwa/                  # PWA install/update experience
│   │   ├── providers.tsx         # Application-level providers
│   │   └── router.tsx            # Browser routing and route guards
│   ├── assets/                   # Fonts and application assets
│   ├── features/
│   │   ├── auth/                 # Sign-in and OTP flow
│   │   ├── onboarding/           # Profile setup and plan selection
│   │   ├── game-workflow/        # Interactive nutrition-preference journey
│   │   └── dashboard/            # Food, activity, diet, and dashboard features
│   ├── shared/
│   │   ├── api/                  # Axios client, token storage, API errors, query client
│   │   ├── base-components/      # Reusable UI primitives
│   │   ├── hooks/                # Shared React hooks
│   │   ├── lib/                  # Shared utilities
│   │   └── stores/               # Shared client-side state
│   ├── index.css                 # Tailwind theme, tokens, and global styles
│   └── main.tsx                  # Application entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── package.json
└── package-lock.json
```

> This is an architectural overview, not an exhaustive listing of every source file. Refer to the repository itself for the current tree.

### Important architectural conventions

- **Feature isolation:** keep feature-specific API calls, types, mappers, hooks, and UI within their owning feature.
- **Shared API access:** use the existing `src/shared/api/` HTTP client rather than creating unrelated Axios instances.
- **Server-state management:** follow the project's TanStack Query conventions for fetching, mutations, caching, and invalidation.
- **Base components first:** reuse existing components in `src/shared/base-components/` before introducing duplicate UI elements.
- **Layout-aware responsiveness:** use the application's existing centered, constrained-width layouts across larger breakpoints.
- **RTL-friendly styling:** favor logical start/end alignment and spacing where direction matters.

## Getting started locally

### Prerequisites

- A modern version of **Node.js** compatible with the installed Vite version (Node.js 22+ recommended).
- **npm**, as the repository includes `package-lock.json`.
- Access to the backend API for features that require authentication or live data.

### 1. Clone the repository

```bash
git clone https://github.com/Mahdinv/zistup-client.git
cd zistup-client
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```dotenv
VITE_API_BASE_URL=https://your-api-host.example/api
VITE_APP_VERSION=your-app-version
```

Replace the placeholders with the **correct values for your environment**. The HTTP client reads these variables in [`src/shared/api/http-client.ts`](./src/shared/api/http-client.ts). A backend URL suitable for local development must be provided by the project team; the placeholder above is **not** the production API endpoint.

> [!CAUTION]
> Vite exposes `VITE_`-prefixed environment variables to the browser. **Never place API secrets, private keys, or server credentials in these variables.** Local `.env` files are git-ignored.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

### 5. Validate and build

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` runs the TypeScript project build followed by the Vite production build. The generated assets are written to `dist/`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check/build TypeScript projects and generate a production bundle. |
| `npm run lint` | Run ESLint across the repository. |
| `npm run preview` | Preview the production bundle locally. |

No dedicated automated test command is currently declared in `package.json`.

## Responsive design and localization

The project's Tailwind theme defines the following breakpoints:

| Breakpoint | Minimum width |
| --- | ---: |
| `compact` | 320 px |
| `mobile` | 375 px |
| `mobile-lg` | 460 px |
| `fold` | 600 px |
| `tablet` | 768 px |
| `laptop` | 1024 px |
| `desktop` | 1280 px |

On larger displays, the account, playground, and dashboard experiences use centered, width-constrained containers rather than stretching the mobile-oriented interface across the entire viewport. Styling tokens, typography, colors, and breakpoints are defined in [`src/index.css`](./src/index.css).

The application is currently presented in **Persian**, with **right-to-left** document direction. Browser speech-recognition availability depends on browser support, microphone permission, and language capabilities.

## API integration and authentication

The shared HTTP client in [`src/shared/api/http-client.ts`](./src/shared/api/http-client.ts) implements:

- A configurable `VITE_API_BASE_URL`.
- An application version header configured through `VITE_APP_VERSION`.
- A bearer token attached to authenticated requests.
- Centralized API error normalization.
- Unauthorized-response handling, including token cleanup and redirection to sign-in.

Authentication endpoints and DTOs are managed within the `auth` feature. Requests for nutrition, meal, and activity data are managed within their respective features. The frontend does **not** include the backend implementation or guarantee standalone access to authenticated functionality without a working API.

## Progressive Web App

Zistup's Vite configuration includes PWA registration, an installable manifest, service-worker update prompts, and caching configuration for static resources and supported API-hosted images.

- The manifest is configured for Persian (`fa`) and RTL layout.
- The intended install experience is a standalone-style app.
- Offline behavior is **limited to what the service worker and browser have cached**; backend-dependent screens still require the relevant API connectivity.

## Current testing notes and limitations

- **Use https://app.zistup.com/ for live evaluation.**
- **Use a mobile number, not an email address, to sign in.**
- **Use verification code `1010` while the SMS gateway is inactive.**
- The login UI or validation code may still reference email; **email authentication is not currently an available sign-in method**.
- Some guided journeys, diet data, and dashboard states require a registered user and working backend responses.
- Browser-based voice recognition is not universally supported; manual text search remains the alternative.
- The product is under active development. Refer to the live application for current behavior.

## Contributing and development guidelines

For changes to this codebase:

1. Follow the existing feature structure, types, API conventions, and component patterns.
2. Prefer reusable base components over feature-level duplication.
3. Keep mobile-first behavior and the project's custom breakpoints in mind.
4. Preserve Persian/RTL support and check theme contrast where applicable.
5. Keep API configuration out of committed secrets and avoid placing sensitive data in frontend environment variables.
6. Run `npm run lint` and `npm run build` before submitting changes.

For issues, improvements, or collaboration proposals, use the repository's [GitHub issues](https://github.com/Mahdinv/zistup-client/issues) or contact its maintainer.

## License and usage

This repository is publicly viewable on GitHub, but **no license file is currently included**. Public visibility does not automatically grant permission to reuse, redistribute, or commercialize the source code. Please contact the repository owner for licensing or reuse permissions.

---

<div align="center">
  <strong>Explore Zistup: <a href="https://app.zistup.com/">app.zistup.com</a></strong>
  <p>Made for healthier decisions, one day at a time.</p>
</div>

## Microsoft Clarity: real recordings on audited routes

The official `@microsoft/clarity` package now records the actual application DOM.
There is no analytics iframe or extra HTML entry. A valid `VITE_CLARITY_PROJECT_ID`
and a production build are required. The SDK is dynamically imported only after
explicit consent and after the audited route commits. Module-level initialization
is shared across StrictMode mounts; no custom pageviews or user identifiers are sent.

### Route and component audit

| Route | Capture | Reason |
| --- | --- | --- |
| `/onboarding/choose-plan` | Yes, clean URL and no router state only | Static generic plan-choice cards, shared Button/ScrollFade, static account header; no personalized data or editable health controls. |
| `/auth/login`, `/google/back` | No | Phone, OTP, OAuth credentials and token-bearing URL. |
| `/onboarding/basic-information` | No | Identity, body measurements, sex, birth date and goals; values also occur in control attributes and geometry. |
| `/onboarding/choose-plan/conventional-global-diets` and `/:dietId` | No | Diet choices, selection interactions, diet IDs, API images and dynamic headers from router state. |
| `/game-workflow` | No | Personalized roadmap/completion state. |
| `/game-workflow/demographic-information`, `/tablemates` | No | Location, income, activity and household/personal data. (The second suffix is under `/game-workflow`.) |
| `/game-workflow/past-week-intake`, `/preferred-food` | No | Food history/preferences, quantities and charts. |
| `/game-workflow/free-shopping`, `/limited-shopping` | No | Selected foods, quantities, dietary effects and drawers. |
| `/game-workflow/social-alignment` | No | Personalized dietary scores, sliders and comparisons. |
| `/game-workflow/optimized-dietary` and `/optimized-dietary/weekly-diet-planning` | No | Generated plans, meals, replacement choices and nutrition. |
| `/app/dashboard`, `/app/diets` | No | Health metrics, calories, water, activity, charts, food logs and personalized plans. |
| `/app/profile` | No | Identity/avatar, mobile, measurements, goals and edit drawers. |
| `/app/zistyar` | No | Although its page is a static placeholder, the shared dashboard layout retains animated page backgrounds and exposes the meal-entry drawer. |
| `/`, `/app`, unknown routes, any query/fragment on the allowed route | No | Redirects, unreviewed content or potentially sensitive URLs. |

Shared layouts, animations, portals, toasts, PWA prompts, error boundaries, form
controls and chart components were included in the audit. Masking text does **not**
remove health information encoded in ARIA attributes, CSS, SVG paths, element counts,
checkboxes or click positions. Those screens are excluded entirely, not merely blurred.
The allowed screen's attributes/styles are static and its outbound controls contain no
personal URLs. Its dynamic account-header route state disqualifies capture.

`data-clarity-mask="true"` covers the body (including portals) and the capture boundary.
No unmask attributes are introduced. The document title is static and the referrer policy
is `no-referrer`. Queries/fragments are never sanitized and then recorded in the same
document: their entry documents are ineligible. External/unsafe referrers also block
initialization. Never add personal values to URLs, titles, CSS, attributes or custom tags
on an eligible screen. Any new screen/component requires another audit before allowlisting.

### Safe lifecycle and consent

Consent remains accessible through the shared Persian/RTL UI, with equally available
accept/deny actions and keyboard focus management. The v2 storage key deliberately
requires fresh consent because the old notice authorized only navigation analytics; previous denials remain respected.
Unknown/denied consent loads no SDK; accepted consent sends `analytics_Storage: granted`
and `ad_Storage: denied`. Storage failures use a denial-only session fallback.

Microsoft's actual runtime shows that Consent V2 denial can call stop and schedule a
restart in cookieless mode. SPA history handling also schedules restarts. Consequently,
removing a script element, unmounting React, or calling stop/pause is not isolation.
Withdrawal sends denial and best-effort stop, makes the outgoing document inert, and
replaces it with a fresh untracked document. Cross-tab withdrawal does the same. Pending
uploads containing already-collected safe content may finish during unload; no sensitive
route is rendered in that outgoing document. If storage cannot save denial, an excluded
`#analytics-off` entry prevents restart. Fragment-only exits use a temporary, non-sensitive `__zistup_privacy_boundary` query flag to force a full request; it is removed before the next router starts, and that document stays untracked. BFCache restoration forces a fresh document.

Navigation into/out of the capture surface uses full-document navigation, even before
consent, to prevent previous forms, portals, cached layouts or timers from surviving.
A router blocker handles normal navigation; a data strategy redirects **before target
loaders** and catches loader redirects; early POP/history guards protect URL changes.
Normal SPA navigation among excluded screens is unchanged. Same-page revalidation does
not reinitialize Clarity. This intentionally trades one page load at privacy boundaries
for isolation. The plan-choice outbound origin defaults already match its callers;
React `location.state` is not transported across document boundaries.

Keep privacy guards in place before creating the router. Keep tracking out of feature
APIs/stores. Do not add another Clarity/tag-manager script or expand the route allowlist
without reviewing the entire reachable layout, including drawers and portals.

### Production configuration and verification

In the Clarity project, retain **Settings → Masking → Strict**, enable Consent Mode
(Settings → Setup: turn off cookies by default), disable advertising integrations,
and leave custom cookie collection disabled. These account settings cannot be set or
verified through the npm initializer. Body masking provides an explicit client override;
it does not replace the route exclusion policy. See Microsoft's
[masking documentation](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking),
[Consent V2 behavior](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2),
and [SPA implementation](https://github.com/microsoft/clarity/blob/master/packages/clarity-js/src/core/history.ts).

Run `npm run build`, `npm run lint`, `node --test tests/clarity.test.ts`, and
`node tests/clarity.browser.mjs`. The browser test uses the real official npm loader and
Microsoft's `clarity-js@0.8.77` runtime, with a local upload sink and all external analytics
requests intercepted. It checks actual Discover/Mutation recording events, Click/Scroll
heatmap events, masked text, consent, initialization, route exclusions and document teardown.
It does not substitute fake pageviews for capture verification.

For the optional browser test, use an existing Playwright installation via
`PLAYWRIGHT_MODULE_PATH`; `BROWSER_CHANNEL` defaults to `msedge`. Download the test-only
runtime with `npm pack clarity-js@0.8.77 --pack-destination node_modules/.tmp --ignore-scripts`,
extract it into `node_modules/.tmp/clarity-runtime`, or set `CLARITY_RUNTIME_PATH` to its
`package/build/clarity.js`. This does not add a production dependency.

The tests prove capture payloads locally, not dashboard ingestion. After deployment,
verify the project's Strict/Consent settings and inspect a consented plan-choice session
in Clarity Recordings and Heatmaps. The production service may sample sessions and batch
processing; no live user sessions or test data are submitted by this test suite.
