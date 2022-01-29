const fs = require('fs-extra')
const path = require('path')
const fetch = require('node-fetch')

const BOOKMARKS = path.join(process.env.CONTENT, 'bookmarks.json')

module.exports = async (req, res) => {
  try {
    // Ensure webpage exists
    const response = await fetch(req.body.url)
    if (response.status !== 200) throw new Error(response.statusText)

    // Ensure webpage is not already bookmarked
    const bookmarks = await fs.readJson(BOOKMARKS)
    for (const index in bookmarks) {
      if (bookmarks[index].url === req.body.url) delete bookmarks[index]
    }

    // Create a new bookmark
    const body = await response.text()
    const bookmark = {
      timestamp: Date.now(),
      title: body.match(/<title.*?>(.*)<\/title>/i)[1],
      url: req.body.url
    }

    // Append bookmark to DB
    bookmarks.push(bookmark)
    const payload = JSON.stringify(bookmarks.filter(Boolean), { spaces: 2 })
    await fs.writeFile(BOOKMARKS, payload.replace(/{/g, '\n{'), 'utf8')

    res.json({ bookmark })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
