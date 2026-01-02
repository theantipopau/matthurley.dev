import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://matthurley.dev',
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  },
  compressHTML: true,
  devToolbar: {
    enabled: false
  }
});
