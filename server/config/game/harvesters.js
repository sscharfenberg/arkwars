/***********************************************************************************************************************
 *
 * HARVESTER RULES
 * this specific file is used by the server and included in the compiled client file
 *
 **********************************************************************************************************************/
const RULES =  {
    "build": [
        {
            "type": "energy",
            "costs": [
                {resourceType: "energy", amount: 50},
                {resourceType: "minerals", amount: 100}
            ],
            "duration": 6
        },
        {
            "type": "food",
            "costs": [
                {resourceType: "energy", amount: 100},
                {resourceType: "minerals", amount: 100}
            ],
            "duration": 4
        },
        {
            "type": "minerals",
            "costs": [
                {resourceType: "energy", amount: 100},
                {resourceType: "minerals", amount: 50}
            ],
            "duration": 6
        },
        {
            "type": "research",
            "costs": [
                {resourceType: "energy", amount: 100},
                {resourceType: "minerals", amount: 100}
            ],
            "duration": 8
        }
    ]
};

module.exports = RULES;
