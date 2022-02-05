#!/usr/bin/env node

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

process.env.ARTICLES = path.join(__dirname, process.env.ARTICLES)
process.env.BOOKMARKS = path.join(__dirname, process.env.BOOKMARKS)

const fs = require('fs-extra')
const http = require('http')
const express = require('express')
const session = require('express-session')
const pkg = require('../package.json')
const FileStore = require('session-file-store')(session)

const app = express()
const server = http.createServer(app)
const sessionParser = session({
  saveUninitialized: false,
  secret: process.env.PASSWORD,
  store: new FileStore({
    path: path.resolve(__dirname, process.env.SESSIONS),
    logFn: message => console.log(new Date(), message),
    encoding: 'utf8',
    fileExtension: '.json'
  }),
  resave: false,
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000
  }
})

// Log request
app.use((req, res, next) => {
  if (process.env.VERBOSE || process.env.NODE_ENV === 'development') {
    console.log(new Date(), `[${req.method}]`, req.originalUrl)
  }
  next()
})

// Setup webpack middlewares
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack')
  const config = require('../webpack.config.js')
  const compiler = webpack(config)
  const hotMiddleware = require('webpack-hot-middleware')(compiler)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    serverSideRender: true,
    stats: 'errors-warnings',
    publicPath: config.output.publicPath
  })

  app.use(devMiddleware)
  app.use(hotMiddleware)
}

// Handle session
app.use(sessionParser)

// Serve static files
app.use('/sw.js', async (req, res) => {
  const sw = await fs.readFile(path.join(__dirname, '..', 'static', 'sw.js'), 'utf8')
  res.type('.js')
  res.send(sw
    .replace('{{PACKAGE_NAME}}', pkg.name)
    .replace('{{PACKAGE_VERSION}}', pkg.version)
  )
})
app.use(express.static(path.join(__dirname, '..', 'build')))
app.use(express.static(path.join(__dirname, '..', 'static')))

// Setup API
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', require('./api/authenticate'))
app.post('/api/article', require('./api/add-article'))
app.delete('/api/article', require('./api/archive-article'))
app.post('/api/bookmark', require('./api/add-bookmark'))
app.patch('/api/bookmark', require('./api/rename-bookmark'))
app.delete('/api/bookmark', require('./api/delete-bookmark'))

// Setup front routes
app.use('/logout', (req, res, next) => {
  req.session.authenticated = false
  req.session.save(() => res.redirect('/'))
})
app.use(require('./render/authenticate'))
app.use('/articles', require('./render/articles'))
app.use('/', require('./render/bookmarks'))

// Log errors
app.use((error, req, res, next) => {
  console.error(new Date(), error)
  res.status(500).json({ error })
})

// Start server
server.listen(process.env.PORT, () => {
  console.log(new Date(), `Server is up and running on port ${process.env.PORT}`)
})
