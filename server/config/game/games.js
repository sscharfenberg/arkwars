/***********************************************************************************************************************
 *
 * GAME RULES
 *
 **********************************************************************************************************************/
const RULES =  {
    empire: {
        name: {bounds: [6, 32]}, // [min, max]
        ticker: {bounds: [2, 5]}, // [min, max]
        population: {
            homeSystemDefault: 5,
            bounds: [0,20] // [min, max]
        }
    },
    turns: {
        // server tick threshold for game turn processing.
        // game turns that are due in (threshold) are processed
        dueThreshold: 30 * 1000
    },
    defaultTurnDuration: 15,
    dimensions: {
        default: 40,
        min: 10,
        max: 200
    },
    distance: {
        default: [3, 5], // [min, max]
        bounds: [2, 20] // [min, max]
    },
    playerDistance: {
        default: [6, 12], // [min, max]
        bounds: [2, 20] // [min, max]
    }
};

module.exports = RULES;
