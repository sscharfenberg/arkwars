<script>
/***********************************************************************************************************************
 * shows a single item in the research qeue
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
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
        btn: Button
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
        isResearching: function () { return this.$store.getters.researchById(this.researchId).order === 0; }
    },
    methods: {
        cancelResearch () {
            alert("cancel");
        }
    }
};
</script>

<template>
    <div class="qeue-item">
        <icon
            name="drag"
            class="drag-handle" />
        <icon
            :name="iconName"
            class="qeue-icon" />
        <div class="tl-name">{{ $t("techLevels." + area ) }}</div>
        <div class="new-level">TL{{ newLevel }}</div>
        <div
            v-if="isResearching"
            class="progress">progress {{ researchDone }} / {{ researchCosts }}</div>
        <btn
            :on-click="cancelResearch"
            icon-name="delete"
            class="cancel"
            :label="$t('research.cancel')" />
    </div>
</template>

<style lang="scss" scoped>
    .qeue-item {
        display: flex;
        align-items: center;

        padding: 1rem;
        border: 1px solid palette("grey", "abbey");
        margin-bottom: 1rem;

        background: palette("grey", "sunken");

        cursor: move;

        &:last-child {
            margin-bottom: 0;
        }

        &:first-child {
            border-color: palette("grey", "fog");
        }

        &.sortable-ghost {
            background: palette("grey", "fog");
            color: palette("grey", "black");
            border-color: palette("grey", "white");
        }
    }

    .qeue-icon,
    .tl-name,
    .new-level {
        margin-right: 1rem;
    }

    .drag-handle {
        margin-right: 1rem;

        fill: palette("grey", "raven");
    }

    .new-level {
        padding: 0.2rem 0.5rem;
        border: 1px solid palette("grey", "charcoal");

        background-color: palette("grey", "asher");
        color: palette("text", "light");
    }

    .progress {
        margin-right: 1rem;
        flex-grow: 1;
    }

    .cancel {
        margin-left: auto;
    }
</style>
