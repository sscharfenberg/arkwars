<script>
/***********************************************************************************************************************
 * Shipyard
 * this component shows the shipyard status
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
//import {shipyardRules} from "Config";
export default {
    props: {
        id: {
            type: String
        },
        planetName: {
            type: String,
            required: true
        }
    },
    components: {
        Icon
    },
    computed: {
        btnClass () { return this.id ? "active" : ""; },
        btnLabel () {
            return this.id
                ? this.$t("planet.shipyard.button.info", {planetName: this.planetName})
                : this.$t("planet.shipyard.button.construct");
        }
    },
    methods: {
        openDetails () { alert("doh"); }
    }
};
</script>

<template>
    <div class="yard">
        <button
            class="slot__btn"
            :class="btnClass"
            @click="openDetails()"
            :title="btnLabel"
            :aria-label="btnLabel">
            <icon
                class="shipyard__icon"
                name="shipyard" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
    .slot__btn {
        display: flex;
        align-items: center;

        box-sizing: content-box;
        height: 2.6rem;
        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "abbey");
        margin: 0 0 0.8rem 0.8rem;

        background: transparent;
        color: palette("text");

        cursor: pointer;

        font-weight: 300;

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        &.active {
            background-color: rgba(palette("grey", "mystic"), 0.05);
            color: palette("text");

            &:hover,
            &:focus {
                background: palette("grey", "sunken");
                outline: 0;
                border-color: palette("grey", "asher");
            }

            > .shipyard__icon {
                opacity: 1;
            }
        }

        &:hover,
        &:focus {
            background-color: rgba(palette("grey", "mystic"), 0.05);
            border-color: palette("grey", "abbey");

            .shipyard__icon {
                opacity: 1;
            }
        }
    }

    .shipyard__icon {
        opacity: 0.3;

        color: palette("state", "error");
    }
</style>
