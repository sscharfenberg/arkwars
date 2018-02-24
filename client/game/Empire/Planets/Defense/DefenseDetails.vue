<script>
/*******************************************************************************************************************
 * Defense Details Modal
 * this component renders a single install modal (do you want to install, costs x?)
 ******************************************************************************************************************/
import Button from "Game/common/Button/Button.vue";
import Icon from "Game/common/Icon/Icon.vue";
import Construction from "./Construction.vue";
import {pduRules} from "Config";
import {latinToRoman} from "../../../handlers/format";
export default {
    data: function() {
        return {
            types: pduRules.types.map(pdu => pdu.type),
            maxPdus: pduRules.maxPerPlanet
        };
    },
    props: {
        planetId: {
            type: String,
            required: true
        },
        starName: {
            type: String,
            required: true,
        }
    },
    components: {
        Icon,
        "btn": Button,
        Construction
    },
    computed: {
        pdus () { return this.$store.getters.pdusByPlanetId(this.planetId); },
        activePdus () { return this.$store.getters.pdusByPlanetId(this.planetId).filter(pdu => pdu.isActive); },
        buildingPdus () { return this.$store.getters.pdusByPlanetId(this.planetId).filter(pdu => !pdu.isActive); },
        planetName () {
            return `${this.starName} - ${latinToRoman(this.$store.getters.planetById(this.planetId).orbitalIndex)}`;
        },
        planetType () { return this.$store.getters.planetById(this.planetId).type; },
        getPlanetTypeToolTip () {
            return this.$t("planet.typeLabel") + ": " + this.$t("planet.types." +
                this.$store.getters.planetById(this.planetId).type);
        },
        getPlanetAriaLabel () { return this.$t("planet.typeLabel"); }

    },
    methods: {
        activeTypes (type) {
            return this.$store.getters.pdusByPlanetId(this.planetId)
                .filter(pdu => pdu.isActive && pdu.pduType === type).length;
        },
        activeLabel (type) {
            const typeName = this.$t("common.pdu.types." + type);
            return this.$t("planet.pdus.active.label", {num: this.activeTypes(type), type: typeName});
        },
        activePduTypeClass (type) {
            return this.$store.getters.pdusByPlanetId(this.planetId)
                .filter(pdu => pdu.isActive && pdu.pduType === type).length === 0 ? "nopdus" : "";
        },
        closeModal () { return this.$modal.hide(`defense-${this.planetId}`); }
    }
};
</script>

<template>
    <modal
        :name="`defense-${planetId}`"
        :adaptive="true"
        :width="320"
        :scrollable="true"
        height="auto">
        <header class="def__header">
            <div class="def__header-planet">
                <aside
                    class="def__planet"
                    :class="planetType"
                    :title="getPlanetTypeToolTip"
                    :aria-label="getPlanetAriaLabel">{{ planetType }}</aside>
                <div class="def__header-planet-name">{{ planetName }}</div>
            </div>
            {{ $t("common.pdu.nameLong") }}
        </header>
        <ul
            class="active"
            v-if="activePdus.length">
            <li class="active__title">{{ $t("planet.pdus.active.title") }}</li>
            <li
                class="active__type"
                v-for="type in types"
                :key="type"
                :class="activePduTypeClass(type)"
                :title="activeLabel(type)"
                :aria-label="activeLabel(type)">
                <icon :name="`wpn-${type}`" /> {{ activeTypes(type) }}
            </li>
        </ul>
        <div
            class="building__title"
            v-if="buildingPdus.length">{{ $t("planet.pdus.building.title") }}</div>
        <ul
            class="building"
            v-if="buildingPdus.length">
            <li
                class="building__type"
                v-for="pdu in buildingPdus"
                :key="pdu.id">
                <icon :name="`wpn-${pdu.pduType}`" />
                <div class="building__turns">
                    <div
                        class="building__turn"
                        v-for="turn in pdu.turnsUntilComplete"
                        :key="turn">•</div>
                </div>
            </li>
        </ul>
        <construction
            v-if="pdus.length < maxPdus"
            :planet-id="planetId" />
        <btn
            class="close-modal"
            :on-click="closeModal"
            icon-name="cancel" />
    </modal>
</template>



<style lang="scss" scoped>
    .def {
        &__header {
            padding: 1rem;
            border-bottom: 1px solid palette("brand", "viking");

            color: palette("brand", "viking");

            font-size: 1.8rem;
        }

        &__header-planet {
            display: flex;
            align-items: center;
        }

        &__planet {
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
    }

    .active,
    .building {
        display: flex;
        flex-wrap: wrap;

        padding: 0 1rem 1rem 1rem;
        border-bottom: 1px solid palette("brand", "viking");
        margin: 0;

        list-style: none;

        &__type {
            display: flex;
            align-items: center;
            justify-content: center;

            height: 3rem;
            padding: 0.5rem;
            border: 1px solid palette("grey", "abbey");
            margin: 0 0.2rem 0 0;
            flex-grow: 1;

            background: palette("grey", "deep");

            > svg {
                margin-right: 1rem;
            }

            &:last-child {
                margin-right: 0;
            }

            &.nopdus {
                opacity: 0.4;
            }
        }

        &__title {
            padding: 0.7rem 0;
            flex: 0 0 100%;
        }
    }

    .building {
        &__title {
            padding: 0.5rem 1rem;
        }

        &__type {
            width: calc(33% - 13px);
            margin: 0 0.2rem 0.2rem 0;
            flex-grow: 0;

            &:nth-of-type(3n) {
                margin-right: 0;
            }
        }

        &__turns {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            max-width: 4rem;
            margin-top: 4px;
        }

        &__turn {
            width: 4px;
            height: 4px;
            margin: 0 4px 4px 0;

            background: linear-gradient(to bottom, palette("state", "warning") 0%, palette("state", "error") 100%);

            border-radius: 50%;

            text-indent: -1000em;
        }
    }

</style>
