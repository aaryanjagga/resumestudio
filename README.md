# Resume Studio

**Professional resumes. Private by design.**

Resume Studio is a minimalist, privacy-focused resume builder built with React, TypeScript, and Vite. It helps users create, customize, preview, and export professional resumes directly in their browser.

Designed around local-first storage, clean typography, and a streamlined workflow, Resume Studio keeps resume management simple without requiring user accounts or a remote database.

## Features

### Resume Templates

Choose from six purpose-built templates:

- **Classic ATS** — A clean, single-column layout designed with applicant tracking system compatibility in mind.
- **Modern Clean** — A balanced, contemporary design with subtle accent details.
- **Developer Tech** — A technical layout highlighting projects, GitHub profiles, portfolio links, and engineering achievements.
- **Executive Brief** — Refined serif typography, strategic summaries, and leadership-focused presentation.
- **Compact Density** — A space-efficient layout that prioritizes readable content.
- **Editorial Journal** — An asymmetrical editorial design with distinctive typography and visual hierarchy.

### Live Preview & Customization

- Preview resume changes in real time.
- Adjust preview zoom from 50% to 130%.
- Use fit-to-screen viewing.
- Monitor content height against an A4 page boundary.
- Choose from six accent palettes:
  - Deep Indigo
  - Modern Slate
  - Classic Navy
  - Forest Emerald
  - Crimson
  - Warm Charcoal

### PDF Export

Export resumes using either of two methods:

- **PDF Download:** Generate a downloadable PDF using `html2pdf.js`.
- **Browser Print:** Use native browser printing with print-specific CSS for printing or saving as PDF.

### Local-First Data Management

- Automatically save multiple resumes in browser storage.
- Use IndexedDB for persistent local data storage.
- Track revisions and versions.
- Export versioned JSON backups.
- Import validated JSON backups using Merge or Replace All modes.
- Clear local resume data with safety confirmation.

### Privacy

- No mandatory user accounts.
- No required remote database.
- Resume data remains in browser storage during normal operation.
- Portable JSON backups provide a way to transfer or restore data.

Privacy depends on the application's actual implementation and its dependencies. Review any third-party integrations before making stronger guarantees about network activity.

---

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4 |
| Local Database | IndexedDB |
| Storage Library | `idb` |
| Schema Validation | Zod |
| PDF Generation | `html2pdf.js` |
| Icons | Lucide React |
| Testing | Vitest, React Testing Library, JSDOM, `fake-indexeddb` |

---

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/aaryanjagga/resumestudio.git
cd resumestudio
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

Open the local URL printed in the terminal to use Resume Studio.

---

## Development Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server |
| `npm test` | Run the configured test suite |
| `npm run lint` | Run the configured lint or type-checking script |
| `npm run build` | Generate the production build |

Run the production build before deployment to catch compilation and type-checking errors.

---

## Deployment

Resume Studio is designed as a client-side application and can be deployed to static hosting platforms.

### Build for Production

```bash
npm run build
```

Vite generates the production assets in the `dist/` directory.

### Supported Hosting Options

- [Render Static Sites](https://render.com/docs/static-sites)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- GitHub Pages
- Any compatible static web server

### Render Deployment

For a Render Static Site, use these settings:

| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

A Static Site does not require a Start Command.

If deploying through a Web Service instead, configure a suitable server command and ensure it listens on the port assigned by Render.

### Client-Side Routing

If the application uses client-side routes, configure the hosting provider to serve `index.html` as a fallback for valid application routes.

**Netlify — `_redirects`**

```text
/* /index.html 200
```

**Vercel — `vercel.json`**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

For GitHub Pages, configure Vite's `base` option when deploying under a repository subpath and implement an appropriate SPA fallback if needed.

---

## Data Storage & Backups

Resume data is stored in the browser's IndexedDB database.

Keep these points in mind:

- Browser storage is specific to the browser profile and device.
- Clearing site data may permanently remove locally saved resumes.
- Switching devices does not automatically transfer local data.
- Export JSON backups regularly to protect your work.
- Keep backup files in a secure location because they may contain personal information.

---

## Project Structure

The following is an illustrative overview; the actual directory structure may vary.

```text
resume-studio/
├── public/
├── src/
├── tests/
├── index.html
├── package.json
├── bun.lock
├── tsconfig.json
├── vite.config.ts
├── metadata.json
├── implementation_plan.md
└── README.md
```

---

## Project Principles

Resume Studio is built around four core principles:

1. **Privacy** — Keep resume management local-first.
2. **Simplicity** — Make creating and managing resumes straightforward.
3. **Readability** — Prioritize clear typography and useful layouts.
4. **User Control** — Support portable backups and local data management.

---

## License

No license information is specified here. Add a `LICENSE` file and update this section before distributing the project under an open-source license.

---

**Resume Studio — Create confidently. Customize effortlessly. Keep your data close.**

