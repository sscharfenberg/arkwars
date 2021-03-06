/***********************************************************************************************************************
 *
 * API ROUTES
 * Api Endpoints always answer with JSON instead of rendered HTML templates.
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
const bodyParser = require("body-parser");
const cspParser = bodyParser.json({type: "application/csp-report"});

router.use("/", authController.isValidUser);

// Content Security Policy Violations
router.post(
    "/csp-violation",
    cspParser,
    apiController.cspViolation
);

// update user, set draweropen = true
router.post("/user/opendrawer", catchErrors(userController.openDrawer));

// update user, set draweropen = false
router.post("/user/closedrawer", catchErrors(userController.closeDrawer));

// get language and area specific textstrings
router.get("/textstrings/:locale/:area", apiController.getTextStrings);

// api/game routes
router.use("/game/", require("./game"));

module.exports = router;
