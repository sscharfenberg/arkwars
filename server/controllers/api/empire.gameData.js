/***********************************************************************************************************************
 *
 * apiEmpireGameDataController
 * this helper functions recieves the player and gets the API return answer.
 * seperated into an external file so we can use it in the controller for the page and pre-fill the initial state
 *
 * @exports {Function} fetch
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Planet = mongoose.model("Planet");

/*
 * fetch game data for player and return API object
 * we do not want to send full mongoose objects to the client,
 * (there might be parts that we don't want to tell the player)
 * so we massage the data a bit.
 * @param {Object} playedr - Mongoose.model("Player")
 */
exports.fetch = async player => {
    const stars = player.stars.map(star => star.id);
    // get unsorted array of all planets that belong to the player's stars
    let planets = await Planet.find({star: {$in: stars}}).populate("harvesters pdus");
    const totalPopulation = planets
        .filter(planet => planet.population >= 1)
        .map(colony => colony.effectivePopulation)
        .reduce((acc, val) => acc + val);

    // prepare return data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const returnData = {
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
        // avoid specific properties on the star and add an array of planetids
        stars: player.stars.map(star => {
            return {
                id: star._id,
                name: star.name,
                spectral: star.spectral,
                coordX: star.coordX,
                coordY: star.coordY,
                planets: planets.filter(planet => `${planet.star}` === `${star._id}`).map(planet => planet.id)
            };
        }),
        harvesters: [],
        planets: [],
        pdus: []
    };

    // add mapped planets
    returnData.planets = planets.map(planet => {
        // add PDU data to pdus array
        returnData.pdus = planet.pdus
            .map(pdu => {
                return {
                    id: pdu._id,
                    planet: pdu.planet,
                    pduType: pdu.pduType,
                    turnsUntilComplete: pdu.turnsUntilComplete,
                    isActive: pdu.isActive
                };
            })
            .concat(returnData.pdus);
        // prepare planet
        return {
            id: planet._id,
            type: planet.type,
            orbitalIndex: planet.orbitalIndex,
            population: planet.population,
            effectivePopulation: planet.effectivePopulation,
            foodConsumption: planet.foodConsumptionPerPop,
            resourceSlots: planet.resources.map(slot => {
                // harvester data into returnData.harvesters array
                returnData.harvesters = planet.harvesters
                    // only harvesters with the correct type
                    .filter(harvester => harvester.resourceType === slot.resourceType)
                    // map to new object with specific order
                    .map(harvester => {
                        return {
                            id: harvester._id,
                            resourceType: harvester.resourceType,
                            turnsUntilComplete: harvester.turnsUntilComplete,
                            isHarvesting: harvester.isHarvesting,
                            resGrade: slot.value
                        };
                    })
                    .concat(returnData.harvesters);
                return {
                    resourceType: slot.resourceType,
                    slots: slot.slots,
                    id: slot._id,
                    resGrade: slot.value,
                    // harvester ids are added into array here
                    harvesters: planet.harvesters
                        .filter(harvester => harvester.resourceType === slot.resourceType)
                        .map(harvester => harvester._id)
                };
            })
        };
    });
    return returnData;
};
