# Deployment (Cloudflare Pages)

## Build settings
- Build command: `npm run build`
- Build output directory: `dist`

## Environment variables
Set these in Cloudflare Pages project settings:
- `RESEND_API_KEY` (required)
- `CONTACT_TO_EMAIL` (required)
- `CONTACT_FROM_EMAIL` (optional, must be a verified sender in Resend)

## Notes
- The contact form posts to `/api/contact` which maps to `functions/api/contact.js` on Cloudflare Pages.
- If you do not have a custom domain, Resend requires a verified sender domain to avoid delivery issues.
