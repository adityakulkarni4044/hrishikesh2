require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { connectDb } = require('./config/db')
const authRoutes = require('./routes/auth')

const PORT = process.env.PORT || 5000

async function start() {
  if (!process.env.MONGO_URI) {
    // eslint-disable-next-line no-console
    console.error('Missing MONGO_URI in environment')
    process.exit(1)
  }
  if (!process.env.JWT_SECRET) {
    // eslint-disable-next-line no-console
    console.error('Missing JWT_SECRET in environment')
    process.exit(1)
  }

  await connectDb(process.env.MONGO_URI)

  const app = express()

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  )
  app.use(express.json())

  app.get('/api/health', (req, res) => res.json({ ok: true }))
  app.use('/api/auth', authRoutes)

  // basic error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  })

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[nowwagon] server running on http://localhost:${PORT}`)
  })
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})

