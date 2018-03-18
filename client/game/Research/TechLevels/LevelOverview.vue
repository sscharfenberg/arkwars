<script>
/***********************************************************************************************************************
 * show an overview of the techlevels of an area
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Button from "Game/common/Button/Button.vue";
import {techRules} from "Config";
export default {
    components: {
        Icon,
        "btn": Button
    },
    props: {
        tlType: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true
        }
    },
    computed: {
        numTechLevels: function () { return techRules.bounds[1] + 1; },
        researches: function () {
            return this.$store.getters.playerResearches.filter(res => this.tlType === res.area);
        },
        nextLevel: function () {
            const researches = this.researches;
            if (this.researches.length === 0) return this.level + 1;
            const nextLevel = researches.sort((a, b) => {
                if (a.newLevel > b.newLevel) return -1;
                if (a.newLevel < b.newLevel) return 1;
                return 0;
            })[0].newLevel;
            return nextLevel + 1;
        }
    },
    methods: {
        getResearchedClass: function (tl) {
            const researches = this.researches;
            const researchForTl = researches.filter(res => tl === res.newLevel);
            let returnClass = this.level >= tl ? "researched" : "unresearched";
            if (researchForTl.length > 0) returnClass += " queued";
            if (this.level === tl) returnClass += " current";
            if (researchForTl.length > 0 && researchForTl[0].order === 0) returnClass += " researching";
            return returnClass;
        },
        getTlLabel: function (tl) {
            const researches = this.researches;
            const researchForTl = researches.filter(res => tl === res.newLevel);
            let returnString = `${this.$t("techLevels." + this.tlType)} TL${tl}: `;
            if (researchForTl.length === 0) {
                return returnString += this.$t("techLevels.status." + (this.level >= tl ? "researched" : "unresearched"));
            }
            if (researchForTl.length > 0) returnString += this.$t("techLevels.status.queued");
            if (researchForTl.length > 0 && researchForTl[0].order === 0) returnString += ", researching";
            return returnString;
        }
    }
};
</script>

<template>
    <ul class="levels">
        <li
            v-for="n in numTechLevels"
            :key="n"
            :class="getResearchedClass(n-1)"
            :aria-selected="(n - 1) === level"
            :title="getTlLabel(n-1)"
            :aria-label="getTlLabel(n-1)">{{ n - 1 }}</li>
    </ul>
</template>


<style lang="scss" scoped>
    .levels {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));

        width: 100%;

        padding: 0;
        margin: 1rem 0;
        grid-gap: 1rem;

        list-style: none;

        > li {
            padding: 0.3rem;

            text-align: center;
        }

        .unresearched {
            border: 2px solid palette("grey", "bunker");

            background: palette("grey", "bunker");
            color: palette("text", "subdued");
        }

        .queued {
            border: 2px dashed palette("grey", "charcoal");
        }

        .researching {
            border: 2px dashed palette("brand", "christine");

            background: linear-gradient(to top left, palette("grey", "deep"), palette("grey", "raven"));
            color: palette("brand", "gorse");
        }

        .researched {
            border: 2px solid palette("grey", "asher");

            background: palette("grey", "asher");
        }

        .current {
            background-color: palette("state", "online");
            color: palette("text", "light");
            border-color: palette("state", "success");

            font-weight: 700;
        }
    }
</style>
