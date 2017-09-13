/***********************************************************************************************************************
 *
 * seedGameHandler
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");

/*
 * get number of systems to create =====================================================================================
 * @param {Mongoose.Object} game
 *
 */
const getSystemsToCreate = (game) => {
    let numNpcSystemsToCreate =
        game.dimensions * game.dimensions / game.density;
    return Math.ceil(
        numNpcSystemsToCreate < game.maxPlayers
            ? 0
            : numNpcSystemsToCreate - game.maxPlayers
    );
};

/*
 * seed NPC systems ====================================================================================================
 * @param {Mongoose.Object} game
 *
 */
exports.NPCSystems = (game, admin) => {
    let numNpcSystemsToCreate = getSystemsToCreate(game);
    logger.info(
        `[Admin ${chalk.cyan(
            "@" + admin.username
        )}]: seed ${numNpcSystemsToCreate} NPC systems.`
    );
    return game;
};

/*
 * seed Player home systems ============================================================================================
 * @param {Mongoose.Object} game
 *
 */
exports.PlayerSystems = (game, admin) => {
    let numPlayerSystemsToCreate = game.maxPlayers;
    logger.info(
        `[Admin ${chalk.cyan(
            "@" + admin.username
        )}]: seed ${numPlayerSystemsToCreate} player home systems.`
    );
    return game;
};
