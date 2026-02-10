// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { defineConfig, passthroughImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.bobocai.win',
	output: 'static',
	image: {
		service: passthroughImageService(),
	},
	integrations: [mdx(), sitemap(), tailwind(), react()],
});
