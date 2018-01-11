/***********************************************************************************************************************
 *
 * seedGameHandler
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
const PoissonDiskSampling = require("poisson-disk-sampling"); // https://github.com/kchapelier/poisson-disk-sampling
const cfg = require("../../config");

/*
 * normalize stars =====================================================================================================
 * round to integer coordinates and remove duplicates.
 * @param {array} points
 * @param {int} dimensions
 *
 */
const normalizeStars = (points, dimensions) => {
    let seen = [];
    let intPoints = points.map(point => [ // we need integer coordinates
        Math.round(point[0]),
        Math.round(point[1])
    ]);
    let filteredPoints = intPoints.filter(star => {
        // convert the coords array to a string, since javascript arrays (objects) are compared by id, not value
        // therefore, we can not simply compare arrays by using indexOf
        let coordSeen = `${star[0]}/${star[1]}`;
        if (star[0] >= dimensions || star[1] >= dimensions || seen.indexOf(coordSeen) > -1) return false;
        seen.push(coordSeen);
        return true;
    });
    logger.info(
        `[App] normmalized all ${chalk.yellow(
            points.length
        )} stars, filtered ${chalk.red(points.length - filteredPoints.length)}.`
    );
    return filteredPoints;
};

/*
 * randomType ==========================================================================================================
 * randomly select a type for an object (spectral type for stars, planetary types)
 * @param {int] owner - system owner type: 1 = npc, 2 = player
 * @param {array} cfgArray - the config object containing type and chances
 * @returns {string} objectType
 *
 */
const randomType = (owner, cfgArray) => {
    let objectType = "";
    let chanceAccumulated = 0;
    let found = false;
    const chanceTotal = cfgArray.reduce((accumulator, value) => {
        let chance = owner === 1 ? value.chance : value.chanceHome;
        return accumulator + chance;
    }, 0);
    let rolled = Math.random() * chanceTotal;
    cfgArray.forEach( cfgType => {
        chanceAccumulated += owner === 1 ? cfgType.chance : cfgType.chanceHome;
        if (chanceAccumulated >= rolled && !found) {
            found = true;
            objectType = cfgType.name;
        }
    });
    return objectType;
};

/*
 * getNumPlanets =======================================================================================================
 * randomly determine the number of planets
 * @param {string] spectral - spectralType
 * @param {int] owner - system owner type: 1 = npc, 2 = player
 * @param {array} cfgArray - the config object cfg.stars.spectralTypes
 * @returns {Number} numPlanets;
 *
 */
const getNumPlanets = (spectral, owner, cfgArray) => {
    let min = owner === 2 ? cfg.stars.planets.player[0] : cfg.stars.planets.npc[0];
    let max = owner === 2 ? cfg.stars.planets.player[1] : cfg.stars.planets.npc[1];
    let types = cfgArray.filter(spectralType => spectralType.name === spectral);
    min += types[0].planetsMod;
    max += types[0].planetsMod;
    min = min <= 0 ? 1 : min; // ensure at least one planet
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/*
 * getStarName =========================================================================================================
 * randomly generate a star name
 * @returns {String} starName;
 *
 */
const getStarName = () => {
    let starName = "";
    let lengthMin = cfg.stars.name.initial[0];
    let lengthMax = cfg.stars.name.initial[1];
    let length = Math.floor(Math.random() * (lengthMax - lengthMin + 1) + lengthMin);
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    while (starName.length < length + 1) {
        let newLetter = letters[Math.floor(Math.random() * letters.length)];
        starName = starName + newLetter;
        starName = starName.length === 3 ? starName + "-" : starName; // insert dash after three letters. purely optical
    }
    return starName;
};

/*
 * seed NPC systems ====================================================================================================
 * @param {Mongoose.Object} game
 * @param {Object} user - req.user that is doing the requesst
 * @param {Number} distMin - minimum star distance
 * @param {Number} distMax - maximum star distance
 * @returns {array} filteredPoints - array of arrays with x/y coordinates
 *
 */
const systems = (game, user, distMin, distMax) => {
    // limit tries for bigger dimensions - very large datasets result in perf problems
    const tries = cfg.games.dimensions.max + 50 - game.dimensions;
    let pds = new PoissonDiskSampling(
        [game.dimensions, game.dimensions], // for now, we only support equal width/height maps
        parseInt(distMin, 10), // ensure integers for distance. pds starts to behave strangely with floats.
        parseInt(distMax, 10),
        tries
    );
    let points = pds.fill();
    logger.info(
        `[App] generated ${chalk.yellow(
            points.length
        )} stars.`
    );
    return normalizeStars(points, game.dimensions);
};

/*
 * assign a random star fromm an array of stars ========================================================================
 * @param {Array} stars - array of Mongoose.Model("Star")
 * @returns {Object} - Mongoose.model("Star")
 * since we return the chose star by index (random integer),
 * first element is 0, last element is stars.length - 1.
 */
const assignRandomStar = (stars) => {
    return stars[Math.floor(Math.random() * stars.length)];
};

/*
 * create and return a random planet ===================================================================================
 * @param {Mongoose.ObjectId} gameId
 * @param {Mongoose.ObjectId} starId
 * @param {Integer} orbitalIndex
 * @param {Boolean} npc - optional, true for npc systems, falsy for player systems.
 * @returns {Mongoose.model("Planet")}
 *
 */
const randomPlanet = (gameId, starId, orbitalIndex, npc) => {
    let planet = {
        game: gameId,
        star: starId,
        type: randomType(npc ? 1 : 2, cfg.planets.types),
        orbitalIndex
    };
    return planet;
};


module.exports = {
    normalizeStars,
    randomType,
    getNumPlanets,
    getStarName,
    systems,
    assignRandomStar,
    randomPlanet
};

