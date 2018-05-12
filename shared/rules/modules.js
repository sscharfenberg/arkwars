/***********************************************************************************************************************
 *
 * MODULE RULES
 *
 **********************************************************************************************************************/
const RULES = [
    {
        stub: "PLASMA_SMALL",
        type: "offensive",
        baseDmg: 14,
        range: 1,
        buildCosts: [
            {resourceType: "energy", amount: 70},
            {resourceType: "minerals", amount: 30}
        ],
        tons: 1.5
    },
    {
        stub: "RAILGUN_SMALL",
        type: "offensive",
        baseDmg: 10,
        range: 3,
        resistType: "railgun",
        buildCosts: [
            {resourceType: "energy", amount: 30},
            {resourceType: "minerals", amount: 70}
        ],
        tons: 1.4
    },
    {
        stub: "MISSILE_SMALL",
        type: "offensive",
        baseDmg: 8,
        range: 4,
        resistType: "missile",
        buildCosts: [
            {resourceType: "energy", amount: 40},
            {resourceType: "minerals", amount: 60}
        ],
        tons: 1.3
    },
    {
        stub: "LASER_SMALL",
        type: "offensive",
        baseDmg: 11,
        range: 3,
        resistType: "laser",
        buildCosts: [
            {resourceType: "energy", amount: 80},
            {resourceType: "minerals", amount: 20}
        ],
        tons: 1.3
    },
];

module.exports = RULES;
