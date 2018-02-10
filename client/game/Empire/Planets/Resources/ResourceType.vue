<script>
/*******************************************************************************************************************
 * Resource Type
 * this component shows harvesters (with status!) and available slots
 * for a single resource type (ie, "energy")
 ******************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Harvester from "./Harvester.vue";
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
        Icon,
        "install-modal": InstallModal,
        Harvester
    },
    computed: {
        getIconName () { return "res-" + this.resourceType; },
        installSaving () { return this.$store.getters.installingResourceTypes.includes(this.id); },
        numEmptySlots () { return this.slots - this.harvesters.length; }
    },
    methods: {
        installModal (index) {
            return this.$modal.show(`installharvester-${this.id}-${this.resourceType}-${index}`);
        }
    }

};
</script>

<template>
    <ul class="slots">
        <harvester
            v-if="harvesters"
            v-for="harvesterId in harvesters"
            :id="harvesterId"
            :key="harvesterId" />

        <li
            class="installable"
            v-if="numEmptySlots">
            <div
                v-for="n in numEmptySlots"
                :key="n">
                <button
                    class="available"
                    :title="$t('planet.harvesters.install')"
                    :aria-label="$t('planet.harvesters.install')"
                    @click="installModal(n)"
                    :disabled="installSaving">
                    <icon :name="getIconName" />
                </button>
                <install-modal
                    :resource-id="id"
                    :index="n"
                    :resource-type="resourceType"
                    :planet-name="planetName"
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

    .installable {
        display: flex;
    }

    .available {
        display: flex;
        align-items: center;

        box-sizing: content-box;
        width: 2.4rem;
        height: 2.6rem;
        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "abbey");
        margin: 0 0.4rem 0.4rem 0;

        background: transparent;

        cursor: pointer;

        transition:
            opacity map-get($animation-speeds, "fast") linear,
            background-color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        > svg {
            opacity: 0.3;
        }

        &:hover:not([disabled]),
        &:focus:not([disabled]) {
            opacity: 0.8;

            background: rgba(palette("grey", "mystic"), 0.05);
            outline: 0;
            border-color: palette("grey", "charcoal");

            > svg {
                opacity: 1;
            }
        }

        &:active:not([disabled]) {
            background: palette("grey", "ebony");
            color: palette("grey", "white");

            > svg {
                opacity: 1;
            }
        }

        &[disabled] {
            background-color: palette("grey", "ebony");
            cursor: not-allowed;
        }
    }

</style>

