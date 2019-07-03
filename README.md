![Link Preview Logo](https://raw.githubusercontent.com/namchey/linkpreview/master/app/images/blue-logo.png)

# Link Preview
[![npm version](https://badge.fury.io/js/%40namchey%2Flinkpreview.svg)](https://badge.fury.io/js/%40namchey%2Flinkpreview)
[![Build Status](https://travis-ci.org/namchey/linkpreview.svg?branch=master)](https://travis-ci.org/namchey/linkpreview)
[![Maintainability](https://api.codeclimate.com/v1/badges/f8aae8449e8d187af9aa/maintainability)](https://codeclimate.com/github/namchey/linkpreview/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f8aae8449e8d187af9aa/test_coverage)](https://codeclimate.com/github/namchey/linkpreview/test_coverage)

Open Graph, Twitter Card, Oembed preview. Shows visual cards that mimics link previews in social media like facebook, twitter, vk, viber and other sites that support link preview.


https://linkpreview.dev/

# Motivation
 There are already tools from facebook (https://developers.facebook.com/tools/debug/) and twitter(https://cards-dev.twitter.com/validator) that does the work of debugging the link preview. But they only work for live URLs. We wanted a tool for our development environment that is as close to those visual debuggers. And we also wanted Oembed protocol testing. So Link Preview was made to solve these problems.It is an all in one debugger. It shows visual link previews for OpenGraph, Twitter Card and Oembed protocol. With this tool you can get somewhat similar link preview in sites like facebook, twitter, medium, etc.

# Requirements

  1. Node.js v10.16.0

  ```
  nvm install v10.16.0
  ```

# Installation

    ````
    npm i -g @namchey/linkpreview
    linkpreview
    //starts a server in localhost:8080
    ````

# Development

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


  # Libraries Used for Scraping

   - [cheeriojs/cheerio](https://github.com/cheeriojs/cheerio)

   - [MattMcFarland/SUq](https://github.com/MattMcFarland/SUq)
