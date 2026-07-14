# Wodiart — Start a Project

The client onboarding and project intake site for Wodiart, a brand identity studio in
Abuja, Nigeria. This is where the "Start a project" link in the Instagram bio points.

A single page: hero, an intake form that emails submissions to you, and direct contact
options (email / phone / WhatsApp). No database — form submissions are sent straight to
your inbox via [Resend](https://resend.com).

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Resend** for transactional email
- Deployed on **Vercel**

## 1. Install and run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The form will fail to send until
you configure Resend (step 2) — you'll see an inline error, which is expected locally
without real credentials.

## 2. Connect Resend

1. Create a free account at [resend.com](https://resend.com).
2. **API Keys** → create a key → copy it into `RESEND_API_KEY`.
3. **Domains** → add and verify the domain you want to send from (e.g. `wodiart.com`).
   Until a domain is verified, you can send test emails using Resend's shared
   `onboarding@resend.dev` sender — set `INTAKE_FROM_EMAIL="Wodiart <onboarding@resend.dev>"`
   for local testing, then switch to your own domain once verified.
4. Set `INTAKE_TO_EMAIL` to the inbox that should receive project requests.
5. Set `INTAKE_FROM_EMAIL` to a verified sender on your domain, e.g.
   `"Wodiart <intake@wodiart.com>"`.

Each submission arrives with the client's email set as **reply-to**, so you can hit
reply and it goes straight to them.

### Using Formspree instead

If you'd rather not manage an API key, [Formspree](https://formspree.io) is a drop-in
alternative: create a form there, then replace the `fetch("/api/intake", ...)` call in
`components/IntakeForm.tsx` with a POST to your Formspree endpoint
(`https://formspree.io/f/your-form-id`), and delete `app/api/intake/route.ts`. Everything
else — validation, the character counter, the confirmation state — stays the same.

## 3. Logo

The real Wodiart mark lives in `public/logo/`:

- `wodiart-mark-white.png` / `wodiart-mark-black.png` — mark only, no wordmark
- `wodiart-logo-white.png` / `wodiart-logo-black.png` — full lockup (mark + wordmark)

`components/WodiartMark.tsx` renders the white mark-only PNG next to a coded
"WODIART" wordmark (so the wordmark stays crisp and matches the site's type
elsewhere), since the whole site sits on the dark `ink` background. If you ever add a
light-background section, swap in the black variant there.

## 4. Fill in real contact details

Edit `lib/constants.ts`:

```ts
export const CONTACT = {
  email: "hello@wodiart.com",
  phoneDisplay: "+234 000 000 0000",
  phoneHref: "+2340000000000", // digits only, used in the tel: link
  whatsappDisplay: "+234 000 000 0000",
  whatsappNumber: "2340000000000", // digits only, no +, used in the wa.me link
  instagramHandle: "@wodiart",
  instagramUrl: "https://instagram.com/wodiart",
};
```

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Add New Project** → import the GitHub repo.
3. Framework preset: **Next.js** (auto-detected). No build command changes needed.
4. Add environment variables under **Project Settings → Environment Variables**:
   - `RESEND_API_KEY`
   - `INTAKE_TO_EMAIL`
   - `INTAKE_FROM_EMAIL`
5. Deploy. Every push to the connected branch redeploys automatically.

### Pointing your domain at it

1. In the Vercel project, go to **Settings → Domains** and add your domain (e.g.
   `start.wodiart.com` or `wodiart.com`).
2. Vercel shows the DNS records to add. At your domain registrar:
   - For an apex domain (`wodiart.com`), add the **A record** Vercel gives you.
   - For a subdomain (`start.wodiart.com`), add the **CNAME record** Vercel gives you.
3. Wait for DNS to propagate (usually minutes, sometimes longer) — Vercel's Domains tab
   shows a green check once it's verified and HTTPS is issued automatically.
4. Update the "Start a project" link in the Instagram bio to point at the new domain.
5. Update `metadataBase` in `app/layout.tsx` to match your final domain, so social share
   previews resolve correctly.

## Form behaviour

- Project details require a minimum of 50 characters, enforced with a live counter and
  a disabled submit button until met.
- The budget question defaults to "Help me understand what this costs." Selecting
  "I have a budget in mind" reveals a range dropdown, which becomes required.
- On success, the form is replaced in place with a confirmation message — no page
  reload, no redirect.
- All interactive elements (checkboxes, radios, selects, the submit button) are native
  form controls, so keyboard navigation and screen readers work without extra ARIA
  wiring.

## Project structure

```
app/
  layout.tsx          Fonts, global metadata
  page.tsx             Composes Hero, IntakeForm, DirectContact, Footer
  globals.css          Tailwind layers, shared field styles
  api/intake/route.ts  Server route that validates + emails submissions via Resend
components/
  Hero.tsx             Headline, positioning line, scroll cue
  IntakeForm.tsx        The intake form and its validation/submit logic
  DirectContact.tsx     Email / phone / WhatsApp links
  Footer.tsx            Mark, tagline, Instagram link
  WodiartMark.tsx        Renders the logo mark + coded wordmark
lib/
  constants.ts          Contact details + form option lists (single source of truth)
public/logo/            Logo PNGs (mark-only and full lockup, black and white)
```
