# satwikdevs

Personal portfolio website hosted under my own domain. Used to showcase projects and host upcoming utility tools I'll build along the way.

Live: [satwikdevs.in](https://satwikdevs.in/)

## Tech Stack

- **Framework:** React 19 + TypeScript, built with Vite
- **Styling:** Tailwind CSS 4
- **Animation:** GSAP, Motion, Lenis (smooth scroll)
- **3D / WebGL:** Three.js, React Three Fiber, React Three Drei, React Three Postprocessing, Spline
- **Backend:** Express (local dev server), Google Gemini API (`@google/genai`)
- **Hosting:** Cloudflare
- **Domain:** Porkbun

## Prerequisites

- Node.js (LTS recommended)

## Setup

```bash
git clone https://github.com/satwikmishra1107/satwikdevs.git
cd satwikdevs
npm install
```

## Scripts

| Command           | Description                          |
|--------------------|---------------------------------------|
| `npm run dev`      | Starts the Vite dev server on port 3000 |
| `npm run build`    | Builds the app for production (`dist/`) |
| `npm run preview`  | Serves the production build locally    |
| `npm run lint`     | Type-checks the project (`tsc --noEmit`) |
| `npm run clean`    | Removes `dist/` and `server.js`        |

## Project Structure

```
satwikdevs/
├── public/          # Static assets
├── src/             # App source (components, scenes, shaders, etc.)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Deployment

The site is built with `npm run build` and deployed to Cloudflare, served under a custom domain purchased through Porkbun.

## License

No license specified — all rights reserved.
