<script>
    /*******************************************************************************************************************
     * Button that fetches game data
     ******************************************************************************************************************/
    import Icon from "../Icon/Icon.vue";
    import Spinner from "../Spinner/Spinner.vue";
    export default {
        data() {
            return {
                spinner: {
                    size: 14,
                    status: true,
                    depth: 5,
                    rotation: true,
                    speed: 0.8,
                }
            };
        },
        components: {
            "icon": Icon,
            "spinner": Spinner
        },
        computed: {
            fetching: function () {
                return this.$store.getters.GET_fetchingGameDataFromApi;
            }
        },
        methods: {
            fetchGameData: function() {
                return this.$store.dispatch("FETCH_GAMEDATA_FROM_API");
            }
        }
    };
</script>

<template>
    <button
        @click="fetchGameData"
        :disabled="fetching"
        :aria-disabled="fetching"
        :aria-expanded="fetching"
        :aria-label="fetching ? $t('common.header.refreshGameDataBtn.fetching') : $t('common.header.refreshGameDataBtn.fetch')">
        <span v-if="fetching">
            <spinner
                :status="spinner.status"
                :size="spinner.size"
                :depth="spinner.depth"
                :rotation="spinner.rotation"
                :speed="spinner.speed" />
            {{ $t("common.header.refreshGameDataBtn.fetching") }} ...
        </span>
        <span v-else>
            <icon class="refresh-icon" name="sync" />
            {{ $t("common.header.refreshGameDataBtn.fetch") }}
        </span>
    </button>
</template>

<style lang="scss" scoped>
    button {
        height: 3.6rem;
        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "sunken");
        margin: 1.6rem;
        flex: 0 0 auto;

        background: rgba(palette("grey", "raven"), 0.5);
        color: palette("text", "base");

        cursor: pointer;

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            color map-get($animation-speeds, "fast") linear;

        &:hover:not([disabled]),
        &:focus {
            background: palette("grey", "ebony");
            color: palette("brand", "viking");
            outline: 0;
        }

        &:active {
            background: palette("grey", "ebony");
            color: palette("grey", "white");
        }

        > span {
            display: flex;
            align-items: center;

            line-height: 1;

            .refresh-icon {
                margin-right: 1rem;
            }

            .spinner {
                margin-right: 1rem;
            }
        }

        &[disabled] {
            background: rgba(palette("grey", "raven"), 0.7);
            cursor: not-allowed;
        }
    }
</style>
