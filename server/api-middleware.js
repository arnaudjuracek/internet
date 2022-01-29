module.exports = (req, res, next) => {
  if (req.get('Authorization') !== ('Basic ' + process.env.API_TOKEN)) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  return res.json({ body: req.body })
}
