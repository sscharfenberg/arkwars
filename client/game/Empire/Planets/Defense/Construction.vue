<script>
    /*******************************************************************************************************************
     * Construct PDUs component
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    import Costs from "Game/common/Costs/Costs.vue";
    import Spinner from "Game/common/Spinner/Spinner.vue";
    import {pduRules} from "Config";
    export default {
        data: function() {
            return {
                types: pduRules.types.map(pdu => pdu.type),
                buildAmount: {
                    laser: 0,
                    plasma: 0,
                    railgun: 0,
                    missile: 0
                },
                showFormRow: {
                    laser: false,
                    plasma: false,
                    railgun: false,
                    missile: false
                },
                // static tmp value until I know how to determin max pdus (planet type? population? techlevel?)
                maxPdus: pduRules.maxPerPlanet,
                playerResources: this.$store.getters.playerResources
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
            "costs": Costs,
            "spinner": Spinner
        },
        computed: {
            pdus () { return this.$store.getters.pdusByPlanetId(this.planetId); },
            isPlanetConstructing () { return this.$store.getters.savingBuildPduPlanetIds.includes(this.planetId); },
            totalBuildAmount () {
                const num = this.buildAmount;
                return num.laser + num.plasma + num.railgun + num.missile;
            },
            isAddDisabled () { return this.totalBuildAmount + this.pdus.length >= this.maxPdus; }
        },
        methods: {
            changeBuildAmount (type, value) {
                if (this.buildAmount[type] + value + this.pdus > this.maxPdus) return;
                this.buildAmount[type] += value;
                if (this.buildAmount[type] < 0) this.buildAmount[type] = 0;
                if (this.buildAmount[type] < 0) this.buildAmount[type] = 0;
            },
            textHint (type) {
                const rules = pduRules.types.find(pdu => pdu.type === type);
                return this.$t("planet.pdus.build.explanation", {dmg: rules.baseDamage, range: rules.orbitRange});
            },
            activeClass (type) { return this.showFormRow[type] ? "active" : ""; },
            toggleFormRow (type) {
                this.showFormRow[type] = !this.showFormRow[type];
                if (this.showFormRow[type]) {
                    this.buildAmount[type] = 0;
                }
            },
            installCosts (type, amount) {
                const rules = pduRules.types.find(slot => slot.type === type);
                let buildCost = [];
                amount = amount < 1 ? 1 : amount;
                rules.costs.forEach( slot => {
                    buildCost.push({
                        resourceType: slot.resourceType,
                        amount: Math.floor(slot.amount * amount)
                    });
                });
                buildCost.push({
                    resourceType: "turns",
                    amount: rules.buildDuration
                });
                return buildCost;
            },
            doRequestConstruction (type) {
                this.$store.dispatch("BUILD_PDUS", {planet: this.planetId, type, amount: this.buildAmount[type]});
                this.buildAmount[type] = 0;
                this.showFormRow[type] = false;
            },
            isSaveDisabled (type) {
                if (this.buildAmount[type] === 0) return true;
                if (this.isPlanetConstructing) return true;
                if (this.totalBuildAmount + this.pdus.length > this.maxPdus) return true;
                let canInstall = true;
                const costs = pduRules.types.find(slot => slot.type === type).costs;
                costs.forEach( cost => {
                    const stockpile = this.playerResources.find(stock => stock.type === cost.resourceType).current;
                    if (Math.floor(cost.amount * this.buildAmount[type]) > stockpile) canInstall = false;
                });
                return !canInstall;
            }
        }
    };
</script>

<template>
    <div class="build">
        <div class="build__title">{{$t("planet.pdus.build.title")}}</div>
        <ul class="toggle">
            <li class="toggle__type"
                v-for="type in types"
                :key="`toggle-${type}`">
                <button :class="activeClass(type)"
                        @click="toggleFormRow(type)">
                    <icon :name="`wpn-${type}`" />
                </button>
            </li>
        </ul>
        <div class="build__type"
             v-for="type in types"
             :key="`build-${type}`"
             v-if="showFormRow[type]">
            <icon class="build__type-icon" :name="`wpn-${type}`" />
            <button class="build__modify"
                    @click="changeBuildAmount(type, -1)"
                    :disabled="buildAmount[type] === 0">
                <icon name="remove" :size="1" />
            </button>
            <div class="build__type-num">{{buildAmount[type]}}</div>
            <button class="build__modify"
                    @click="changeBuildAmount(type, 1)"
                    :disabled="isAddDisabled">
                <icon name="add" :size="1" />
            </button>
            <spinner class="build__spinner" v-if="isPlanetConstructing" />
            <button class="build__save"
                    @click="doRequestConstruction(type)"
                    :disabled="isSaveDisabled(type)">
                <icon name="done" :size="1" />
                {{$t("planet.pdus.build.save")}}
            </button>
            <div class="hint">{{textHint(type)}}</div>
            <costs v-if="buildAmount[type] !== 0"
                   :costs="installCosts(type, buildAmount[type])" />
        </div>
    </div>

</template>

<style lang="scss" scoped>
    .toggle {
        display: flex;

        padding: 0 1rem 1rem 1rem;
        margin: 0;

        list-style: none;

        &__type {
            margin: 0 0.2rem 0 0;
            flex-grow: 1;

            &:last-of-type { margin-right: 0; }

            > button {
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.5;

                box-sizing: content-box;
                width: calc(100% - 1.2rem);
                height: 3rem;
                padding: 0.5rem;
                border: 1px solid palette("grey", "abbey");

                background: palette("grey", "deep");
                color: palette("text");

                cursor: pointer;

                &:hover,
                &:focus {
                    opacity: 1;

                    outline: 0;
                }

                &.active {
                    opacity: 1;

                    background: palette("grey", "bunker");
                    color: palette("brand", "viking");
                    outline: 0;
                    border-color: palette("grey", "raven");
                }
            }
        }
    }

    .build {
        margin: 0 0 1rem 0;

        &__title { padding: 0.7rem 1rem 0.5rem 1rem; }

        &__type {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            padding: 0.5rem;
            border: 1px solid palette("grey", "asher");
            margin: 0 1rem 0.5rem 1rem;

            background: palette("grey", "bunker");

            &:last-of-type {
                margin-bottom: 0;
            }

            .hint {
                margin: 1rem 0;
                flex: 0 0 100%;
            }
        }

        &__type-icon { margin-right: 1rem; }

        &__type-num {
            width: 4.5rem;

            text-align: center;
        }

        &__modify,
        &__save {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 3rem;
            height: 3rem;
            padding: 0;
            border: 1px solid palette("grey", "asher");
            margin: 0;

            background: palette("grey", "raven");
            color: palette("text", "tint");
            cursor: pointer;

            &:hover:not([disabled]),
            &:focus {
                background: palette("grey", "bunker");
                color: palette("brand", "viking");
                outline: 0;
                border-color: palette("grey", "raven");
            }

            &:active {
                background: palette("grey", "ebony");
                color: palette("grey", "white");
            }

            &[disabled] {
                opacity: 0.3;

                cursor: not-allowed;
            }
        }

        &__save {
            width: auto;
            padding: 0 1rem;
            margin-left: auto;

            > svg { margin-right: 1rem; }
        }

        &__spinner {
            margin-left: 0.5rem;
        }
    }
</style>
