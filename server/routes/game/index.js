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
const { catchErrors } = require("../../handlers/error");

// isAdmin Middleware protecting the admin routes
router.use("/", authController.isLoggedIn);

// show "enlist to game" form
router.get(
    "/:game/enlist",
    catchErrors(gameController.checkCanEnlist),
    gameController.showEnlistForm
);

// post "enlist to game" form
router.post(
    "/:game/enlist",
    catchErrors(gameController.checkCanEnlist), // 1. check if the game can be enlisted to
    catchErrors(gameController.validateEnlistForm), // 2. validate form data
    catchErrors(gameController.enlistUser) // 3. enlist user
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
    catchErrors(gameController.withdrawEnlistedUser), // 2. update user and player
);



module.exports = router;