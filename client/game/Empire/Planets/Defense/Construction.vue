<script>
    /*******************************************************************************************************************
     * Construct PDUs component
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    import cfg from "Config";
    export default {
        data: function() {
            return {
                buildAmount: 0
            };
        },
        props: {
            planetId: {
                type: String,
                required: true
            },
            pduType: {
                type: String,
                required: true
            }
        },
        components: {
            "icon": Icon
        },
        computed: {
            textHint () {
                const rules = cfg.rules.pdus.find(pdu => pdu.type === this.pduType);
                return this.$t("planet.pdus.build.explanation", {dmg: rules.baseDamage, range: rules.orbitRange});
            }
        },
        methods: {
            changeBuildAmount (value) {
                this.buildAmount += value;
                if (this.buildAmount < 0) this.buildAmount = 0;
            },
            saveConstruction () {
                console.log(" save!");
            }
        }
    };
</script>

<template>
    <div class="build__type">
        <icon class="build__type-icon" :name="`wpn-${pduType}`" />
        <button class="build__modify"
                @click="changeBuildAmount(-1)"
                :disabled="buildAmount === 0">
            <icon name="remove" :size="1" />
        </button>
        <div class="build__type-num">{{buildAmount}}</div>
        <button class="build__modify"
                @click="changeBuildAmount(1)">
            <icon name="add" :size="1" />
        </button>
        <button class="build__save"
                @click="saveConstruction"
                :disabled="buildAmount === 0">
            <icon name="done" :size="1" />
            {{$t("planet.pdus.build.save")}}
        </button>
        <div class="hint">{{textHint}}</div>
    </div>
</template>

<style lang="scss" scoped>
    .build {
        &__type {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            padding: 0.2rem 0;
            margin: 0 1rem 0.5rem 1rem;

            background: palette("grey", "bunker");

            &:last-of-type {
                margin-bottom: 0;
            }

            .hint {
                margin: 0.2rem 0;
                flex: 0 0 100%;

                font-size: 1.2rem;
            }
        }

        &__type-icon {
            margin-right: 1rem;
        }

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

            > svg {
                margin-right: 1rem;
            }
        }
    }
</style>
