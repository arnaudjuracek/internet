const fs = require('fs-extra')
const path = require('path')
const YAML = require('yaml')
const template = require('handlebars').compile(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'src', 'templates', 'articles.hbs'),
    'utf8'
  )
)

async function getFiles (directories, extensions = []) {
  const files = []

  for (const directory of directories) {
    for (const filename of await fs.readdir(directory)) {
      if (extensions && extensions.length && !extensions.includes(path.extname(filename))) continue
      files.push(path.join(directory, filename))
    }
  }

  return files
}

function parseFrontMatter (markdown, file) {
  try {
    const frontMatter = YAML.parse(
      (markdown.match(/^---(([\s\S])+?)---/) || [])[1] || ''
    )

    if (frontMatter && frontMatter.author) {
      const [, name, email, website] = /^([^<(]+?)?[ \t]*(?:<([^>(]+?)>)?[ \t]*(?:\(([^)]+?)\)|$)/g.exec(frontMatter.author) || []
      frontMatter.author = { name, email, website }
    }

    return frontMatter
  } catch (error) {
    console.warn(`Error while parsing front matter block of ${file}`)
    console.warn(error)
  }
}

module.exports = async (req, res, next) => {
  try {
    const articles = []
    const unread = process.env.ARTICLES
    const archived = path.join(process.env.ARTICLES, 'archived')

    for (const file of await getFiles([unread, archived], ['.md'])) {
      const filename = path.basename(file)
      const archived = path.basename(path.dirname(file)) === 'archived'
      const markdown = await fs.readFile(file, 'utf8')
      const frontMatter = parseFrontMatter(markdown, file)
      const url = archived
        ? process.env.ARTICLES_URL + 'archived/' + filename
        : process.env.ARTICLES_URL + filename

      articles.push({
        ...frontMatter,
        url: url.replace(/.md$/, ''),
        archived,
        title: frontMatter ? frontMatter.title : filename,
        filename,
        markdown,
        lastmod: (await fs.stat(file)).mtime,
        favicon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${(frontMatter && frontMatter.icon) || '🗄'}</text></svg>`
      })
    }

    res.send(template({
      isProduction: process.env.NODE_ENV !== 'development',
      articles: articles
        .sort((a, b) => {
          if (a.archived && !b.archived) return 1
          return b.lastmod - a.lastmod
        })
        .filter(Boolean)
    }))
  } catch (error) {
    next(error)
  }
}
