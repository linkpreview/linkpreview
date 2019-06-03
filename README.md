# Link Preview
Open Graph, Twitter Card, Oembed preview. Shows visual cards that mimics link previews in facebook, twitter and other sites that support link preview.

https://linkpreview.dev/

# Requirements

  1. Node.js v10.16.0

  ```
  nvm install v10.16.0
  ```

# Installation

1. Clone this repo
  ````
  git clone git@github.com:namchey/linkpreview.git
  ````

2. Install Dependencies
  ````
  npm i
  ````

3. Copy `.env.example` ---> `.env` if you want custom env vars

4. Webpack Build

  ````
  //server-rendering
  npm run build:dev

  //client
  npm run app-dev-server

  ````

5. Run in Development mode
  ````
  npm run dev
  //open app in browser, default is http://localhost:4040
  ````

# Production


  1. Build
  ````
  npm run build
  ````

  2. Run
  ````
  npm run start
  ````
