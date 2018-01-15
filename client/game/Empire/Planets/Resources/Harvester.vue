<script>
    /*******************************************************************************************************************
     * Harvester
     * this component shows extractors (with status!) and available slots of a single type (ie, "energy")
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    export default {
        props: {
            id: {
                type: String,
                required: true
            }
        },
        components: {
            "icon": Icon
        },
        computed: {
            iconName () { return "res-" + this.$store.getters.harvesterById(this.id).resourceType; },
            buildingHarvesterClass () {
                return this.$store.getters.harvesterById(this.id).turnsUntilComplete > 0 ? "harvester__building" : "";
            },
            turnsUntilComplete () { return this.$store.getters.harvesterById(this.id).turnsUntilComplete; },
            harvesterLabel () {
                let turns = this.$store.getters.harvesterById(this.id).turnsUntilComplete;
                let label = this.$t("planet.harvesters.names." + this.$store.getters.harvesterById(this.id).resourceType);
                label += turns ? " - " + this.$t("planet.harvesters.untilComplete", {turns}) : "";
                return label;
            }
        },
        methods: {}
    };
</script>

<template>
    <li class="harvester"
        :class="buildingHarvesterClass"
        :title="harvesterLabel"
        :aria-label="harvesterLabel">
        <icon :name="iconName" />
        <div v-if="turnsUntilComplete"
             class="harvester__build-turns">
            <div v-for="n in turnsUntilComplete"
                 class="harvester__build-turn"
                 role="presentation"
                 aria-hidden="true"
                 :key="n"></div>
        </div>
    </li>
</template>

<style lang="scss" scoped>
    .harvester {
        display: flex;
        align-items: center;

        width: 2.4rem;
        height: 2.4rem;
        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "abbey");
        margin: 0 0.4rem 0.4rem 0;

        background: rgba(palette("grey", "mystic"), 0.05);

        &__building {
            opacity: 0.7;

            width: auto;
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
        }
    }
</style>
