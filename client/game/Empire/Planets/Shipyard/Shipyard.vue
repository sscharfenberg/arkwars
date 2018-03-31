<script>
/***********************************************************************************************************************
 * Shipyard
 * this component shows the shipyard status
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
//import {shipyardRules} from "Config";
export default {
    components: {
        Icon
    },
    computed: {
        btnClass () { return ""; },
        btnLabel () { return "Construct Shipyard"; }
    },
    methods: {
        openDetails () { alert("doh"); }
    }
};
</script>

<template>
    <div class="yard">
        <button
            class="yard__btn"
            :class="btnClass"
            @click="openDetails()"
            :title="btnLabel"
            :aria-label="btnLabel">
            <icon
                class="yard__icon"
                name="shipyard" />
        </button>
    </div>
</template>


<style lang="scss" scoped>
    .yard__btn {
        display: flex;
        align-items: center;

        box-sizing: content-box;
        height: 2.6rem;
        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "abbey");
        margin: 0 0 0.8rem 0;

        background: transparent;
        color: palette("text");

        cursor: pointer;

        font-weight: 300;

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        &:hover,
        &:focus {
            background-color: rgba(palette("grey", "mystic"), 0.05);
            border-color: palette("grey", "abbey");

            .yard__icon {
                opacity: 1;
            }
        }
    }

    .yard__icon {
        opacity: 0.3;
    }
</style>
