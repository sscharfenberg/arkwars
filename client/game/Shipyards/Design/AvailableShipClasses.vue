<script>
/***********************************************************************************************************************
 * Available Ship Classes
 * this component lists the available ship classes
 **********************************************************************************************************************/
export default {
    components: {},
    computed: {
        shipClasses () { return this.$store.getters.shipClasses; }
    }
};
</script>

<template>
    <ul>
        <li
            v-for="sc in shipClasses"
            :key="sc.id">
            {{ sc.name }} {{ sc.hullType }}
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    ul {
        padding: 0;
        margin: 1rem 0 0 0;
        flex-basis: 100%;

        list-style: none;
    }
</style>
