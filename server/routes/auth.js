/***********************************************************************************************************************
 *
 * AUTH ROUTES
 *
 * @exports {Express.Router} router
 *
 **********************************************************************************************************************/
const express = require("express"); // http://expressjs.com/
const router = express.Router(); // http://expressjs.com/en/api.html#router
const registrationController = require("../controllers/auth/register");
const resetController = require("../controllers/auth/reset");
const resendController = require("../controllers/auth/resend");
const authController = require("../controllers/auth");
const { catchErrors } = require("../handlers/error");


// show registration form
router.get("/register", registrationController.showRegistration);

// post registration
router.post(
    "/register",
    catchErrors(registrationController.validateRegistration), // 1. Validate the registration data
    catchErrors(registrationController.doRegistration), // 2. register the user
    catchErrors(registrationController.sendConfirmationEmail) // 3. send confirmation email
);

// confirm email (from email link)
router.get("/confirm/:token", catchErrors(registrationController.confirmEmail));

// login
router.get("/login", authController.showLoginForm);
router.post("/login", authController.login);

// logout
router.get("/logout", authController.logout);

// show "resend activation email" form
router.get("/resend", resendController.showResendForm);

// post "resend activation email" form
router.post(
    "/resend",
    catchErrors(resendController.validateResend), // 1. Validate form data
    catchErrors(resendController.doResend) // 2. resend activation link
);

// show reset form
router.get("/reset", resetController.showResetForm);

// post "request reset email" request
router.post(
    "/reset",
    catchErrors(resetController.validateRequest), // 1. validate form data
    catchErrors(resetController.updateResetUser), // 2. update user
    catchErrors(resetController.sendResetEmail) // 3. send reset email
);

// show change password form (from email link)
router.get("/reset/:token",
    catchErrors(resetController.validateResetToken), // 1. validate token
    resetController.showChangeForm // 2. show password change form
);

// post change password form
router.post("/reset/:token",
    catchErrors(resetController.validateResetToken), // 1. validate token
    catchErrors(resetController.validateChangeForm), // 2. validate form data
    catchErrors(resetController.resetChangePassword) // 3. change password
);


module.exports = router;
