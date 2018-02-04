/***********************************************************************************************************************
 *
 * api/game/empire ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const empireController = require("../../controllers/api/empire");
const apiController = require("../../controllers/api");
const {catchErrors} = require("../../handlers/error");
const jsonParser = require("body-parser").json();

// get empire game data for player
router.get("/data", catchErrors(empireController.getGameData));

// set star name request
router.post(
    "/star/name",
    jsonParser,
    catchErrors(apiController.gameProcessing), // verify game is not processing.
    catchErrors(empireController.saveStarName) // change star name
);

// install harvester request
router.post(
    "/harvester/install",
    jsonParser,
    catchErrors(apiController.gameProcessing), // verify game is not processing.
    catchErrors(empireController.checkInstallHarvester), // check for auth, funds, slots
    catchErrors(empireController.installHarvester) // do db updates
);

// build PDUs request
router.post(
    "/pdu/build",
    jsonParser,
    catchErrors(apiController.gameProcessing), // verify game is not processing.
    catchErrors(empireController.checkBuildPdu), // check for auth, funds, maxPdu
    catchErrors(empireController.buildPdus) // do db updates
);

// change food consumption request
router.post(
    "/planet/food",
    jsonParser,
    catchErrors(apiController.gameProcessing), // verify game is not processing.
    catchErrors(empireController.checkFoodConsumption), // check for auth, bounds
    catchErrors(empireController.setFoodConsumption) // do db updates
);

module.exports = router;
