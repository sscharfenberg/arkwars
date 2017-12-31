# Changelog

`31.12.2017`
- [x] improved mockdata and added a homesystem to players
- [x] improved webpack tooling - added imagemin-webpack-plugin for image optimization.
- [x] added a common chunk since it starts to make sense (moment, axios, later Vue etc.). simple for now. 
- [x] added "enlisted games" to admin > edit user

`30.12.2017`
- [x] Changed the way suspensions are handled and created a new schema for suspensions. Added virtual field to User schema and created a "isSuspended" virtual function. Refactored suspension handling and admin pages - suspensions are now visible on the user detail page, and you can now clear specific suspensions.
- [x] bumped dependencies, except for mongoose5 (way too many breaking changes, will look into this later)

`26.12.2017`
- [x] Changed api/textstrings so all texts are now cached on server start, api calls to the endpoint simply filter and deliver the array.
- [x] `Admin > Users` and `Admin > Games`: Added `moment.fromNow()` to datetimne displays.
- [x] created `handlers/authorized.js` with generic functions that return if user is authed, enlisted etc. Refactored controllers to use this handler.

`23.12.2017`
- [x] Boilerplating text string handling. language is passed via template from server to client, as well as the version of the json language files on disk. The client then checks if cached texts exists and if they are not older then the server files. If not, client asks server for texts and updates cache. Finally, vue ist extended and $txt is used for all text-strings for use in all components.
You can now switch languages, and the header in "Empire" screen is dynamically updated.
- [x] Changed drawer state - now saved on server (User), not in localstorage. Users that are not logged in do not save states during navigation, which is fine. Now, the drawer is open when the page is getting loaded, not having the page load, and after that the drawer gets opened.

`17.12.2017`
- [x] Made cron server more robust: Originally, we used node-schedule to schedule a turn's processing. This worked ok, but it doesn't scale, and changes via admin panel to game settings (active, turnDue etc) would not change the already scheduled turn processing. Now the cron server checks at the beginning of each minute for games that need to be processed. This means the turnDue is not precise anymore, it can vary by 30s. However, this scales better and changes in the admin panel / db will be immediately reflected.
- [x] Wrapped cron server in nodemon for dev restarts / crashes.
- [x] Bumped dependencies
- [x] added map preview to admin > edit game. added moment.fromNow() for games overview
- [x] improved mockdata by dynamically generating games with stars and planets

`10.12.2017`
- [x] played around a bit with VueJS tooling. Added child component and included an image via url-loader / file-loader. Not sure I am happy with .Vue files.

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
