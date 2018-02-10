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
        planetId: {
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
        <li
            v-for="resource in resources"
            :key="resource.id">
            <resource-type
                :id="resource.id"
                :resource-type="resource.resourceType"
                :slots="resource.slots"
                :harvesters="resource.harvesters"
                :planetid="planetId"
                :planet-name="planetName" />
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
