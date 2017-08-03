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
const resetController = require("../controllers/auth/reset");
const resendController = require("../controllers/auth/resend");
const registrationController = require("../controllers/auth/register");
const adminController = require("../controllers/admin");
const userHomeController = require("../controllers/user/home");
const { catchErrors } = require("../handlers/error");

// our homepage \o/
router.get("/", indexController.homePage);

// TODO: check if user is allowed
router.get("/api/game/:game/status", catchErrors(apiController.gameStatus));

// switch language
router.get("/language/:lang", catchErrors(userController.switchLanguage));
// user home
router.get(
    "/home",
    authController.isLoggedIn,
    userHomeController.showHome
);

/*
 * auth routes =========================================================================================================
 */

// show registration form
router.get("/auth/register", registrationController.showRegistration);
// post registration
router.post(
    "/auth/register",
    catchErrors(registrationController.validateRegistration), // 1. Validate the registration data
    catchErrors(registrationController.doRegistration), // 2. register the user
    catchErrors(registrationController.sendConfirmationEmail) // 3. send confirmation email
);
// confirm email (from email link)
router.get("/auth/confirm/:token", catchErrors(registrationController.confirmEmail));
// login
router.get("/auth/login", authController.showLoginForm);
router.post("/auth/login", authController.login);
// logout
router.get("/auth/logout", authController.logout);
// show "resend activation email" form
router.get("/auth/resend", resendController.showResendForm);
// post "resend activation email" form
router.post(
    "/auth/resend",
    catchErrors(resendController.validateResend), // 1. Validate form data
    catchErrors(resendController.doResend) // 2. resend activation link
);
// show reset form
router.get("/auth/reset", resetController.showResetForm);
// post "request reset email" request
router.post(
    "/auth/reset",
    catchErrors(resetController.validateRequest), // 1. validate form data
    catchErrors(resetController.updateResetUser), // 2. update user
    catchErrors(resetController.sendResetEmail) // 3. send reset email
);
// show change password form (from email link)
router.get("/auth/reset/:token",
    catchErrors(resetController.validateResetToken), // 1. validate token
    resetController.showChangeForm // 2. show password change form
);
// post change password form
router.post("/auth/reset/:token",
    catchErrors(resetController.validateResetToken), // 1. validate token
    catchErrors(resetController.validateChangeForm), // 2. validate form data
    catchErrors(resetController.resetChangePassword) // 3. change password
);

/*
 * admin routes ========================================================================================================
 */
router.use("/admin/", authController.isAdmin);
router.get(
    "/admin/mock/email/:template",
    catchErrors(adminController.showEmail)
);

module.exports = router;
