![Node.js CI](https://github.com/hirasso/parcel-plugin-watch-reload/workflows/Node.js%20CI/badge.svg) 
[![Build Status](https://travis-ci.com/hirasso/parcel-plugin-watch-reload.svg?branch=master)](https://travis-ci.com/hirasso/parcel-plugin-watch-reload) 
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B17638%2Fgit%40github.com%3Ahirasso%2Fparcel-plugin-watch-reload.git.svg?type=shield)](https://app.fossa.com/projects/custom%2B17638%2Fgit%40github.com%3Ahirasso%2Fparcel-plugin-watch-reload.git?ref=badge_shield)

# parcel-plugin-watch-reload 


📦🔌🗂👀 A [Parcel](https://github.com/parcel-bundler/parcel) plugin that watches files not included in your bundles (e.g. `**/*.php`) and reloads your browser if they change (great for CMS theme development like e.g. WordPress). Also, has emojis in readme 👾


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
Without the `files` setting in your `package.json`, the plugin will do nothing.

## Optional settings

- Set a reload delay:

  ```json
  {
    "watchreload": {
      "files": "**/*.php",
      "reloadDelay": 200
    }
  }
  ```
- Overwrite the plugin's settings for [Chokidar](https://github.com/paulmillr/chokidar#api). The defaults are:

  ```json
  {
    "watchreload": {
      "files": "**/*.php",
      "chokidarOptions": {
        "ignored": ["node_modules", "bower_components", ".cache"],
        "ignoreInitial": true
      }
    }
  }
  ```

That's it! If you start parcel in `watch` mode with the `hmr` option set to true (it's the default), each change to a file matching your rules will trigger a browser reload. ✨

## License

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B17638%2Fgit%40github.com%3Ahirasso%2Fparcel-plugin-watch-reload.git.svg?type=large)](https://app.fossa.com/projects/custom%2B17638%2Fgit%40github.com%3Ahirasso%2Fparcel-plugin-watch-reload.git?ref=badge_large)