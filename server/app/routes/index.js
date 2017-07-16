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
const adminController = require("../controllers/admin");
const { catchErrors } = require("../handlers/error");

router.get("/", indexController.homePage);


// TODO: check if user is allowed
router.get(
    "/api/game/:game/status",
    catchErrors(apiController.gameStatus)
);


router.get(
    "/language/:lang",
    catchErrors(userController.switchLanguage)
);


router.get("/profile", (req, res) => { res.render("profile", {title: "My Profile"})});

/*
 * auth routes =========================================================================================================
 */

// show registration form
router.get("/auth/register", userController.showRegistration);
// post registration
router.post(
    "/auth/register",
    catchErrors(userController.validateRegistration), // 1. Validate the registration data
    catchErrors(userController.doRegistration), // 2. register the user
    catchErrors(userController.sendConfirmationEmail) // 3. send confirmation email
);
// confirm email
router.get(
    "/auth/confirm/:token",
    catchErrors(userController.confirmEmail)
);
// show login form
router.get("/auth/login", authController.showLoginForm);
// do login
router.post("/auth/login", authController.login);
router.get("/auth/logout", authController.logout);

/*
 * admin routes ========================================================================================================
 * TODO: isAdmin middleware!
 */

router.get(
    "/admin/mock/email/:template",
    catchErrors(adminController.showEmail)
);

module.exports = router;
