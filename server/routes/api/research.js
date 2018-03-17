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
const apiController = require("../../controllers/api");
const jsonParser = require("body-parser").json();
const {catchErrors} = require("../../handlers/error");

// get empire game data for player
router.get("/data", catchErrors(researchController.getGameData));

// set star name request
router.post(
    "/order",
    jsonParser,
    catchErrors(apiController.gameProcessing), // verify game is not processing.
    catchErrors(researchController.changeOrder) // change research order
);

module.exports = router;
