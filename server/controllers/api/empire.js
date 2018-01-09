/***********************************************************************************************************************
 *
 * apiEmpireController
 *
 * @exports {ExpressController} pulse
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Planet = mongoose.model("Planet");
const Star = mongoose.model("Star");
const logger = require("../../handlers/logger/console");

/*
 * get game data =======================================================================================================
 * we do not want to send full mongoose objects to the client,
 * (there might be parts that we don't want to tell the player)
 * so we massage the data a bit.
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.getGameData = async (req, res) => {
    const player = req.user.selectedPlayer;
    const game = player.game;
    const stars = player.stars.map(star => star.id);
    const planets = await Planet.find({star: {$in: stars}});
    const returnData = {
        game: {
            number: game.number,
            active: game.active,
            dimensions: game.dimensions,
            turn: game.turn,
            turnDue: game.turnDue,
            turnDuration: game.turnDuration,
            processing: game.processing
        },
        player: {
            name: player.name,
            ticker: player.ticker
        },
        stars: []
    };
    player.stars.length &&
        player.stars.forEach(star => {
            let starPlanets = [];
            planets.length &&
                planets.forEach(planet => {
                    // make sure the planet belongs to this star before adding
                    if (`${planet.star}` === `${star._id}`) {
                        starPlanets.push({
                            id: planet._id,
                            type: planet.type,
                            orbitalIndex: planet.orbitalIndex
                        });
                    }
                });
            returnData.stars.push({
                id: star._id,
                name: star.name,
                spectral: star.spectral,
                coordX: star.coordX,
                coordY: star.coordY,
                planets: starPlanets
            });
        });

    logger.info(
        `[App] User ${chalk.red("@" + req.user.username)} requested game data for ${chalk.yellow(
            "g" + returnData.game.number
        )} ${chalk.cyan("[" + returnData.player.ticker + "]")} ${chalk.cyan(returnData.player.name)}`
    );

    return res.json(returnData);
};

/*
 * XHR POST save star name =============================================================================================

 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.saveStarName = async (req, res) => {
    const playerStars = req.user.selectedPlayer.stars.map(star => star.id);
    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} requesting name change of star ${chalk.yellow(
            req.body.id
        )} to ${chalk.cyan(req.body.name)}`
    );
    // don't trust the client.
    if (!playerStars.includes(req.body.id)) {
        logger.error(`[App] user ${req.user.username} was not allowed to edit star.`);
        return res.status(403).json({message: "you are not allowed to edit this star."});
    }
    const updatedStar = await Star.findOneAndUpdate(
        {_id: req.body.id},
        {$set: {name: req.body.name}},
        {new: true, runValidators: true, context: "query"}
    );
    if (updatedStar) {
        logger.success(`[App] name of star ${chalk.yellow(req.body.id)} was changed to ${chalk.cyan(updatedStar.name)}.`);
        return res.status(200).json({data: {name: updatedStar.name}});
    } else {
        logger.success(`[App] error saving name.`);
        return res.status(500).json({message: "error while saving to database."});
    }
};
