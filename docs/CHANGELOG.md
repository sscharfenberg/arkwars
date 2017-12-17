# Changelog

`17.12.2017`
- Made cron server more robust: Originally, we used node-schedule to schedule a turn's processing. This worked ok, but it doesn't scale, and changes via admin panel to game settings (active, turnDue etc) would not change the already scheduled turn processing. Now the cron server checks at the beginning of each minute for games that need to be processed. This means the turnDue is not precise anymore, it can vary by 30s. However, this scales better and changes in the admin panel / db will be immediately reflected.
- Wrapped cron server in nodemon for dev restarts / crashes.
- Bumped dependencies

`10.12.2017`
- played around a bit with VueJS tooling. Added child component and included an image via url-loader / file-loader. Not sure I am happy with .Vue files.

`09.12.2017`
- [x] make values for progressbar dynamic from server. clock is ticking properly now.
- [x] do not update progressbar for inactive games, show default (empty) progressbar.

`03.12.2017`
- [x] Webpack Refactor, +BundleAnalyzer and extract header css link; three chunks at the moment (app, admin, empire)
- [x] Updated dependencies again. 
- [x] Improved admin > games by adding turndue column (sortable). 
- [x] Edit Games screen now allows editing of current turn and turn due. 
- [x] Improved cron task; processed turns are written into database with (mockup) logdata.
 
`05.11.2017`
- [x] Updated Packages - apparently no side-effects this time \o/ 
- [x] Implemeneted Tooling for Vue Components, reconfigured chunks so app is always needed, admin and empire|fleets|etc are added via pug template.
 
`01.10.2017`
- [x] externalize cron/turn handling into a seperate node process. 
- [x] add orbital index to planets
- [x] enlist => assign random player system 
- [x] withhdraw => remove ownership of player systems

`older stuff`
- [x] change Users model and make "players" a virtual field. change controller User.find, add autopopulate players.
- [x] Add a datetime picker for game generation.
- [x] delete game => delete stars and planets
- [x] add map dimensions to saved game when seeding
- [x] seed universe with star systems, include preview
- [x] Delete game
- [x] Create game
- [x] Edit game  

even older changes - see commits.
