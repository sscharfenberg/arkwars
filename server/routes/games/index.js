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
const gamesController = require("../../controllers/games");
const { catchErrors } = require("../../handlers/error");

// isAdmin Middleware protecting the admin routes
router.use("/", authController.isLoggedIn);

// show "enlist to game" form
router.get(
    "/:game/enlist",
    catchErrors(gamesController.checkCanEnlist),
    gamesController.showEnlistForm
);

// post "enlist to game" form
router.post(
    "/:game/enlist",
    catchErrors(gamesController.checkCanEnlist), // 1. check if the game can be enlisted to
    catchErrors(gamesController.validateEnlistForm), // 2. validate form data
    catchErrors(gamesController.enlistUser) // 3. enlist user
);


module.exports = router;
