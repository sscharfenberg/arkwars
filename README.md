# ArkWars

Frontend and Backend for Arkwars (**working title!**) - a strategic turn-based game of galactic conquest.

Number of times `.env` file got submitted to github: **2** 

### Warning

This is a rough and early work in progress, it is far from ready to be used in any implementation whatsoever. 
There are lots of areas that don't work yet, lots of stuff will break again and again. 
Also, I am (ab-) using git as remote savefile, so there are lots of commits and no releases - yet.
 
Use at your own risk. 

## Requirements

* MongoDB 3.4 Database
* Redis database as session store
* NodeJS 8.9.0 LTS, npm 5.5.1

## Usage: npm Scripts

* `npm run server.start`: starts the backend server that servers HTML and provides the REST API. Also serves static (gulp-created) content.
* `npm run server.cron`: starts the cron server that checks each minute if there are turns to process, games to start etc.
* `npm run dev.watch`: cleanup, create static assets, use webpack-dev-server to deliver assets for **development** and have gulp watch app assets (`scss`, `svg`s etc.)
* `npm run app.static.build`: cleanup, then generates static app assets - fonts, images, styles, icon spritesheet.
* `npm run js.prod`: generate webpack bundles (including templates) for a **production** environment.
* `npm run js.dev`: generate webpack bundles (including templates) for a **development** environment and starts webpack-dev-server.
* `npm run js.test`: run unit tests once and analyse coverage.
* `npm run js.test.watch`: start jest unit tests in watch mode. Incompatible with IntelliJ's `Run` Conolse.
* `npm run files.cleanup`: empty directories with webpack-generated, git-ignored files.
* `npm run db.prune`: delete MongoDB collections.
* `npm run db.seed`: seed MongoDB with mock data.

## Documentation
(this needs work!)

* [Changelog](https://github.com/sscharfenberg/arkwars/blob/master/docs/CHANGELOG.md)
* [TODO](https://github.com/sscharfenberg/arkwars/blob/master/docs/TODO.md)
* [Installation](https://github.com/sscharfenberg/arkwars/blob/master/docs/INSTALLATION.md)

