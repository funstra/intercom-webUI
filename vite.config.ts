import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createHtmlPlugin } from "vite-plugin-html"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), viteSingleFile(), createHtmlPlugin({ minify: true })],
  resolve: {
    alias: [
      {
        find: "$lib",
        replacement: "/src/lib"
      },
      {
        find: "$components",
        replacement: "/src/lib/components"
      },
      {
        find: "$util",
        replacement: "/src/util"
      },
    ]
  }
})
