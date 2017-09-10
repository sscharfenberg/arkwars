/***********************************************************************************************************************
 *
 * MANAGE EMAILS ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const managegEmailsController = require("../../controllers/admin/emails");
const { catchErrors } = require("../../handlers/error");

// list available email templates
router.get("/", catchErrors(managegEmailsController.showEmailTemplates));
// mock view email templates
router.get("/:template/lang/:language", catchErrors(managegEmailsController.showEmail));

module.exports = router;
