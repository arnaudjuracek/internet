const fs = require('fs-extra')
const path = require('path')
const YAML = require('yaml')
const template = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'templates', 'list.hbs'), 'utf8')
const render = require('handlebars').compile(template)

const ACTIONS = {
  rename: {
    label: 'rename',
    method: 'PATCH',
    endpoint: '/api/article',
    input: {
      key: 'title',
      message: 'Rename article'
    }
  },
  archive: { label: 'archive', method: 'DELETE', endpoint: '/api/article' }
}

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

    // Strip surounding double-quotes
    if (frontMatter && frontMatter.title) frontMatter.title = frontMatter.title.replace(/^"(.*)"\s?$/, '$1')
    if (frontMatter && frontMatter.description) frontMatter.description = frontMatter.description.replace(/^"(.*)"\s?$/, '$1')

    if (frontMatter && frontMatter.author) {
      const [, name, email, website] = /^([^<(]+?)?[ \t]*(?:<([^>(]+?)>)?[ \t]*(?:\(([^)]+?)\)|$)/g.exec(frontMatter.author) || []
      frontMatter.author = { name, email, website }
    }

    frontMatter.title = frontMatter.title.replace(/\r?\n|\r/g, '')

    return frontMatter
  } catch (error) {
    console.warn(`Error while parsing front matter block of ${file}`)
    console.warn(error)
  }
}

module.exports = async (req, res, next) => {
  try {
    const unread = process.env.ARTICLES
    const archived = path.join(process.env.ARTICLES, 'archived')

    // Create an array containing all articles and their informations
    const articles = []
    for (const file of await getFiles([unread, archived], ['.md'])) {
      const filename = path.basename(file)
      const archived = path.basename(path.dirname(file)) === 'archived'
      const markdown = await fs.readFile(file, 'utf8')
      const frontMatter = parseFrontMatter(markdown, file)
      const url = archived
        ? process.env.ARTICLES_URL + 'archived/' + filename
        : process.env.ARTICLES_URL + filename

      const stat = await fs.stat(file)

      articles.push({
        ...frontMatter,
        url: url.replace(/.md$/, ''),
        archived,
        title: frontMatter ? frontMatter.title : filename,
        filename,
        markdown,
        created: stat.birthtime,
        lastmod: stat.mtime,
        favicon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${(frontMatter && frontMatter.icon) || '🗄'}</text></svg>`
      })
    }

    // Render the HTML content
    const html = render({
      title: 'Internet/articles',
      type: 'articles',
      isProduction: process.env.NODE_ENV !== 'development',
      switch: { label: 'bookmarks', href: '/' },
      items: articles.filter(Boolean)
        .sort((a, b) => a.archived && !b.archived ? 1 : b.created - a.created)
        .map(article => ({
          ...article,
          class: article.archived ? '' : 'bold',
          actions: article.archived
            ? [ACTIONS.rename]
            : [ACTIONS.rename, ACTIONS.archive]
        }))
    })

    res.send(html)
  } catch (error) {
    next(error)
  }
}
