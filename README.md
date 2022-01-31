# internet <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/285/house_1f3e0.png" width="100" align="right">
**Get/set bookmarks and articles from anywhere**

<br>

## Usage

```console
$ curl -X POST -H 'Authorization: Basic API_TOKEN' -H 'Content-Type: application/json' --data '{ "url": "https://example.com" }' …/api/bookmark
```

### API

| endpoint | method | body | description |
| :------- | :----- | :--: | :---------- |
| `/api/article` | `POST` | `{ url }` | Add a new bookmark |
| `/api/article` | `DELETE` | `{ url }` | Delete a bookmark |
| `/api/article` | `PATCH` | `{ url, title }` | Rename a bookmark |
| `/api/bookmark` | `POST` | `{ url }` | Save a new article |
| `/api/bookmark` | `DELETE` | `{ url }` | Archive an article |

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

