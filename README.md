# Gaenr Website

Gaenr is a Vite + React + TypeScript website for managed freelancing and outsourcing services in Bangladesh.

## 1. Run the website on localhost

### Install Node.js

Install the **LTS version of Node.js** from [nodejs.org](https://nodejs.org/). After installation, open PowerShell and check:

```powershell
node --version
npm --version
```

### Open this project folder

```powershell
cd "D:\Work Station\Gaenr\Gaenr\Gaenr Tech\Gaenr Website + Operations"
```

### Install dependencies

Run this once after downloading or cloning the project:

```powershell
npm install
```

### Start local development

```powershell
npm run dev
```

Open the URL shown in the terminal, normally:

```text
http://localhost:3000
```

Keep the terminal open while coding. Vite will automatically update the browser when you save source files. Press `Ctrl+C` in the terminal to stop the local server.

## 1.1 Run the self-hosted backend

The admin data is persisted through the Node API in `server.js`, not only in browser storage. The API stores the shared state in `data/gaenr-state.json` and mirrors the existing application storage keys, including branding, experts, categories, avatars, tasks, feedback, applications, and operations data.

Start the backend in a second terminal:

```powershell
npm.cmd run server
```

Then start the Vite frontend with `npm.cmd run dev`. Vite proxies `/api/*` to `http://127.0.0.1:8787` during local development. On a hosted server, run `npm.cmd run build`, run `npm.cmd run server`, serve the generated `dist/` through the same Node process, and set `VITE_API_URL` to the public API origin before building when the API is on a separate domain.

The backend is intentionally self-hostable and has no third-party database dependency. For production, protect the server behind HTTPS, a firewall/reverse proxy, and an authentication layer before exposing write access publicly. Back up `data/gaenr-state.json` regularly.

## 1.2 Deploy the shared API on Vercel

Vercel does not keep a Node process or local JSON file running between requests. The production API is therefore implemented in `api/state.js` as a Vercel Serverless Function and uses a Neon database connected through the Vercel Marketplace.

1. In Vercel, open the project and select **Storage → Create → Neon Postgres** (or add the Neon integration from the Marketplace).
2. Connect the database to this Vercel project and make sure `DATABASE_URL` is available in **Project Settings → Environment Variables** for Preview and Production.
3. Push this repository to GitHub and wait for a new Vercel deployment.
4. After deployment, open `https://YOUR-DOMAIN/api/state`. It should return JSON with `state` and `updatedAt`.
5. The frontend automatically uses the same-origin `/api/state`; no `VITE_API_URL` is needed when the API function is deployed in the same Vercel project.

Use `https://YOUR-DOMAIN/api/health` as a quick deployment check. It must return JSON with `ok: true`; if it returns the website HTML, the API files were not included in the deployment or the deployment is still serving an older commit.

The first request creates the `gaenr_app_state` table automatically. Do not expose `DATABASE_URL` in frontend code or commit it to GitHub.

### Test a production build locally

```powershell
npm run build
npm run preview
```

The first command creates `dist/`; the second serves the production build locally.

## 2. Upload the project to GitHub

1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository**.
3. Use a name such as `gaenr-website`.
4. Keep it **Private** unless you intentionally want the source code public.
5. Do not add another README, `.gitignore`, or license because this project already contains them.
6. Create the repository.
7. Open PowerShell in this project folder and run:

```powershell
git init
git add .
git commit -m "Prepare Gaenr website for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gaenr-website.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and use the repository URL shown by GitHub. If GitHub asks for authentication, complete its browser sign-in or use GitHub Desktop.

Never commit real passwords, API keys, or `.env` files. This project ignores `.env*` files except `.env.example`.

## 3. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with the same GitHub account.
2. Click **Add New... → Project**.
3. Select the `gaenr-website` repository and click **Import**.
4. Use these settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `.`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.
6. Vercel will give you a temporary `vercel.app` URL. Open it and test the home page, service pages, and a direct page refresh.

The included `vercel.json` makes client-side routes work when someone opens or refreshes a URL such as `/services/graphics-design`.

## 4. Future live coding workflow

After Vercel is connected to GitHub, use this repeatable workflow:

```powershell
cd "D:\Work Station\Gaenr\Gaenr\Gaenr Tech\Gaenr Website + Operations"
npm run dev
```

Edit files in `src/`, check the result at `http://localhost:3000`, then save and publish:

```powershell
git status
git add .
git commit -m "Describe the change"
git push
```

Every push to `main` automatically starts a new Vercel deployment. Vercel keeps previous deployments, so you can roll back if needed.

For safer changes, create a branch on GitHub, test locally, and open a Pull Request. Vercel creates a preview URL for that branch before it reaches the live site.

## 5. Important folders

- `src/`: React pages, components, data, and styles
- `public/`: public images, sitemap, robots rules, and AI-readable site information
- `index.html`: global SEO metadata and structured data
- `vercel.json`: Vercel route fallback configuration
- `package.json`: scripts and dependencies
- `.env.example`: safe example environment variable names

## 6. Useful commands

| Purpose | Command |
|---|---|
| Start localhost | `npm run dev` |
| Type-check source | `npm run lint` |
| Build for Vercel | `npm run build` |
| Preview production build | `npm run preview` |
| See changed files | `git status` |
| Publish changes | `git add . && git commit -m "message" && git push` |
