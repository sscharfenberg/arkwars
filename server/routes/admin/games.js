/***********************************************************************************************************************
 *
 * MANAGE GAMES ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const manageGamesController = require("../../controllers/admin/games");
const { catchErrors } = require("../../handlers/error");

// manage games routes
router.get("/games", catchErrors(manageGamesController.showGames));

module.exports = router;
