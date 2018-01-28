/***********************************************************************************************************************
 *
 * PDU RULES
 * this specific file is used by the server and included in the compiled client file
 *
 **********************************************************************************************************************/
const RULES = {
    types: [
        {
            type: "plasma",
            orbitRange: 0,
            baseDamage: 45,
            costs: [{resourceType: "energy", amount: 180}, {resourceType: "minerals", amount: 45}],
            buildDuration: 12,
            baseHp: 100
        },
        {
            type: "railgun",
            orbitRange: 1,
            baseDamage: 36,
            costs: [{resourceType: "energy", amount: 90}, {resourceType: "minerals", amount: 135}],
            buildDuration: 12,
            baseHp: 70
        },
        {
            type: "missile",
            orbitRange: 2,
            baseDamage: 27,
            costs: [{resourceType: "energy", amount: 45}, {resourceType: "minerals", amount: 180}],
            buildDuration: 20,
            baseHp: 70
        },
        {
            type: "laser",
            orbitRange: 3,
            baseDamage: 18,
            costs: [{resourceType: "energy", amount: 135}, {resourceType: "minerals", amount: 90}],
            buildDuration: 16,
            baseHp: 50
        }
    ],
    maxPerPlanet: 5
};

module.exports = RULES;
