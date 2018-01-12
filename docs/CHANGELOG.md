# Changelog

`12.01.2018`
- [x] Refactored mockdata again; mockdata now has "mapData", which exports stars and planets - we need both because of the IDs and planets have IDs for game and star. Previously, I imported stars twice - it was not executed twice thankfully, which would mean the planets don't fit the servers. Now stars are only imported and executed once.
- [x] Created `seed.randomPlanet` method that is used during game creation via admin screen as well as mockdata.
- [x] Expanded the Planets model by adding an array of resources the planet has. A planet can have zero or all resource type slots available. Implemented the Mongoose Model and the seeding of the resources to the planet, in the `seed.randomPlanet` method. Expanded gameData api and added the resources to the planet so they end up in the vuex store. Whoop.
- [x] Added new Mongoose model, `Harvesters` - these are resource extractors installed on a planet. Implemented as usual with ref to Planets, and a virtual field on the Planet. In the empire/api, the data gets shuffled around a bit so Vue can access it optimally.
- [x] For Planets all resource slots are now shown. They appear as either a full opacity button (if harvester installed) or as a low-opacity icon (if the slot is empty). Info for now as tooltip / aria-label, will become popover / dialog modals sometime soon.
- [x] `db.reseed` is amazingly useful ^.^

`11.01.2018`
- [x] Created the four basic resources - `energy`, `minerals`, `food` and `research`. Added base rules to server config, adjusted Player model and passed the information from the header component to `Resource` components that display what and how much the player has. These are global (player) resources that can be accessed from anywhere (logistics get tedious, no thanks...).
- [x] Learned that you should not use nested properties in Vuex state - Arrays that contain objects are fine, objects that contain objects are not.
- [x] refactored server config a bit since the file became way too big; extracted game rules in seperate files. 

`10.01.2018`
- [x] small(ish) finetuning for responsive layout of star.
- [x] more Vue Components: `Planets` and `Planet`. Empire screen now lists planets below every star, including an image of the planet type, the name of the planet and some mockups (for population, resource extractor slots, pds etc). Apart from the ice planet (which comes from DeviantArt User [opreadorin1](https://opreadorin1.deviantart.com/)), all planets are public domain NASA images of our solar system. 

`09.01.2018`
- [x] VueJS is a joy to work with.
- [x] improving Stars / Star Components for Empire screen. Star shows spectral type image, name of the star, and the location. Also, there is an edit button to change the name of the star; since editing should be done inline we needed different states (editing, saving) and show different buttons (edit, save, cancel) as well as a loading spinner while the XHR request is pending. API saves the name of the star and the state (gameData) is updated.
- [x] added resources mockup and player name/ticker to header. need to consider how to implement them, possibly as get functions in the Mongoose player model. 
- [x] switched npm scripts around a bit. now you need two seperate node tasks for development, `app.static.watch` and `js.dev`. Splitting them means we don't have a massive task; restarts are not as bad then.
- [x] added lazy sanitization.
- [x] added form validation via `vuelidate` (love the name!) so the client can't enter invalid star names. server validates this as well.
- [x] paid some technical debt - I lazily used `onClick` and `onChange` event handlers in the pug template. Under our CSP policy, these are `unsafe-inline` and should be avoided at all cost. Refactored these event handlers and turned them into script tags including our generated UUID nonce. better.

`07.01.2018`
- [x] Apparently I am easily influenced/scared - [HackerNoon](https://hackernoon.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5) made me implement a CSP policy. It doesn't hurt, but I am not happy with Vue's "unsafe-eval" requirement - and I probably spend too much time on twitter. CSP report API endpoint created, which simply logs the report, header and user.
- [x] switched to `UglifyJS3`, mainly to remove an error message (UglifyJS@2 has problems with the webpack output "unexcepted token punc"). Turns out v3 minifies better, bundle size went down ~30%. I'll take it.
- [x] Tried to get Jest to work and failed -.- Main problem was some dependency hell with the new babel7 and older babel plugins - [babel/babel#7110](https://github.com/babel/babel/issues/7110). Needs to be revisited ...
- [x] Scaffolding Stars / Star Component for empire view.

`06.01.2018`
- [x] Refactoring of SCSS. Since we switched to "stylelint-config-standard", which is very restrictive, we had to refactor the scss - and extend `.stylelintrc` on the way. Changed formatting to fix ~280 new issues. Quite happy with style tooling now.
- [x] Added a session timeout, which resulted in me losing session sometimes. need to watch this, meh.
- [x] Learning VueJS: Added `vue-i18n` and cleaned up messageString handling. Still cached via localStorage, still requested from api. Added `beforeCreate` hook with gamedata api fetch. New/refactored Components:
  - common/Icon: for SVG icons (via external spritesheet, generated via gulp of all things)
  - Header/RefreshGameDataBtn: sets global state, asks server forgame data. Handles state (fetching/disabled). Also added a bit of styling ^.^
  - common/Spinner - taken from [sergeyloysha](https://github.com/sergeyloysha/vue-spinner-component/) and stripped down :) 

`05.01.2018`
- [x] `gamedata` api endpoint now delivers correct gamedata to the client.
- [x] fixed a nasty bug that resulted in player homesystems without planets. whoops.
- [x] bumped dependencies - switching to babel7/babel-loader8.
- [x] improved tooling: moved generic babel options to .babelrc file, renamed eslint and stylelint config files to default values. added babel cache directory.
- [x] some small style improvements - global scss files are now imported via sass-loader data, no need to import them in every component.

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
