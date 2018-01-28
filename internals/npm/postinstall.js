/***********************************************************************************************************************
 *
 * post install script
 * this simply creates directories that we need, but don't want to add to git
 *
 **********************************************************************************************************************/
const path = require("path"); // https://nodejs.org/api/path.html
const fs = require("fs-extra"); // https://www.npmjs.com/package/fs-extra
const cfg = require("../../server/config");

const paths = [
    path.join(cfg.app.projectDir, ".babel-cache"),
    path.join(cfg.app.projectDir, "server", "logs"),
    path.join(cfg.app.projectDir, "server", "logs", "turns"),
    path.join(cfg.app.projectDir, "server", "views", "webpack"),
    path.join(cfg.app.projectDir, "server", "public"),
    path.join(cfg.app.projectDir, "server", "public", "assets"),
    path.join(cfg.app.projectDir, "server", "public", "assets", "fonts"),
    path.join(cfg.app.projectDir, "server", "public", "assets", "images"),
    path.join(cfg.app.projectDir, "server", "public", "avatars")
];

console.log(`${cfg.app.title} creating necessary directories.`);

paths.forEach( path => {
    console.log(`creating "${path}" ...`);
    fs.ensureDirSync(path, "0o644");
});
