/***********************************************************************************************************************
 *
 * MAIN ROUTES
 *
 * main express routing file
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express                   = require( "express" );                     // http://expressjs.com/
const router                    = express.Router();                         // http://expressjs.com/en/api.html#router
const indexController           = require( "../controllers/index" );
//const { catchErrors } = require("../handlers/error" );

router.get( "/", indexController.homePage );

module.exports = router;

