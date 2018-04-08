/***********************************************************************************************************************
 *
 * SHIP CLASS RULES
 *
 **********************************************************************************************************************/
const RULES = {
    name: [1, 80], // minLength, maxLength
    speed: [0.1, 10], // min, max
    hullTypes: [
        {
            name: "ark",
            maxSpeed: 1
        },
        {
            name: "small",
            maxSpeed: 10
        },
        {
            name: "medium",
            maxSpeed: 8
        },
        {
            name: "large",
            maxSpeed: 6
        }
    ]
};

module.exports = RULES;
