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
                {type: "food", chance: 120, max: 3, potential: [2000, 4000]},
                {type: "energy", chance: 80, max: 2, potential: [1000, 2000]}
            ]
        },
        {
            name: "gas",
            chance: 17,
            chanceHome: 10,
            resourceSlots: [
                {type: "research", chance: 100, max: 3, potential: [1500, 3000]},
                {type: "energy", chance: 80, max: 2, potential: [1000, 2000]}
            ]
        },
        {
            name: "ice",
            chance: 16,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 60, max: 1, potential: [800, 1600]},
                {type: "food", chance: 100, max: 2, potential: [1500, 3000]}
            ]
        },
        {
            name: "iron",
            chance: 20,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 100, max: 3, potential: [1500, 3000]},
                {type: "research", chance: 60, max: 1, potential: [800, 1600]}
            ]
        },
        {
            name: "desert",
            chance: 29,
            chanceHome: 10,
            resourceSlots: [
                {type: "energy", chance: 80, max: 2, potential: [1000, 2000]},
                {type: "food", chance: 80, max: 2, potential: [1000, 2000]}
            ]
        },
        {
            name: "toxic",
            chance: 5,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 80, max: 2, potential: [1000, 2000]},
                {type: "energy", chance: 80, max: 2, potential: [1000, 2000]}
            ]
        },
        {
            name: "carbon",
            chance: 2,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 80, max: 2, potential: [1000, 2000]},
                {type: "research", chance: 120, max: 4, potential: [2000, 4000]}
            ]
        },
        {
            name: "tomb",
            chance: 1,
            chanceHome: 0,
            resourceSlots: [
                {type: "energy", chance: 50, max: 1, potential: [500, 1000]},
                {type: "minerals", chance: 50, max: 1, potential: [500, 1000]},
                {type: "food", chance: 50, max: 1, potential: [500, 1000]},
                {type: "research", chance: 120, max: 3, potential: [2000, 4000]}
            ]
        }
    ]
};

module.exports = RULES;
