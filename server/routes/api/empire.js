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

// set star name request
router.post("/star/name", jsonParser, catchErrors(apiController.saveStarName));

// install harvester request
router.post(
    "/harvester/install",
    jsonParser,
    // TODO: check if game is processing
    catchErrors(apiController.checkInstallHarvester), // check for auth, funds, slots
    catchErrors(apiController.installHarvester) // do db updates
);

// build PDUs request
router.post(
    "/pdu/build",
    jsonParser,
    // TODO: check if game is processing
    catchErrors(apiController.checkBuildPdu), // check for auth, funds, maxPdu
    catchErrors(apiController.buildPdus) // do db updates
);

module.exports = router;
