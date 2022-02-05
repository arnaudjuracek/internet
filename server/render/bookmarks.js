const fs = require('fs-extra')
const path = require('path')
const favicon = require('../utils/get-favicon-url')
const template = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'templates', 'list.hbs'), 'utf8')
const render = require('handlebars').compile(template)

const ACTIONS = {
  rename: {
    label: 'rename',
    method: 'PATCH',
    endpoint: '/api/bookmark',
    input: {
      key: 'title',
      message: 'Rename bookmark'
    }
  },
  delete: { label: 'delete', method: 'DELETE', endpoint: '/api/bookmark' }
}

module.exports = (req, res, next) => {
  try {
    // Create an array of all bookmarks and their informations
    const bookmarks = fs.readJsonSync(path.join(process.env.BOOKMARKS), 'utf8')
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((bookmark, index) => {
        try {
          const url = new URL(bookmark.url)
          bookmark.index = index
          bookmark.hostname = url.hostname.replace(/^www./, '')
          bookmark.favicon = favicon(url.origin)
          bookmark.title = bookmark.title || (bookmark.hostname + url.pathname)
        } catch (error) {
          console.error(error)
          return
        }
        return bookmark
      })

    // Render the HTML content
    const html = render({
      title: 'Internet',
      type: 'bookmarks',
      isProduction: process.env.NODE_ENV !== 'development',
      switch: { label: 'articles', href: '/articles' },
      items: bookmarks.filter(Boolean).map(bookmark => ({
        ...bookmark,
        actions: [ACTIONS.rename, ACTIONS.delete]
      }))
    })

    res.send(html)
  } catch (error) {
    next(error)
  }
}
