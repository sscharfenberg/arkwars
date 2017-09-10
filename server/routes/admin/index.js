/***********************************************************************************************************************
 *
 * ADMIN ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const adminController = require("../../controllers/admin");
const authController = require("../../controllers/auth");
const { catchErrors } = require("../../handlers/error");

// isAdmin Middleware protecting the admin routes
router.use("/", authController.isAdmin);

// admin dashboard
router.get("/", catchErrors(adminController.showDashboard));

// manage users routes
router.use("/users", require("./users"));

// manage games routes
router.use("/games", require("./games"));

// manage email templates
router.use("/emails", require("./emails"));

module.exports = router;
