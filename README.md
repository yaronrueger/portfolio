# Portfolio

A single-page portfolio, built as a static site with Next.js.

## What is shown

- **Intro:** portrait, name, title and employer.
- **About:** bio paragraphs.
- **Experience:** career entries with start dates.
- **Education:** degrees and training with dates.
- **Skills:** skill levels as bars.
- **Projects:** public GitHub repositories, each expandable with summary, stack, year and links.
- **Contact:** email, GitHub and LinkedIn.

## Build

Requirements: Node.js 20.9 or newer.

```bash
npm ci
npm run build
```

The static site is written to `out/`.

Development server:

```bash
npm run dev
```

## Docker

```bash
docker build -t portfolio .
docker run -p 8080:8080 portfolio
```

The site is then available at http://localhost:8080.
