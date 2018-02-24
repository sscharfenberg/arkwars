<script>
import Button from "Game/common/Button/Button.vue";
import Icon from "Game/common/Icon/Icon.vue";
import {latinToRoman} from "../../../handlers/format";
import FoodConsumption from "./FoodConsumption.vue";
export default {
    props: {
        planetId: {
            type: String,
            required: true
        },
        starName: {
            type: String,
            required: true
        }
    },
    components: {
        "btn": Button,
        Icon,
        FoodConsumption
    },
    computed: {
        planetName () {
            return `${this.starName} - ${latinToRoman(this.$store.getters.planetById(this.planetId).orbitalIndex)}`;
        },
        population () {
            return this.$store.getters.planetById(this.planetId).population.toString(10).replace(".", ",");
        },
        planetType () { return this.$store.getters.planetById(this.planetId).type; },
        planetTypeToolTip () {
            return this.$t("planet.typeLabel") + ": " + this.$t("planet.types." +
                this.$store.getters.planetById(this.planetId).type);
        },
        planetAriaLabel () { return this.$t("planet.typeLabel"); }
    },
    methods: {
        closeModal () { return this.$modal.hide(`colony-${this.planetId}`); }
    }
};
</script>

<template>
    <modal
        :name="`colony-${planetId}`"
        :adaptive="true"
        :width="320"
        :scrollable="true"
        height="auto">
        <header class="colony__header">
            <div class="colony__header-planet">
                <aside
                    class="planet"
                    :class="planetType"
                    :title="planetTypeToolTip"
                    :aria-label="planetAriaLabel">{{ planetType }}</aside>
                <div class="def__header-planet-name">{{ planetName }}</div>
            </div>
            {{ $t("planet.population.title") }}
        </header>
        <div class="colony__pop">
            <icon name="population" />
            {{ population }}
        </div>
        <food-consumption :planet-id="planetId" />
        <btn
            class="close-modal"
            :on-click="closeModal"
            icon-name="cancel" />
    </modal>
</template>



<style lang="scss" scoped>
    .colony {
        &__header {
            padding: 1rem;
            border-bottom: 1px solid palette("brand", "viking");

            color: palette("brand", "viking");

            font-size: 1.8rem;
        }

        &__pop {
            display: flex;
            align-items: center;

            padding: 1rem;
            border-bottom: 1px solid palette("brand", "viking");
        }

        &__header-planet {
            display: flex;
            align-items: center;
        }
    }

    .planet {
        width: 48px;
        height: 48px;
        flex: 0 0 48px;

        background: transparent url("../planets.png") 0 0 no-repeat;

        text-indent: -1000em;

        // these need to be synced with /server/config/config.js
        &.gas { background-position: 0 -48px; }
        &.ice { background-position: 0 -96px; }
        &.iron { background-position: 0 -144px; }
        &.desert { background-position: 0 -192px; }
        &.toxic { background-position: 0 -240px; }
        &.carbon { background-position: 0 -288px; }
        &.tomb { background-position: 0 -336px; }
    }
</style>
