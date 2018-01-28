/***********************************************************************************************************************
 *
 * HARVESTER RULES
 * this specific file is used by the server and included in the compiled client file
 *
 **********************************************************************************************************************/
const RULES =  {
    types: [
        {
            type: "energy",
            costs: [
                {resourceType: "energy", amount: 50},
                {resourceType: "minerals", amount: 100}
            ],
            duration: 8,
            baseProduction: 20
        },
        {
            type: "food",
            costs: [
                {resourceType: "energy", amount: 100},
                {resourceType: "minerals", amount: 100}
            ],
            duration: 6,
            baseProduction: 10
        },
        {
            type: "minerals",
            costs: [
                {resourceType: "energy", amount: 100},
                {resourceType: "minerals", amount: 50}
            ],
            duration: 8,
            baseProduction: 20
        },
        {
            type: "research",
            costs: [
                {resourceType: "energy", amount: 100},
                {resourceType: "minerals", amount: 100}
            ],
            duration: 12,
            baseProduction: 10
        }
    ]
};

module.exports = RULES;
