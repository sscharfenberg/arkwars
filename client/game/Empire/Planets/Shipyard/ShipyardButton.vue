<script>
/***********************************************************************************************************************
 * Shipyard
 * this component shows the shipyard status
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import ShipyardModal from "./ShipyardModal.vue";
export default {
    props: {
        id: {
            type: String
        },
        planetId: {
            type: String,
            required: true
        },
        planetName: {
            type: String,
            required: true
        }
    },
    components: {
        Icon,
        ShipyardModal
    },
    computed: {
        shipyard () { return this.$store.getters.shipyardById(this.id); },
        btnClass () {
            if (this.shipyard.id) return this.shipyard.active ? "active" : "building";
            return "";
        },
        btnLabel () {
            return this.id
                ? this.$t("planet.shipyard.button.info", {planetName: this.planetName})
                : this.$t("planet.shipyard.button.construct");
        },
        btnDisabled () { return this.$store.getters.requestingShipyardPlanets.includes(this.planetId); }
    },
    methods: {
        openDetails () { this.$modal.show(`shipyard-modal-${this.planetId}`); }
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
            :aria-label="btnLabel"
            :disabled="btnDisabled"
            :aria-disabled="btnDisabled">
            <icon
                class="shipyard__icon"
                name="shipyard" />
        </button>
        <shipyard-modal
            :id="id"
            :planet-id="planetId"
            :planet-name="planetName" />
    </div>
</template>

<style lang="scss" scoped>
    .slot__btn {
        display: flex;
        align-items: center;

        box-sizing: content-box;
        height: 2.6rem;
        padding: 0.5rem 1rem;
        border: 2px solid palette("grey", "abbey");
        margin: 0 0 0.8rem 0.8rem;

        background: transparent;
        color: palette("text");

        cursor: pointer;

        font-weight: 300;

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        &[disabled] {
            border-color: palette("grey", "deep");

            cursor: not-allowed;

            .shipyard__icon { opacity: 0.2; }
        }

        &.active,
        &.building {
            border: 2px dashed palette("state", "building");

            background-color: rgba(palette("grey", "mystic"), 0.05);
            color: palette("text");

            &:hover,
            &:focus {
                background: palette("grey", "sunken");
                outline: 0;
                border-color: palette("grey", "asher");
            }

            .shipyard__icon { opacity: 1; }
        }

        &.active {
            border: 2px solid palette("grey", "abbey");
        }

        &:hover:not([disabled]),
        &:focus:not([disabled]) {
            background: palette("grey", "bunker");
            outline: 0;
            border-color: palette("grey", "asher");

            .shipyard__icon {
                opacity: 1;
            }
        }
    }

    .shipyard__icon { opacity: 0.3; }
</style>
