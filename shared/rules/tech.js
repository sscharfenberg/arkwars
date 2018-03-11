/***********************************************************************************************************************
 *
 * TechLevel RULES
 *
 **********************************************************************************************************************/
const RULES = {
    bounds: [0, 10],
    types: {
        offensive: [
            {
                type: "plasma",
                initial: 0
            },
            {
                type: "railgun",
                initial: 0
            },
            {
                type: "missile",
                initial: 0
            },
            {
                type: "laser",
                initial: 0
            }
        ],
        defensive: [
            {
                type: "shields",
                initial: 0
            },
            {
                type: "armour",
                initial: 0
            }
        ]
    },
    cost: {
        offensive: [1000, 1200, 1440, 1720, 2048, 2480, 3200, 4480, 6720, 11000],
        defensive: [1000, 1200, 1440, 1720, 2048, 2480, 3200, 4480, 6720, 11000]
    }
};

module.exports = RULES;
