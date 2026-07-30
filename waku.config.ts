import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'waku/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  vite: {
    environments: {
      rsc: {
        optimizeDeps: { include: ['hono/tiny'] },
        build: { rolldownOptions: { platform: 'neutral' } as never },
      },
    },
    plugins: [
      tailwindcss(),
      cloudflare({
        // `childEnvironments` must list "ssr". Without it the SSR module runner is never
        // initialised and every render dies in renderHtml — with an error that names the
        // fix, which is how this was found.
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        inspectorPort: false,
      }),
    ],
    resolve: {
      alias: { '@': path.resolve(dirname, 'src') },
    },
  },
});
