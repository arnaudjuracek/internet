const parseurl = require('parseurl')
const { decode } = require('html-entities')
const moment = require('moment')

require('handlebars').registerHelper({
  plaintext: string => string ? decode(string.replace(/(<([^>]+)>)/ig, '')).trim() : string,
  date: (isoString, format = '') => isoString && moment(isoString).format(typeof format === 'string' ? format : '')
})

const render = {
  authenticate: require('./templates/authenticate'),
  bookmarks: require('./templates/bookmarks')
}

const auth = req => new Promise(resolve => {
  req.session.authenticated = req.session.authenticated ||
    (req.method === 'POST' && req.body.password === process.env.PASSWORD)
  req.session.save(() => resolve(req.session.authenticated))
})

module.exports = async (req, res, next) => {
  const url = parseurl.original(req)
  const authenticated = req.session.authenticated || await auth(req)

  // PRG pattern, see https://en.wikipedia.org/wiki/Post/Redirect/Get
  if (req.method === 'POST') return res.redirect(url.href)

  // Render and send HTML
  res.send(authenticated
    ? await render.bookmarks(url)
    : await render.authenticate(url)
  )
  next()
}
