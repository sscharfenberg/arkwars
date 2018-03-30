/***********************************************************************************************************************
 *
 * apiResearchGameDataController
 * this helper functions recieves the player and gets the API return answer.
 * seperated into an external file so we can use it in the controller for the page and pre-fill the initial state
 *
 * @exports {Function} fetch
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Research = mongoose.model("Research");
const Planet = mongoose.model("Planet");
const StorageUpgrade = mongoose.model("StorageUpgrade");

/*
 * fetch game data for player and return API object
 * we do not want to send full mongoose objects to the client,
 * (there might be parts that we don't want to tell the player)
 * so we massage the data a bit.
 * @param {Object} playedr - Mongoose.model("Player")
 */
exports.fetch = async player => {
    const stars = player.stars.map(star => star.id);
    const colonyPromise = Planet.find({star: {$in: stars}, population: {$gte: 1}});
    const researchPromise = Research.find({player: player._id}).sort({order: "asc"});
    const storageUpgradePromise = StorageUpgrade.find({player: player._id});
    const [colonies, researches, storageUpgrades] = await Promise.all([colonyPromise, researchPromise, storageUpgradePromise]);
    const totalPopulation = colonies.map(colony => colony.effectivePopulation).reduce((acc, val) => acc + val);

    return {
        game: {
            // only selected game props
            number: player.game.number,
            active: player.game.active,
            dimensions: player.game.dimensions,
            turn: player.game.turn,
            turnDue: player.game.turnDue,
            turnDuration: player.game.turnDuration,
            processing: player.game.processing
        },
        player: {
            // again, only selected props
            name: player.name,
            ticker: player.ticker,
            researchPriority: player.researchPriority,
            totalPopulation
        },
        // un-flatten resource data into an array for VueJS
        resources: [
            {
                type: "energy",
                current: player.resources.energy.current,
                max: player.resources.energy.max,
                storageLevel: player.resources.energy.storageLevel
            },
            {
                type: "food",
                current: player.resources.food.current,
                max: player.resources.food.max,
                storageLevel: player.resources.food.storageLevel
            },
            {
                type: "minerals",
                current: player.resources.minerals.current,
                max: player.resources.minerals.max,
                storageLevel: player.resources.minerals.storageLevel
            },
            {
                type: "research",
                current: player.resources.research.current,
                max: player.resources.research.max,
                storageLevel: player.resources.research.storageLevel
            }
        ],
        techLevels: [
            {type: "plasma", level: player.tech.plasma},
            {type: "railgun", level: player.tech.railgun},
            {type: "missile", level: player.tech.missile},
            {type: "laser", level: player.tech.laser},
            {type: "shields", level: player.tech.shields},
            {type: "armour", level: player.tech.armour}
        ],
        researches: researches.map(research => {
            return {
                id: research._id,
                area: research.area,
                newLevel: research.newLevel,
                order: research.order,
                remaining: research.remaining
            };
        }),
        storageUpgrades: storageUpgrades.map( upgrade => {
            return {
                id: upgrade._id,
                area: upgrade.area,
                newLevel: upgrade.newLevel,
                turnsUntilComplete: upgrade.turnsUntilComplete
            }
        })
    };
};
