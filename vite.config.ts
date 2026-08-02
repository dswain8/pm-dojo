import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { gradeWithGemini } from './api/_lib/gradeWithGemini'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
      // Local /api/grade → Gemini (mirrors Vercel Edge function)
      {
        name: 'local-grade-api',
        configureServer(server) {
          server.middlewares.use('/api/grade', async (req, res, next) => {
            if (req.method === 'OPTIONS') {
              res.statusCode = 204
              res.end()
              return
            }
            if (req.method !== 'POST') {
              next()
              return
            }

            const chunks: Buffer[] = []
            req.on('data', (c) => chunks.push(Buffer.from(c)))
            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json')
              try {
                const apiKey = env.GEMINI_API_KEY
                if (!apiKey) {
                  res.statusCode = 503
                  res.end(
                    JSON.stringify({
                      error:
                        'Grading is not configured. Add GEMINI_API_KEY to .env.local',
                    })
                  )
                  return
                }

                const body = JSON.parse(Buffer.concat(chunks).toString() || '{}')
                const { scenario, userAnswer } = body
                if (!scenario?.title || typeof userAnswer !== 'string') {
                  res.statusCode = 400
                  res.end(JSON.stringify({ error: 'Missing scenario or userAnswer' }))
                  return
                }

                const result = await gradeWithGemini(apiKey, scenario, userAnswer)
                res.statusCode = 200
                res.end(JSON.stringify(result))
              } catch (err) {
                console.error('local grade error:', err)
                const message = err instanceof Error ? err.message : ''
                if (message.includes('429') || message.toLowerCase().includes('quota')) {
                  res.statusCode = 429
                  res.end(
                    JSON.stringify({
                      error:
                        'Gemini free-tier quota hit. Wait a few minutes (or until daily reset) and retry.',
                    })
                  )
                  return
                }
                if (message.includes('aborted') || message.includes('AbortError')) {
                  res.statusCode = 504
                  res.end(JSON.stringify({ error: 'Grading timed out. Try again.' }))
                  return
                }
                res.statusCode = 502
                res.end(
                  JSON.stringify({ error: 'Could not grade response. Try again.' })
                )
              }
            })
          })
        },
      },
    ],
    server: {
      port: 3333,
    },
  }
})
