# Uninstall Feedback — SvelteKit

A production-ready uninstall feedback experience for SaaS products.
Captures the reason a user left with minimal friction and a polished, trustworthy UI.

---

## Quick Start

```bash
npm install
npm run dev
```

Then open: [http://localhost:5173/uninstall?email=you@example.com](http://localhost:5173/uninstall?email=you@example.com)

---

## Project Structure

```
src/
├── app.html                          # HTML shell (Google Fonts loaded here)
├── lib/
│   ├── config.js                     # ← Central config: variant, copy, reasons, product
│   ├── styles/
│   │   └── global.css                # Design tokens + reset + utilities
│   └── components/
│       ├── Button.svelte             # Gradient button (primary / secondary / ghost)
│       ├── Card.svelte               # Surface container with glow & shadow
│       └── RadioGroup.svelte         # Animated radio selection group
└── routes/
    ├── +layout.svelte                # Root layout (imports global CSS)
    ├── +page.svelte                  # Redirects / → /uninstall
    ├── uninstall/
    │   └── +page.svelte              # ← Main experience (form + success state)
    └── api/
        ├── save-email/
        │   └── +server.js            # POST /api/save-email
        └── update-feedback/
            └── +server.js            # POST /api/update-feedback
```

---

## Configuration

Edit **`src/lib/config.js`** to customize:

| Key               | Description                                      |
|-------------------|--------------------------------------------------|
| `VARIANT`         | `'professional'` \| `'emotional'` \| `'minimal'` |
| `PRODUCT`         | Name, logo emoji, support email, homepage URL    |
| `FEEDBACK_REASONS`| Array of selectable reasons (add/remove freely)  |
| `COPY`            | All UI text, per variant                         |
| `API`             | Endpoint paths                                   |

---

## URL Parameter

Pass the user's email as a query parameter:

```
/uninstall?email=user@example.com
```

The page will:
1. Read the email on mount
2. POST to `/api/save-email` to log the uninstall event
3. Show the feedback form
4. On submit → POST to `/api/update-feedback`
5. Transition to the success/thank-you state

---

## Backend Integration

Both API routes (`save-email` and `update-feedback`) ship with **console-log stubs**.
Replace `saveToStore()` and `updateRecord()` with your persistence layer.

### Google Sheets (recommended for quick setup)

```bash
npm install googleapis
```

Add to `.env`:
```
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
SHEET_ID=your_spreadsheet_id
```

Full integration instructions are in the JSDoc comments inside each `+server.js` file.

### Other options

- **Supabase**: `supabase.from('uninstalls').upsert({ ... })`
- **Prisma**: `prisma.uninstall.upsert({ where: { email }, update: ..., create: ... })`
- **Airtable**: Airtable API with base ID
- **Any REST API**: Replace the fetch stub

---

## Design System

All design tokens live in `src/lib/styles/global.css` as CSS custom properties.

| Token group     | Examples                                      |
|-----------------|-----------------------------------------------|
| Colors          | `--color-bg`, `--color-primary`, `--color-accent` |
| Typography      | `--font-display`, `--font-body`, `--text-*`   |
| Spacing         | `--space-1` … `--space-16`                    |
| Shadows         | `--shadow-sm` … `--shadow-xl`, `--shadow-glow` |
| Transitions     | `--transition-fast`, `--transition-spring`    |
| Border radius   | `--radius-sm` … `--radius-full`               |

---

## Animations

| Trigger          | Animation                          |
|------------------|------------------------------------|
| Page load        | `fly` (y: 24px, 500ms)             |
| Card entrance    | `scale` (0.95 → 1)                 |
| Radio selection  | CSS translate + dot scale bounce   |
| Textarea reveal  | `fly` (y: 10px, backOut easing)    |
| Success state    | `scale` + staggered `fly`          |
| Checkmark draw   | SVG stroke-dashoffset animation    |
| Button hover     | `scale(1.03) translateY(-1px)`     |

---

## Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start dev server               |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview production build       |
| `npm run check`   | Svelte type-check              |

---

## License

MIT — use freely in your product.
