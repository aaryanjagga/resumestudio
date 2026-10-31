# Resume Studio — Implementation Plan

A minimalist, local-first, privacy-respecting resume builder engineered for speed, clean typography, and zero-compromise browser persistence. Users can manage multiple resumes in IndexedDB, use an honest assisted LinkedIn importer, customize across six distinctive templates, test page overflow in a live A4 preview, and export through both instant client-side PDF download and high-fidelity browser print.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed for the implementation:
>
> - **Initial Resume State**: New resumes will initialize pre-filled with a realistic, high-caliber sample profile (Senior Full-Stack Engineer) to provide immediate visual feedback across templates and editable guidance. Users can clear fields anytime with a single click.
> - **PDF Export Strategy**: Dual-mode export offering both a **one-click instant client-side PDF download** (A4 formatted document generated in the browser) and an optimized **system print dialog** (100% vector typography with print CSS).
> - **Aesthetic & Accent Palette**: Sophisticated Modern Slate canvas with a Deep Indigo accent (`#4F46E5` / `#3730A3`) and clean monochrome typography, supplemented by user-switchable accent themes in the editor (Indigo, Slate, Emerald, Navy, Crimson, Rose).

---

## 1. Overview & Core Concept

- **What It Does**: A completely client-side resume development workspace allowing job seekers to draft, refine, reorganize, and export resumes without creating an account, paying subscription fees, or sending personal data to a remote server.
- **Target Audience**: Software engineers, designers, executives, product managers, and modern knowledge workers seeking distraction-free resume authoring with layout integrity.
- **Key Value**: Zero telemetry, instantaneous local autosave via IndexedDB, six distinct structural templates (Classic ATS, Modern, Developer, Executive, Compact, Editorial), transparent LinkedIn URL assisted-import, and real-time A4 overflow detection.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Landing & Exploration**: Welcoming hero explaining the local-first ethos, live interactive template showcases, feature highlights, and direct CTAs to start or inspect templates.
2. **Resume Dashboard**: Grid and list views of user-owned resumes stored in IndexedDB. Instant creation, duplication, renaming, deletion with confirmation modal, last-edited timestamps, search filtering, and JSON backup/restore.
3. **Studio Editor & Live Preview (Split Workspace)**:
   - **Left Panel (Editor Tabs)**: Personal Details, Experience, Education, Skills, Projects, Certifications, Section Visibility & Order, and LinkedIn Import helper.
   - **Right Panel (Live Document)**: Scaled A4 sheet preview with real-time updates, page break boundary guides, overflow warning indicator, template switcher, and dual export buttons.
4. **Assisted LinkedIn Import Flow**: Dedicated modal validating LinkedIn profile URLs (`linkedin.com/in/...`), explaining LinkedIn's scraping restrictions with total honesty, and providing a structured assisted-paste parser that maps profile text or JSON into resume sections seamlessly.
5. **JSON Backup & Recovery**: One-click encrypted or clean JSON export of all resumes, plus safe transactional JSON import with duplicate ID resolution and schema validation.

### Visual Identity & Theme Tokens
- **Design Philosophy**: Minimalist Swiss-inspired typography, generous spatial margins, restrained border hairlines (`border-slate-200/80`), and zero decorative slop (no fake AI scoreboards, no floating badges, no pulsing dots).
- **Color Discipline (60-30-10)**:
  - 60% Canvas: Crisp Pure White (`#FFFFFF`) / Subdued Slate Canvas (`#F8FAFC`).
  - 30% Structural Surfaces: Neutral cards, clean border rules (`#E2E8F0`), and high-legibility dark slate typography (`#0F172A`).
  - 10% Intentional Accent: Deep Indigo (`#4338CA` to `#4F46E5`), switchable per-resume to Classic Navy, Forest Emerald, Crimson, or Minimalist Charcoal.
- **Typography**:
  - Headings & Brand: Plus Jakarta Sans / Outfit for crisp display clarity.
  - Body Prose: DM Sans / Public Sans for effortless dense legibility.
  - Telemetry & Dates: Tabular figures (`tabular-nums`) and clean unboxed metadata with `·` separators.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Pure Client-Side Persistence via IndexedDB (`idb`)
- **Chosen Approach**: Store all resume documents in an IndexedDB object store with an auto-incremented revision tracker and debounced 500ms autosave.
- **Why**: Resumes are sensitive personal documents. Local-first storage guarantees complete privacy, works offline, and requires zero cloud infrastructure.
- **Trade-Off**: Clearing browser cache or switching devices does not auto-sync; we prominently provide versioned JSON backup/restore and explanatory warning banners.

### Decision 2: Honest Assisted LinkedIn Importer
- **Chosen Approach**: Validates LinkedIn URL format, respects LinkedIn terms by avoiding unauthorized scraping, and provides an assisted-paste parser for profile text/PDF downloads.
- **Why**: Scraping LinkedIn client-side is blocked by CORS and LinkedIn bot protections. Misleading users with fake scraping creates broken experiences; an honest, guided import workflow delivers real value without fragility.

### Decision 3: Six Dedicated Template Renderers on a Shared Schema
- **Chosen Approach**: A centralized, Zod-validated TypeScript resume model (`ResumeData`) rendered by six bespoke components:
  1. *Classic ATS*: Ultra-clean single-column, standard headings, maximum machine readability.
  2. *Modern*: Clean two-column sidebar layout with balanced hierarchy and subtle accent headers.
  3. *Developer*: Highlights GitHub/portfolio links, categorized tech stack badges, and deep project details.
  4. *Executive*: Distinguished serif display headings, strategic leadership summaries, and metrics focus.
  5. *Compact*: High-density layout optimized for single-page constraints without illegible font shrinkage.
  6. *Editorial*: Refined asymmetrical typographic styling with literary elegance.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Resume Studio Client                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌─────────────────────┐    ┌─────────────────────────────────────┐   │
│   │   React Router      │    │  Global State / Autosave Hook       │   │
│   │   - / (Landing)     │───▶│  - Active Resume State              │   │
│   │   - /resumes (Dash) │    │  - Debounced (500ms) IDB Writer     │   │
│   │   - /editor/:id     │    │  - Revision Guard & Conflict Notice │   │
│   └─────────────────────┘    └──────────────────┬──────────────────┘   │
│                                                 │                      │
│                                                 ▼                      │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     IndexedDB Storage Layer                    │   │
│   │    - Object Store: 'resumes' (Key: id, Index: updatedAt)       │   │
│   │    - Migration Engine: Schema v1 with version tracking         │   │
│   │    - Backup Engine: JSON export/import with Zod validation     │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                 │                      │
│         ┌───────────────────────────────────────┴───────────────┐      │
│         ▼                                                       ▼      │
│   ┌───────────────────────────┐           ┌────────────────────────┐   │
│   │   Editor Sub-Panels       │           │   A4 Preview Canvas    │   │
│   │   - Personal Info         │           │   - Scale & Zoom       │   │
│   │   - Experience & Bullets  │           │   - Overflow Detector  │   │
│   │   - Education & Skills    │           │   - Template Selector  │   │
│   │   - Projects & Certs      │           │   - Accent Customizer  │   │
│   │   - Reordering & Toggles  │           └───────────┬────────────┘   │
│   └───────────────────────────┘                       │                │
│                                                       ▼                │
│                                           ┌────────────────────────┐   │
│                                           │  Export Engine         │   │
│                                           │  1. Client-Side PDF    │   │
│                                           │  2. Browser Print CSS  │   │
│                                           └────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Schema & Data Model
- `Resume`:
  - `id`: UUID string
  - `title`: User-friendly document label
  - `createdAt`, `updatedAt`: ISO strings
  - `schemaVersion`: `1`
  - `templateId`: `'classic-ats' | 'modern' | 'developer' | 'executive' | 'compact' | 'editorial'`
  - `accentColor`: Hex color code
  - `fontSize`: `'sm' | 'base' | 'lg'`
  - `sectionOrder`: Array of section IDs (`['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications']`)
  - `sectionVisibility`: Record mapping section ID to boolean
  - `personal`: Contact information, professional headline, summary, links (LinkedIn, GitHub, Portfolio)
  - `experience`: Array of items with position, company, location, date ranges, current flag, and bullet point items
  - `education`: Array of items with school, degree, field, dates, honors
  - `skills`: Categorized skill items
  - `projects`: Project name, role, dates, tech list, link, description bullets
  - `certifications`: Name, issuer, date, credential link

### Dual Export Strategy
1. **Direct Browser Print (`window.print()`)**:
   - High-fidelity vector PDF with exact CSS `@media print` rules, A4 page size (`@page { size: A4; margin: 0; }`), background colors enabled, and cleanly isolated print preview container.
2. **Client-Side PDF Generation**:
   - Instant direct file download (`Resume_<Name>.pdf`) using html2pdf / jsPDF rendering the preview element with crisp A4 pixel-to-millimeter coordinates.
