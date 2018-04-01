<script>
/***********************************************************************************************************************
 * ShipyardUpgrade
 * this component allows upgrading of an existing shipyard
 **********************************************************************************************************************/
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    }
};
</script>

<template>
    <div>Upgrade shipyard {{ id }}</div>
</template>

<style scoped>

</style>
