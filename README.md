# ArkWars

Frontend and Backend for Arkwars - a strategic turn-based game of galactic conquest.

**Status:** working on basics - currently user accounts.

**TODO:** write tests, dammit.

## Requirements

* MongoDB 3.4 Database
* Redis database as session store
* NodeJS 8.2.1, npm 5.3

## NPM Scripts

* `npm run server.start`: starts the node backend
* `npm run watch`: cleanup, create static assets, use webpack-dev-server to deliver assets for **development** and have gulp watch static assets (`scss`, `svg`s etc.)
* `npm run build.static`: cleanup, then generates static assets - fonts, images, styles, icon spritesheet.
* `npm run js.prod`: generate javascript for a **production** environment.
* `npm run jst.test`: run unit tests once and analyse coverage.
* `npm run js.test.watch`: start jest unit tests in watch mode. Incompatible with IntelliJ's `Run` Conolse.
* `npm run cleanup`: empty directories with webpack-generated, git-ignored files.
* `npm run server.db.prune`: empty MongoDB databases.
* `npm run server.db.seed`: seed MongoDB with mock data.
