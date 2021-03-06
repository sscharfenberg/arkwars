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
        btnClass () {
            if (this.pdus.length === 0) return "civilian";
            return this.activePdus.length === this.pdus.length ? "military" : "building";
        },
        buttonLabel () { return this.$t("common.pdu.namesLong"); }
    },
    methods: {
        openDetails () { return this.$modal.show(`defense-${this.planetId}`); }
    }
};
</script>

<template>
    <div class="pdu">
        <button
            class="pdu__btn"
            :class="btnClass"
            @click="openDetails()"
            :title="buttonLabel"
            :aria-label="buttonLabel">
            <icon
                class="pdu__icon"
                name="pdu" />
            <span
                v-if="activePdus.length"
                class="pdu__num">
                {{ activePdus.length }}
            </span>
        </button>
        <defense-details
            :planet-id="planetId"
            :star-name="starName" />
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
            border: 2px solid palette("grey", "abbey");
            margin: 0 0 0.8rem 0.8rem;

            background: transparent;
            color: palette("text");

            cursor: pointer;

            font-weight: 300;

            transition:
                background-color map-get($animation-speeds, "fast") linear,
                border-color map-get($animation-speeds, "fast") linear;

            &.military {
                background-color: rgba(palette("grey", "mystic"), 0.05);
                border-color: palette("state", "active");

                &:hover,
                &:focus {
                    background-color: palette("grey", "bunker");
                    outline: 0;
                    border-color: palette("grey", "fog");
                }

                &:active {
                    background-color: palette("grey", "ebony");
                    color: palette("grey", "white");
                }
            }

            &.civilian {
                &:hover,
                &:focus {
                    background: palette("grey", "bunker");
                    border-color: palette("grey", "fog");

                    .pdu__icon { opacity: 1; }
                }

                &:active {
                    background-color: palette("grey", "ebony");
                    color: palette("grey", "white");
                }

                .pdu__icon { opacity: 0.3; }
            }

            &.building {
                border: 2px dashed palette("state", "building");

                background-color: rgba(palette("grey", "mystic"), 0.05);

                .pdu__icon { opacity: 0.7; }
            }

            &[disabled] { cursor: not-allowed; }
        }

        &__num { margin-left: 1rem; }
    }
</style>
