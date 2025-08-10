const fs = require('fs-extra')

module.exports = async (req, res, next) => {
  try {
    // Read bookmarks
    const bookmarks = await fs.readJson(process.env.BOOKMARKS)

    // Delete relevant bookmark
    let deleted
    for (const index in bookmarks) {
      if (bookmarks[index].url === req.body.url) {
        deleted = bookmarks[index]
        delete bookmarks[index]
      }
    }

    // Update bookmarks
    const payload = JSON.stringify(bookmarks.filter(Boolean), { spaces: 2 })
    await fs.writeFile(process.env.BOOKMARKS, payload.replace(/{/g, '\n{'), 'utf8')

    // Send back deleted bookmark, in case client implements undo
    res.json({ deleted })
  } catch (error) {
    next(error)
  }
}
