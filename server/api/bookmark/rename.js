const fs = require('fs-extra')

module.exports = async (req, res, next) => {
  try {
    if (!req.body.title) throw new Error('Invalid title')

    // Read bookmarks
    const bookmarks = await fs.readJson(process.env.BOOKMARKS)

    // Rename relevant bookmark
    let renamed
    for (const index in bookmarks) {
      if (bookmarks[index].url === req.body.url) {
        const previousTitle = bookmarks[index].title
        bookmarks[index].title = req.body.title
        renamed = { ...bookmarks[index], previousTitle }
      }
    }

    // Update bookmarks
    const payload = JSON.stringify(bookmarks.filter(Boolean), { spaces: 2 })
    await fs.writeFile(process.env.BOOKMARKS, payload.replace(/{/g, '\n{'), 'utf8')

    // Send back renamed bookmark, in case client implements undo
    res.json({ renamed })
    next()
  } catch (error) {
    next(error)
  }
}
