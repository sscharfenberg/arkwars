/***********************************************************************************************************************
 *
 * calculations handler
 * this calculates various game stuff. all functions need to be "pure" so we can use them in the client as well
 *
 **********************************************************************************************************************/

/*
 * calculate population growth
 *
 * default food consumption is 1 per pop
 * below 1 food per pop, we use a Math.log so the population decreases more if it gets less food.
 * for zero food, we use a fixed starving Multiplier.
 * for more than one food per pop, we make sure that bigger population means less (possible) growth
 * absolute growth varies by factor of 20 (1 pop versus 20 pop).
 * we want population growth to start quite fast and then slow down as population grows
 * this function does not care about population max.
 *
 * @param {Number} population - float
 * @param {Number} foodConsumtion - float
 * @returns {Number} new population - float
 */
const populationGrowth = (population, foodConsumption) => {
    let starvingMultiplier = 0.8; // 20% of population dies if noone eats ^.^
    let newPop = foodConsumption < 1
        ? population * (1 + ((Math.log(foodConsumption) * 3) / 100))
        : population + ((Math.log(foodConsumption * 3) / population) / 100);
    newPop = foodConsumption < 0.01 ? population * starvingMultiplier : newPop;
    return newPop.toFixed(8); // we don't need this much precision, waste of db space
};

module.exports = {populationGrowth};
