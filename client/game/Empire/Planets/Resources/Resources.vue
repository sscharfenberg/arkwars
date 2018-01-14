<script>
    /*******************************************************************************************************************
     * Planetary Resources
     * this component lists all planetary resource types - min 0, max 4 (lucky tombworld!)
     ******************************************************************************************************************/
    import ResourceType from "./ResourceType.vue";
    export default {
        props: {
            resources: {
                type: Array,
                required: true
            },
            planetid: {
                type: String,
                required: true
            },
            planetName: {
                type: String,
                required: true
            }
        },
        components: {
            "resource-type": ResourceType
        }
    };
</script>

<template>
    <ul class="resources">
        <li v-for="resource in resources">
            <resource-type :id="resource.id"
                           :resourceType="resource.resourceType"
                           :slots="resource.slots"
                           :harvesters="resource.harvesters"
                           :planetid="planetid"
                           :planetName="planetName" />
        </li>
    </ul>
</template>



<style lang="scss" scoped>
    .resources {
        display: flex;

        padding: 0;
        margin: 0 0.4rem 0.8rem 0;

        list-style: none;
    }
</style>
