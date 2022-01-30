const path = require('path')
const fs = require('fs-extra')

module.exports = async (req, res, next) => {
  try {
    // Try to move article to /archived
    const filename = path.basename(req.body.url)
    await fs.move(
      path.join(process.env.ARTICLES, filename + '.md'),
      path.join(process.env.ARTICLES, 'archived', filename)
    )

    // Send back archived article, in case client implements undo
    res.json({ archived: req.body.url })
  } catch (error) {
    next(error)
  }
}
