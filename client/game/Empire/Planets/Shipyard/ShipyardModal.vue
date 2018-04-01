<script>
/***********************************************************************************************************************
 * ShipyardModal
 * this component shows the shipyard modal
 **********************************************************************************************************************/
import Button from "Game/common/Button/Button.vue";
import ShipyardDetails from "./ShipyardDetails.vue";
import ShipyardStatus from "./ShipyardStatus.vue";
import ShipyardConstruction from "./ShipyardConstruction.vue";
import ShipyardUpgrade from "./ShipyardUpgrade.vue";
//import {shipyardRules} from "Config";
export default {
    props: {
        id: {
            type: String,
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
        btn: Button,
        ShipyardDetails,
        ShipyardStatus,
        ShipyardConstruction,
        ShipyardUpgrade
    },
    methods: {
        closeModal () { return this.$modal.hide(`shipyard-modal-${this.planetId}`); }
    }
};
</script>

<template>
    <modal
        :name="`shipyard-modal-${planetId}`"
        :adaptive="true"
        :width="320"
        height="auto"
        :scrollable="true">
        <header class="header">
            {{ $t("common.shipyards.name", {planetName: this.planetName}) }}
        </header>
        <shipyard-status
            v-if="id"
            :id="id" />
        <shipyard-details
            v-if="id"
            :id="id" />
        <shipyard-upgrade
            v-if="id"
            :id="id" />
        <shipyard-construction
            v-if="!id"
            :planet-id="planetId" />
        <btn
            class="close-modal"
            :on-click="closeModal"
            icon-name="cancel" />
    </modal>
</template>

<style lang="scss" scoped>
    .header {
        padding: 1rem;
        border-bottom: 1px solid palette("brand", "viking");

        color: palette("brand", "viking");

        font-size: 1.8rem;
    }
</style>
