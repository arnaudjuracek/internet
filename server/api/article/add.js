const path = require('path')
const cabinet = require('cabinet')

module.exports = async (req, res, next) => {
  try {
    const filename = await cabinet(req.body.url, {
      output: path.join(process.env.ARTICLES, '{{title}}.md'),
      download: path.join(process.env.ARTICLES, 'medias'),
      template: path.join(__dirname, '..', '..', 'article.md')
    })

    res.send({
      url: process.env.ARTICLES_URL + path.basename(filename)
    })
  } catch (error) {
    next(error)
  }
}
