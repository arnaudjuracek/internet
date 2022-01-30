const fs = require('fs-extra')
const path = require('path')

const BOOKMARKS = path.join(process.env.CONTENT, 'bookmarks.json')

module.exports = async (req, res) => {
  try {
    // Read bookmarks
    const bookmarks = await fs.readJson(BOOKMARKS)

    // Delete relevant bookmark
    let deleted
    for (const index in bookmarks) {
      if (bookmarks[index].url === req.body.url) {
        console.log('found')
        deleted = bookmarks[index]
        delete bookmarks[index]
      }
    }

    // Update bookmarks
    const payload = JSON.stringify(bookmarks.filter(Boolean), { spaces: 2 })
    await fs.writeFile(BOOKMARKS, payload.replace(/{/g, '\n{'), 'utf8')

    // Send deleted bookmark, in case client implements undo
    res.json({ deleted })
  } catch (error) {
    console.error(new Date(), error)
    res.status(500).json({ error: error.message })
  }
}
