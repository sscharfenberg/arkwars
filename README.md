# ArkWars

Frontend and Backend for Arkwars - a strategic turn-based game of galactic conquest.

Number of times `.env` file got submitted to git: **2** 

**Status:** backend push so we have some structure to work with in the frontend. currently working on admin area.

## Requirements

* MongoDB 3.4 Database
* Redis database as session store
* NodeJS 8.4.0, npm 5.3

### Next TODOs Backend

- [x] Edit game
- [x] Create game
- [x] Delete game
- [ ] seed universe and star systems
- [ ] make values for progressbar dynamic from server

### Next TODOs Frontend

- [ ] Add a Frontend framework for game screens. Decide on using React or Vue.
- [ ] Refactor webpack config: changes for framework, bundle-buddy
  

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
