<script>
    /*******************************************************************************************************************
     * Colony
     * this component shows the modal window for a colony
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    import {populationGrowth} from "Shared/calculations";
    export default {
        data: function() {
            return {
                setFood: this.$store.getters.planetById(this.planetId).foodConsumption
            };
        },
        props: {
            planetId: {
                type: String,
                required: true
            }
        },
        components: {
            Icon
        },
        computed: {
            population () { return this.$store.getters.planetById(this.planetId).population; },
            totalConsumption () { return Math.ceil(this.population * this.setFood); },
            populationChange () {
                return (populationGrowth(this.population, this.setFood) - this.population).toFixed(8);
            },
            changeDisabled () { return this.$store.getters.savingFoodConsumptionPlanetIds.includes(this.planetId); }
        },
        methods: {
            changeConsumption () {
                this.$store.dispatch("CHANGE_FOOD_CONSUMPTION", {planet: this.planetId, consumption: this.setFood});
            }
        }
    };
</script>

<template>
    <ul>
        <li class="hdl">
            <icon name="res-food" />
            {{$t("planet.population.food.title")}}
        </li>
        <li class="perpop">
            <label :for="`setFood-slider-${planetId}`">{{$t("planet.population.food.perPop")}}</label>
            <input type="range"
                   :id="`setFood-slider-${planetId}`"
                   min="0"
                   aria-valuemin="0"
                   max="3"
                   aria-valuemax="3"
                   step="0.01"
                   v-model="setFood"
                   :disabled="changeDisabled"
                   @change="changeConsumption()" />
            <input type="number"
                   :id="`setFood-number-${planetId}`"
                   min="0"
                   aria-valuemin="0"
                   max="3"
                   aria-valuemax="3"
                   step="0.01"
                   v-model="setFood"
                   :aria-label="$t('planet.population.food.title') + ' ' + $t('planet.population.food.perPop')"
                   :disabled="changeDisabled"
                   @change="changeConsumption()" />
        </li>
        <li class="total">
            <div class="total__label">{{$t("planet.population.food.total")}}</div>
            <div class="total__value">{{totalConsumption}}</div>
        </li>
        <li class="change">
            <div class="change__label">{{$t("planet.population.food.change")}}</div>
            <div class="change__value">{{populationChange}}</div>
        </li>
    </ul>
</template>



<style lang="scss" scoped>
    ul {
        padding: 1rem;
        margin: 0;

        list-style: none;
    }

    .hdl {
        display: flex;
        align-items: center;

        margin-bottom: 0.5rem;

        color: palette("brand", "gorse");

        > svg {
            margin-right: 1rem;
        }
    }

    .perpop {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        > label {
            flex: 0 0 100%;
        }

        > input[type="range"] {
            flex-grow: 1;
        }

        > input[type="number"] {
            width: 5rem;
            padding: 0.5rem 1rem;
            border: 0;
            margin-left: 1rem;

            background: palette("grey", "deep");
            color: palette("text");

            font-weight: 300;
            line-height: 1;

            &:focus {
                background: palette("grey", "raven");
                color: palette("grey", "white");
                outline: 0;
            }
        }

        > input:disabled {
            opacity: 0.5;
        }
    }

    .total,
    .change {
        display: flex;
        align-items: center;

        &__label,
        &__value {
            margin-right: 1rem;
        }
    }
</style>
