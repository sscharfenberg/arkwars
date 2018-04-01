<script>
/*******************************************************************************************************************
 * Harvester
 * this component shows extractors (with status!) and available slots of a single type (ie, "energy")
 ******************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import InfoModal from "./InfoModal.vue";
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        Icon,
        "info-modal": InfoModal
    },
    computed: {
        iconName () { return "res-" + this.$store.getters.harvesterById(this.id).resourceType; },
        buildingHarvesterClass () {
            return this.$store.getters.harvesterById(this.id).turnsUntilComplete > 0 ? "harvester--building" : "";
        },
        turnsUntilComplete () { return this.$store.getters.harvesterById(this.id).turnsUntilComplete; },
        harvesterLabel () {
            let turns = this.$store.getters.harvesterById(this.id).turnsUntilComplete;
            let label = this.$t("planet.harvesters.names." + this.$store.getters.harvesterById(this.id).resourceType);
            label += turns ? " - " + this.$t("planet.harvesters.untilComplete", {turns}) : "";
            return label;
        },
        resGrade () { return this.$store.getters.harvesterById(this.id).resGrade; }
    },
    methods: {
        showInfoModal (harvester) {
            return this.$modal.show(`harvester-info-${harvester}`);
        }
    }
};
</script>

<template>
    <li class="harvester">
        <button
            class="harvester__button"
            :class="buildingHarvesterClass"
            :title="harvesterLabel"
            :aria-label="harvesterLabel"
            @click="showInfoModal(id)">
            <icon :name="iconName" />
            <div
                v-if="turnsUntilComplete"
                class="harvester__build-turns">
                <div
                    v-for="n in turnsUntilComplete"
                    class="harvester__build-turn"
                    role="presentation"
                    aria-hidden="true"
                    :key="n">•</div>
            </div>
        </button>
        <info-modal :harvester-id="id" />
    </li>
</template>

<style lang="scss" scoped>
    .harvester {
        &__button {
            display: flex;
            align-items: center;

            box-sizing: content-box;
            width: 2.4rem;
            height: 2.6rem;
            padding: 0.5rem 1rem;
            border: 1px solid palette("state", "online");
            margin: 0 0 0.4rem 0.4rem;

            background: rgba(palette("grey", "mystic"), 0.05);
            cursor: pointer;

            transition:
                background-color map-get($animation-speeds, "fast") linear,
                border-color map-get($animation-speeds, "fast") linear;

            &:hover:not([disabled]),
            &:focus:not([disabled]) {
                background: palette("grey", "bunker");
                outline: 0;
                border-color: palette("grey", "asher");
            }

            &:active:not([disabled]) {
                background: palette("grey", "ebony");
                color: palette("grey", "white");
            }

            &[disabled] {
                background-color: palette("grey", "ebony");
                cursor: not-allowed;
            }
        }

        &--building {
            opacity: 0.7;

            width: auto;

            border-color: palette("state", "building");
        }

        &__build-turns {
            display: flex;
            flex-wrap: wrap;

            max-width: 3.2rem;
            margin: 4px 0 0 10px;
        }

        &__build-turn {
            width: 4px;
            height: 4px;
            margin: 0 4px 4px 0;

            background: linear-gradient(to bottom, palette("state", "warning") 0%, palette("state", "error") 100%);

            border-radius: 50%;

            text-indent: -1000em;
        }
    }
</style>
