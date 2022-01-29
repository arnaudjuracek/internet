const fs = require('fs-extra')
const path = require('path')
const template = require('handlebars').compile(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'templates', 'authenticate.hbs'),
    'utf8'
  )
)

module.exports = async url => {
  return template({
    isProduction: process.env.NODE_ENV !== 'development'
  })
}
