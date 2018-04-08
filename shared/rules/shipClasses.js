/***********************************************************************************************************************
 *
 * SHIP CLASS RULES
 *
 **********************************************************************************************************************/
const RULES = {
    name: [1, 80], // minLength, maxLength
    speed: [0.1, 10], // min, max
    tonnage: [10, 300],
    hullTypes: [
        {
            name: "ark",
            maxSpeed: 1,
            tonnage: [25, 25]
        },
        {
            name: "small",
            maxSpeed: 10,
            tonnage: [10, 40]
        },
        {
            name: "medium",
            maxSpeed: 8,
            tonnage: [50, 100]
        },
        {
            name: "large",
            maxSpeed: 6,
            tonnage: [120, 300]
        }
        //, {
        // oh yeah...
        //}
    ]
};

module.exports = RULES;
