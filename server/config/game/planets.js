/***********************************************************************************************************************
 *
 * PLANET RULES
 *
 **********************************************************************************************************************/
const RULES =  {
    // these need to be synced with /client/game/Empire/Planets/Planets.vue
    types: [
        {
            name: "terrestrial",
            chance: 20,
            chanceHome: 40,
            resourceSlots: [
                {type: "food", chance: 70, max: 3, potential: [3000, 6000]},
                {type: "energy", chance: 50, max: 2, potential: [2000, 3000]}
            ]
        },
        {
            name: "gas",
            chance: 17,
            chanceHome: 10,
            resourceSlots: [
                {type: "research", chance: 70, max: 3, potential: [3000, 6000]},
                {type: "energy", chance: 50, max: 2, potential: [2000, 3000]}
            ]
        },
        {
            name: "ice",
            chance: 16,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 30, max: 1, potential: [1200, 2400]},
                {type: "food", chance: 70, max: 2, potential: [3000, 6000]},
                {type: "research", chance: 15, max: 1, potential: [750, 1500]}
            ]
        },
        {
            name: "iron",
            chance: 20,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 70, max: 3, potential: [3000, 6000]},
                {type: "research", chance: 30, max: 1, potential: [1200, 2400]},
                {type: "food", chance: 15, max: 1, potential: [750, 1500]}
            ]
        },
        {
            name: "desert",
            chance: 29,
            chanceHome: 10,
            resourceSlots: [
                {type: "energy", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "food", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "minerals", chance: 15, max: 1, potential: [750, 1500]}
            ]
        },
        {
            name: "toxic",
            chance: 5,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "energy", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "research", chance: 15, max: 1, potential: [750, 1500]}
            ]
        },
        {
            name: "carbon",
            chance: 2,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "research", chance: 70, max: 3, potential: [3000, 6000]}
            ]
        },
        {
            name: "tomb",
            chance: 1,
            chanceHome: 0,
            resourceSlots: [
                {type: "energy", chance: 30, max: 1, potential: [1000, 2000]},
                {type: "minerals", chance: 30, max: 1, potential: [1000, 2000]},
                {type: "food", chance: 30, max: 1, potential: [1000, 2000]},
                {type: "research", chance: 100, max: 3, potential: [4000, 8000]}
            ]
        }
    ]
};

module.exports = RULES;
