<script>
/***********************************************************************************************************************
 * allows modification of research speed
 **********************************************************************************************************************/
import {techRules} from "Config";
import {effectiveResearch} from "Shared/calculations";
export default {
    data: function() {
        return {
            setPriority: this.$store.getters.player.researchPriority
        };
    },
    computed: {
        sliderSettings () { return techRules.researchPriority; },
        totalPopulation () { return this.$store.getters.player.totalPopulation; },
        calculatedCosts () { return Math.ceil(this.setPriority * this.totalPopulation); },
        calculatedWork () { return effectiveResearch(this.totalPopulation, this.setPriority); },
        isRequesting () { return this.$store.getters.isChangingResearchPriority; }
    },
    methods: {
        changePriority() { this.$store.dispatch("CHANGE_RESEARCH_PRIORITY", this.setPriority); }
    }
};
</script>

<template>
    <div class="research-speed">
        <div class="set">
            <label for="researchSpeedNumber">{{ $t("research.priority.label") }}</label>
            <input
                type="range"
                id="researchSpeedSlider"
                :min="sliderSettings[0]"
                :aria-valuemin="sliderSettings[0]"
                :max="sliderSettings[1]"
                :aria-valuemax="sliderSettings[1]"
                step="0.1"
                v-model="setPriority"
                :disabled="isRequesting"
                @change="changePriority()">
            <input
                type="number"
                id="researchSpeedNumber"
                :min="sliderSettings[0]"
                :aria-valuemin="sliderSettings[0]"
                :max="sliderSettings[1]"
                :aria-valuemax="sliderSettings[1]"
                step="0.5"
                v-model="setPriority"
                :disabled="isRequesting"
                @change="changePriority()">
        </div>
        <div class="result">
            <div class="costs">
                {{ $t("research.priority.costs") }}: {{ calculatedCosts }}
            </div>
            <div class="work">
                {{ $t("research.priority.work") }}: {{ calculatedWork }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .research-speed {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        padding: 1rem;
        margin: 1rem 0;

        background: palette("grey", "sunken");

        @include respond-to("medium") {
            margin: 2rem 0;
        }
    }

    .set {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;

        flex-basis: 100%;

        @include respond-to("large") {
            flex-grow: 1;

            flex-basis: auto;
        }

        > input[type="range"] {
            margin: 0 1rem;
            flex-grow: 1;
        }

        > input[type="number"] {
            width: 4.5rem;
            padding: 0.5rem 1rem;
            border: 0;

            background: palette("grey", "deep");
            color: palette("text");

            font-weight: 300;
            line-height: 1;

            &:focus {
                background: palette("grey", "raven");
                color: palette("grey", "white");
                outline: 0;
            }
        }
    }

    .result {
        margin: 1rem 0 0 0;
        flex-basis: 100%;

        background: palette("grey", "bunker");

        @include respond-to("large") {
            padding: 0 1rem;
            margin: 0 0 0 1rem;
            flex-basis: 25rem;
        }
    }
</style>
