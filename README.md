# Front-End-V

## Google Search Console verification

Deploys are built from the `client/` app. To verify the site in Google Search Console:

1) In the Search Console property setup, choose the HTML meta tag method and copy the verification token value.  
2) Add an environment variable in Vercel (or your hosting) named `VITE_GSC_VERIFICATION` with that token.  
3) Redeploy. The app injects `<meta name="google-site-verification" content="...">` into every page head via `client/src/components/SEO.tsx`, which Search Console will detect.
