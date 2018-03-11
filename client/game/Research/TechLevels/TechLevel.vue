<script>
/***********************************************************************************************************************
 * show a specific techLevel
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Button from "Game/common/Button/Button.vue";
import ResearchProgress from "./Research/ResearchProgress.vue";
import StartResearch from "./Research/StartResearch.vue";
import {techRules} from "Config";
export default {
    data: function() {
        return {
            showResearch: false
        };
    },
    components: {
        Icon,
        "btn": Button,
        ResearchProgress,
        StartResearch
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
        iconName: function () {
            if (techRules.types.offensive.find(tl => tl.type === this.tlType)) {
                return `wpn-${this.tlType}`;
            }
            return this.tlType;
        },
        numTechLevels: function () { return techRules.bounds[1] + 1; },
        hasResearch: function () { return this.$store.getters.playerResearches.find(res => res.area === this.tlType); },
        isMaxed: function () { return this.level >= techRules.bounds[1]; }
    },
    methods: {
        getResearchedClass: function (tl) {
            const returnClass = this.level >= tl ? "researched" : "unresearched";
            return this.level === tl ? returnClass + " current" : returnClass;
        },
        startResearch: function () {
            console.log("toggling reasearch panel from ", this.showResearch);
            return this.showResearch = !this.showResearch;
        }
    }
};
</script>

<template>
    <li class="item">
        <icon
            class="icon"
            :name="iconName"
            :size="4" />
        <section class="level">
            <h4>{{ $t("techLevels." + tlType ) }}</h4>
            <ul class="levels">
                <li
                    v-for="n in numTechLevels"
                    :key="n"
                    :class="getResearchedClass(n-1)">{{ n - 1 }}</li>
            </ul>
            <btn
                v-if="!hasResearch && !isMaxed && !showResearch"
                :on-click="startResearch"
                class="start-research"
                :label="$t('research.start')"
                :text-string="$t('research.start')"/>
            <research-progress
                v-if="hasResearch"
                :remaining="hasResearch.remaining"
                :new-level="hasResearch.newLevel"
                :tl-type="tlType" />
            <start-research v-if="showResearch" />
        </section>
    </li>
</template>



<style lang="scss" scoped>
    .item {
        display: flex;
        align-items: center;

        padding: 1rem;
        border: 1px solid palette("grey", "abbey");
        margin-top: 1rem;

        background: palette("grey", "sunken");

        @include respond-to("medium") {
            margin-top: 2rem;
        }

        .icon {
            align-self: flex-start;

            width: 4.8rem;
            height: 4.8rem;
            margin: 1rem 1rem 0 0;

            @include respond-to("medium") {
                align-self: center;

                width: 6.4rem;
                height: 6.4rem;
                margin: 0 2rem 0 1rem;
            }
        }
    }

    .level {
        flex-grow: 1;

        > h4 {
            margin: 0;

            font-weight: 300;
        }
    }

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
