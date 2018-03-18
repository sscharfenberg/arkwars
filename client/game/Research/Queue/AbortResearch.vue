<script>
/***********************************************************************************************************************
 * Cancel Research Job Modal
 **********************************************************************************************************************/
import Button from "Game/common/Button/Button.vue";
import Icon from "Game/common/Icon/Icon.vue";
import ProgressBar from "Game/common/Progress/ProgressBar.vue";
import {techRules} from "Config";
export default {
    props: {
        researchId: {
            type: String,
            required: true
        }
    },
    components: {
        btn: Button,
        Icon,
        ProgressBar
    },
    computed: {
        newLevel: function() { return this.$store.getters.researchById(this.researchId).newLevel; },
        remaining: function () { return this.$store.getters.researchById(this.researchId).remaining; },
        area: function () { return this.$store.getters.researchById(this.researchId).area; },
        researchCosts: function () {
            return techRules.areas.find(tl => tl.area === this.area).costs[this.newLevel - 1];
        },
        researchDone: function () { return this.researchCosts - this.remaining; },
        iconName: function () { return techRules.areas.find(tl => tl.area === this.area).icon; },
        isActive: function () { return this.$store.getters.researchById(this.researchId).order === 0; }
    },
    methods: {
        cancelCancel () { this.$modal.hide(`cancel-research-${this.researchId}`); },
        cancelConfirm () {
            this.$store.dispatch("DELETE_RESEARCH_JOB", this.researchId);
            this.$modal.hide(`cancel-research-${this.researchId}`);
        }
    }
};
</script>

<template>
    <modal
        :name="`cancel-research-${researchId}`"
        :adaptive="true"
        :width="320"
        :scrollable="true"
        height="auto">
        <header class="cancel__header">
            {{ $t("research.abort") }}
        </header>
        <div class="cancel__research">
            <icon :name="iconName" />
            <div class="new-level">{{ newLevel }}</div>
            <progress-bar
                class="progress"
                :max="researchCosts"
                :active="isActive"
                :value="researchDone" />
        </div>
        <div class="cancel__text">
            {{ $t("research.abortDesc", {workDone: researchDone}) }}
        </div>
        <div class="cancel__actions">
            <btn
                :on-click="cancelConfirm"
                :text-string="$t('research.abort')"
                icon-name="delete" />
        </div>
        <btn
            class="close-modal"
            :on-click="cancelCancel"
            icon-name="cancel" />
    </modal>
</template>

<style lang="scss" scoped>
    .cancel {
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

        &__research {
            display: flex;
            align-items: center;

            padding: 1rem;

            > svg,
            > .new-level {
                margin-right: 1rem;
            }

            .progress {
                flex-grow: 1;
            }

            .new-level {
                padding: 0 1rem;
                border: 1px solid palette("grey", "charcoal");

                background-color: palette("grey", "asher");
                color: palette("text", "light");

                text-align: center;
            }
        }

        &__text {
            padding: 0 1rem 1rem 1rem;
        }
    }
</style>
