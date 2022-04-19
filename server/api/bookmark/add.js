const fs = require('fs-extra')
const fetch = require('node-fetch')

module.exports = async (req, res, next) => {
  try {
    // Ensure webpage exists
    const response = await fetch(req.body.url)

    // TODO: handle 403 forbidden
    if (response.status !== 200) {
      throw new Error(`[${response.status}] ${response.statusText}`)
    }

    // Ensure webpage is not already bookmarked
    const bookmarks = await fs.readJson(process.env.BOOKMARKS)
    for (const index in bookmarks) {
      if (bookmarks[index].url === req.body.url) delete bookmarks[index]
    }

    // Create a new bookmark
    const body = await response.text()
    const title = (body.match(/<title.*?>([\S\s]*?)<\/title>/i) || [])[1]
    const bookmark = {
      timestamp: Date.now(),
      title: (title || req.body.url).replace(/[\n\r\t]/g, ''),
      url: req.body.url
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
