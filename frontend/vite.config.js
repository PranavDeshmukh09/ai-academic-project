import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '#minpath': path.resolve(__dirname, 'node_modules/vfile/lib/minpath.browser.js'),
      '#minproc': path.resolve(__dirname, 'node_modules/vfile/lib/minproc.browser.js'),
      '#minurl': path.resolve(__dirname, 'node_modules/vfile/lib/minurl.browser.js'),
    },
  },
})
