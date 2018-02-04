<script>
    /*******************************************************************************************************************
     * Defense
     * this component shows a Defense summary and opens the detail window
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    import Details from "./DefenseDetails.vue";
    export default {
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
            "defense-details": Details
        },
        computed: {
            pdus () { return this.$store.getters.pdusByPlanetId(this.planetId); },
            activePdus () { return this.$store.getters.pdusByPlanetId(this.planetId).filter(pdu => pdu.isActive); },
            btnClass () { return this.activePdus.length > 0 ? "military" : "civilian"; }
        },
        methods: {
            openDetails () { return this.$modal.show(`defense-${this.planetId}`); }
        }
    };
</script>

<template>
    <div class="pdu">
        <button class="pdu__btn"
                :class="btnClass"
                @click="openDetails()">
            <icon class="pdu__icon" name="pdu" />
            <span v-if="activePdus.length">
                {{activePdus.length}}
            </span>
        </button>
        <defense-details :planetId="planetId"
                         :starName="starName" />
    </div>
</template>


<style lang="scss" scoped>
    .pdu {
        &__btn {
            display: flex;
            align-items: center;

            box-sizing: content-box;
            height: 2.6rem;
            padding: 0.5rem 1rem;
            border: 1px solid palette("grey", "abbey");
            margin: 0 0 0.8rem 0;

            background: transparent;
            color: palette("text");

            cursor: pointer;

            font-weight: 300;

            transition:
                background-color map-get($animation-speeds, "fast") linear,
                border-color map-get($animation-speeds, "fast") linear;

            &.military {
                background-color: rgba(palette("grey", "mystic"), 0.05);
                border-color: palette("grey", "abbey");

                &:hover,
                &:focus {
                    background-color: palette("grey", "bunker");
                    outline: 0;
                    border-color: palette("grey", "asher");
                }

                &:active {
                    background-color: palette("grey", "ebony");
                    color: palette("grey", "white");
                }

                > svg {
                    margin-right: 0.6rem;
                }
            }

            &.civilian {
                &:hover,
                &:focus {
                    background-color: rgba(palette("grey", "mystic"), 0.05);
                    border-color: palette("grey", "abbey");

                    .pdu__icon {
                        opacity: 1;
                    }
                }

                &:active {
                    background-color: palette("grey", "ebony");
                    color: palette("grey", "white");
                }

                .pdu__icon {
                    opacity: 0.3;
                }
            }

            &[disabled] {
                cursor: not-allowed;
            }
        }
    }
</style>
