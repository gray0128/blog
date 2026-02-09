// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { defineConfig, passthroughImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	output: 'server',
	adapter: cloudflare(),
	image: {
		service: passthroughImageService(),
	},
	integrations: [mdx(), sitemap(), tailwind(), react()],
});
