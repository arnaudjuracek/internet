const fs = require('fs-extra')
const fetch = require('node-fetch')

module.exports = async (req, res, next) => {
  try {
    // Ensure webpage is not already bookmarked
    const bookmarks = await fs.readJson(process.env.BOOKMARKS)
    for (const index in bookmarks) {
      if (bookmarks[index].url === req.body.url) delete bookmarks[index]
    }

    // Ensure webpage exists
    const response = await fetch(req.body.url)

    // Create a new bookmark
    const bookmark = {
      timestamp: Date.now(),
      // Use url origin as default
      title: (req.body.url.match(/https?:\/\/(?:www\.)?([^/]*)/) || [])[1] || req.body.url,
      url: req.body.url
    }

    // Get bookmark title if possible
    if (response.status === 200) {
      const body = await response.text()
      const title = (body.match(/<title.*?>([\S\s]*?)<\/title>/i) || [])[1]
      bookmark.title = (title || req.body.url).replace(/[\n\r\t]/g, '')
    }

    // Append bookmark to DB
    bookmarks.push(bookmark)
    const payload = JSON.stringify(bookmarks.filter(Boolean), { spaces: 2 })
    await fs.writeFile(process.env.BOOKMARKS, payload.replace(/{/g, '\n{'), 'utf8')

    res.json({ bookmark })
  } catch (error) {
    next(error)
  }
}
