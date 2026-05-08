function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const first = result.error.issues?.[0]
      return res.status(400).json({ message: first?.message || 'Invalid request' })
    }
    req.body = result.data
    next()
  }
}

module.exports = { validateBody }

