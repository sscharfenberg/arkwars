/***********************************************************************************************************************
 *
 * PDU RULES
 * this specific file is used by the server and included in the compiled client file
 *
 **********************************************************************************************************************/
const RULES =  [
    {
        type: "laser",
        orbitRange: 3,
        baseDamage: 6,
        costs: [
            {resourceType: "energy", amount: 40},
            {resourceType: "minerals", amount: 25}
        ],
        buildDuration: 8,
        baseHp: 25
    },
    {
        type: "plasma",
        orbitRange: 0,
        baseDamage: 15,
        costs: [
            {resourceType: "energy", amount: 60},
            {resourceType: "minerals", amount: 15}
        ],
        buildDuration: 6,
        baseHp: 50
    },
    {
        type: "railgun",
        orbitRange: 1,
        baseDamage: 12,
        costs: [
            {resourceType: "energy", amount: 25},
            {resourceType: "minerals", amount: 40}
        ],
        buildDuration: 6,
        baseHp: 35
    },
    {
        type: "missile",
        orbitRange: 2,
        baseDamage: 9,
        costs: [
            {resourceType: "energy", amount: 15},
            {resourceType: "minerals", amount: 60}
        ],
        buildDuration: 10,
        baseHp: 35
    }
];

module.exports = RULES;
