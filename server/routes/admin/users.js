/***********************************************************************************************************************
 *
 * ADMIN/USERS ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const manageUsersController = require("../../controllers/admin/users");
const { catchErrors } = require("../../handlers/error");


// show users
router.get("/", catchErrors(manageUsersController.showUsers));

// show users on a certain page
router.get("/p/:page/s/:sortField/d/:sortDirection", catchErrors(manageUsersController.showUsers));
//router.get("/users/p/:page", catchErrors(adminController.showUsers));

// post search user / change sort order request
router.post("/", catchErrors(manageUsersController.showUsers));

// show edit user form
router.get("/:userid", catchErrors(manageUsersController.showEditUser));

// post change username
router.post("/:userid/username", catchErrors(manageUsersController.changeUsername));

// post change email address
router.post("/:userid/email", catchErrors(manageUsersController.changeEmail));

// post reset avatar
router.post("/:userid/avatar/reset", catchErrors(manageUsersController.resetAvatar));

// post suspend user
router.post("/:userid/suspend", catchErrors(manageUsersController.suspendUser));

// clear suspension
router.get("/:userid/suspend/clear", catchErrors(manageUsersController.clearUserSuspension));

// reset user password
router.post("/:userid/password", catchErrors(manageUsersController.resetPassword));

// post change email address
router.post("/:userid/email/resend", catchErrors(manageUsersController.resendConfirmationEmail));

// set email address to confirmed
router.get("/:userid/email/confirm", catchErrors(manageUsersController.setEmailConfirmed));

module.exports = router;
