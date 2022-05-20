module.exports = (req, res, next) => {
  // Allow API calls from authenticated clients
  if (req.session.authenticated) return next()

  // Allow API calls if API_TOKEN is explicitly set to false
  if (process.env.API_TOKEN === 'false') return next()

  // Reject API calls if incorrect API token
  if (req.get('Authorization') !== ('Basic ' + process.env.API_TOKEN)) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  next()
}
