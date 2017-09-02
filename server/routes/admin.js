/***********************************************************************************************************************
 *
 * ADMIN ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const adminController = require("../controllers/admin");
const authController = require("../controllers/auth");
const { catchErrors } = require("../handlers/error");

// isAdmin Middleware protecting the admin routes
router.use("/", authController.isAdmin);

// admin dashboard
router.get("/", catchErrors(adminController.showDashboard));

// user administration
router.get("/users", catchErrors(adminController.showUsers));
// user administration with pagination
router.get("/users/p/:page/s/:sortField/d/:sortDirection", catchErrors(adminController.showUsers));
router.get("/users/p/:page", catchErrors(adminController.showUsers));
// post search user / change sort order request
router.post("/users", catchErrors(adminController.showUsers));

// show edit user form
router.get("/users/:userid", catchErrors(adminController.showEditUser))

// game administration
router.get("/games", adminController.showGames);

// list available email templates
router.get("/emails", catchErrors(adminController.showEmailTemplates));
// mock view email templates
router.get("/emails/:template", catchErrors(adminController.showEmail));

module.exports = router;
