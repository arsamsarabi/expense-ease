import { defineConfig } from 'tsup'

export default defineConfig(({ watch }) => ({
	entry: ['src/index.ts'],
	splitting: false,
	sourcemap: false,
	clean: true,
	minify: !watch,
}))
