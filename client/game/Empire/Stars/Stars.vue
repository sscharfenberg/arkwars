<script>
    /*******************************************************************************************************************
     * List all my stars
     * this component lists the stars
     ******************************************************************************************************************/
    import Star from "./Star.vue";
    export default {
        computed: {
            stars: function () {
                return this.$store.getters.stars;
            }
        },
        components: {
            "star": Star
        }
    };
</script>

<template>
    <ul v-if="stars.length > 0">
        <li v-for="star in stars">
            <star :id="star.id"
                :name="star.name"
                :coord-x="star.coordX"
                :coord-y="star.coordY"
                :spectral="star.spectral"
                :planets="star.planets" />
        </li>
    </ul>
    <div v-else>
        No Stars!
    </div>
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
