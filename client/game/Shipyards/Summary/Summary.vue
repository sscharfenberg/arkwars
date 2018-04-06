<script>
/***********************************************************************************************************************
 * Shipyards Summary Component
 **********************************************************************************************************************/
export default {
    components: {}
};
</script>

<template>
    <div class="summary">
        Shipyards: 12
        <br>
        Currently in Production: > > => =>
    </div>
</template>

<style lang="scss" scoped>
    .summary {
        @include respond-to("medium") {
            flex: 1 1 calc(50% - 1rem);
        }
    }
</style>
