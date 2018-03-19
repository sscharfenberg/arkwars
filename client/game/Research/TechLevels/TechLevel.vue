<script>
/***********************************************************************************************************************
 * show a specific techLevel
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Button from "Game/common/Button/Button.vue";
import LevelOverview from "./LevelOverview.vue";
import {techRules} from "Config";
export default {
    components: {
        Icon,
        "btn": Button,
        LevelOverview
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
        researches: function () {
            return this.$store.getters.playerResearches.filter(res => this.tlType === res.area);
        },
        /*
         * "enqueue" button is disabled if
         * a) level is >= max level
         * b) queue.length >= queue maxlength
         * TODO: c) currently requesting "enqueue"
         */
        disableEnqueue: function () {
            return this.level >= techRules.bounds[1] || this.$store.getters.playerResearches.length >= techRules.queue;
        },
        getStartLabel: function () { return this.$t("research.start", {tl: this.nextLevel}); },
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
        startResearch: function () {
            this.$modal.show(`start-${this.tlType}`);
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
                :disabled="disableEnqueue"
                :on-click="startResearch"
                class="start-research"
                :label="getStartLabel"
                :text-string="getStartLabel"/>
            <level-overview
                :tl-type="tlType"
                :level="level" />
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


</style>
