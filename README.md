# Front-End-V

## Google Search Console verification

Deploys are built from the `client/` app. To verify the site in Google Search Console:

1) In the Search Console property setup, choose the HTML meta tag method and copy the verification token value.  
2) Add an environment variable in Vercel (or your hosting) named `VITE_GSC_VERIFICATION` with that token.  
3) Redeploy. The app injects `<meta name="google-site-verification" content="...">` into every page head via `client/src/components/SEO.tsx`, which Search Console will detect.

### If you prefer the HTML file method

The build now auto-generates the Google verification HTML file when these env vars are present at build time:

- `GSC_HTML_FILENAME` – e.g., `google12345abcde.html` (must end with `.html`)
- `GSC_HTML_CONTENT` – the exact contents from the downloaded verification file (e.g., `google-site-verification: google12345abcde.html`)

Set both env vars in your deployment provider and redeploy. The file will be emitted to `client/public` and served at `https://<your-domain>/<filename>`, satisfying Search Console’s HTML file check.
