const fs = require('fs-extra')
const parseurl = require('parseurl')
const path = require('path')
const template = require('handlebars').compile(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'templates', 'authenticate.hbs'),
    'utf8'
  )
)

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

  if (authenticated) next()
  else res.send(template({ isProduction: process.env.NODE_ENV !== 'development' }))
}
