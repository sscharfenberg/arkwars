<script>
    /*******************************************************************************************************************
     * Resource Type
     * this component shows extractors (with status!) and available slots of a single type (ie, "energy")
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    import InstallModal from "./InstallModal.vue";
    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            resourceType: {
                type: String,
                required: true
            },
            slots: {
                type: Number,
                required: true
            },
            harvesters: {
                type: Array,
                required: true
            },
            planetid: {
                type: String,
                required: true
            },
            planetName: {
                type: String,
                required: true
            }
        },
        components: {
            "icon": Icon,
            "install-modal": InstallModal
        },
        computed: {
            getIconName () { return "res-" + this.resourceType; },
            installSaving () { return this.$store.getters.installingResourceTypes.includes(this.id); }
        },
        methods: {
            harvesterLabel (harvester) {
                let turns = harvester.turnsUntilComplete;
                let label = this.$t("planet.harvesters.names." + this.resourceType);
                label += turns ? " - " + this.$t("planet.harvesters.untilComplete", {turns}) : "";
                return label;
            },
            buildingHarvesterClass (harvester) { return harvester.turnsUntilComplete > 0 ? "harvester__building" : ""; },
            installModal (index) {
                return this.$modal.show(`installharvester-${this.id}-${this.resourceType}-${index}`);
            }
        }

    };
</script>

<template>
    <ul class="slots">
        <li v-if="harvesters.length"
            v-for="harvester in harvesters"
            class="harvester"
            :class="buildingHarvesterClass(harvester)"
            :title="harvesterLabel(harvester)"
            :aria-label="harvesterLabel(harvester)">
            <icon :name="getIconName" />
            <div v-if="harvester.turnsUntilComplete"
                 class="harvester__build-turns">
                <div v-for="n in harvester.turnsUntilComplete"
                     class="harvester__build-turn"
                     role="presentation"
                     aria-hidden="true"
                     :key="n"></div>
            </div>
        </li>
        <li class="installable">
            <div v-for="n in (slots - harvesters.length)" :key="n">
                <button class="available"
                        :title="$t('planet.harvesters.install')"
                        :aria-label="$t('planet.harvesters.install')"
                        @click="installModal(n)"
                        :disabled="installSaving">
                    <icon :name="getIconName" />
                </button>
                <install-modal :resourceId="id"
                               :index="n"
                               :resourceType="resourceType"
                               :planetName="planetName"
                               :planetid="planetid" />
            </div>

        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .slots {
        display: flex;

        padding: 0;
        margin: 0;

        list-style: none;
    }

    .harvester,
    .available {
        display: flex;
        align-items: center;

        width: 2.4rem;
        height: 2.4rem;
        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "abbey");
        margin: 0 0.4rem 0.4rem 0;

        background: rgba(palette("grey", "mystic"), 0.05);
    }

    .harvester {
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

    .installable {
        display: flex;
    }

    .available {
        opacity: 0.3;

        box-sizing: content-box;

        cursor: pointer;

        transition:
            opacity map-get($animation-speeds, "fast") linear,
            background-color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        &:hover:not([disabled]),
        &:focus:not([disabled]) {
            opacity: 0.8;

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

</style>

