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
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const dashboardController = require("../controllers/user/dashboard");
const { catchErrors } = require("../handlers/error");

// our homepage \o/
router.get("/", indexController.homePage);

// TODO: check if user is allowed
router.get("/api/game/:game/status", catchErrors(apiController.gameStatus));

// switch language
router.get("/language/:lang", catchErrors(userController.switchLanguage));
// user home
router.get(
    "/dashboard",
    authController.isLoggedIn,
    dashboardController.showDashboard
);

/*
 * auth routes =========================================================================================================
 */
router.use("/auth", require("./auth"));

/*
 * admin routes ========================================================================================================
 */
router.use("/admin/", require("./admin"));


module.exports = router;
