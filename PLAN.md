# MemoScan AI File Structure

This document outlines the file layout created by the architect for MemoScan AI.

```
/
├── app/
│   ├── layout.tsx                # High-level layout with Tailwind styling themes
│   ├── page.tsx                  # Landing page with 'Login with Google' Auth Button
│   ├── auth/
│   │   └── callback/route.ts     # Supabase Auth OAuth callback route
│   ├── dashboard/
│   │   ├── page.tsx              # Main Smart Vault Dashboard UI
│   │   └── layout.tsx            # Authenticated layout protecting dashboard routes
│   └── api/
│       └── extract/route.ts      # Simulate OCR extraction (API call)
├── components/
│   ├── ui/                       # Tailwind utility components (Buttons, Inputs, Cards)
│   ├── auth/                     # Authentication components (Login Button)
│   └── dashboard/
│       ├── uploader.tsx          # Frictionless ingest area (Drag & Drop)
│       ├── smart-vault.tsx       # Search bar & Document grid
│       └── upcoming.tsx          # Automatic Reminders Sidebar
├── lib/
│   └── supabase/
│       ├── client.ts             # Browser client initialization
│       └── server.ts             # Server client initialization (for Next.js App router)
├── public/                       # Static public assets
├── tailwind.config.ts            # High-contrast 'Uncle-friendly' theme definitions
└── PLAN.md                       # Documentation file mapping out the project
```
