/***********************************************************************************************************************
 *
 * TEMPLATE HELPERS
 *
 * simple template helpers for use in .pug views
 *
 * @exports {dump, image, icon, spritesheet, progressbar, appName}
 *
 **********************************************************************************************************************/
const fs = require("fs"); // https://nodejs.org/api/fs.html
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const cfg = require("../config");

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
//exports.moment = require( "moment" );

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
//exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting a SVG image
exports.image = path =>
    fs.readFileSync(`./server/public/assets/images/${path}`);

/*
 * inserting a SVG icon with <use>
 * @param {string} name
 * @param {array} modifiers - array of strings
 * @usage:
 * != h.icon("games", ["small"])
 */
exports.icon = (name, modifiers) => {
    modifiers = modifiers || [];
    modifiers = modifiers.map(modifier => {
        return "aw-icon--" + modifier;
    });
    return `<svg class="aw-icon ${modifiers.join(
        " "
    )}"><use xlink:href="#${name}"></use></svg>`;
};

/*
 * insert inline spritesheet into body.
 * this means we don't use caching for this, but we avoid a lot of problems.
 */
exports.spritesheet = () =>
    fs
        .readFileSync(`./server/public/assets/icons/sprite.svg`, {
            encoding: "utf-8"
        })
        .replace("<svg", '<svg class="aw-icon-sprite"')
        .replace('<?xml version="1.0" encoding="UTF-8"?>', "");

/*
 * progressbar helper function
 */
exports.progressbar = (max, value) => {
    let pct;
    let colorClass = "aw-progress__bar-value--";
    let svg = fs.readFileSync("./server/public/assets/images/progressbar.svg", {
        encoding: "utf-8"
    });
    if (value > max) value = max; // just to make sure.
    pct = parseInt(100 - parseInt(value, 10) / parseInt(max, 10) * 100, 10);
    if (pct > 0 && pct <= 20) colorClass += "1";
    if (pct > 21 && pct <= 40) colorClass += "2";
    if (pct > 41 && pct <= 60) colorClass += "3";
    if (pct > 61 && pct <= 80) colorClass += "4";
    if (pct > 81) colorClass += "5";
    svg = svg.replace("__DASHOFFSET__", pct);
    svg = svg.replace("__COLORCLASS__", colorClass);
    return svg;
};

// Some details about the site
exports.appName = cfg.app.title;

// i18n translate fn, make them available with current locale in templates
exports.__ = key => {
    return i18n.__(key);
};
