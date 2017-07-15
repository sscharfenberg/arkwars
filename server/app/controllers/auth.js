/***********************************************************************************************************************
 *
 * authController
 *
 * @exports {ExpressController} showRegister
 *
 **********************************************************************************************************************/
const svgCaptcha = require("svg-captcha"); // https://github.com/lemonce/svg-captcha



const showRegister = (req, res) => {
    const captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: "0o1i",
        noise: 0
    });
    req.session.captcha = captcha.text; // this should be flashed, not injected into the session
    res.render("auth/register", { title: "Register", session: req.session, captcha: captcha.data });
};

exports.showRegister = showRegister;
