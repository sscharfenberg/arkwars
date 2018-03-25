<script>
/*******************************************************************************************************************
 * List all my stars
 * this component lists the stars
 ******************************************************************************************************************/
import Star from "./Star.vue";
import ScreenSection from "Game/common/ScreenSection/ScreenSection.vue";
export default {
    computed: {
        stars: function () { return this.$store.getters.stars; }
    },
    components: {
        Star,
        ScreenSection
    }
};
</script>

<template>
    <screen-section :hdl="$t('stars')">
        <ul v-if="stars.length > 0">
            <li
                v-for="star in stars"
                :key="star.id">
                <star
                    :id="star.id"
                    :name="star.name"
                    :coord-x="star.coordX"
                    :coord-y="star.coordY"
                    :spectral="star.spectral"
                    :planets="star.planets" />
            </li>
        </ul>
    </screen-section>
</template>

<style lang="scss" scoped>
    ul {
        padding: 0;
        margin: 1rem 0 0 0;

        list-style: none;

        @include respond-to("medium") {
            margin-top: 2rem;
        }
    }

    li {
        display: block;

        margin-bottom: 1rem;

        @include respond-to("medium") {
            margin-bottom: 2rem;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
