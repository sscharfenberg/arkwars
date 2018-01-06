<template>
    <button @click="fetchGameData">
        {{$txt.common.header.refresh}}
    </button>
</template>

<script>
    export default {
        methods: {
            fetchGameData: function() {
                this.$store.dispatch("FETCH_GAMEDATA_FROM_API");
            }
        }
    };
</script>

<style lang="scss" scoped>
    button {
        padding: 0;
        border: 0;
        margin: 1.6rem;
        flex: 0 0 auto;

        background: orange;
    }
</style>

