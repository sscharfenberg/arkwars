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
    catchErrors(dashboardController.showDashboard)
);

// post change email address
router.post(
    "/dashboard/email",
    authController.isLoggedIn, // 1. check if user is logged in
    catchErrors(dashboardController.validateChangeEmail), // 2. validate email
    catchErrors(dashboardController.updateEmail), // 3. update user
    catchErrors(dashboardController.sendEmailUpdated)// 4. send email
);

// post change password
router.post(
    "/dashboard/password",
    authController.isLoggedIn, // 1. check if user is logged in
    catchErrors(dashboardController.validateChangePassword), // 2. validate password
    catchErrors(dashboardController.updatePassword) // 3. change password
);

// post change avatar
router.post(
    "/dashboard/avatar",
    authController.isLoggedIn, // 1. check if user is logged in
    dashboardController.bufferAvatarFormData, // 2. multipart/form-data middleware
    catchErrors(dashboardController.validateAvatar), // 3. validate avatar
    catchErrors(dashboardController.writeAvatar), // 4. write avatar to disk
    catchErrors(dashboardController.deleteOldAvatar), // 5. delete old avatar
    catchErrors(dashboardController.updateAvatarUser), // 6. update user with avatar
);

// delete avatar
router.get(
    "/dashboard/avatar/delete",
    authController.isLoggedIn, // 1. check if user is logged in
    catchErrors(dashboardController.deleteCurrentAvatar) // 2. delete current avatar
);

// delete user account
router.post(
    "/dashboard/delete",
    catchErrors(dashboardController.deleteUser)
);


module.exports = router;
