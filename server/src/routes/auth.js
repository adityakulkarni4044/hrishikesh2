const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { z } = require('zod')
const { User, roles } = require('../models/User')
const { validateBody } = require('../middleware/validate')
const { requireAuth } = require('../middleware/auth')
const { sendMail } = require('../utils/mailer')

const router = express.Router()

function signToken(user) {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET,
    { subject: user._id.toString(), expiresIn: '7d' },
  )
}

const registerSchema = z
  .object({
    role: z.enum(roles),
    name: z.string().min(2),
    phone: z.string().regex(/^[0-9]{10}$/),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

router.post('/register', validateBody(registerSchema), async (req, res) => {
  const { role, name, phone, email, password } = req.body

  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { phone }],
  })

  if (existing) {
    if (existing.email === email.toLowerCase()) {
      return res.status(409).json({ message: 'Email already exists' })
    }
    if (existing.phone === phone) {
      return res.status(409).json({ message: 'Phone already exists' })
    }
    return res.status(409).json({ message: 'Account already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    role,
    name,
    phone,
    email: email.toLowerCase(),
    passwordHash,
  })

  const token = signToken(user)
  return res.status(201).json({ token, user: user.toSafeJSON() })
})

const loginSchema = z.object({
  role: z.enum(roles),
  email: z.string().email(),
  password: z.string().min(6),
})

router.post('/login', validateBody(loginSchema), async (req, res) => {
  const { role, email, password } = req.body
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  if (user.role !== role) return res.status(401).json({ message: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  const token = signToken(user)
  return res.json({ token, user: user.toSafeJSON() })
})

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user.toSafeJSON() })
})

const forgotSchema = z.object({
  role: z.enum(roles),
  email: z.string().email(),
})

router.post('/forgot-password', validateBody(forgotSchema), async (req, res) => {
  const { role, email } = req.body
  const user = await User.findOne({ email: email.toLowerCase(), role })

  // Always return success to avoid account enumeration
  if (!user) return res.json({ ok: true })

  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes

  user.resetPasswordTokenHash = tokenHash
  user.resetPasswordExpiresAt = expires
  await user.save()

  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const resetLink = `${baseUrl}/reset-password?role=${encodeURIComponent(role)}&token=${encodeURIComponent(
    rawToken,
  )}`

  const subject = 'Nowwagon password reset'
  const text = `Reset your password using this link:\n\n${resetLink}\n\nThis link expires in 15 minutes.`
  const html = `<p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link expires in 15 minutes.</p>`

  const result = await sendMail({ to: user.email, subject, text, html })

  if (!result.delivered) {
    // Dev-friendly: show link in server logs
    // eslint-disable-next-line no-console
    console.log(`[nowwagon] reset link for ${user.email}: ${resetLink}`)
  }

  return res.json({ ok: true })
})

const resetSchema = z
  .object({
    role: z.enum(roles),
    token: z.string().min(10),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

router.post('/reset-password', validateBody(resetSchema), async (req, res) => {
  const { role, token, password } = req.body
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    role,
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  })

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }

  user.passwordHash = await bcrypt.hash(password, 10)
  user.resetPasswordTokenHash = undefined
  user.resetPasswordExpiresAt = undefined
  await user.save()

  return res.json({ ok: true })
})

module.exports = router

