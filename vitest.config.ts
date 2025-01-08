import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    reporters: process.env.GITHUB_ACTIONS === 'true' ? ['dot', 'github-actions'] : ['dot'],
    environment: 'jsdom',
  },
})
