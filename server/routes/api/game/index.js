/***********************************************************************************************************************
 *
 * /api/game/ ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const apiController = require("../../../controllers/api");
const authController = require("../../../controllers/auth");
const {catchErrors} = require("../../../handlers/error");


router.use("/", authController.isValidUser);

// game status pulse - next turn etc.
router.get(
    "/:game/status",
    // TODO: check if user has player in this game
    catchErrors(apiController.gameStatus)
);

// upgrade storage levels
router.post("/storage-upgrade/:area",
    catchErrors(apiController.gameProcessing), // 1. verify game is not processing.
    catchErrors(apiController.verifyStorageUpgrade), // 2. check if request is valid
    catchErrors(apiController.doStorageUpgrade) // 3. update database
);

// api/game routes
router.use("/empire/", require("./empire"));
router.use("/research/", require("./research"));

module.exports = router;
