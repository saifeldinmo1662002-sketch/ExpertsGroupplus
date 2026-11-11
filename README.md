# Experts Group Plus — Bilingual Website + Admin CMS

This package contains the public Experts Group Plus website, a protected admin portal, a Node.js/Express API, and PostgreSQL persistence designed for Railway.

## Included capabilities

- Public website retains the existing Experts Group Plus visual identity and footer social links.
- Language-specific routes: `/en/`, `/ar/`, and matching routes for About, Training, Consultation, Operations, BPO and Contact.
- Per-route titles/descriptions, canonical URLs, `hreflang`, Open Graph metadata, Organization JSON-LD, `robots.txt` and `sitemap.xml`.
- Arabic typography/direction support and Modern Standard Arabic refinements across 23 existing translation entries, plus localized Arabic SEO metadata.
- Admin portal at `/admin` (linked from the public footer).
- Admin authentication with bcrypt password hashing, HTTP-only session cookies stored in PostgreSQL, login rate limiting and same-origin mutation checks.
- Owner-controlled approval for additional admin accounts. A new user can request access, but remains pending until the owner approves them.
- Add/edit/delete reviews, operations service cards and consultation options.
- Store contact submissions in PostgreSQL, view them in the portal and update their pipeline status.
- Edit CTA/button link destinations from the portal. Use **Scan website buttons** in the Button Links section to import public anchors/navigation buttons into the editable link list.
- Admin password change screen.

## Railway deployment

### 1. Create the Railway project

1. Create a new Railway project and add a **PostgreSQL** service.
2. Push the **contents of this folder** to the repository root (so `package.json` and `src/` are at the top level). If you keep the `egp-admin-package/` wrapper folder in your repository, set Railway Service → Settings → Root Directory to `/egp-admin-package`. Do not leave Railway pointed at the repository root while the app files are nested one folder below it.
3. In the web service Variables, add the variables below. Railway should provide `DATABASE_URL` when the PostgreSQL service is attached/referenced.

Required variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Railway PostgreSQL connection URL (use the internal/private URL when app and DB are in the same project) |
| `SESSION_SECRET` | A cryptographically random secret, at least 32 characters |
| `SITE_URL` | Your production canonical URL, e.g. `https://www.expertsgp.com` |
| `ADMIN_EMAIL` | Your first platform-owner email |
| `ADMIN_PASSWORD` | A unique password of at least 14 characters |
| `NODE_ENV` | `production` |

`PORT` is supplied by Railway automatically.

Generate a strong session secret locally with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 2. Deploy

The start command is already configured as `npm start`. It runs the idempotent database initializer and then starts the web server. The initializer creates the tables, seeds the existing website reviews/services/consultation options, and provisions the first owner account from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

The app exposes `/health` for Railway health checks. `railway.json` contains the deployment settings.

### 3. Connect your domain

In Railway, add your production domain to the web service and configure DNS as Railway instructs. Set `SITE_URL` to the exact canonical version (including `www` if that is the version you choose). Point both language routes at the same service.

### 4. First login and admin approval

1. Open `https://YOUR-DOMAIN/admin`.
2. Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from Railway Variables.
3. Go to **Admin approvals** to approve or reject access requests.
4. Other users can choose **Request access** on the login page. They cannot enter the portal until approved.
5. Change the initial password from **Security** after the first login. Update Railway's `ADMIN_PASSWORD` too if you want the bootstrap variable to remain aligned with the current owner password (the initializer only runs at service start).

Do not put credentials in this repository, public HTML, or screenshots. The ZIP intentionally contains no default/shared admin password.

## Local development

```bash
cp .env.example .env
# Fill DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD
npm install
npm start
```

Open `http://localhost:3000/en/` and `http://localhost:3000/admin`.

## Database tables

- `admins`: administrator credentials, approval state and role.
- `content_items`: reviews, operations services and consultation options (JSONB content).
- `site_links`: editable link destinations keyed by stable button/link identifiers.
- `contact_submissions`: persistent inquiry records and sales status.
- `user_sessions`: PostgreSQL-backed Express sessions (created by the session store).

## Important production notes

- The initial owner is created from environment variables. The owner can approve additional administrators; there is no public self-approval path.
- Contact inquiries are saved in PostgreSQL. This package does not send email notifications; add an SMTP/transactional email provider if the sales team also needs inbox alerts.
- Review/testimonial wording and performance claims are carried over from the supplied website. Verify client permission and the accuracy of every claim before publishing.
- The link manager imports anchors and navigation buttons from the public website. Review imported mappings and use the exact key shown in the portal when editing a destination.
- Before launch, test all forms, every route, mobile/desktop layouts, Arabic content, database backups and owner recovery procedures on the Railway deployment.

## Project layout

```text
public-site.html       Original public website, with bilingual route integration
public/integration.js  CMS content, URL routing, lead submission and link integration
public/admin.html      Admin portal interface
src/server.js          Express API, auth, content, contact and SEO routes
src/init-db.js         PostgreSQL schema, seed content and owner bootstrap
src/seed-content.json  Existing website content used for initial seed
railway.json           Railway build/deploy configuration
.env.example           Environment variable template
```
