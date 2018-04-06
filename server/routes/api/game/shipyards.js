/***********************************************************************************************************************
 *
 * api/game/shipyards ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const shipyardsController = require("../../../controllers/api/shipyards");
//const apiController = require("../../../controllers/api");
//const jsonParser = require("body-parser").json();
const {catchErrors} = require("../../../handlers/error");

// get empire game data for player
router.get("/data", catchErrors(shipyardsController.getGameData));

module.exports = router;
