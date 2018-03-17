<script>
/***********************************************************************************************************************
 * shows the research progress
 **********************************************************************************************************************/
import {techRules} from "Config";
export default {
    props: {
        researchId: {
            type: String,
            required: true
        }
    },
    computed: {
        research: function () { return this.$store.getters.researchById(this.researchId); },
        position: function () { return this.$store.getters.researchById(this.researchId).order; },
        newLevel: function() { return this.$store.getters.researchById(this.researchId).newLevel; },
        remaining: function () { return this.$store.getters.researchById(this.researchId).remaining; },
        area: function () { return this.$store.getters.researchById(this.researchId).area; },
        researchCosts: function () {
            return techRules.areas.find(tl => tl.area === this.area).costs[this.newLevel - 1];
        },
        researchDone: function () { return this.researchCosts - this.remaining; },
        isResearching: function () { return this.position === 0; },
    }
};
</script>

<template>
    <div>
        <span v-if="isResearching">
            researching TL{{ newLevel }}.
        </span>
        <span v-if="!isResearching">
            qeued TL{{ newLevel }}.
        </span>

        Work Done: {{ researchDone }}.
        Remaining Work: {{ remaining }} / {{ researchCosts }}
    </div>
</template>

<style lang="scss" scoped>
    div {
        padding: 1rem 0;
    }
</style>
