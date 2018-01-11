/***********************************************************************************************************************
 *
 * STAR RULES
 *
 **********************************************************************************************************************/
const RULES =  {
    spectralTypes: [
        {
            name: "O",
            chance: 5,
            chanceHome: 0,
            planetsMod: -3
        },
        {
            name: "B",
            chance: 5,
            chanceHome: 0,
            planetsMod: -2
        },
        {
            name: "A",
            chance: 5,
            chanceHome: 0,
            planetsMod: -2
        },
        {
            name: "F",
            chance: 10,
            chanceHome: 30,
            planetsMod: 0
        },
        {
            name: "G",
            chance: 20,
            chanceHome: 40,
            planetsMod: 2
        },
        {
            name: "K",
            chance: 20,
            chanceHome: 30,
            planetsMod: 1
        },
        {
            name: "M",
            chance: 30,
            chanceHome: 0,
            planetsMod: 0
        },
        {
            name: "Y",
            chance: 5,
            chanceHome: 0,
            planetsMod: -2
        }
    ],
    name: {
        initial: [4, 6], // range for initially generated names
        // this needs to be synced with /client/game/Empire/Stars/Star.vue
        bounds: [4, 40] // range for player edited names
    },
    planets: {
        npc: [4, 6], // range for numplanets in npc systems
        player: [6, 9] // range for numplanets in player systems
    }
};

module.exports = RULES;
