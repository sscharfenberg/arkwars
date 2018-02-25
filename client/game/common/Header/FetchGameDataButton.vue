<script>
/*******************************************************************************************************************
 * Button that fetches game data
 ******************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Spinner from "Game/common/Spinner/Spinner.vue";
export default {
    props: {
        area: {
            type: String,
            required: true
        }
    },
    components: {
        Icon,
        Spinner
    },
    computed: {
        fetching () { return this.$store.getters.fetchingGameDataFromApi; }
    },
    methods: {
        fetchGameData () { return this.$store.dispatch("FETCH_GAMEDATA_FROM_API", {area: this.area}); }
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
                :size="20"
                :depth="2" />
            {{ $t("common.header.refreshGameDataBtn.fetching") }} ...
        </span>
        <span v-else>
            <icon
                class="refresh-icon"
                name="sync" />
            {{ $t("common.header.refreshGameDataBtn.fetch") }}
        </span>
    </button>
</template>

<style lang="scss" scoped>
    button {
        position: relative;

        height: 3.6rem;
        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "sunken");
        margin: 1.6rem 0 0 1.6rem;

        background: rgba(palette("grey", "raven"), 0.6);
        color: palette("text", "base");

        cursor: pointer;

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            color map-get($animation-speeds, "fast") linear;

        @include respond-to("small") {
            position: absolute;
            top: 1.6rem;
            right: 1.6rem;

            margin: 0;
        }

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
