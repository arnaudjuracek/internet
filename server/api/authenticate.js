module.exports = (req, res, next) => {
  // Allow API calls from authenticated clients
  if (req.session.authenticated) return next()

  // Reject API calls if incorrect API token
  if (req.get('Authorization') !== ('Basic ' + process.env.API_TOKEN)) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  next()
}
