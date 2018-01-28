const calc = require("./shared/calculations");

const pops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const foodConsumption = 1;
console.log("consumption " + foodConsumption);
pops.forEach(pop => {
    console.log("newPop: " + calc.populationGrowth(pop, foodConsumption));
});
