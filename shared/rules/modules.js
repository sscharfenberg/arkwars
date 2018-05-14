/***********************************************************************************************************************
 *
 * MODULE RULES
 *
 **********************************************************************************************************************/
const RULES = [
    /**
     * offensive modules
     */
    {
        stub: "PLASMA_SMALL",
        type: "offensive",
        hullType: "small",
        buildCosts: [{resourceType: "energy", amount: 70}, {resourceType: "minerals", amount: 30}],
        mass: 2,
        powerRequired: 6,
        resistType: "plasma",
        baseDmg: 14,
        range: 1
    },
    {
        stub: "RAILGUN_SMALL",
        type: "offensive",
        hullType: "small",
        buildCosts: [{resourceType: "energy", amount: 30}, {resourceType: "minerals", amount: 70}],
        mass: 6,
        powerRequired: 2,
        resistType: "railgun",
        baseDmg: 10,
        range: 3
    },
    {
        stub: "MISSILE_SMALL",
        type: "offensive",
        hullType: "small",
        buildCosts: [{resourceType: "energy", amount: 40}, {resourceType: "minerals", amount: 60}],
        mass: 8,
        powerRequired: 0,
        resistType: "missile",
        baseDmg: 8,
        range: 4
    },
    {
        stub: "LASER_SMALL",
        type: "offensive",
        hullType: "small",
        buildCosts: [{resourceType: "energy", amount: 60}, {resourceType: "minerals", amount: 40}],
        mass: 3,
        powerRequired: 5,
        resistType: "laser",
        baseDmg: 11,
        range: 3
    },

    /**
     * defensive modules
     */
    {
        stub: "ARMOUR_SMALL",
        type: "defensive",
        hullType: "small",
        buildCosts: [{resourceType: "energy", amount: 100}, {resourceType: "minerals", amount: 200}],
        mass: 10,
        powerRequired: 0,
        defenseType: "armour",
        baseHp: 150
    },
    {
        stub: "SHIELD_SMALL",
        type: "defensive",
        hullType: "small",
        buildCosts: [{resourceType: "energy", amount: 250}, {resourceType: "minerals", amount: 50}],
        mass: 3,
        powerRequired: 8,
        defenseType: "shields",
        baseHp: 150
    },

    /**
     * industrial modules
     */
    {
        stub: "COLONY",
        type: "industrial",
        hullType: "ark",
        buildCosts: [{resourceType: "energy", amount: 250}, {resourceType: "minerals", amount: 50}],
        mass: 20,
        powerRequired: 20
    }
];

module.exports = RULES;
