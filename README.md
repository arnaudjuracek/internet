# internet <img src="https://em-content.zobj.net/thumbs/240/apple/325/house_1f3e0.png" width="100" align="right">
**Get/set bookmarks and articles from anywhere**

<br>

## Usage

```console
$ curl -X POST -H 'Authorization: Basic API_TOKEN' -H 'Content-Type: application/json' --data '{ "url": "https://example.com" }' …/api/bookmark
```

### API

| method | endpoint | body | description |
| :----- | :------- | :--- | :---------- |
| `POST`  | `/api/article` | `{ url }` | Add a new article |
| `PATCH` | `/api/article` | `{ url, title }` | Rename an article |
| `PATCH` | `/api/article/archive` |  `{ url }` | Archive an article |
| `DELETE` | `/api/article` | `{ url }` | Delete an article |
| `POST`  | `/api/bookmark` | `{ url }` | Save a new bookmark |
| `PATCH` | `/api/bookmark` | `{ url }` | Rename a bookmark |
| `DELETE` | `/api/bookmark` | `{ url }` | Delete a bookmark |

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

