# patelaryan.dev

Personal portfolio of Aryan Patel, live at https://patelaryan.dev. Next.js static export served by one Cloudflare Worker.

## Run it

    npm install
    npm run build      # stamps the build, builds twice to measure page weight, checks the output
    npm test
    npx wrangler dev   # local Worker with the live panel
    npx wrangler deploy   # run `npm run build` right before this: the Worker bundles content/build.json

## Deploys

Every push to `main` runs `.github/workflows/deploy.yml`: typecheck, tests, the full build, then `wrangler deploy`. Pull requests run the same checks without deploying. The repository needs two Actions secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
