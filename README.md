# Docvai Dashboard (Netlify + Vite + CommonJS Functions)

Updated on 2025-08-28

## Quick start

```bash
npm i
npm run dev
```

Deploy on Netlify. Set the following environment variables in Netlify:

- `JWT_SECRET`
- `DEMO_USERS` (e.g. `admin@docvai.com:admin123;...`)
- `DATABASE_URL` (Neon)
- `BOLNA_API_KEY`
- `BOLNA_API_BASE` (optional, defaults to `https://api.bolna.ai`)
- `DEFAULT_TENANT_ID` (optional, defaults `t_demo`)

**Note**: Functions are CommonJS (no `"type":"module"` in package.json) to avoid import/require mismatches.
