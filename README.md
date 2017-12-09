# ArkWars

Frontend and Backend for Arkwars (**working title!**) - a strategic turn-based game of galactic conquest.

Number of times `.env` file got submitted to git: **2** 

### Warning
This is a rough and early work in progress. There are lots of areas that don't work yet, lots of stuff will break again and again. I am using github as remove savefile, so there are lots of commits and no releases (yet!).
 
Use at your own risk. 

## Requirements

* MongoDB 3.4 Database
* Redis database as session store
* NodeJS 8.9.0 LTS, npm 5.5.1

## Usage: npm Scripts

* `npm run server.start`: starts the node backend
* `npm run watch`: cleanup, create static assets, use webpack-dev-server to deliver assets for **development** and have gulp watch static assets (`scss`, `svg`s etc.)
* `npm run build.static`: cleanup, then generates static assets - fonts, images, styles, icon spritesheet.
* `npm run js.prod`: generate webpack bundles (including templates) for a **production** environment.
* `npm run jst.test`: run unit tests once and analyse coverage.
* `npm run js.test.watch`: start jest unit tests in watch mode. Incompatible with IntelliJ's `Run` Conolse.
* `npm run cleanup`: empty directories with webpack-generated, git-ignored files.
* `npm run db.prune`: delete MongoDB collections.
* `npm run db.seed`: seed MongoDB with mock data.

## Documentation
(this needs work!)

* [Changelog](https://github.com/sscharfenberg/arkwars/blob/master/docs/CHANGELOG.md)
* [TODO](https://github.com/sscharfenberg/arkwars/blob/master/docs/TODO.md)
* [Installation](https://github.com/sscharfenberg/arkwars/blob/master/docs/INSTALLATION.md)

