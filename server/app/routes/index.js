/***********************************************************************************************************************
 *
 * MAIN ROUTES
 *
 * main express routing file
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const indexController = require("../controllers/index");
const apiController = require("../controllers/api");
const authController = require("../controllers/auth");
const { catchErrors } = require("../handlers/error");

router.get("/", indexController.homePage);

router.get("/api/game/:game/status",
    catchErrors(apiController.gameStatus)
    // TODO: check if user is allowed
);

router.get("/auth/register", authController.showRegister);


module.exports = router;
