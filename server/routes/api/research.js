/***********************************************************************************************************************
 *
 * api/game/research ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const researchController = require("../../controllers/api/research");
const {catchErrors} = require("../../handlers/error");

// get empire game data for player
router.get("/data", catchErrors(researchController.getGameData));

module.exports = router;
