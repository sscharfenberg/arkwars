/***********************************************************************************************************************
 *
 * `/admin/games` ROUTES
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
// post edit gamme formm
router.post("/:id/edit",
    manageGamesController.parseCheckboxAndDates,
    catchErrors(manageGamesController.editGame)
);

// show create game formm
router.get("/new", catchErrors(manageGamesController.showEditGame));
// post create gamme formm
router.post("/new",
    manageGamesController.parseCheckboxAndDates, // 1. parse date+time to datetime and assign checkbox values
    catchErrors(manageGamesController.newGame), // 2. create new game with metadata
    catchErrors(manageGamesController.seedGame) // 3. seed universe with systems
);

// delete game request
router.get("/:id/delete", catchErrors(manageGamesController.deleteGame)); // TODO: remove systems

module.exports = router;
