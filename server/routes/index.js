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

// our homepage \o/
router.get("/", indexController.homePage);

/*
 * user routes =========================================================================================================
 */
router.use("/", require("./user"));

/*
 * api routes ==========================================================================================================
 */
router.use("/api", require("./api"));

/*
 * auth routes =========================================================================================================
 */
router.use("/auth", require("./auth"));

/*
 * admin routes ========================================================================================================
 */
router.use("/admin", require("./admin"));

/*
 * game routes =========================================================================================================
 */
router.use("/game", require("./game"));

module.exports = router;
