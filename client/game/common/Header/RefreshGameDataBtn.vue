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
            <icon class="refresh" name="sync" />
            {{ $t("common.header.refreshGameDataBtn.fetch") }}
        </span>
    </button>
</template>

<script>
    import Icon from "../Icon/Icon.vue";
    import Spinner from "../Spinner.vue";
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
                return this.$store.getters.fetchingGameDataFromApi;
            }
        },
        methods: {
            fetchGameData: function() {
                return this.$store.dispatch("FETCH_GAMEDATA_FROM_API");
            }
        }
    };
</script>

<style lang="scss" scoped>
    button {
        padding: 0.5rem 1rem;
        border: 0;
        margin: 1.6rem;
        flex: 0 0 auto;

        background: rgba(palette("grey", "raven"), 0.5);
        color: palette("text", "base");

        cursor: pointer;

        > span {
            display: flex;
            align-items: center;

            line-height: 1;

            .refresh {
                //width: 3rem;
                //height: 3rem;
                margin-right: 1rem;
            }

            .spinner {
                margin-right: 1rem;
            }
        }

        &[disabled] {
            cursor: not-allowed;
        }
    }
</style>
