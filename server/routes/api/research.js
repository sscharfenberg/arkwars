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
    jsonParser, // 1. add JSON parameters to req.body
    catchErrors(apiController.gameProcessing), // 2. verify game is not processing.
    catchErrors(researchController.verifyChangeOrder), // 3. verify request is valid
    catchErrors(researchController.doChangeOrder), // 4. change research order
    catchErrors(researchController.sendResearches) // 5. get research jobs from DB and send to client via JSON
);

// set star name request
router.post(
    "/delete",
    jsonParser, // 1. add JSON parameters to req.body
    catchErrors(apiController.gameProcessing), // 2. verify game is not processing.
    catchErrors(researchController.verifyDeleteResearch), // 3. verify request is valid
    catchErrors(researchController.doDeleteResearch), // 4. delete research job
    catchErrors(researchController.sendResearches) // 5. get research jobs from DB and send to client via JSON
);

module.exports = router;
