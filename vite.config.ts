import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {createHash} from 'crypto';
import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {defineConfig, type Connect, type Plugin} from 'vite';

// On build, replaces dist/_redirects so `/resume` redirects to `/Resume_Latex.pdf?v=<hash of the PDF>`.
// Every new resume gets a new URL, so no browser, PDF viewer or CDN can serve an old copy from cache,
// while the `/resume` link people already have keeps working.
function resumeVersionedRedirect(): Plugin {
  let outDir = 'dist';
  return {
    name: 'resume-versioned-redirect',
    apply: 'build',
    configResolved: (config) => void (outDir = path.resolve(config.root, config.build.outDir)),
    closeBundle() {
      const pdf = readFileSync(path.resolve(__dirname, 'public/Resume_Latex.pdf'));
      const version = createHash('sha256').update(pdf).digest('hex').slice(0, 10);
      writeFileSync(path.join(outDir, '_redirects'), `/resume /Resume_Latex.pdf?v=${version} 302\n`);
    },
  };
}

// Mirrors the `/resume` rewrite in public/_redirects so it also works in dev and preview
function resumeRewrite(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url === '/resume' || req.url === '/resume/') req.url = '/Resume_Latex.pdf';
    next();
  };
  return {
    name: 'resume-rewrite',
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), resumeRewrite(), resumeVersionedRedirect()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
