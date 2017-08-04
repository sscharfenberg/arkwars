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
router.get("/", adminController.showDashboard);

// user administration
router.get("/users", adminController.showUsers);

// game administration
router.get("/games", adminController.showGames);

// list available email templates
router.get("/emails", catchErrors(adminController.showEmailTemplates));
// mock view email templates
router.get("/emails/:template", catchErrors(adminController.showEmail));

module.exports = router;
