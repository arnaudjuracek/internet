const path = require('path')
const fs = require('fs-extra')

module.exports = async (req, res, next) => {
  try {
    // Try to delete article
    const filename = path.basename(req.body.url) + '.md'
    const file = /\/archived\//.test(req.body.url)
      ? path.join(process.env.ARTICLES, 'archived', filename)
      : path.join(process.env.ARTICLES, filename)

    await fs.unlink(file)

    // Send back archived article, in case client implements undo
    res.json({ archived: req.body.url })
  } catch (error) {
    next(error)
  }
}
