/***********************************************************************************************************************
 *
 * SHIPYARD RULES
 *
 **********************************************************************************************************************/
const RULES = {
    hullTypes: [
        {
            name: "small",
            costs: {
                build: [
                    {resourceType: "energy", amount: 400},
                    {resourceType: "minerals", amount: 600},
                    {resourceType: "resaerch", amount: 200},
                    {resourceType: "turns", amount: 32}
                ]
            }
        },
        {
            name: "medium",
            costs: {
                build: [
                    {resourceType: "energy", amount: 800},
                    {resourceType: "minerals", amount: 1200},
                    {resourceType: "resaerch", amount: 400},
                    {resourceType: "turns", amount: 64}
                ],
                upgrade: [
                    {resourceType: "energy", amount: 600},
                    {resourceType: "minerals", amount: 900},
                    {resourceType: "resaerch", amount: 300},
                    {resourceType: "turns", amount: 64}
                ]
            }
        },
        {
            name: "large",
            costs: {
                build: [
                    {resourceType: "energy", amount: 1200},
                    {resourceType: "minerals", amount: 1800},
                    {resourceType: "resaerch", amount: 600},
                    {resourceType: "turns", amount: 128}
                ],
                upgrade: [
                    {resourceType: "energy", amount: 700},
                    {resourceType: "minerals", amount: 1050},
                    {resourceType: "resaerch", amount: 350},
                    {resourceType: "turns", amount: 128}
                ]
            }
        }
    ]
};

module.exports = RULES;
