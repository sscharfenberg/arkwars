/***********************************************************************************************************************
 *
 * PLAYER RULES
 *
 **********************************************************************************************************************/
const RULES = {
    name: {bounds: [6, 32]}, // [min, max] player/empire name
    ticker: {bounds: [2, 5]}, // {min, max] player/empire ticker
    // resourceTypes
    resourceTypes: [
        {
            type: "energy",
            default: 1000,
            storageLevels: [
                {
                    lvl: 0,
                    amount: 1000,
                    default: true
                },
                {
                    lvl: 1,
                    amount: 1500,
                    costs: [
                        {resourceType: "minerals", amount: 400},
                        {resourceType: "energy", amount: 400},
                        {resourceType: "turns", amount: 16}
                    ]
                },
                {
                    lvl: 2,
                    amount: 2000,
                    costs: [
                        {resourceType: "minerals", amount: 600},
                        {resourceType: "energy", amount: 600},
                        {resourceType: "turns", amount: 24}
                    ]
                },
                {
                    lvl: 3,
                    amount: 3000,
                    costs: [
                        {resourceType: "minerals", amount: 1000},
                        {resourceType: "energy", amount: 1000},
                        {resourceType: "turns", amount: 32}
                    ]
                },
                {
                    lvl: 4,
                    amount: 5000,
                    costs: [
                        {resourceType: "minerals", amount: 2000},
                        {resourceType: "energy", amount: 2000},
                        {resourceType: "turns", amount: 64}
                    ]
                }
            ]
        },
        {
            type: "food",
            default: 500,
            storageLevels: [
                {
                    lvl: 0,
                    amount: 500,
                    default: true
                },
                {
                    lvl: 1,
                    amount: 750,
                    costs: [
                        {resourceType: "minerals", amount: 250},
                        {resourceType: "energy", amount: 550},
                        {resourceType: "turns", amount: 24}
                    ]
                },
                {
                    lvl: 2,
                    amount: 1000,
                    costs: [
                        {resourceType: "minerals", amount: 400},
                        {resourceType: "energy", amount: 800},
                        {resourceType: "turns", amount: 32}
                    ]
                },
                {
                    lvl: 3,
                    amount: 1500,
                    costs: [
                        {resourceType: "minerals", amount: 750},
                        {resourceType: "energy", amount: 1250},
                        {resourceType: "turns", amount: 48}
                    ]
                },
                {
                    lvl: 4,
                    amount: 2500,
                    costs: [
                        {resourceType: "minerals", amount: 1500},
                        {resourceType: "energy", amount: 2500},
                        {resourceType: "turns", amount: 96}
                    ]
                }
            ]
        },
        {
            type: "minerals",
            default: 1000,
            storageLevels: [
                {
                    lvl: 0,
                    amount: 1000,
                    default: true
                },
                {
                    lvl: 1,
                    amount: 1500,
                    costs: [{resourceType: "energy", amount: 800}, {resourceType: "turns", amount: 16}]
                },
                {
                    lvl: 2,
                    amount: 2000,
                    costs: [{resourceType: "energy", amount: 1200}, {resourceType: "turns", amount: 24}]
                },
                {
                    lvl: 3,
                    amount: 3000,
                    costs: [{resourceType: "energy", amount: 2000}, {resourceType: "turns", amount: 32}]
                },
                {
                    lvl: 4,
                    amount: 5000,
                    costs: [{resourceType: "energy", amount: 3000}, {resourceType: "turns", amount: 64}]
                }
            ]
        },
        {
            type: "research",
            default: 500,
            storageLevels: [
                {
                    lvl: 0,
                    amount: 500,
                    default: true
                },
                {
                    lvl: 1,
                    amount: 750,
                    costs: [
                        {resourceType: "food", amount: 250},
                        {resourceType: "energy", amount: 250},
                        {resourceType: "minerals", amount: 250},
                        {resourceType: "turns", amount: 24}
                    ]
                },
                {
                    lvl: 2,
                    amount: 1000,
                    costs: [
                        {resourceType: "food", amount: 400},
                        {resourceType: "energy", amount: 400},
                        {resourceType: "minerals", amount: 400},
                        {resourceType: "turns", amount: 32}
                    ]
                },
                {
                    lvl: 3,
                    amount: 1500,
                    costs: [
                        {resourceType: "food", amount: 750},
                        {resourceType: "energy", amount: 750},
                        {resourceType: "minerals", amount: 750},
                        {resourceType: "turns", amount: 48}
                    ]
                },
                {
                    lvl: 4,
                    amount: 2500,
                    costs: [
                        {resourceType: "food", amount: 1500},
                        {resourceType: "energy", amount: 1500},
                        {resourceType: "minerals", amount: 1500},
                        {resourceType: "turns", amount: 96}
                    ]
                }
            ]
        }
    ]
};

module.exports = RULES;
