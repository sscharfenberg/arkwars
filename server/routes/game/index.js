/***********************************************************************************************************************
 *
 * GAMES ROUTES
 * this includes "meta" routes - list, enlist, quit etc.
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const authController = require("../../controllers/auth");
const gameController = require("../../controllers/game");
const empireController = require("../../controllers/game/empire");
const researchController = require("../../controllers/game/research");
const shipyardsController = require("../../controllers/game/shipyards");
const {catchErrors} = require("../../handlers/error");

router.use("/", authController.isValidUser);

// show "enlist to game" form
router.get(
    "/:game/enlist",
    catchErrors(gameController.checkCanEnlist), // 1. check if the game can be enlisted to
    gameController.showEnlistForm // 2. show enlist form for empire name/ticker
);

// post "enlist to game" form
router.post(
    "/:game/enlist",
    catchErrors(gameController.checkCanEnlist), // 1. check if the game can be enlisted to
    catchErrors(gameController.validateEnlistForm), // 2. validate form data
    catchErrors(gameController.enlistUser), // 3. enlist user
    catchErrors(gameController.prepareHomeSystem) // 4. assign an available home system to the user.
);

// switch to game
router.get(
    "/:game/select",
    catchErrors(gameController.validateGameSelect), // 1. check if the user can actually select the game
    catchErrors(gameController.selectGame) // 2. update database
);

// withdraw enlisting
router.get(
    "/:game/withdraw",
    catchErrors(gameController.validateWithdraw), // 1. check if user can withdraw
    catchErrors(gameController.withdrawEnlistedUser) // 2. update user, player and planets
);

// game screens ========================================================================================================
router.get(
    "/:game/empire",
    catchErrors(gameController.verifyGameAuth), // 1. check if game exists and user is enlisted
    catchErrors(empireController.showIndex) // 2. show index page
);

router.get(
    "/:game/research",
    catchErrors(gameController.verifyGameAuth), // 1. check if game exists and user is enlisted
    catchErrors(researchController.showIndex) // 2. show index page
);

router.get(
    "/:game/shipyards",
    catchErrors(gameController.verifyGameAuth), // 1. check if game exists and user is enlisted
    catchErrors(shipyardsController.showIndex) // 2. show index page
);

module.exports = router;
