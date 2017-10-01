# ArkWars

Frontend and Backend for Arkwars - a strategic turn-based game of galactic conquest.

Number of times `.env` file got submitted to git: **2** 

**Status:** backend push so we have some structure to work with in the frontend. currently working on admin area, manage games.

## Requirements

* MongoDB 3.4 Database
* Redis database as session store
* NodeJS 8.4.0, npm 5.3

### Next TODOs Backend
- [x] improve seed database scripts by using server handlers. half done, needs work.
- [ ] add orbital index to planets
- [ ] externalize cron/turn handling into a seperate node process.
- [ ] debug and test manage games stuff. shits important, yo.
- [ ] make values for progressbar dynamic from server (probably together with frontend push)

### Next TODOs Frontend

- [ ] Add a Frontend framework for game screens. Decide on using React or Vue.
- [ ] Refactor webpack config: changes for framework, bundle-buddy

### Recently Done
- [x] enlist => assign random player system
- [x] withhdraw => remove ownership of player systems
- [x] change Users model and make "players" a virtual field. change controller User.find, add autopopulate players.
- [x] Add a datetime picker for game generation.
- [x] delete game => delete stars and planets
- [x] add map dimensions to saved game when seeding
- [x] seed universe with star systems, include preview
- [x] Delete game
- [x] Create game
- [x] Edit game  

## Installation

tbd `¯\_(ツ)_/¯`

## NPM Scripts

* `npm run server.start`: starts the node backend
* `npm run watch`: cleanup, create static assets, use webpack-dev-server to deliver assets for **development** and have gulp watch static assets (`scss`, `svg`s etc.)
* `npm run build.static`: cleanup, then generates static assets - fonts, images, styles, icon spritesheet.
* `npm run js.prod`: generate javascript for a **production** environment.
* `npm run jst.test`: run unit tests once and analyse coverage.
* `npm run js.test.watch`: start jest unit tests in watch mode. Incompatible with IntelliJ's `Run` Conolse.
* `npm run cleanup`: empty directories with webpack-generated, git-ignored files.
* `npm run db.prune`: empty MongoDB databases.
* `npm run db.seed`: seed MongoDB with mock data.
