# ISAC registration site

Static site for GitHub Pages. Data is stored in a Google Sheet through the Apps Script in `backend/Code.gs`.

## Publish on GitHub Pages
1. Create a new repository on GitHub (for example `isac`), then upload everything in this folder to it (including the hidden `.nojekyll` file).
2. In the repository open Settings > Pages. Under Build and deployment choose Deploy from a branch, branch `main`, folder `/ (root)`, then Save.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Connect the Google Sheet
1. Open the Google Sheet, then Extensions > Apps Script. Paste `backend/Code.gs` over the existing code and set `ADMIN_PASSWORD`.
2. Deploy > Manage deployments > New version (Web app, execute as you, access Anyone).
3. Copy the web app URL into `js/config.js`, commit, and the site is connected.
4. Admin panel: open `<site URL>/#admin`.

Note: the repository and site are public. Never put the admin password in the site files; it lives only in the Apps Script.
