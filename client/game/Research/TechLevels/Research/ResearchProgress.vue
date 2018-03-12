<script>
/***********************************************************************************************************************
 * shows the research progress
 **********************************************************************************************************************/
import {techRules} from "Config";
export default {
    props: {
        tlType: {
            type: String,
            required: true
        },
        remaining: {
            type: Number,
            required: true
        },
        newLevel: {
            type: Number,
            required: true
        }
    },
    computed: {
        researchCosts: function () {
            const isOffensive = techRules.types.offensive.find(tl => tl.type === this.tlType);
            const isDefensive = techRules.types.defensive.find(tl => tl.type === this.tlType);
            let costs;
            if (isOffensive) {
                costs = techRules.costs.offensive[this.newLevel - 1];
            }
            if (isDefensive) {
                costs = techRules.costs.defensive[this.newLevel - 1];
            }
            console.log(costs);
            return costs;
        },
        researchDone: function () { return this.researchCosts - this.remaining; }
    }
};
</script>

<template>
    <div>researching TL{{ newLevel }}. Work Done: {{ researchDone }}. Remaining Work: {{ remaining }} / {{ researchCosts }}</div>
</template>

<style lang="scss" scoped>
    div {
        padding: 1rem 0;
    }
</style>
