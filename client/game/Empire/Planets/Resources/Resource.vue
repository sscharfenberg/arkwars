<script>
    /*******************************************************************************************************************
     * Resource Type
     * this component shows extractors (with status!) and available slots of a single type (ie, "energy")
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
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
            }
        },
        components: {
            "icon": Icon
        },
        computed: {
            getIconName () { return "res-" + this.resourceType; }
        },
        methods: {
            harvesterLabel (harvester) {
                let turns = harvester.turnsUntilComplete;
                let label = this.$t("planet.harvesters.names." + this.resourceType);
                label += turns ? " - " + this.$t("planet.harvesters.untilComplete", {turns}) : "";
                return label;
            },
            buildingHarvesterClass (harvester) { return harvester.turnsUntilComplete > 0 ? "harvester__building" : ""; },
            installClick () {
                confirm(`[todo] install ${this.resourceType} harvester for planet ${this.planetid}`);
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
            <div v-for="n in harvester.turnsUntilComplete"
                 class="harvester__build-turn"
                 role="presentation"
                 aria-hidden="true"
                 :key="n"></div>
        </li>
        <li class="installable">
            <button v-for="n in (slots - harvesters.length)"
                    class="available"
                    :key="n"
                    :title="$t('planet.harvesters.install')"
                    :aria-label="$t('planet.harvesters.install')"
                    @click="installClick">
                <icon :name="getIconName" />
            </button>

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
            width: auto;
        }

        &__build-turn {
            width: 4px;
            height: 4px;
            margin-left: 4px;

            background: linear-gradient(to bottom, palette("state", "warning") 0%, palette("state", "error") 100%);

            border-radius: 50%;

            &:first-of-type {
                margin-left: 10px;
            }
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

        &:hover,
        &:focus {
            opacity: 0.8;

            background: palette("grey", "bunker");
            outline: 0;
            border-color: palette("grey", "asher");
        }

        &:active {
            background: palette("grey", "ebony");
            color: palette("grey", "white");
        }
    }

</style>
