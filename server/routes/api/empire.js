/***********************************************************************************************************************
 *
 * api/game/empire ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const apiController = require("../../controllers/api/empire");
const {catchErrors} = require("../../handlers/error");
const jsonParser = require("body-parser").json();

// get empire game data for player
router.get("/data", catchErrors(apiController.getGameData));

// get empire game data for player
router.post("/star/name", jsonParser, catchErrors(apiController.saveStarName));

module.exports = router;
