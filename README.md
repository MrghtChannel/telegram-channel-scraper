
# 📡 Telegram Channel Scraper – JSON API

Parsing messages from **public Telegram channels** on the website `https://t.me/s/<channel>` and returning them as an API response in JSON format.

## 🚀 Features

- ✅ Retrieve message text
- 🖼 Extract images
- 🎥 Get video previews
- 📎 Extract document titles
- 🕒 Formatted date (ISO 8601)
- 🧩 Simple REST API

## 📦 Installation

```bash
git clone https://github.com/MrghtChannel/telegram-channel-scraper
cd telegram-channel-scraper
npm install
```

## ▶️ Run

```bash
node index.js
```

By default, the server runs on port `3000`.

## 📥 Example Request

```
GET http://localhost:3000/t.me/s/<channel>/json
```

Replace `<channel>` with the channel name. Examples:

- `durov`
- `breakingmash`
- `elonmusk`

## 🧾 Example Response

```json
[
  {
    "text": "New project update!",
    "date": "2025-04-05T12:34:00",
    "image": "https://cdn4.telegram-cdn.org/file/example.jpg",
    "video": null,
    "document": null,
    "voice": null,
    "url": "https://t.me/channel_name/1",
    "styles": ["bold"]
  },
  {
    "text": "Watch our video 👇",
    "date": "2025-04-05T12:35:00",
    "image": null,
    "video": "https://cdn4.telegram-cdn.org/file/video-thumb.jpg",
    "document": null,
    "voice": null,
    "url": "https://t.me/channel_name/2",
    "styles": ["emoji"]
  }
]
```

## ⚠️ Limitations

- ❗ Works **only with public** Telegram channels
- ❗ Telegram may change the HTML structure at any time (if this happens, the parser will need to be updated)
- ❗ Video and documents — only previews or titles, not the files themselves

## 🧱 Technology Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Axios](https://github.com/axios/axios)
- [Cheerio](https://cheerio.js.org/) – jQuery-like HTML parser

## 📄 License

This project is licensed under the [MIT](LICENSE) license.
