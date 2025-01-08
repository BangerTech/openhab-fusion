/// <reference types="vite/client" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: preprocess()
    })
  ],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    dedupe: ['svelte', 'svelte-routing']
  },
  optimizeDeps: {
    include: ['svelte-routing']
  }
}) 