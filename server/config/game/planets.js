/***********************************************************************************************************************
 *
 * PLANET RULES
 * chance and chanceHome are added each and a random number between min and max is chosen.
 * they do not necessarily add up to 100.
 * the resourceSlot chances, however, are percentage chances. they are also cumulative:
 * if a 30 is rolled and the chance was 70, there is a new chance with 40% - up to max prop
 * potential is the "grade" of the resource;
 *
 **********************************************************************************************************************/
const RULES =  {
    types: [
        {
            name: "terrestrial",
            chance: 20,
            chanceHome: 37,
            resourceSlots: [
                {type: "food", chance: 70, max: 3, potential: [1, 2]},
                {type: "energy", chance: 50, max: 2, potential: [0.7, 1.3]}
            ]
        },
        {
            name: "gas",
            chance: 17,
            chanceHome: 13,
            resourceSlots: [
                {type: "research", chance: 70, max: 3, potential: [1, 2]},
                {type: "energy", chance: 50, max: 2, potential: [0.7, 1.3]}
            ]
        },
        {
            name: "ice",
            chance: 16,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 30, max: 1, potential: [0.6, 1.2]},
                {type: "food", chance: 70, max: 2, potential: [1, 2]},
                {type: "research", chance: 15, max: 1, potential: [0.5, 1]}
            ]
        },
        {
            name: "iron",
            chance: 20,
            chanceHome: 10,
            resourceSlots: [
                {type: "minerals", chance: 70, max: 3, potential: [1, 2]},
                {type: "research", chance: 30, max: 1, potential: [0.6, 1.2]},
                {type: "food", chance: 15, max: 1, potential: [0.5, 1]}
            ]
        },
        {
            name: "desert",
            chance: 19,
            chanceHome: 10,
            resourceSlots: [
                {type: "energy", chance: 50, max: 2, potential: [0.7, 1.3]},
                {type: "food", chance: 50, max: 2, potential: [0.7, 1.3]},
                {type: "minerals", chance: 15, max: 1, potential: [0.5, 1]}
            ]
        },
        {
            name: "toxic",
            chance: 10,
            chanceHome: 13,
            resourceSlots: [
                {type: "minerals", chance: 50, max: 2, potential: [0.7, 1.3]},
                {type: "energy", chance: 50, max: 2, potential: [0.7, 1.3]},
                {type: "research", chance: 15, max: 1, potential: [0.5, 1]}
            ]
        },
        {
            name: "carbon",
            chance: 7,
            chanceHome: 7,
            resourceSlots: [
                {type: "minerals", chance: 50, max: 2, potential: [0.7, 1.3]},
                {type: "research", chance: 70, max: 3, potential: [1, 2]}
            ]
        },
        {
            name: "tomb",
            chance: 1,
            chanceHome: 0,
            resourceSlots: [
                {type: "energy", chance: 30, max: 1, potential: [0.6, 1.2]},
                {type: "minerals", chance: 30, max: 1, potential: [0.6, 1.2]},
                {type: "food", chance: 30, max: 1, potential: [0.6, 1.2]},
                {type: "research", chance: 100, max: 3, potential: [1.2, 2.4]}
            ]
        }
    ]
};

module.exports = RULES;
