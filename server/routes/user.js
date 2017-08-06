/***********************************************************************************************************************
 *
 * USER ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const dashboardController = require("../controllers/user/dashboard");
const { catchErrors } = require("../handlers/error");


// switch language
// TODO move to some sort of utility route group?
router.get("/language/:lang", catchErrors(userController.switchLanguage));


// user home
router.get(
    "/dashboard",
    authController.isLoggedIn,
    dashboardController.showDashboard
);

// post change email address
router.post(
    "/dashboard/email",
    authController.isLoggedIn, // 1. check if user is logged in
    catchErrors(dashboardController.validateChangeEmail), // 2. validate email
    catchErrors(dashboardController.updateEmail), // 3. update user
    catchErrors(dashboardController.sendEmailUpdated)// 4. send email
);

module.exports = router;
