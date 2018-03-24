# Changelog

`25.03.2018`
- [x] switched svg icon spritesheets from inline in html to external files for better caching. 
- [x] bumped dependencies

`18.03.2018`
- [x] refactored and cleaned up `TechLevel`(s) components. 
- [x] created a common (generic) component for `ProgressBar`s.
- [x] added research qeue - `Queue`, `QueueItem`, `AbortResearch` components. QeueItems can be dragged to change order, and they can be aborted using a modal confirm window.
- [x] added API middlewares for verifying and executing `change order` and `delete job`.
- [x] server currently does not progress researches, and `start research` is currently mocked (needs to be a modal showing research costs).
- [x] bumped dependencies

`11.03.2018`
- [x] bumped dependencies again. Webpack4 continues to mature, one fork could be removed already.
- [x] List Player TechLevels: TechLevels and Research Jobs are now sent from API to client, and visualized via `TechLevels` and `TechLevel` Components. If there is a research queued for a technology, the research is shown (very raw/unstyled).
- [x] new Icons for Armour (yes, british spelling, sue me) and shields.
- [x] using the "fetch from api" button now also updates the turn progress on the right side.
 

`03.03.2018`
- [x] bumped dependencies. Switched to `webpack`@4 and refactored build scripts accordingly. Some webpack plugins where not yet ready for webpack4, so I used instructions from [Ivan Erceg](https://coderwall.com/p/q_gh-w/fork-and-patch-npm-moduels-hosted-on-github) to link to forks with fixes for two plugins. Using these forks until the fixes land upstream.
    - `stylelint-webpack-plugin`: [Github Issue](https://github.com/JaKXz/stylelint-webpack-plugin/issues/137) - [Fork with fix](https://github.com/waterfoul/stylelint-webpack-plugin/commit/0f46e8fcc857db10e01b84dbe4b378e3956a9379)
    - `html-webpack-harddisk-plugin`: [Github Issue](https://github.com/jantimon/html-webpack-harddisk-plugin/issues/12) - [Fork with fix](https://github.com/sscharfenberg/html-webpack-harddisk-plugin/commit/968d2538b004f2fc257e6cceb997954f07891d05)
- [x] some layout work - added Nizza's Icons for weapontypes (much appreciated!), changed defense construction active classes.
- [x] started preparations for research and tech levels - added techlevels to player, created `Research` model, added some researches to `db.seed`.    

`25.02.2018`
- [x] moved `dotfiles` to project root - `.eslintrc`, `.babelrc`, `.stylelintrc`. It is currently way to annoying to move these files elsewhere, latest culprit is babel-jest and babelrc location. So they now make the project root a bit uglier, but it should avoid tooling problems.
- [x] added unit tests via `Jest`. Starting with unit tests for common components - `Icon`, `Button`, `Spinner`, `Costs`, `Header`, `Resource`, `FetchGameDataButton`, mocking vue-i18n and vuex store.
- [x] `Header` now passes the area prop through to `FetchGameDataButton`.

`18.02.2018`
- [x] bumped dependencies, free weekend ^.^

`11.02.2018 - @0.0.5`
- [x] Switched from `eslint-plugin-html` to `eslint-plugin-vue`. Reformatted/refactored all .vue components so they follow eslints vue-rules. Cleaner sourcecode, hooray!
- [x] bumped a few dependencies.
- [x] added `Summary` to Empire - shows the number of produced resources per type and turn, as well as food consumption and total population. Realized with grid layout because i want to :)
- [x] added starting colony population to the planet with the most resources:
  - when a player enlists to a game
  - `db.seed` and `db.reseed`

`04.02.2018`
- [x] Refactored Modals so the styles are app-global. Adjusted styling a bit.
- [x] small improvements: changed modal styling; pdu build is only shown if there are slots left, changed pdu display from dots to number (consistency, we use dots for turns).
- [x] Visualization of population of planet - new Components `Population`, `Colony` and `FoodConsumption` - modal window for colony that shows accurate population value, and Food Consumption slider that shows resulting total consumption and population change.
- [x] API endpoint for food consumption change - as usual, validate first, update DB next. 
- [x] bumped dependencies
- [x] games are now set to `processing` when the turn is being calculated; api sends error message if turn is still processing.

`28.01.2018`
- [x] bumped dependencies. Mostly semver patch/minor; with the exception of Mongoose that was bumped from v4 to v5. So far, no massive breakage.
- [x] more work on implementing **population**: cron server now handles population growth. Calculation of growth is imported from a shared server/client function.
- [x] refactored turn handler a bit, `cron` folder now has the first subdirectory for `turn`s.
- [x] food Consumption uses Mongoose bulkWrite API, this means updates are sent in batches to the db. This should allow us to handle more players and bigger maps (hopefully!). With small sample sizes this works well.
- [x] population - effective and real - is sent to client and dumped - no visualization or functions yet.
- [x] added postinstall script that creates the necessary directories, so we don't need `.gitkeep` files anymore.
- [x] refactored `cron/turn/harvesterProduction.js` so it uses `bulkWrite` API instead of seperate Promises.
- [x] refactored the files that are shared between server and client (game rules!) into a `/shared/` directory - this contains either constants or pure functions. client config imports specific files, other handlers will import functions (future food consumption slider). Changed objects around a bit.
- [x] improved checking if construction > save + build buttons need to be disabled.  

`20.01.2018`
- [x] Improved error handling when client and server are out of sync. If the server finds an api request to be not valid, he sends the translated error message to the client. the client then shows a `vue-snotify` notification (new dependency, yeah!). Implemented for all current game api endpoints.
- [x] holiday two-week sprint is over -.- 


`18.01.2018 - @0.0.4`
- [x] Refactored `Construction` Component - it now includes the title, a (new) toggle list of PDU types, and the form-rows for each type. Previously, the component was rendered once for each type, but with that the tab-like mechanic was not possible.
- [x] Added "Is Planet Constructing" mechanics, similar to isStarNameSaving with the planetid in a state array.
- [x] Max PDU value is now enforced (tmp: 10), but it is still not clear how this value will be determined - techlevel, population, planet type?
- [x] api endpoint implemented, server now verifies the request is valid, then creates new PDUs and subtracts build costs. New PDU ids are sent to the client, who updates the state.
- [x] pdu build costs are now dynamic, depending on the amount selected. Surprisingly simple - this reactive stuff is pretty nice.
- [x] inlined the svg spritesheet instead of external reference. saves some headaches, and since the html is gzipped the perf cost isn't too bad.

`17.01.2018`
- [x] Resource grade is now shown before install. It doesn't really make sense to hide this information from the player in the first place.
- [x] worked an PDUs - icon in planet list now shows the number of active PDUs, click on the button opens the `DefenseDetails` Modal.
- [x] `DefenseDetails` now shows the number of active PDUS, a list of PDUs in build, and a form to build more PDUs (`Construction`).
- [x] For this, we needed weapon/PDU types and appropriate icons. Apart from "Missile", these are placeholders - not really happy with them.

`16.01.2018`
- [x] added harvester production to turn processing. harvesters now actually produce resources (still unmodified by techlevel since that doesn't exist yet). Need to test this though, since we have to do one update per player - so, if there are 200 players, we need to execute 200 MongoDB `findOneAndUpdate`'s. Updating multiple records with different values is a hotly requested feature though, so we'll see.
- [x] refactored planet.resources[].value - it is now a straight modifier to resource production. Changed turn processing so the modifier gets accounted for.
- [x] Added `InfoModal` Component, that shows information about a harvester - either the turns remaining or the amount produced. Again, this is unmodified by techlevel.
- [x] Started work on PDUs - added Mongoose model, rules and random mockdata seeding.

`15.01.2018`
- [x] first simple steps for cron turn handling, added a (synchronuous!) turn processing structure and started with the handling of harvesters in built.
- [x] with harvesters actually getting built, I discovered that using the refresh button correctly updates gameData, but the "pips" indicating how many turns to build did not update. Solved this by a lot of refactoring; `Harvester` is a Component now and used from `ResourceType`. It is passed the id of the harvester as prop and gets the data from the store by Id.
- [x] fixed a ug where db.seed switched player/npc type chances for planets. now we should not see tomb planets in player homesystems anymore.
- [x] refactored the api, so the data returned is a bit friendlier for Vuex (no deeply nested structures anymore). Gave up on making the Vuex store game-wide, it will be area-specific.

`14.01.2018`

Added player actions to resource slots. Empty slots are now a button; @click opens a modal that shows the costs for the harvester and asks if it should be installed. On confirmation, the server inserts a new harvester into the database.
For this, several additions / changes had to be implemented:
- [x] Rules and texts for harvesters, including client rules where the client imports a server file so the client knows costs etc as well.
- [x] new api endpoint, `/api/game/empire/harvester/install` with two new middlewares - one for validating, one for actually installing the harvester. The server subtracts the resources, the client does the same (immediately visible).
- [x] New dependency, `vue-js-modal`.
- [x] Additions to store, actions and mutations for state handling.
- [x] Added new Vue Components: `Costs` (displays costs in resources/turns), `InstallModal` which uses `vue-js-modal` to display a modal confirm window.
- [x] quite extensive changes to `ResourceTypes`

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
