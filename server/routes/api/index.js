/***********************************************************************************************************************
 *
 * API ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const apiController = require("../../controllers/api");
const userController = require("../../controllers/user");
const authController = require("../../controllers/auth");
const {catchErrors} = require("../../handlers/error");

router.use("/", authController.isLoggedIn);

// game status pulse - next turn etc.
router.get(
    "/game/:game/status",
    // TODO: check if user has player in this game
    catchErrors(apiController.gameStatus)
);

// update user, set draweropen = true
router.post("/user/opendrawer", catchErrors(userController.openDrawer));

// update user, set draweropen = false
router.post("/user/closedrawer", catchErrors(userController.closeDrawer));

module.exports = router;
