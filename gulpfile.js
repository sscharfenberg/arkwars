/***********************************************************************************************************************
 *
 * gulpfile.js
 * @type {Gulp}
 * this file simply includes the task files.
 *
 **********************************************************************************************************************/
require( "./internals/scripts/gulp/styles");
require( "./internals/scripts/gulp/sync");
require( "./internals/scripts/gulp/buildAssets-prod");
require( "./internals/scripts/gulp/watchAssets-dev");