/***********************************************************************************************************************
 *
 * SHIPYARD RULES
 *
 **********************************************************************************************************************/
const RULES = {
    hullTypes: [
        {
            name: "small",
            default: true, // = shipType for starting shipyard
            costs: {
                build: [
                    {resourceType: "energy", amount: 400},
                    {resourceType: "minerals", amount: 600},
                    {resourceType: "research", amount: 200},
                    {resourceType: "turns", amount: 96}
                ]
            }
        },
        {
            name: "medium",
            costs: {
                build: [
                    {resourceType: "energy", amount: 800},
                    {resourceType: "minerals", amount: 1200},
                    {resourceType: "research", amount: 400},
                    {resourceType: "turns", amount: 192}
                ],
                upgrade: [
                    {resourceType: "energy", amount: 600},
                    {resourceType: "minerals", amount: 900},
                    {resourceType: "research", amount: 300},
                    {resourceType: "turns", amount: 144}
                ]
            }
        },
        {
            name: "large",
            costs: {
                build: [
                    {resourceType: "energy", amount: 1200},
                    {resourceType: "minerals", amount: 1800},
                    {resourceType: "research", amount: 600},
                    {resourceType: "turns", amount: 384}
                ],
                upgrade: [
                    {resourceType: "energy", amount: 700},
                    {resourceType: "minerals", amount: 1050},
                    {resourceType: "research", amount: 350},
                    {resourceType: "turns", amount: 288}
                ]
            }
        }
    ]
};

module.exports = RULES;
