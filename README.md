<h1 align="center">y2mate-clone <img align="center" src="frontend/images/logo.png" width="70px"></h1>

Web-interface for [Youtube-Downloader-API](https://github.com/Simatwa/youtube-downloader-api) inspired by [y2mate.com](https://y2mate.com)

# Pre-requisites

- [Python version 3.10 or higher](https://python.org)
- [Git](https://git-scm.com/)

# Installation and Usage

- Clone repository and enter the project directory.

```sh
git clone https://github.com/Simatwa/y2mate-clone.git
cd y2mate-clone
```

- Install backend dependencies

```sh
cd backend
pip install -r requirements.txt
```

- Start the backend server

```sh
python -m fastapi run app
```

- On another terminal tab, start the frontend server from the root directory of the project

```
python -m http.server 8080 -d frontend
```

Then you can now access the web-interface from <http://localhost:8080>.

Change the Base URL of the API to point to the one we had setup before and enjoy the service.

<p align="center">
<img src="assets/setup-api-base-url.jpg" width="80%">
</p>

> [!NOTE]
> Purpose to checkout [Youtube-Downloader-API](https://github.com/Simatwa/youtube-downloader-api) to learn more about customizing the REST-API.

# License

- [x] [MIT](LICENSE)