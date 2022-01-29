module.exports = (req, res, next) => {
  if (req.get('Authorization') !== ('Basic ' + process.env.API_TOKEN)) {
    res.status(401).json({ error: 'Invalid token' })
  } else next()
}
