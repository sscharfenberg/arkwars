/***********************************************************************************************************************
 *
 * captchaHandler
 *
 **********************************************************************************************************************/
const svgCaptcha = require("svg-captcha"); // https://github.com/lemonce/svg-captcha


/*
 * create a SVG captcha image. =========================================================================================
 * uses random characters or a string that is passed to the fn.
 * @param {string} text - optional
 * @returns {CaptchaObj} || {SVGObj}
 */
exports.getCaptcha = (text = undefined) => {
    const options = {
        height: 26,
        size: 4,
        ignoreChars: "0Ool1Ii8B",
        noise: 0
    };
    if (text) {
        return svgCaptcha(text, options); // {SVGObj}
    } else {
        return svgCaptcha.create(options); // {CaptchaObj}
    }
};
