/***********************************************************************************************************************
 *
 * PLANET RULES
 * chance and chanceHome are added each and a random number between min and max is chosen.
 * they do not necessarily add up to 100.
 * the resourceSlot chances, however, are percentage chances. they are also cumulative:
 * if a 30 is rolled and the chance was 70, there is a new chance with 40% - up to max prop
 *
 **********************************************************************************************************************/
const RULES =  {
    types: [
        {
            name: "terrestrial",
            chance: 20,
            chanceHome: 37,
            resourceSlots: [
                {type: "food", chance: 70, max: 3, potential: [3000, 6000]},
                {type: "energy", chance: 50, max: 2, potential: [2000, 3000]}
            ]
        },
        {
            name: "gas",
            chance: 17,
            chanceHome: 13,
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
            chance: 19,
            chanceHome: 10,
            resourceSlots: [
                {type: "energy", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "food", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "minerals", chance: 15, max: 1, potential: [750, 1500]}
            ]
        },
        {
            name: "toxic",
            chance: 10,
            chanceHome: 13,
            resourceSlots: [
                {type: "minerals", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "energy", chance: 50, max: 2, potential: [2000, 3000]},
                {type: "research", chance: 15, max: 1, potential: [750, 1500]}
            ]
        },
        {
            name: "carbon",
            chance: 7,
            chanceHome: 7,
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
