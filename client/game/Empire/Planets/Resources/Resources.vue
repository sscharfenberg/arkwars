<script>
    /*******************************************************************************************************************
     * Planetary Resources
     * this component lists all planetary resource types - min 0, max 4 (lucky tombworld!)
     ******************************************************************************************************************/
    import Resource from "./Resource.vue";
    export default {
        props: {
            resources: {
                type: Array,
                required: true
            },
            planetid: {
                type: String,
                required: true
            }
        },
        components: {
            "resource": Resource
        }
    };
</script>

<template>
    <ul class="resources">
        <li v-for="resource in resources">
            <resource :id="resource.id"
                      :resourceType="resource.resourceType"
                      :slots="resource.slots"
                      :harvesters="resource.harvesters"
                      :planetid="planetid"/>
        </li>
    </ul>
</template>



<style lang="scss" scoped>
    .resources {
        display: flex;

        padding: 0;
        margin: 0 0.8rem 0.8rem 0;

        list-style: none;
    }
</style>
