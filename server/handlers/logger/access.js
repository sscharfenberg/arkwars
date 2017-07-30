/***********************************************************************************************************************
 *
 * ACCESS LOGGER
 *
 * initiates and exports morgan instance for access logging.
 *
 * @type {Node.js}
 * @exports {morgan} accessLogger - Morgan logging instance middleware for use in express
 *
 **********************************************************************************************************************/
const fs = require("fs"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const moment = require("moment"); // https://momentjs.com/
const morgan = require("morgan"); // https://www.npmjs.com/package/morgan

morgan.token("datetime", () => {
    return moment().format("ddd, DD.MM.YYYY HH:mm:ss.SSSS");
});

// prepare tokens with formatting
let morganTokens = [
    "📆 [:datetime]",
    "❄ [:status]",
    "🎵 :remote-addr",
    '🍓 ":method :url HTTP/:http-version"',
    "☕ :res[content-length] bytes",
    '😎 ":user-agent"',
    "✈ :referrer",
    "🕖 :response-time ms"
].join(" ");

/*
 * create morgan logger
 * append to access.log file
 *
 */
let accessLogger = morgan(morganTokens, {
    stream: fs.createWriteStream(
        path.join(
            __dirname,
            "..",
            "..",
            "logs",
            moment().format("YYYYMMDD") + ".access.log"
        ),
        { flags: "a" }
    )
});

module.exports = accessLogger;
