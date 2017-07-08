# ArkWars

Frontend and Backend for Arkwars - a strategic turn-based game of galactic conquest. NodeJS/MongoDB Backend, React Frontend.

**Status:** layout framework.

**TODO:** write tests, dammit.

## NPM Scripts

* `npm run start`: starts the node backend
* `npm run build.static`: generates static assets - fonts, images, styles, icon spritesheet.
* `npm run watch`: use webpack-dev-server to deliver assets for **development** and have gulp watch static assets (`scss`, `svg`s etc.)
* `npm run js.prod`: generate javascript for a **production** environment.
* `npm run test.client`: run unit tests once and analyse coverage.
* `npm run test.client.watch`: start jest unit tests in watch mode. Incompatible with IntelliJ's `Run` Conolse.
* `npm run cleanup`: empty directories with webpack-generated, git-ignored files.
