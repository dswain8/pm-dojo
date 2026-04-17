import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    // Serve progress files (profile.json, active-session.json, sessions.jsonl)
    {
      name: 'serve-progress',
      configureServer(server) {
        const progressDir = path.resolve(__dirname, '../progress')
        server.middlewares.use('/progress', (req, res, next) => {
          const filePath = path.join(progressDir, req.url || '')
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Access-Control-Allow-Origin', '*')
            fs.createReadStream(filePath).pipe(res)
          } else {
            next()
          }
        })
      },
    },
  ],
  server: {
    port: 3333,
  },
})
