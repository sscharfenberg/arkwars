<script>
    /*******************************************************************************************************************
     * Planets
     * this component lists the single planets
     ******************************************************************************************************************/
    import Planet from "./Planet.vue";
    export default {
        props: {
            planets: { // this array contains IDs of the planets
                type: Array,
                required: true
            },
            starName: {
                type: String,
                required: true
            }
        },
        components: {
            "planet": Planet
        }
    };
</script>

<template>
    <ul class="planets">
        <li v-for="planet in planets">
            <planet :id="planet"
                    :starName="starName" />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .planets {
        display: flex;
        position: relative;
        flex-direction: column;

        padding: 0;
        margin: 12px 0 0 0;

        list-style: none;
    }
</style>
