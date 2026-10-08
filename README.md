# witharyan

Personal portfolio of Aryan Patel, live at https://witharyan.tech. Next.js static export served by one Cloudflare Worker.

## Run it

    npm install
    npm run build      # stamps the build, builds twice to measure page weight, checks the output
    npm test
    npx wrangler dev   # local Worker with the live panel
    npx wrangler deploy   # run `npm run build` right before this: the Worker bundles content/build.json

`design-preview/` holds the static sketches from the design phase.
