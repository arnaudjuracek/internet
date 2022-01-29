const fs = require('fs-extra')
const path = require('path')
const template = require('handlebars').compile(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'templates', 'bookmarks.hbs'),
    'utf8'
  )
)

const BOOKMARKS = path.join(__dirname, '..', process.env.CONTENT, 'bookmarks.json')

module.exports = async url => template({
  isProduction: process.env.NODE_ENV !== 'development',
  bookmarks: fs.readJsonSync(BOOKMARKS, 'utf8')
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((bookmark, index) => {
      try {
        const url = new URL(bookmark.url)
        bookmark.index = index
        bookmark.hostname = url.hostname.replace(/^www./, '')
        bookmark.favicon = 'https://s2.googleusercontent.com/s2/favicons?domain=' + url.origin
        bookmark.title = bookmark.title || (bookmark.hostname + url.pathname)
      } catch (error) {
        console.error(error)
        return
      }

      return bookmark
    })
    .filter(Boolean)
})
