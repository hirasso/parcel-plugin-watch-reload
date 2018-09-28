# parcel-plugin-modernizr [![Build Status](https://travis-ci.com/hirasso/parcel-plugin-watch-reload.svg?branch=master)](https://travis-ci.com/hirasso/parcel-plugin-watch-reload)

📦🔌🗂👀 A [Parcel](https://github.com/parcel-bundler/parcel) plugin that watches files not included in your bundles (e.g. `**/*.php`) and reloads your browser if they change. Also, has emojis in readme 👾


## Installation

```
$ npm install parcel-plugin-watch-reload -D
```
...or

```
$ yarn add parcel-plugin-watch-reload -D
```

## Setup

Specify which file types should trigger a browser reload in your `package.json`:

```json
{
  "watchreload": {
    "files": "**/*.php"
  }
}
```
Arrays of globs are also supported:

```json
{
  "watchreload": {
    "files": ["**/*.php", "**/*.svg"]
  }
}
```

That's it! If you start parcel in watch mode, each change to a file matching your rules will trigger a browser reload. ✨