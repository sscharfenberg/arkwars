/***********************************************************************************************************************
 *
 * TechLevel RULES
 *
 **********************************************************************************************************************/
const RULES = {
    bounds: [0, 10], // tech levels min/max
    queue: 5, // max queue length
    areas: [
        {
            area: "plasma",
            icon: "wpn-plasma",
            initial: 0,
            costs: [1000, 1200, 1440, 1720, 2048, 2480, 3200, 4480, 6720, 11000]
        },
        {
            area: "railgun",
            icon: "wpn-railgun",
            initial: 0,
            costs: [1000, 1200, 1440, 1720, 2048, 2480, 3200, 4480, 6720, 11000]
        },
        {
            area: "missile",
            icon: "wpn-missile",
            initial: 0,
            costs: [1000, 1200, 1440, 1720, 2048, 2480, 3200, 4480, 6720, 11000]
        },
        {
            area: "laser",
            icon: "wpn-laser",
            initial: 0,
            costs: [1000, 1200, 1440, 1720, 2048, 2480, 3200, 4480, 6720, 11000]
        },
        {
            area: "shields",
            icon: "shields",
            initial: 0,
            costs: [1500, 1800, 1440, 2160, 3072, 3720, 4800, 6720, 10080, 16500]
        },
        {
            area: "armour",
            icon: "armour",
            initial: 0,
            costs: [1500, 1800, 1440, 2160, 3072, 3720, 4800, 6720, 10080, 16500]
        }
    ]
};

module.exports = RULES;
