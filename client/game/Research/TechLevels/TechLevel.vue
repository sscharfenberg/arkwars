<script>
/***********************************************************************************************************************
 * show a specific techLevel
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Button from "Game/common/Button/Button.vue";
import ResearchProgress from "./ResearchProgress.vue";
import {techRules} from "Config";
export default {
    components: {
        Icon,
        "btn": Button,
        ResearchProgress
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
        iconName: function () { return techRules.areas.find(tl => tl.area === this.tlType).icon; },
        numTechLevels: function () { return techRules.bounds[1] + 1; },
        research: function () { return this.$store.getters.playerResearches.find(res => res.area === this.tlType); },
        isMaxed: function () { return this.level >= techRules.bounds[1]; }
    },
    methods: {
        getResearchedClass: function (tl) {
            const returnClass = this.level >= tl ? "researched" : "unresearched";
            return this.level === tl ? returnClass + " current" : returnClass;
        },
        startResearch: function () {
            alert("start research action");
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
            <btn
                v-if="!research"
                :disabled="isMaxed"
                :on-click="startResearch"
                class="start-research"
                :label="$t('research.start')"
                :text-string="$t('research.start')"/>
            <research-progress
                v-if="research"
                :research-id="research.id" />
            <ul class="levels">
                <li
                    v-for="n in numTechLevels"
                    :key="n"
                    :class="getResearchedClass(n-1)"
                    :aria-selected="(n - 1) === level"
                    :aria-hidden="(n - 1) !== level">{{ n - 1 }}</li>
            </ul>
        </section>
    </li>
</template>



<style lang="scss" scoped>
    .item {
        display: flex;
        align-items: center;

        padding: 1rem;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;

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
