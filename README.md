# Rahnumaa Dashboard

The dashboard for [rahnumaa.com](https://rahnumaa.com), built with React, TypeScript and Vite.

## Development

```bash
npm install
npm run dev
```

## How deployment works

1. Push to `main`.
2. A GitHub Action (`.github/workflows/deploy.yml`) runs `npm run build` and commits the built files to the `deploy` branch.
3. Hostinger's Git deployment (hPanel → Advanced → Git) pulls the `deploy` branch into `public_html`. Auto-deployment is triggered by a GitHub webhook.

`public/.htaccess` forces HTTPS and sends all routes to `index.html` so client-side routing works on Hostinger's shared hosting.
