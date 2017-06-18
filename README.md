# ArkWars

Frontend and Backend for Arkwars - a strategic turn-based game of galactic conquest. NodeJS/MongoDB Backend, React Frontend.

**Status:** Working on build-scripts and generic server stuff.

## NPM Scripts

* `npm run start@server`: starts the node backend
* `npm run assets:prod@client`: generates all client files for a **production** environment
* `npm run assets:dev@client`: use webpack-dev-server to deliver assets for **development**.
* `npm run assets:cleanup@client`: empty directories with webpack-generated, git-ignored files.
* `npm run test@client`: run unit tests once and analyse coverage.
* `npm run test:watch@client`: start jest unit tests in watch mode. Incompatible with IntelliJ's `Run` Conolse.

