<script>
    /*******************************************************************************************************************
     * StarsList
     * this component lists the stars
     ******************************************************************************************************************/
    import Star from "./Star/Star.vue";
    export default {
        computed: {
            stars: function () {
                return this.$store.getters.GET_stars;
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
            <star
                :name="star.name"
                :coord-x="star.coordX"
                :coord-y="star.coordY"
                :spectral="star.spectral" />
        </li>
    </ul>
    <div v-else>
        No Stars
    </div>
</template>

<style lang="scss" scoped>
    ul {
        padding: 0;
        margin: 1rem 0 0 0;

        list-style: none;
    }

    li {
        background: palette("grey", "bunker");
    }
</style>
