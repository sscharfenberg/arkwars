<script>
    /*******************************************************************************************************************
     * Defense Details Modal
     * this component renders a single install modal (do you want to install, costs x?)
     ******************************************************************************************************************/
    import Button from "Game/common/Button/Button.vue";
    import Icon from "Game/common/Icon/Icon.vue";
    import Construction from "./Construction.vue";
    import cfg from "Config";
    export default {
        data: function() {
            return {
                types: cfg.rules.pdus.map(pdu => pdu.type)
            };
        },
        props: {
            planetId: {
                type: String,
                required: true
            }
        },
        components: {
            "icon": Icon,
            "btn": Button,
            "construction": Construction
        },
        computed: {
            pdus () { return this.$store.getters.pdusByPlanetId(this.planetId); },
            activePdus () { return this.$store.getters.pdusByPlanetId(this.planetId).filter(pdu => pdu.isActive); },
            buildingPdus () { return this.$store.getters.pdusByPlanetId(this.planetId).filter(pdu => !pdu.isActive); }
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
    <modal :name="`defense-${planetId}`"
           :adaptive="true"
           class="def"
           classes="def__box"
           :width="354"
           :scrollable="true"
           height="auto">
        <div class="def__box">
            <header class="def__header">
                {{ $t("common.pdu.nameShort") }} - {{ $t("common.pdu.namesLong") }}
            </header>
            <ul class="active"
                v-if="activePdus.length">
                <li class="active__title">{{$t("planet.pdus.active.title")}}</li>
                <li class="active__type"
                    v-for="type in types"
                    :key="type"
                    :class="activePduTypeClass(type)"
                    :title="activeLabel(type)"
                    :aria-label="activeLabel(type)">
                    <icon :name="`wpn-${type}`" /> {{activeTypes(type)}}
                </li>
            </ul>
            <div class="building__title"
                 v-if="buildingPdus.length">{{$t("planet.pdus.building.title")}}</div>
            <ul class="building" v-if="buildingPdus.length">
                <li class="building__type"
                    v-for="pdu in buildingPdus"
                    :key="pdu.id">
                    <icon :name="`wpn-${pdu.pduType}`" />
                    <div class="building__turns">
                        <div class="building__turn"
                             v-for="turn in pdu.turnsUntilComplete"
                             :key="turn"></div>
                    </div>
                </li>
            </ul>
            <construction :planetId="planetId" />
        </div>
        <btn class="close-modal" :onClick="closeModal" iconName="cancel" />
    </modal>
</template>



<style lang="scss" scoped>
    .def {
        background: rgba(palette("grey", "black"), 0.5);

        &__box {
            position: relative;

            overflow: visible;
            border: 3px solid palette("grey", "charcoal");
            margin: 17px;

            background: palette("grey", "sunken");
            color: palette("text");
            border-radius: 0;
            box-shadow: 0 0 20px rgba(palette("grey", "mystic"), 0.15);
        }

        &__header {
            padding: 1rem;
            border-bottom: 3px solid palette("grey", "charcoal");

            color: palette("brand", "viking");

            font-size: 1.8rem;
        }

        .active,
        .building {
            display: flex;
            flex-wrap: wrap;

            padding: 0 1rem 1rem 1rem;
            border-bottom: 3px solid palette("grey", "charcoal");
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
            }
        }
    }

    .close-modal {
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
