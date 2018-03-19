<script>
/***********************************************************************************************************************
 * Start Research Job Modal
 **********************************************************************************************************************/
import Button from "Game/common/Button/Button.vue";
import Icon from "Game/common/Icon/Icon.vue";
import Costs from "Game/common/Costs/Costs.vue";
import {techRules} from "Config";
export default {
    props: {
        area: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true
        }
    },
    components: {
        btn: Button,
        Icon,
        Costs
    },
    computed: {
        researches: function () { return this.$store.getters.playerResearches.filter(res => this.area === res.area); },
        iconName: function () { return techRules.areas.find(tl => tl.area === this.area).icon; },
        nextLevel: function () {
            const researches = this.researches;
            if (this.researches.length === 0) return this.level + 1;
            const highestResearch = researches.sort((a, b) => {
                if (a.newLevel > b.newLevel) return -1;
                if (a.newLevel < b.newLevel) return 1;
                return 0;
            })[0].newLevel;
            return highestResearch + 1;
        },
        researchCosts: function () {
            return [{
                resourceType: "research",
                amount: techRules.areas.find(slot => slot.area === this.area).costs[this.nextLevel - 1]
            }];
        }
    },
    methods: {
        cancelStart () { this.$modal.hide(`start-${this.area}`); },
        confirmStart () {
            alert("confirm");
        }
    }
};
</script>

<template>
    <modal
        :name="`start-${area}`"
        :adaptive="true"
        :width="320"
        :scrollable="true"
        height="auto">
        <header class="enqueue__header">
            {{ $t("research.enqueue.title") }}
        </header>
        <div class="enqueue__what">
            <icon
                class="icon"
                :name="iconName"
                :size="2" />
            <div class="level">TL{{ nextLevel }}</div>
        </div>
        <div class="enqueue__costs">
            <costs
                :show-affordable="false"
                :costs="researchCosts" />
        </div>
        <div class="enqueue__explanation">
            {{ $t("research.enqueue.explanation", {turns: 25}) }}
        </div>
        <div class="enqueue__actions">
            <btn
                :on-click="cancelStart"
                :text-string="$t('common.buttons.cancel')"
                icon-name="cancel" />
            <btn
                :on-click="confirmStart"
                :text-string="$t('research.enqueue.start')"
                icon-name="done" />
        </div>
        <btn
            class="close-modal"
            :on-click="cancelStart"
            icon-name="cancel" />
    </modal>
</template>

<style lang="scss" scoped>
    .enqueue {
        &__header {
            padding: 1rem;
            border-bottom: 1px solid palette("brand", "viking");

            color: palette("brand", "viking");

            font-size: 1.8rem;
        }

        &__actions {
            display: flex;
            justify-content: stretch;

            padding: 0.2rem;
            border-top: 1px solid palette("brand", "viking");

            > button {
                justify-content: center;

                margin-right: 0.2rem;
                flex: 1;

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        &__what {
            display: flex;
            align-items: center;

            padding: 1rem;

            > .icon {
                margin-right: 1rem;
            }

            > .level {
                width: 3rem;
                padding: 0 0.5rem;
                border: 1px solid palette("grey", "charcoal");

                background-color: palette("grey", "asher");
                color: palette("text", "light");

                text-align: center;
            }
        }

        &__costs {
            padding: 0 1rem 1rem 1rem;
            border-bottom: 1px solid palette("brand", "viking");
        }

        &__explanation {
            padding: 1rem;
        }
    }
</style>
