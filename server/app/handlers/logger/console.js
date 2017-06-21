/***********************************************************************************************************************
 *
 * CONSOLE LOGGER
 *
 * this exports a winstonLogger instance for use in our app
 *
 * @type {Node.js}
 * @exports {winston.Logger} logger
 *
 **********************************************************************************************************************/
const fs = require("fs-extra"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const moment = require("moment"); // https://momentjs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
let logFilePath = path.join(
    appDirectory,
    "server",
    "logs",
    moment().format("YYYYMMDD") + ".console.log"
);
const cleanChalkedMessage = message => {
    // https://stackoverflow.com/questions/25245716/remove-all-ansi-colors-styles-from-strings#answer-29497680
    // remove ANSI escape codes that got inserted by chalk.
    message = message.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ""
    );
    return `[${moment().format(
        "dddd, DD.MM.YYYY HH:mm:ss.SSSS"
    )}] ${message}\r\n`;
};

moment.locale("de"); // TODO: make config setting

exports.info = message => {
    const data = `📞 INFO 📞 → ${message}`;
    console.log(
        `${chalk.magenta(moment().format("HH:mm:ss.SSSS"))} ${chalk.white(
            data
        )}`
    );
    fs.appendFile(logFilePath, cleanChalkedMessage(data), "utf8", err => {
        if (err) throw err;
    });
};

exports.debug = message => {
    const data = `🔧 DEBUG 🔧 → ${message}`;
    console.log(
        `${chalk.magenta(moment().format("HH:mm:ss.SSSS"))} ${chalk.cyan(data)}`
    );
    fs.appendFile(logFilePath, cleanChalkedMessage(data), "utf8", err => {
        if (err) throw err;
    });
};

exports.warn = message => {
    const data = `🔥 WARN 🔥 → ${message}`;
    console.log(
        `${chalk.magenta(moment().format("HH:mm:ss.SSSS"))} ${chalk.yellow(
            data
        )}`
    );
    fs.appendFile(logFilePath, cleanChalkedMessage(data), "utf8", err => {
        if (err) throw err;
    });
};

exports.error = message => {
    const data = `💀 ERROR 💀 → ${message}`;
    console.log(
        `${chalk.magenta(moment().format("HH:mm:ss.SSSS"))} ${chalk.red(data)}`
    );
    fs.appendFile(logFilePath, cleanChalkedMessage(data), "utf8", err => {
        if (err) throw err;
    });
};

exports.success = message => {
    const data = `👍 SUCCESS 👍 → ${message}`;
    console.log(
        `${chalk.magenta(moment().format("HH:mm:ss.SSSS"))} ${chalk.blue(data)}`
    );
    fs.appendFile(logFilePath, cleanChalkedMessage(data), "utf8", err => {
        if (err) throw err;
    });
};
