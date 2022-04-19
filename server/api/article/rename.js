const path = require('path')
const fs = require('fs-extra')

module.exports = async (req, res, next) => {
  try {
    if (!req.body.url) throw new Error('No url given')
    if (!req.body.title) throw new Error('Invalid title')

    // Try to read article
    const filename = path.basename(req.body.url) + '.md'
    const file = /\/archived\//.test(req.body.url)
      ? path.join(process.env.ARTICLES, 'archived', filename)
      : path.join(process.env.ARTICLES, filename)
    const markdown = await fs.readFile(file, 'utf8')

    // Update article title
    const hasFrontMatter = /^---(([\s\S])+?)---/.test(markdown)
    const content = hasFrontMatter
      ? markdown.replace(/^(---\n+title:\s(?:\|\s?\n\s{2})?)(.*)(\n[\s\S]*?---)/, `$1${req.body.title}$3`)
      : `---\ntitle: |\n  ${req.body.title}\n---\n\n` + markdown
    await fs.writeFile(file, content, 'utf8')

    res.json(({ renamed: req.body.url }))
  } catch (error) {
    next(error)
  }
}
