/***********************************************************************************************************************
 *
 * PLAYER RULES
 *
 **********************************************************************************************************************/
const RULES = {
    name: {bounds: [6, 32]}, // [min, max] player/empire name
    ticker: {bounds: [2, 5]}, // {min, max] player/empire ticker
    // order is important since array index is used in Mongoose.model("Player")
    resourceTypes: [
        {
            type: "energy",
            start: 1000,
            max: {start: 1000, increase: {steps: 5, by: 250}}
        },
        {
            type: "food",
            start: 500,
            max: {start: 500, increase: {steps: 5, by: 100}}
        },
        {
            type: "minerals",
            start: 1000,
            max: {start: 1000, increase: {steps: 5, by: 250}}
        },
        {
            type: "research",
            start: 250,
            max: {start: 500, increase: {steps: 5, by: 100}}
        }
    ]
};

module.exports = RULES;
