<script>
/***********************************************************************************************************************
 * shows a single item in the research queue
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import ProgressBar from "Game/common/Progress/ProgressBar.vue";
import Button from "Game/common/Button/Button.vue";
import {techRules} from "Config";
export default {
    props: {
        researchId: {
            type: String,
            required: true
        }
    },
    components: {
        Icon,
        btn: Button,
        ProgressBar
    },
    computed: {
        newLevel: function() {
            return this.$store.getters.researchById(this.researchId).newLevel;
        },
        remaining: function () { return this.$store.getters.researchById(this.researchId).remaining; },
        area: function () { return this.$store.getters.researchById(this.researchId).area; },
        researchCosts: function () {
            return techRules.areas.find(tl => tl.area === this.area).costs[this.newLevel - 1];
        },
        researchDone: function () { return this.researchCosts - this.remaining; },
        iconName: function () { return techRules.areas.find(tl => tl.area === this.area).icon; },
        isActive: function () { return this.$store.getters.researchById(this.researchId).order === 0; },
        label: function () {
            return `${this.$t("techLevels." + this.area )} TL${this.newLevel} ${Math.round(this.researchDone / this.researchCosts * 100)}%`;
        },
        disabledClass () { return this.$store.getters.isChangingResearchOrder ? "disabled" : ""; }
    },
    methods: {
        showAbortResearch () { this.$modal.show(`cancel-research-${this.researchId}`); }
    }
};
</script>

<template>
    <div
        class="queue-item"
        :class="disabledClass"
        :title="label">
        <icon
            name="drag"
            class="drag-handle" />
        <icon
            :name="iconName"
            class="queue-icon" />
        <div
            class="new-level"
            aria-hidden="true">{{ newLevel }}</div>
        <progress-bar
            class="progress"
            :max="researchCosts"
            :active="isActive"
            :value="researchDone" />
        <btn
            :on-click="showAbortResearch"
            icon-name="delete"
            class="cancel"
            :label="$t('research.abort')" />
    </div>
</template>

<style lang="scss" scoped>
    .queue-item {
        display: flex;
        align-items: center;

        padding: 1rem;
        border: 1px solid palette("grey", "abbey");
        margin-bottom: 1rem;

        background: palette("grey", "sunken");

        cursor: move;

        &.disabled {
            opacity: 0.6;

            cursor: wait;
        }

        &:last-child {
            margin-bottom: 0;
        }

        &.sortable-ghost {
            background: palette("grey", "fog");
            color: palette("grey", "black");
            border-color: palette("grey", "white");
        }
    }

    .queue-icon,
    .new-level {
        margin-right: 1rem;
    }

    .drag-handle {
        margin-right: 1rem;

        fill: palette("grey", "raven");

        @include respond-to("medium") { margin-right: 2rem; }
    }

    .new-level {
        width: 3rem;
        padding: 0 0.5rem;
        border: 1px solid palette("grey", "charcoal");

        background-color: palette("grey", "asher");
        color: palette("text", "light");

        text-align: center;
    }

    .progress {
        margin: 0 1rem 0 0;
        flex-grow: 1;

        @include respond-to("medium") { margin: 0 2rem 0 1rem; }
    }

    .cancel {
        margin-left: auto;
    }
</style>
