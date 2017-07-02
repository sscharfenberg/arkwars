# ArkWars

Frontend and Backend for Arkwars - a strategic turn-based game of galactic conquest. NodeJS/MongoDB Backend, React Frontend.

**Status:** Working on build-scripts and generic server stuff.

## NPM Scripts

* `npm run start`: starts the node backend
* `npm run build.prod`: generates all client files for a **production** environment. `todo: not all fonts are transfered`
* `npm run watch`: use webpack-dev-server to deliver assets for **development** and have gulp watch static assets (`scss`, `svg`s etc.)
* `npm run sync.all`: copy static assets like fonts, images, icons.
* `npm run cleanup`: empty directories with webpack-generated, git-ignored files.
* `npm run test.client`: run unit tests once and analyse coverage.
* `npm run test.client.watch`: start jest unit tests in watch mode. Incompatible with IntelliJ's `Run` Conolse.
