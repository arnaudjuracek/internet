# internet <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/285/house_1f3e0.png" width="100" align="right">
**Get/set bookmarks and articles from anywhere**

<br>

## Usage

```console
$ curl -X POST -H 'Authorization: Basic API_TOKEN' -H 'Content-Type: application/json' --data '{ "url": "https://example.com" }' …/api/bookmark
```

### API

app.post('/api/article', require('./api/article/add'))
app.patch('/api/article', require('./api/article/rename'))
app.patch('/api/article/archive', require('./api/article/archive'))
app.delete('/api/article', require('./api/article/delete'))

app.post('/api/bookmark', require('./api/bookmark/add'))
app.patch('/api/bookmark', require('./api/bookmark/rename'))
app.delete('/api/bookmark', require('./api/bookmark/delete'))


| endpoint | method | body | description |
| :------- | :----- | :--: | :---------- |
| `/api/article` | `POST` | `{ url }` | Add a new article |
| `/api/article` | `PATCH` | `{ url, title }` | Rename an article |
| `/api/article/archive` | `PATCH` | `{ url, title }` | Rename an article |
| `/api/article` | `DELETE` | `{ url }` | Delete an article |
| `/api/bookmark` | `POST` | `{ url }` | Save a new bookmark |
| `/api/bookmark` | `PATCH` | `{ url }` | Rename a bookmark |
| `/api/bookmark` | `DELETE` | `{ url }` | Delete a bookmark |

## Development

### Installation

```console
$ git clone https://github.com/arnaudjuracek/internet && cd internet
$ cp server/.env.example server/.env
$ yarn install
```

### Deployment
Deployment to the AlwaysData environment is done automatically via a [Github action](.github/workflows/deploy-alwaysdata.yml). Simply create a new release by running:

```console
$ yarn version
```

## License

[MIT.](https://tldrlegal.com/license/mit-license)

