# Pawikan

The personal portfolio of Meo Angelo Alcantara, a full-stack developer building AI automation. It shows who I am, my projects, and real measured proof of the work.

Live site: https://pawikan-lilac.vercel.app

## Stack

- Next.js (App Router), TypeScript and Tailwind CSS, with shadcn/ui components
- One MDX file per project, checked when the site builds
- Hosted on Vercel, which deploys each push to GitHub by itself

There is no database, backend or login. Every page is built ahead of time.

## Run it locally

You need Node.js 22.

```bash
npm install      # get the packages
npm run dev      # run the site at http://localhost:3000
npm run build    # make a production build, and check every project file
```

## Add a project in 10 minutes

1. Copy `PROJECT_TEMPLATE.mdx` to `content/projects/<short-name>.mdx`. The file name becomes the web address: `/projects/<short-name>`.
2. Replace every `[bracket]` with your own text. Use real numbers only.
3. Run `npm run build`. If something is missing, the build fails and tells you what.
4. Push to GitHub. Vercel puts it live.

## Hiding a project

Set `published: false` at the top of a project file. It then disappears everywhere: the home page, the project list and the sitemap, and its web address shows "not found". Change it to `true` and push to bring it back.

## Versions

Checked on 8 Nov 2026, from `package.json`:

| Package | Version |
| --- | --- |
| Next.js | 16.4.5 |
| React | 19.3.0 |
| Tailwind CSS | 4.3.4 (`package.json` allows any `^4`) |
