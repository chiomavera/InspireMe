import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      "inspireme-by-vera.netlify.app",
      "deploy-preview-*.netlify.app",
      "devserver-dev--inspireme-by-vera.netlify.app",
    ],
  },
});
