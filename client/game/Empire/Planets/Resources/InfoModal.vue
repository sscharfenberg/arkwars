<script>
    /*******************************************************************************************************************
     * InfoModal
     * this component shows some information about the extractor
     ******************************************************************************************************************/
    import Button from "Game/common/Button/Button.vue";
    import Production from "./Production.vue";
    export default {
        props: {
            harvesterId: {
                type: String,
                required: true
            }
        },
        components: {
            "m-button": Button,
            "production": Production
        },
        computed: {
            harvester () { return this.$store.getters.harvesterById(this.harvesterId); }
        },
        methods: {
            closeModal () { return this.$modal.hide(`harvester-info-${this.harvesterId}`); }
        }
    };
</script>

<template>
    <modal :name="`harvester-info-${harvesterId}`"
           :adaptive="true"
           class="info-modal"
           classes="info-modal-box"
           :width="320"
           height="auto">
        <div class="info__box">
            <header class="info__header">
                {{ $t("planet.harvesters.names." + this.harvester.resourceType) }}
            </header>
            <ul class="info__building" v-if="!harvester.isHarvesting">
                <li class="info__building-label">
                    Im Bau
                    <div v-for="n in harvester.turnsUntilComplete"
                         class="info__build-turn"
                         role="presentation"
                         aria-hidden="true"
                         :key="n"></div>
                </li>
                <li class="info__building-turns">
                    {{$t("planet.harvesters.untilComplete", {turns:harvester.turnsUntilComplete})}}
                </li>
            </ul>
            <div class="info__prod" v-if="harvester.isHarvesting">
                <production :harvesterId="harvesterId" />
            </div>
            <div class="info__actions">
                <m-button :onClick="closeModal"
                          :textString="$t('common.buttons.ok')"
                          iconName="done" />
            </div>
        </div>
    </modal>
</template>



<style lang="scss" scoped>
    .info-modal {
        background: rgba(palette("grey", "black"), 0.5);
    }

    .info__box {
        border: 3px solid palette("grey", "charcoal");

        background: palette("grey", "sunken");
        color: palette("text");
        border-radius: 0;
        box-shadow: 0 0 60px rgba(palette("grey", "mystic"), 0.15);
    }

    .info {
        &__header {
            padding: 1rem;
            border-bottom: 3px solid palette("grey", "charcoal");

            color: palette("brand", "viking");

            font-size: 1.8rem;
        }

        &__building {
            padding: 1rem;
            margin: 0;

            list-style: none;
        }

        &__building-label {
            display: flex;
            align-items: center;

            box-sizing: border-box;
            width: 100%;
            padding: 0.5rem 1rem;
            border: 1px solid palette("grey", "abbey");
            margin-bottom: 0.2rem;

            background: palette("grey", "raven");
        }

        &__building-turns {
            padding: 0.5rem 1rem;

            border: 1px solid palette("grey", "abbey");

            background: palette("grey", "deep");
        }

        &__prod {
            padding: 1rem;
        }

        &__actions {
            display: flex;
            justify-content: stretch;

            padding: 0.2rem;
            border-top: 3px solid palette("grey", "charcoal");

            > button {
                justify-content: center;

                margin-right: 0.2rem;
                flex: 1;

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        &__build-turn {
            width: 4px;
            height: 4px;
            margin: 0 4px 0 0;

            background: linear-gradient(to bottom, palette("state", "warning") 0%, palette("state", "error") 100%);

            border-radius: 50%;

            &:first-of-type {
                margin-left: 1rem;
            }
        }
    }
</style>
