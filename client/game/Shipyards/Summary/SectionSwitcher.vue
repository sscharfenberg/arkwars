<script>
/***********************************************************************************************************************
 * SectionSwitcher Component
 * this Component displays the available section and allows switching
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
export default {
    components: {
        Icon
    },
    computed: {
        currentSection () { return this.$store.getters.userSettings.shipyards.selectedSection; }
    },
    methods: {
        switchTo (section) { return this.$store.dispatch("SET_SHIPYARD_SECTION", section); },
        sectionClass (section) { return this.currentSection === section ? "active" : ""; }
    }
};
</script>

<template>
    <nav class="switcher">
        <button
            role="switch"
            class="section"
            :class="sectionClass('design')"
            :aria-checked="currentSection === 'desgin'"
            :aria-label="$t('switch.design.label')"
            @click="switchTo('design')">
            <icon
                name="lightbulb"
                :size="3" />
            {{ $t("switch.design.text") }}
        </button>
        <button
            role="switch"
            class="section"
            :class="sectionClass('construct')"
            :aria-checked="currentSection === 'construct'"
            :aria-label="$t('switch.construct.label')"
            @click="switchTo('construct')">
            <icon
                name="build"
                :size="3" />
            {{ $t("switch.construct.text") }}
        </button>
    </nav>
</template>

<style lang="scss" scoped>
    .switcher {
        display: flex;

        @include respond-to("medium") {
            flex: 1 1 calc(50% - 1rem);
        }
    }

    .section {
        display: flex;
        align-items: center;
        justify-content: center;

        width: calc(50% - 1rem);
        padding: 1rem;
        border: 2px solid palette("grey", "abbey");
        margin-right: 1rem;

        background-color: palette("grey", "sunken");
        color: palette("text");

        font-weight: 300;

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        &:last-child { margin-right: 0; }

        &:hover:not([disabled]),
        &:active:not([disabled]),
        &:focus:not([disabled]) {
            background-color: palette("grey", "ebony");
            outline: 0;

            cursor: pointer;
        }

        &.active {
            color: palette("brand", "viking");
            border-color: palette("brand", "christine");
            > svg { color: palette("brand", "gorse"); }
        }

        > svg {
            margin-right: 1rem;
        }
    }
</style>
