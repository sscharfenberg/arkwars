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

// show all gammes
router.get("/", catchErrors(manageGamesController.showGames));

// show gammes on a certain page
router.get("/p/:page/s/:sortField/d/:sortDirection", catchErrors(manageGamesController.showGames));

// post change sort order request
router.post("/", catchErrors(manageGamesController.showGames));

// show edit gamme formm
router.get("/:id/edit", catchErrors(manageGamesController.showEditGame));
// show create game formm
router.get("/new", catchErrors(manageGamesController.showEditGame));

module.exports = router;
