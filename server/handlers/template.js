/***********************************************************************************************************************
 *
 * TEMPLATE HELPERS
 *
 * simple template helpers for use in .pug views
 *
 * @exports {dump, image, icon, spritesheet, progressbar, appName}
 *
 **********************************************************************************************************************/
const fs = require("fs-extra"); // https://nodejs.org/api/fs.html
const path = require("path");
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const cfg = require("../config");


// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require("moment");

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
//exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting a SVG image
exports.image = path => fs.readFileSync(`./server/public/assets/images/${path}`);

/*
 * inserting a SVG icon with <use>
 * @param {string} name
 * @param {array} modifiers - array of strings
 * @usage:
 * != h.icon("games", ["small"])
 */
exports.icon = (name, modifiers) => {
    const basePath = "/public/assets/images/icons-app.svg";
    modifiers = modifiers || [];
    modifiers = modifiers.map(modifier => {
        return "aw-icon--" + modifier;
    });
    return `<svg class="aw-icon ${modifiers.join(" ")}"><use xlink:href="${basePath}#${name}"></use></svg>`;
};

/*
 * progressbar helper function
 */
exports.progressbar = (max, value, active) => {
    //let pct;
    //let colorClass = "aw-progress__bar-value--";
    let svg = fs.readFileSync("./server/public/assets/images/progressbar.svg", {
        encoding: "utf-8"
    });
    if (value > max) value = max; // just to make sure.
    //pct = parseInt(100 - parseInt(value, 10) / parseInt(max, 10) * 100, 10);
    //if (pct > 0 && pct <= 20) colorClass += "1";
    //if (pct > 21 && pct <= 40) colorClass += "2";
    //if (pct > 41 && pct <= 60) colorClass += "3";
    //if (pct > 61 && pct <= 80) colorClass += "4";
    //if (pct > 81) colorClass += "5";
    let activeClass = active ? "active" : "";
    //colorClass = active ? colorClass : ""; // reset color class for inactive progressbars
    //svg = svg.replace("__DASHOFFSET__", pct);
    //svg = svg.replace("__COLORCLASS__", colorClass);
    svg = svg.replace("__ACTIVE__", activeClass);
    return svg;
};

// Some details about the site
exports.appName = cfg.app.title;

// i18n translate fn, make them available with current locale in templates
exports.__ = (key, data) => {
    return i18n.__(key, data);
};

exports.getAvatar = (avatar, size) => {
    if (avatar) {
        return `<img class="aw-show-avatar aw-show-avatar--${size}" src="/public/avatars/${avatar}">`;
    } else {
        return `<img class="aw-show-avatar aw-show-avatar--${size}" src="/public/assets/images/user-anon.svg">`;
    }
};


/*
 * helper function that utilizes the hashes in manifest.json to output hashed filenames
 */
exports.hashedAsset = name => {
    // chunks where we return nothing in dev mode, since webpack-dev-server injects styles into head directly.
    const cssDevChunks = [
        "common.css",
        "empire.css",
        "research.css",
        "shipyards.css",
        "fleets.css",
        "starchart.css",
        "galnet.css"
    ];
    const manifestPath = path.join(cfg.app.projectDir, "server", "public", "assets", "manifest.json");
    let manifest = {};
    let clientIsDev = false;
    if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    }
    for (let asset in manifest) {
        if (manifest[asset].indexOf("localhost") > -1) {
            clientIsDev = true;
            break;
        }
    }
    // for dev mode, we return nothing for our hashed css chunks, since they are not emitted anyway.
    if (clientIsDev && cssDevChunks.includes(name)) return;
    // webpack-dev-server is only needed in dev mode
    // TODO: find a way to not have an empty script tag in production because of this.
    if (name === "webpack-dev-server.js") {
        return clientIsDev ? "http://localhost:8000/" + name : "";
    }
    return manifest.hasOwnProperty(name) ? manifest[name] : "/public/assets/" + name;
};

