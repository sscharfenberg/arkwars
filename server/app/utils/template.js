/***********************************************************************************************************************
 *
 * TEMPLATE HELPERS
 *
 * simple template helpers for use in .pug views
 *
 * @exports {function} dump
 * @exports {function} icon
 * @exports {string} siteName
 *
 **********************************************************************************************************************/
const fs = require("fs"); // https://nodejs.org/api/fs.html
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

exports.spritesheet = () =>
    fs
        .readFileSync(`./server/public/assets/icons/sprite.svg`, {
            encoding: "utf-8"
        })
        .replace("<svg", '<svg class="aw-icon-sprite"')
        .replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");

// Some details about the site
exports.appName = cfg.app.title;
