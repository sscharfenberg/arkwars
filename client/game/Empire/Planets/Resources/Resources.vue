<script>
    /*******************************************************************************************************************
     * Planetary Resources
     * this component lists all planetary resource types
     ******************************************************************************************************************/
    import Resource from "./Resource.vue";
    export default {
        props: {
            resources: {
                type: Array
            }
        },
        components: {
            "resource": Resource
        }
    };
</script>

<template>
    <ul>
        <li v-for="resource in resources">
            <resource
                :id="resource.id"
                :resourceType="resource.resourceType"
                :slots="resource.slots" />
        </li>
    </ul>
</template>



<style lang="scss" scoped>
    ul {
        display: flex;

        padding: 0;
        margin: 0;

        background: palette("grey", "asher");

        list-style: none;
    }
</style>
